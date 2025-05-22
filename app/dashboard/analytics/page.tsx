"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { Loader2, Users, MessageSquare, MessageCircle } from "lucide-react"
import { Chart } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

type PostsPerUser = {
  name: string
  posts: number
}

type CommentsPerPost = {
  id: number
  title: string
  comments: number
}

export default function AnalyticsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    users: number
    posts: number
    comments: number
    postsPerUser: PostsPerUser[]
    commentsPerPost: CommentsPerPost[]
  }>({
    users: 0,
    posts: 0,
    comments: 0,
    postsPerUser: [],
    commentsPerPost: [],
  })

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push("/dashboard")
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return

      try {
        setLoading(true)

        const usersResponse = await axios.get("https://jsonplaceholder.typicode.com/users")
        const users: Array<{ id: number; name: string }> = usersResponse.data

        const postsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts")
        const posts: Array<{ userId: number; id: number; title: string }> = postsResponse.data

        const commentsResponse = await axios.get("https://jsonplaceholder.typicode.com/comments")
        const comments: Array<{ postId: number }> = commentsResponse.data

        const postsPerUser: PostsPerUser[] = users
          .map((user) => {
            const userPosts = posts.filter((post) => post.userId === user.id)
            return {
              name: user.name,
              posts: userPosts.length,
            }
          })
          .sort((a, b) => b.posts - a.posts)
          .slice(0, 5)

        const commentsPerPost: CommentsPerPost[] = posts
          .map((post) => {
            const postComments = comments.filter((comment) => comment.postId === post.id)
            return {
              id: post.id,
              title: post.title.slice(0, 20) + "...",
              comments: postComments.length,
            }
          })
          .sort((a, b) => b.comments - a.comments)
          .slice(0, 5)

        setStats({
          users: users.length,
          posts: posts.length,
          comments: comments.length,
          postsPerUser,
          commentsPerPost,
        })

        setError(null)
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        setError("Failed to load analytics data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">You don&apos;t have permission to view this page</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#B8BEDD]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#B8BEDD] text-black rounded-md hover:bg-[#a7accc]"
        >
          Try Again
        </button>
      </div>
    )
  }

  const COLORS = ["#9c89B8", "#F0A6CA", "#E7BCDE", "#B8BEDD"]

  const overviewData = [
    { name: "Users", value: stats.users, icon: Users, color: "#9c89B8" },
    { name: "Posts", value: stats.posts, icon: MessageSquare, color: "#F0A6CA" },
    { name: "Comments", value: stats.comments, icon: MessageCircle, color: "#E7BCDE" },
  ]

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Posts", value: stats.posts },
    { name: "Comments", value: stats.comments },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-400">Overview of users, posts, and comments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {overviewData.map((item) => (
          <Card
            key={item.name}
            className="bg-gradient-to-br from-black to-gray-900"
            style={{ borderColor: `${item.color}30` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">{item.name}</CardTitle>
              <item.icon className="h-4 w-4" style={{ color: item.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <p className="text-xs text-gray-400 mt-1">Total {item.name.toLowerCase()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-black to-gray-900 border-[#9c89B8]/30">
          <CardHeader>
            <CardTitle className="text-white">Distribution Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Relative distribution of users, posts, and comments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30">
          <CardHeader>
            <CardTitle className="text-white">Top Users by Posts</CardTitle>
            <CardDescription className="text-gray-400">Users with the most published posts</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.postsPerUser}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#aaa", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#aaa" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="posts" fill="#F0A6CA" />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-black to-gray-900 border-[#E7BCDE]/30">
          <CardHeader>
            <CardTitle className="text-white">Top Posts by Comments</CardTitle>
            <CardDescription className="text-gray-400">Posts with the most comments</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.commentsPerPost}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="title"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#aaa", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#aaa" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="comments" fill="#E7BCDE" />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
