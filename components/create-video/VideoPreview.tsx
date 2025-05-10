// src/components/create-video/VideoPreview.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2, Loader2 } from "lucide-react"
import { VideoPreviewProps } from "@/types/video"
import { JSX } from "react"

export default function VideoPreview({
  generated,
  download,
  videoUrl,
  loading,
  onRegenerate
}: VideoPreviewProps): JSX.Element {
  return (
    <Card className="w-full bg-neutral- text-white border-neutral-800 rounded-3xl border-none shadow-md shadow-neutral-500">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>

      <div className="md:grid md:grid-cols-2 md:gap-4 items-center">
        <CardContent className="col-span-1">
          <div className="rounded-3xl">
            {videoUrl ? (
              <video className="h- w-auto" controls preload="none">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : generated ? (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 p-4 text-white">
                <p className="text-center">Video generated! URL: {videoUrl}</p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4 bg-neutral-950 border-0">
                <Wand2 className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  {loading ? "Generating your video..." : "No preview available yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <div className="col-span-1 w-fit">
          {generated && (
            <div className="flex items-center gap-4 w-fit">
              <Button variant="outline" className="bg-indigo-600 hover:bg-indigo-700 rounded-3xl" onClick={onRegenerate}>Regenerate</Button>
              {download && (
                <Button asChild>
                  <a href={download} download target="_blank" rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-3xl">Download</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}