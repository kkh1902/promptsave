"use client"

import { useState } from "react"
import { ArrowLeft, ImageIcon, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadImagePage() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Image Post</h1>
        </div>

        {/* Alert */}
        <Alert className="mb-8 bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            There may be a short delay before your uploaded media appears in the Model
            Gallery and Image Feeds. Please allow a few minutes for your media to become
            visible after posting.
          </AlertDescription>
        </Alert>

        {/* Info Text */}
        <p className="text-sm text-muted-foreground mb-6">
          Our site is mostly used for sharing AI generated content. You can start generating images using our{" "}
          <Link href="#" className="text-primary hover:underline inline-flex items-center">
            onsite generator <ExternalLink className="h-3 w-3 ml-0.5" />
          </Link>{" "}
          or train your model using your own images by using our{" "}
          <Link href="#" className="text-primary hover:underline inline-flex items-center">
            onsite LoRA trainer <ExternalLink className="h-3 w-3 ml-0.5" />
          </Link>
          .
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted rounded-lg p-12">
          <input
            type="file"
            multiple
            accept=".png,.jpeg,.jpg,.webp"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
          >
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Drag images here or click to select files
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Attach up to 20 files
            </p>
            <p className="text-xs text-muted-foreground">
              Accepted file types: .png, .jpeg, .jpg, .webp
            </p>
          </label>
        </div>

        {/* Terms */}
        <p className="text-sm text-muted-foreground mt-6">
          By uploading images to our site you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms of service
          </Link>
          . Be sure to read our{" "}
          <Link href="#" className="text-primary hover:underline">
            Content Policies
          </Link>{" "}
          before uploading any images.
        </p>
      </main>
    </div>
  )
} 