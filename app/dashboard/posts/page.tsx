"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, MessageSquare, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import { techTopics, techPostTitles, techPostContent, techImageUrls } from "@/lib/tech-data"

type PostType = {
  id: number
  userId: number
  title: string 
  body: string
  image?: string
  topic?: string
}

type UserType = {
  id: number
  name: string
  username: string
  profileImage?: string
}

export default function PostsPage() {
  const { user: currentUser, isAdmin } = useAuth()
  const [posts, setPosts] = useState<PostType[]>([])
  const [users, setUsers] = useState<Record<number, UserType>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all users first to get their names
        const usersResponse = await axios.get("https://jsonplaceholder.typicode.com/users")

        // Import user profile images
        import("@/lib/tech-data").then(({ userProfileImages }) => {
          // Add profile images to users
          const usersData = usersResponse.data.reduce(
            (acc: Record<number, UserType>, user: UserType, index: number) => {
              acc[user.id] = {
                ...user,
                profileImage: userProfileImages[index % userProfileImages.length],
              }
              return acc
            },
            {},
          )
          setUsers(usersData)
        })

        // Fetch posts
        const postsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts")
        let postsData = postsResponse.data

        // Filter posts if not admin
        if (!isAdmin && currentUser) {
          postsData = postsData.filter((post: PostType) => post.userId === currentUser.id)
        }

        // Enhance posts with VR/AR content and images
        const enhancedPosts = postsData.map((post: PostType, index: number) => {
          const postIndex = index % techPostTitles.length
          return {
            ...post,
            title: techPostTitles[postIndex],
            body: techPostContent[index % techPostContent.length],
            image: techImageUrls[index % techImageUrls.length],
            topic: techTopics[index % techTopics.length],
          }
        })

        setPosts(enhancedPosts)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser, isAdmin])

  // Get unique topics for filtering
  const topics = Array.from(new Set(posts.map((post) => post.topic))).filter(Boolean) as string[]

  // Filter posts by search term and selected topic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (users[post.userId]?.name && users[post.userId].name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.topic && post.topic.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTopic = !selectedTopic || post.topic === selectedTopic

    return matchesSearch && matchesTopic
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#F0A6CA]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#F0A6CA] text-black rounded-md hover:bg-[#e095b9]"
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
          <h1 className="text-2xl font-bold tracking-tight">Tech Trends</h1>
          <p className="text-gray-400">
            {isAdmin
              ? "Browse all posts about VR, AR, and emerging technologies"
              : "View your posts about VR, AR, and emerging technologies"}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8 bg-gray-900 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Topic filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedTopic === null ? "default" : "outline"}
          className={`cursor-pointer ${
            selectedTopic === null
              ? "bg-[#9c89B8] hover:bg-[#8a78a6]"
              : "bg-transparent hover:bg-[#9c89B8]/10 text-gray-300"
          }`}
          onClick={() => setSelectedTopic(null)}
        >
          All Topics
        </Badge>

        {topics.map((topic) => (
          <Badge
            key={topic}
            variant={selectedTopic === topic ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedTopic === topic
                ? "bg-[#F0A6CA] hover:bg-[#e095b9] text-black"
                : "bg-transparent hover:bg-[#F0A6CA]/10 text-gray-300"
            }`}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/dashboard/posts/${post.id}`}>
              <Card className="bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30 hover:border-[#F0A6CA]/60 transition-all cursor-pointer h-full flex flex-col">
                {post.image && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  {post.topic && (
                    <Badge variant="outline" className="self-start mb-2 border-[#F0A6CA] text-[#F0A6CA]">
                      {post.topic}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={users[post.userId]?.name || "User"}
                        image={users[post.userId]?.profileImage}
                        size="sm"
                      />
                      <CardDescription className="text-gray-400">
                        {users[post.userId]?.name || "Unknown User"}
                      </CardDescription>
                    </div>
                    {isAdmin && currentUser?.id !== post.userId && (
                      <Badge variant="outline" className="border-[#9c89B8] text-[#9c89B8]">
                        Other User
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-medium text-white mt-2 line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-300 line-clamp-3">{post.body}</p>
                </CardContent>
                <CardFooter className="flex items-center text-sm text-gray-400">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>View comments</span>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <MessageSquare className="h-10 w-10 mx-auto text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-white">No posts found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedTopic ? "Try adjusting your search criteria" : "There are no posts available"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
