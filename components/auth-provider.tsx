"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"

// User type with profileImage, bio, and interests
type User = {
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

type RegisterData = {
  name: string
  username: string
  email: string
  password: string
  // Add other registration fields if any
}

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: RegisterData) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy data for profile images, bios, and interests
const userProfileImages = ["/profile1.jpg", "/profile2.jpg", "/profile3.jpg", "/profile4.jpg", "/profile5.jpg"]

const techUserBios = [
  "Passionate about AI and machine learning. Building the future, one algorithm at a time.",
  "Full-stack developer with a love for clean code and elegant solutions.",
  "Cybersecurity expert dedicated to protecting digital assets and ensuring online safety.",
  "Data scientist uncovering insights from complex datasets to drive informed decision-making.",
  "Cloud computing enthusiast helping businesses scale and innovate in the digital age.",
]

const techInterests = [
  ["Artificial Intelligence", "Machine Learning", "Data Science"],
  ["Web Development", "JavaScript", "React", "Node.js"],
  ["Cybersecurity", "Network Security", "Ethical Hacking"],
  ["Data Analysis", "Big Data", "Statistical Modeling"],
  ["Cloud Computing", "DevOps", "Microservices"],
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = user?.email === "admin@admin.com" || user?.email === "cabanzamia@gmail.com"

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)

    // Redirect to login if not authenticated and not on login/register page
    const isAuthPage = pathname === "/login" || pathname === "/register"
    if (!storedUser && !isAuthPage && pathname !== "/") {
      router.push("/login")
    }
  }, [pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Admin user login
      if (email === "admin@admin.com" && password === "admin123") {
        const adminUser: User = {
          id: 0,
          name: "Admin User",
          username: "admin123",
          email,
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
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        return true
      }

      // Fetch users from API
      const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users")

      // Add custom user Mia Cabanza
      const customUser: User = {
        id: 999,
        name: "Mia Cabanza",
        username: "macstar",
        email: "cabanzamia@gmail.com",
        address: {
          street: "Your Street",
          suite: "Your Suite",
          city: "Your City",
          zipcode: "00000",
          geo: { lat: "0", lng: "0" },
        },
        phone: "123-456-7890",
        website: "mia.dev",
        company: {
          name: "Cabanza Tech",
          catchPhrase: "Innovating Tomorrow",
          bs: "Tech Solutions",
        },
      }

      // Combine fetched users and custom user
      const users = [...response.data, customUser]

      // Add profile images, bios, interests
      const enhancedUsers = users.map((u: User, index: number) => ({
        ...u,
        profileImage: userProfileImages[index % userProfileImages.length],
        bio: techUserBios[index % techUserBios.length],
        interests: techInterests[index % techInterests.length],
      }))

      // Find user by email and username (password check simulated as username match)
      const foundUser = enhancedUsers.find((u: User) => u.email === email && u.username === password)

      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("user", JSON.stringify(foundUser))
        return true
      }

      return false
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message)
      } else {
        console.error("Login error:", err)
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const register = async (): Promise<boolean> => {
    try {
      // Simulate registration success
      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Registration error:", err.message)
      } else {
        console.error("Registration error:", err)
      }
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
