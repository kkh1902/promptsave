"use client"

import { useState } from "react"
import { ArrowLeft, ImageIcon, Info, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryNavigation } from "@/components/category/category-navigation"

export default function CreateImagePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [selectedTab, setSelectedTab] = useState("details")
  const [files, setFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CategoryNavigation type="image" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Image</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Image Upload/Preview */}
          <div className="md:col-span-2 space-y-6">
            {files.length === 0 ? (
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
            ) : (
              <>
                <div className="aspect-video bg-card rounded-lg overflow-hidden">
                  {files[0] && (
                    <img
                      src={URL.createObjectURL(files[0])}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                    <TabsTrigger value="generation" className="flex-1">Generation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Input
                        placeholder="Add a title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-semibold"
                      />
                      <Textarea
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="resources" className="space-y-4 mt-6">
                    <div className="bg-card rounded-lg p-6 space-y-4">
                      <h2 className="font-semibold">Resources</h2>
                      <p className="text-sm text-muted-foreground">
                        Install the Civitai Extension for Automatic 1111 Stable Diffusion Web UI
                        to automatically detect all the resources used in your images.
                      </p>
                      <Button className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="generation" className="space-y-4 mt-6">
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
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Post Settings</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="Add tags (comma separated)" />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  Post
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Draft
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Tips</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Add a clear title that describes your image</li>
                <li>• Include the prompt used to generate the image</li>
                <li>• Tag your post to help others find it</li>
                <li>• Add any resources used in generation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 