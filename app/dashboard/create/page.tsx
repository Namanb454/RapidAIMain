"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Wand2, Loader2 } from "lucide-react"

export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState(15)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!prompt) return

    setLoading(true)

    // Simulate video generation
    setTimeout(() => {
      setLoading(false)
      setGenerated(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Video</h2>
        <p className="text-muted-foreground">Generate a video using AI by describing what you want to see</p>
      </div>

      <Tabs defaultValue="text-to-video" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text-to-video">Text to Video</TabsTrigger>
          <TabsTrigger value="image-to-video">Image to Video</TabsTrigger>
        </TabsList>
        <TabsContent value="text-to-video" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Video Description</CardTitle>
                <CardDescription>Describe the video you want to generate in detail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A cinematic shot of a futuristic city with flying cars and neon lights..."
                    className="min-h-32 resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <span className="text-sm text-muted-foreground">{duration}s</span>
                  </div>
                  <Slider
                    id="duration"
                    min={0}
                    max={60}
                    step={30}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerate} disabled={!prompt || loading} className="w-full gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Video
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generated video will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  {generated ? (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 p-4 text-white">
                      <p className="text-center">AI-generated video preview (simulated)</p>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4">
                      <Wand2 className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-center text-sm text-muted-foreground">
                        {loading ? "Generating your video..." : "No preview available yet"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                {generated && (
                  <>
                    <Button variant="outline">Regenerate</Button>
                    <Button>Download</Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="image-to-video" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Image to Video</CardTitle>
              <CardDescription>Upload an image to animate it into a video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-10 w-10 text-muted-foreground"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <p className="text-sm font-medium">Drag & drop an image</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled className="w-full gap-2">
                <Wand2 className="h-4 w-4" />
                Animate Image
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

