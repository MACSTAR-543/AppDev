"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  Cpu,
  HeadsetIcon as VrHeadsetIcon,
  Layers,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserAvatar } from "@/components/user-avatar"

function DashboardCard({
  title,
  icon: Icon,
  description,
  linkHref,
  linkText,
  borderColor,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  linkHref: string
  linkText: string
  borderColor: string
  children?: React.ReactNode
}) {
  return (
    <Card className={`bg-gradient-to-br from-black to-gray-900 border-[${borderColor}]/30`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-[${borderColor}]`} />
      </CardHeader>
      <CardContent>
        {children}
        <p className="text-xs text-gray-400 mt-1">{description}</p>
        <Link href={linkHref} className={`inline-flex items-center mt-4 text-xs text-[${borderColor}] hover:underline`}>
          {linkText}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar name={user?.name || ""} image={user?.profileImage} size="lg" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-gray-400">
              {isAdmin ? "You have admin access to all features and data." : "View your posts and user information."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin && (
          <DashboardCard
            title="Users"
            icon={Users}
            description="Browse VR/AR experts and tech professionals"
            linkHref="/dashboard/users"
            linkText="View all users"
            borderColor="#9c89B8"
          >
            <div className="text-2xl font-bold text-white">View Users</div>
          </DashboardCard>
        )}

        <DashboardCard
          title="Tech Articles"
          icon={MessageSquare}
          description={
            isAdmin
              ? "Access all articles on VR, AR and emerging tech"
              : "View your articles on VR, AR and emerging tech"
          }
          linkHref="/dashboard/posts"
          linkText="View all articles"
          borderColor="#F0A6CA"
        >
          <div className="text-2xl font-bold text-white">View Articles</div>
        </DashboardCard>

        <DashboardCard
          title="Comments"
          icon={MessageCircle}
          description={isAdmin ? "Access all comments on tech articles" : "View comments on your tech articles"}
          linkHref="/dashboard/posts"
          linkText="View all comments"
          borderColor="#E7BCDE"
        >
          <div className="text-2xl font-bold text-white">View Comments</div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-black to-gray-900 border-[#B8BEDD]/30 overflow-hidden">
          <div className="relative h-40">
            <Image src="/1739272936112.png" alt="Virtual Reality" fill className="object-cover" />
          </div>
          <CardHeader>
            <CardTitle className="text-white">Virtual Reality Trends</CardTitle>
            <CardDescription className="text-gray-400">
              Explore the latest developments in VR technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              From immersive gaming to professional training, virtual reality is transforming how we interact with
              digital content. Discover the latest headsets, applications, and development tools.
            </p>
            <Link
              href="/dashboard/posts"
              className="inline-flex items-center mt-4 text-sm text-[#B8BEDD] hover:underline"
            >
              Explore VR articles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30 overflow-hidden">
          <div className="relative h-40">
            <Image src="/augmented.jpg" alt="Augmented Reality" fill className="object-cover" />
          </div>
          <CardHeader>
            <CardTitle className="text-white">Augmented Reality Innovations</CardTitle>
            <CardDescription className="text-gray-400">
              Discover how AR is changing our perception of the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Augmented reality is blending digital information with our physical environment in revolutionary ways.
              Learn about AR applications in retail, education, navigation, and more.
            </p>
            <Link
              href="/dashboard/posts"
              className="inline-flex items-center mt-4 text-sm text-[#F0A6CA] hover:underline"
            >
              Explore AR articles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Emerging Tech"
          icon={Cpu}
          description="Quantum computing, neural interfaces, and more"
          linkHref="#"
          linkText=""
          borderColor="#9c89B8"
        >
          <p className="text-gray-300 text-sm">
            Quantum computing, neural interfaces, and other cutting-edge technologies that will shape our future.
          </p>
        </DashboardCard>

        <DashboardCard
          title="XR Development"
          icon={VrHeadsetIcon}
          description="Best practices for immersive XR experiences"
          linkHref="#"
          linkText=""
          borderColor="#F0A6CA"
        >
          <p className="text-gray-300 text-sm">
            Tools, frameworks, and best practices for creating immersive extended reality experiences.
          </p>
        </DashboardCard>

        <DashboardCard
          title="Spatial Computing"
          icon={Layers}
          description="Understanding interaction in 3D environments"
          linkHref="#"
          linkText=""
          borderColor="#E7BCDE"
        >
          <p className="text-gray-300 text-sm">
            How computers are learning to understand and interact with three-dimensional space.
          </p>
        </DashboardCard>
      </div>

      {isAdmin && (
        <Card className="bg-gradient-to-br from-black to-gray-900 border-[#B8BEDD]/30">
          <CardHeader>
            <CardTitle className="text-white">Admin Analytics</CardTitle>
            <CardDescription className="text-gray-400">View detailed analytics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              As an admin, you have access to detailed analytics about users, posts, and comments. Visit the Analytics
              page to view charts and statistics about VR/AR content engagement.
            </p>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center mt-4 text-sm text-[#B8BEDD] hover:underline"
            >
              Go to Analytics
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
