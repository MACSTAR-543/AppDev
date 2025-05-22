"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, User } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

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
}

export default function UsersPage() {
  
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get<UserType[]>("https://jsonplaceholder.typicode.com/users")

        const { userProfileImages, techUserBios } = await import("@/lib/tech-data")

        const enhancedUsers = response.data.map((user, index) => ({
          ...user,
          profileImage: userProfileImages[index % userProfileImages.length],
          bio: techUserBios[index % techUserBios.length],
        }))

        setUsers(enhancedUsers)
        setError(null)
      } catch (err: unknown) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#9c89B8]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#9c89B8] text-white rounded-md hover:bg-[#8a78a6]"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-400">Browse and view user profiles</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 bg-gray-900 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link key={user.id} href={`/dashboard/users/${user.id}`}>
              <Card className="bg-gradient-to-br from-black to-gray-900 border-[#9c89B8]/30 hover:border-[#9c89B8]/60 transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} image={user.profileImage} size="sm" />
                    <div>
                      <CardTitle className="text-lg font-medium text-white">{user.name}</CardTitle>
                      <CardDescription className="text-gray-400">@{user.username}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-300">{user.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">Company:</span>
                      <span className="text-gray-300">{user.company.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <User className="h-10 w-10 mx-auto text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-white">No users found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

