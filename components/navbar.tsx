"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarChart3, Home, LogOut, Menu, MessageSquare, User, X, ChevronDown, Settings } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Users", href: "/dashboard/users", icon: User },
    { name: "Posts", href: "/dashboard/posts", icon: MessageSquare },
  ]

  if (isAdmin) {
    navigation.push({ name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 })
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold bg-gradient-to-r from-[#9c89B8] via-[#F0A6CA] to-[#B8BEDD] bg-clip-text text-transparent"
              >
                Dynamic Web App
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-[#9c89B8]/20 text-[#9c89B8]"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <item.icon className="mr-1.5 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User profile dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 text-sm font-medium rounded-md w-full"
                >
                  <div className="flex items-center gap-2 w-full">
                    <UserAvatar name={user?.name || ""} image={user?.profileImage} size="sm" />
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-900 border-gray-800 text-gray-300 z-50"
                sideOffset={8}
              >
                <div className="md:hidden px-2 py-1.5 text-sm font-medium">
                  {user?.name}
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>
                <DropdownMenuSeparator className="md:hidden bg-gray-800" />

                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 hover:text-white focus:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800 hover:text-white focus:bg-gray-800"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-gray-900 border-t border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-[#9c89B8]/20 text-[#9c89B8]"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile menu user section */}
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0">
                <UserAvatar name={user?.name || ""} image={user?.profileImage} size="md" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.name}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href={`/dashboard/users/${user?.id}`}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </div>
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </div>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
