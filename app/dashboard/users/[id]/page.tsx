"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Globe, Phone, Mail, Briefcase, MapPin } from "lucide-react"
import dynamic from "next/dynamic"

// Import UserAvatar component
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 rounded-md animate-pulse"></div>,
})

// Update the UserType to include profile image and bio
type UserType = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  profileImage?: string
  bio?: string
  interests?: string[]
}

export default function UserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)

        if (id === "0") {
          if (currentUser && currentUser.id === 0) {
            setUser(currentUser)
            setError(null)
            setLoading(false)
            return
          }

          const adminUserData = {
            id: 0,
            name: "Admin User",
            username: "admin",
            email: "admin@admin.com",
            address: {
              street: "Admin Street",
              suite: "Admin Suite",
              city: "Admin City",
              zipcode: "00000",
              geo: {
                lat: "0",
                lng: "0",
              },
            },
            phone: "000-000-0000",
            website: "admin.com",
            company: {
              name: "Admin Company",
              catchPhrase: "Admin Catchphrase",
              bs: "Admin BS",
            },
            profileImage: "/placeholder.svg?height=200&width=200&text=Admin",
            bio: "Technology enthusiast and VR/AR expert. Managing the latest developments in immersive technologies and exploring their applications across industries.",
            interests: ["Virtual Reality", "Augmented Reality", "Technology Management", "Digital Innovation"],
          }

          setUser(adminUserData)
          setError(null)
          setLoading(false)
          return
        }

        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)

        import("@/lib/tech-data").then(({ userProfileImages, techUserBios, techInterests }) => {
          const userData = response.data
          const userIndex = userData.id % 10

          const enhancedUser = {
            ...userData,
            profileImage: userProfileImages[userIndex],
            bio: techUserBios[userIndex],
            interests: techInterests[userIndex],
          }

          setUser(enhancedUser)
          setError(null)
          setLoading(false)
        })
      } catch (err: unknown) {
        console.error("Error fetching user:", err)
        setError("Failed to load user details. Please try again later.")
        setLoading(false)
      }
    }

    if (id) {
      fetchUser()
    }
  }, [id, currentUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#9c89B8]" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || "User not found"}</p>
        <Button onClick={() => router.push("/dashboard/users")} className="bg-[#9c89B8] hover:bg-[#8a78a6]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  const userLocation: [number, number] = [
    Number.parseFloat(user.address.geo.lng),
    Number.parseFloat(user.address.geo.lat),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/users")}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-gradient-to-br from-black to-gray-900 border-[#9c89B8]/30">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center text-center">
              <UserAvatar name={user.name} image={user.profileImage} size="xl" className="mb-4" />
              <CardTitle className="text-xl font-medium text-white">{user.name}</CardTitle>
              <CardDescription className="text-gray-400">@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {user.bio && (
              <div className="mt-4 mb-6 text-center">
                <p className="text-gray-300 text-sm">{user.bio}</p>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="bg-[#9c89B8]/10 text-[#9c89B8] border-[#9c89B8]/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#F0A6CA]" />
                <span className="text-gray-300">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#E7BCDE]" />
                <span className="text-gray-300">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#B8BEDD]" />
                <span className="text-gray-300">{user.website}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-[#9c89B8]" />
                <span className="text-gray-300">{user.company.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30">
          <CardHeader>
            <CardTitle className="text-white">Address & Location</CardTitle>
            <CardDescription className="text-gray-400">User&apos;s address and geographic location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#F0A6CA] mt-0.5" />
              <div className="text-gray-300">
                <p>
                  {user.address.street}, {user.address.suite}
                </p>
                <p>
                  {user.address.city}, {user.address.zipcode}
                </p>
              </div>
            </div>

            <div className="h-64 rounded-md overflow-hidden">
              <MapComponent selectedLocation={userLocation} readOnly={true} initialLocation={userLocation} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-gradient-to-br from-black to-gray-900 border-[#E7BCDE]/30">
          <CardHeader>
            <CardTitle className="text-white">Company Catchphrase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 italic">&quot;{user.company.catchPhrase}&quot;</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



