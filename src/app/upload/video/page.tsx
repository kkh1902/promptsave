"use client"

import { useState } from "react"
import { ArrowLeft, Video, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadVideoPage() {
  const [title, setTitle] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
      setShowPreview(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Upload Video</h1>
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

        <div className="space-y-8">
          {!showPreview ? (
            /* File Upload */
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <input
                type="file"
                accept=".mp4,.webm"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Drag video here or click to select file
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Videos cannot exceed 750 MB, 4K resolution, or 04 minutes (245 seconds) in duration
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Accepted file types: .mp4, .webm
                </p>
              </label>
            </div>
          ) : (
            /* Preview and Settings */
            <div className="space-y-8">
              {/* Title */}
              <Input
                placeholder="Add a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
              />

              {/* Preview */}
              <div className="aspect-video bg-card rounded-lg overflow-hidden">
                {files[0] && (
                  <video
                    src={URL.createObjectURL(files[0])}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Prompt */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Prompt</h3>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Negative Prompt</h3>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Enter negative prompt here..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Resources */}
              <div className="bg-card rounded-lg p-4 space-y-4">
                <h2 className="font-semibold">Resources</h2>
                <p className="text-sm text-muted-foreground">
                  Install the Civitai Extension for Automatic 1111 Stable Diffusion Web UI
                  to automatically detect all the resources used in your videos.
                </p>
                <Button className="w-full" variant="outline">
                  + Add Resource
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button>
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 