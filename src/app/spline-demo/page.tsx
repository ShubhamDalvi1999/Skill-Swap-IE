'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SplineDemo from "@/components/ui/spline-demo"
import Link from "next/link"

export default function SplineDemoPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-bold text-primary-500">
            Course Platform
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">Spline 3D Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-white">Interactive 3D Scene</h2>
            <p className="text-gray-400 mb-6">
              This is a demo of a Spline 3D scene integrated into our Next.js application.
              Spline allows us to create interactive 3D experiences that can be used to
              enhance course materials and provide immersive learning experiences.
            </p>
            <div className="flex space-x-4">
              <Button>
                Learn More
              </Button>
              <Button variant="outline">
                Explore Courses
              </Button>
            </div>
          </Card>
          
          <div className="h-96 bg-black rounded-lg overflow-hidden">
            <SplineDemo 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
            />
          </div>
        </div>
      </main>
    </div>
  )
} 