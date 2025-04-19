"use client"

import { JSX, useState } from "react"
import { SharedVideoProps } from "@/types/video"
import VideoForm from "./VideoForm"
import VideoPreview from "./VideoPreview"
import { generateNarration, generateVideo, checkJobStatus } from "@/app/actions/video-actions"
import VideoFields from "./VideoFields"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { AlertCircle } from "lucide-react"

export default function TextToVideoTab({
  duration,
  setDuration,
  voice,
  setVoice,
  generated,
  setGenerated,
  videoUrl,
  setVideoUrl,
  error,
  setError,
  loading,
  setLoading
}: SharedVideoProps): JSX.Element {
  const [prompt, setPrompt] = useState<string>("")
  const [narration, setNarration] = useState<string>("")
  const [showNarrationEditor, setShowNarrationEditor] = useState<boolean>()

  const handleGenerateNarration = async (): Promise<void> => {
    if (!prompt) return

    setLoading(true)
    setError("")
    setGenerated(false)

    try {
      const narrationData = await generateNarration(prompt, duration)
      setNarration(narrationData?.script);
      setShowNarrationEditor(true)
    } catch (err) {
      console.error("Error generating narration:", err)
      setError(`Failed to generate narration: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = async (): Promise<void> => {
    if (!narration) return

    setLoading(true)
    setError("")
    setGenerated(false)
    setShowNarrationEditor(false)

    try {
      const jobId = await generateVideo(narration, voice, duration)
      console.log("Video generation job created:", jobId)

      const finalVideoUrl = await pollJobStatus(jobId)
      setVideoUrl(finalVideoUrl)
      setGenerated(true)
      console.log("Video URL retrieved successfully:", finalVideoUrl)
    } catch (err) {
      console.error("Error in video generation process:", err)
      setError(`Failed to generate video: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const pollJobStatus = async (jobId: string): Promise<string> => {
    const POLLING_INTERVAL = 4000 // 4 seconds

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const data: any = await checkJobStatus(jobId)
          console.log("Job status check:", data)

          if (data.status === "completed" && data?.output_path) {
            console.log(data?.output_path)
            setVideoUrl(data?.output_path)
            resolve(data?.output_path)
            return
          } else {
            setTimeout(checkStatus, POLLING_INTERVAL)
            return
          }
        } catch (err) {
          reject(err)
        }
      }

      checkStatus()
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <VideoForm
        textareaLabel="Prompt"
        textareaPlaceholder="A cinematic shot of a futuristic city with flying cars and neon lights..."
        textareaValue={prompt}
        onTextareaChange={(e) => setPrompt(e.target.value)}
        duration={duration}
        setDuration={setDuration}
        voice={voice}
        setVoice={setVoice}
        error={error}
        onSubmit={handleGenerateNarration}
        isSubmitDisabled={!prompt || loading}
        loading={loading}
        title="Video Description"
        description="Describe the video you want to generate in detail"
      />

      <Dialog open={showNarrationEditor} onOpenChange={setShowNarrationEditor}>
        <DialogContent className="sm:max-w-[600px] bg-neutral-950 text-white border-none rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Narration</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Textarea
              className="w-full h-80 bg-neutral-900 border-none rounded-3xl"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Edit the generated narration here..."
            />
            <div className="flex items-center gap-2 text-sm text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              Don't cancel or close it, you may lost your video or credit.
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNarrationEditor(false)}
              className="w-fit gap-2 bg-transparent rounded-3xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateVideo}
              disabled={loading || !narration}
              className="w-fit gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-3xl"
            >
              Generate Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <VideoFields
        textareaLabel="Prompt"
        textareaPlaceholder="A cinematic shot of a futuristic city with flying cars and neon lights..."
        textareaValue={prompt}
        onTextareaChange={(e) => setPrompt(e.target.value)}
        duration={duration}
        setDuration={setDuration}
        voice={voice}
        setVoice={setVoice}
        error={error}
        onSubmit={handleGenerateNarration}
        isSubmitDisabled={!prompt || loading}
        loading={loading}
        title="Music Selection"
        description="Select your best music to add in background"
      />

      <VideoPreview
        generated={generated}
        videoUrl={videoUrl}
        loading={loading}
        onRegenerate={handleGenerateNarration}
      />
    </div>
  )
}