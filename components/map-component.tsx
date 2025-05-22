"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

interface MapComponentProps {
  onLocationSelect?: (coords: [number, number]) => void
  selectedLocation?: [number, number] | null
  readOnly?: boolean
  initialLocation?: [number, number]
}

const MAPTILER_API_KEY = "3BFiEfWYqYLPfAi9Wqp3"

export default function MapComponent({
  onLocationSelect,
  selectedLocation,
  readOnly = false,
  initialLocation = [0, 0],
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Memoize click handler for proper add/remove
  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat

      if (marker.current) {
        marker.current.remove()
      }

      if (map.current) {
        marker.current = new maplibregl.Marker({ color: "#F0A6CA" }).setLngLat([lng, lat]).addTo(map.current)
      }

      if (onLocationSelect) {
        onLocationSelect([lng, lat])
      }
    },
    [onLocationSelect]
  )

  useEffect(() => {
    if (!mapContainer.current) return

    async function initMap() {
      try {
        const response = await fetch(
          `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`
        )
        const style = await response.json()

        if (style.sprite && !style.sprite.includes("key=")) {
          style.sprite += `?key=${MAPTILER_API_KEY}`
        }
        if (style.glyphs && !style.glyphs.includes("key=")) {
          style.glyphs += `?key=${MAPTILER_API_KEY}`
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current!, // Non-null assertion
          style,
          center: initialLocation,
          zoom: 2,
        })

        map.current.on("load", () => {
          setMapLoaded(true)
        })
      } catch (error) {
        console.error("Error loading map style:", error)
      }
    }

    initMap()

    return () => {
      if (map.current && !readOnly) {
        map.current.off("click", handleMapClick)
      }
      map.current?.remove()
      map.current = null
    }
  }, [initialLocation, readOnly, handleMapClick])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    if (!readOnly) {
      map.current.off("click", handleMapClick)
      map.current.on("click", handleMapClick)
    }

    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick)
      }
    }
  }, [mapLoaded, readOnly, handleMapClick])

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedLocation) return

    if (marker.current) {
      marker.current.remove()
    }

    marker.current = new maplibregl.Marker({ color: "#F0A6CA" }).setLngLat(selectedLocation).addTo(map.current)

    map.current.flyTo({
      center: selectedLocation,
      zoom: 10,
      essential: true,
    })
  }, [mapLoaded, selectedLocation])

  return <div ref={mapContainer} className="w-full h-full" />
}