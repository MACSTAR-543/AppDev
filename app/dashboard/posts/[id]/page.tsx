"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, MessageCircle, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import {
  techTopics,
  techPostTitles,
  techPostContent,
  techImageUrls,
  userProfileImages,
  getRelevantComments,
} from "@/lib/tech-data"
import { useToast } from "@/components/ui/use-toaster"

type PostType = {
  id: number
  userId: number
  title: string
  body: string
  image?: string
  topic?: string
}

type CommentType = {
  id: number
  postId?: number
  name: string
  email: string
  body: string
}

type UserType = {
  id: number
  name: string
  username: string
  email: string
  profileImage?: string
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user: currentUser, isAdmin } = useAuth()
  const { toast } = useToast()

  const [post, setPost] = useState<PostType | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [postUser, setPostUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostType[]>([])

  const postId = Number(id)

  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError("Invalid post ID")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch post
        const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        const postData = postResponse.data

        // Access control
        if (!isAdmin && currentUser && postData.userId !== currentUser.id) {
          setError("You don't have permission to view this post")
          setLoading(false)
          return
        }

        // Enhance post
        const postIndex = postData.id % techPostTitles.length
        const topic = techTopics[postIndex % techTopics.length]
        const enhancedPost: PostType = {
          ...postData,
          title: techPostTitles[postIndex],
          body: techPostContent[postIndex % techPostContent.length],
          image: techImageUrls[postIndex % techImageUrls.length],
          topic,
        }

        setPost(enhancedPost)

        // Author
        const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${postData.userId}`)
        const userData = userResponse.data
        const userIndex = userData.id % userProfileImages.length

        setPostUser({
          ...userData,
          profileImage: userProfileImages[userIndex],
        })

        // Comments
        const relevantComments = getRelevantComments(topic, 5)
        setComments(relevantComments)

        // Related posts
        const allPostsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts")
        const allPosts = allPostsResponse.data

        const related = (allPosts as PostType[])
  .filter((p) => p.id !== postId)
  .sort(() => 0.5 - Math.random())
  .slice(0, 3)
  .map((post, idx: number) => {
    const index = (postIndex + idx + 1) % techPostTitles.length
    return {
      ...post,
      title: techPostTitles[index],
      body: techPostContent[index % techPostContent.length],
      image: techImageUrls[index % techImageUrls.length],
      topic: techTopics[index % techTopics.length],
    }
  })

        setRelatedPosts(related)
        setError(null)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Failed to load post details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [postId, currentUser, isAdmin])

  const handleShare = () => {
  if (typeof window === "undefined") return

  navigator.clipboard
    .writeText(window.location.href)
    .then(() =>
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this post with others",
      }),
    )
    .catch(() =>
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
      }),
    )
}


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#F0A6CA]" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || "Post not found"}</p>
        <Button onClick={() => router.push("/dashboard/posts")} className="bg-[#F0A6CA] hover:bg-[#e095b9] text-black">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/posts")}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            aria-label="Back to post list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Tech Article</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-[#B8BEDD] text-[#B8BEDD]"
          aria-label="Copy share link to clipboard"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30">
        {post.image && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-t-lg">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          {post.topic && <Badge className="self-start mb-2 bg-[#F0A6CA] text-black">{post.topic}</Badge>}
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar name={postUser?.name || "User"} image={postUser?.profileImage} size="md" />
            <div>
              <CardDescription className="text-gray-300 font-medium">{postUser?.name}</CardDescription>
              <CardDescription className="text-gray-500">{postUser?.email}</CardDescription>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line text-lg leading-relaxed">{post.body}</p>
            <p className="text-gray-300 whitespace-pre-line text-lg leading-relaxed mt-4">
              As technology continues to evolve, the boundaries between virtual and physical reality become increasingly
              blurred...
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#E7BCDE]" />
            Expert Comments ({comments.length})
          </h2>
        </div>
        <Separator className="bg-gray-800" />
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-gradient-to-br from-black to-gray-900 border-[#E7BCDE]/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={comment.name} size="sm" />
                    <div>
                      <CardTitle className="text-sm font-medium text-white">{comment.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-400">{comment.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{comment.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MessageCircle className="h-10 w-10 mx-auto text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-white">No comments yet</h3>
            <p className="text-gray-400">This post doesn&rsquo;t have any comments</p>

          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Related Articles</h2>
        {relatedPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/dashboard/posts/${relatedPost.id}`}>
                <Card className="bg-gradient-to-br from-black to-gray-900 border-[#B8BEDD]/30 hover:border-[#B8BEDD]/60 transition-all cursor-pointer h-full">
                  {relatedPost.image && (
                    <div className="relative w-full h-36 overflow-hidden rounded-t-lg">
                      <Image src={relatedPost.image} alt={relatedPost.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    {relatedPost.topic && (
                      <Badge variant="outline" className="self-start mb-1 border-[#B8BEDD] text-[#B8BEDD]">
                        {relatedPost.topic}
                      </Badge>
                    )}
                    <CardTitle className="text-sm font-medium text-white line-clamp-2">{relatedPost.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No related articles found.</p>
        )}
      </div>
    </div>
  )
}
