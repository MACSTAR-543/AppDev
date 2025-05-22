import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-5xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-[#9c89BB] via-[#F0A6CA] to-[#B8BEDD] bg-clip-text text-transparent">
          Explore the Future of Technology
        </h1>
        <p className="text-xl text-gray-300">
          Virtual Reality, Augmented Reality, and Emerging Tech Trends
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild variant="link" className="bg-[#9c89B8] hover:bg-[#8a78a6] text-white">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#F0A6CA] text-[#F0A6CA] hover:bg-[#F0A6CA]/10">
            <Link href="/register">Register</Link>
          </Button> 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="relative overflow-hidden rounded-lg h-64">
            <Image
              src="/virtual-reality.jpg"
              alt="Virtual Reality"
              fill
              style={{ objectFit: "cover" }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h2 className="text-xl font-semibold text-white mb-1">Virtual Reality</h2>
              <p className="text-sm text-gray-200">Immersive experiences that transport you to new worlds</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg h-64">
            <Image
              src="/augmented reality.jpg"
              alt="Augmented Reality"
              fill
              style={{ objectFit: "cover" }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h2 className="text-xl font-semibold text-white mb-1">Augmented Reality</h2>
              <p className="text-sm text-gray-200">Digital overlays enhancing your perception of reality</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg h-64">
            <Image
              src="/1649194756646.jpg"
              alt="Emerging Tech"
              fill
              style={{ objectFit: "cover" }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h2 className="text-xl font-semibold text-white mb-1">Emerging Tech</h2>
              <p className="text-sm text-gray-200">Cutting-edge innovations shaping our future</p>
            </div>
          </div>
      </div>
      
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-[#9c89B8]/30">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Tech Community</h2>
          <p className="text-gray-300 mb-6">
            Connect with VR/AR enthusiasts, developers, and industry experts. Stay updated on the latest trends, share your insights, and explore the future of technology together.
          </p>
          <Button asChild className="bg-[#F0A6CA] hover:bg-[#e095b9] text-black">
            <Link href="/register">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
