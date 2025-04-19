// src/components/create-video/VideoPreview.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2, Loader2 } from "lucide-react"
import { VideoPreviewProps } from "@/types/video"
import { JSX } from "react"

export default function VideoPreview({
  generated,
  videoUrl,
  loading,
  onRegenerate
}: VideoPreviewProps): JSX.Element {
  return (
    <Card className="md:col-span-1 bg-neutral-950 text-white border-neutral-800 rounded-3xl">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Your generated video will appear here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-3xl bg-muted bg-neutral-950">
          {generated && videoUrl ? (
            <video className="h-full w-full object-cover bg-neutral-950" controls preload="none">
              <source src={videoUrl} type="video/mp4" />
              {/* <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            /> */}
              Your browser does not support the video tag.
            </video>
          ) : generated ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 p-4 text-white">
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
      <CardFooter className="justify-between">
        {generated && (
          <>
            <Button variant="outline" className="bg-indigo-600 hover:bg-indigo-700 rounded-3xl" onClick={onRegenerate}>Regenerate</Button>
            {videoUrl && (
              <Button asChild>
                <a href={videoUrl} download target="_blank" rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-3xl">Download</a>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}