"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toaster"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"


const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 rounded-md animate-pulse"></div>,
})

const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    location: z.array(z.number()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      location: undefined,
    },
  })

  // Update form value when location is selected
  const handleLocationSelect = (coords: [number, number]) => {
    setSelectedLocation(coords)
    form.setValue("location", coords)
  }

  // Helper to generate a username from first and last name
  function generateUsername(firstName: string, lastName: string) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, "")
  }

  async function onSubmit(data: RegisterFormValues) {
    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please select an address on the map",
      })
      return
    }

    setIsLoading(true)
    try {
      // Construct user data including required `name` and `username`
      const userData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        username: generateUsername(data.firstName, data.lastName),
        location: selectedLocation,
      }

      const success = await register(userData)

      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please login.",
        })
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "An error occurred. Please try again.",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <Card className="w-full max-w-2xl border-[#F0A6CA]/30 bg-gradient-to-b from-black to-gray-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create an account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Address (Click on map to select)</FormLabel>
                    <FormControl>
                      <div className="mt-1 rounded-md overflow-hidden h-64">
                        <MapComponent onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                      </div>
                    </FormControl>
                    {!selectedLocation && <FormMessage>Please select a location on the map</FormMessage>}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#F0A6CA] hover:bg-[#e095b9] text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-400 text-center w-full">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#9c89B8] hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

