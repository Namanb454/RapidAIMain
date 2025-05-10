"use client"

import { JSX, useState } from "react"
import { SharedVideoProps } from "@/types/video"
import VideoForm from "./VideoForm"
import VideoPreview from "./VideoPreview"
import { CaptionVideo, generateNarration, generateVideo, RawCaptionVideo, storeVideoInSupabase } from "@/app/actions/video-actions"
import VideoFields from "./VideoFields"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer"
import { AlertCircle, Loader2, Video, Wand2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function TextToVideoTab({
  duration,
  setDuration,
  voice,
  setVoice,
  generated,
  setGenerated,
  error,
  setError,
  loading,
  setLoading
}: SharedVideoProps): JSX.Element {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState<string>("")
  const [narration, setNarration] = useState<string>("")
  const [script, setScript] = useState<any | null>(null)
  const [showNarrationEditor, setShowNarrationEditor] = useState<boolean>(false)
  const [showNarrationWarning, setShowNarrationWarning] = useState<boolean>(false)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState<boolean>(false)
  const [showPreviewWarning, setShowPreviewWarning] = useState<boolean>(false)
  const [playableVideoUrl, setPlayableVideoUrl] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")

  const pollJobStatus = async (jobId: string): Promise<any> => {
    const POLLING_INTERVAL = 4000 // 4 seconds
    const MAX_POLLING_TIME = 3 * 60 * 1000 // 3 minutes in milliseconds
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          // Check if we've exceeded the time limit
          if (Date.now() - startTime > MAX_POLLING_TIME) {
            setError("Video generation timed out after 3 minutes. Please try again.")
            reject(new Error("Video generation timed out after 3 minutes"))
            return
          }

          const data = await RawCaptionVideo(jobId)
          console.log("Raw Video Status:", data.status)

          if (data.status === "completed") {
            console.log("Video Status URL: ", data.raw_video_url)
            const rawVideoUrl: any = data.raw_video_url
            setVideoUrl(rawVideoUrl)
            setPlayableVideoUrl(rawVideoUrl)

            try {
              const captionedData = await handleCaptionVideo(jobId)
              resolve(captionedData)
            } catch (err) {
              // If captioning fails, we still have the raw video URL
              console.error("Error in captioning video:", err)
              resolve({ url: videoUrl })
            }
          } else {
            setTimeout(checkStatus, POLLING_INTERVAL)
          }
        } catch (err) {
          reject(err)
        }
      }

      checkStatus()
    })
  }

  const handleCaptionVideo = async (jobId: string): Promise<any> => {
    const POLLING_INTERVAL = 4000 // 4 seconds
    const MAX_POLLING_TIME = 2 * 60 * 1000 // 2 minutes in milliseconds
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const checkCaptionedStatus = async () => {
        try {
          // Check if we've exceeded the time limit
          if (Date.now() - startTime > MAX_POLLING_TIME) {
            console.warn("Video captioning timed out, falling back to raw video")
            resolve({ url: videoUrl }) // Resolve with the raw video URL as fallback
            return
          }

          const data = await CaptionVideo(jobId)
          console.log("Captioned Video Status:", data.status)

          if (data.status === "completed") {
            console.log("Captioned Video URL: ", data.captioned_video_url)
            const captionedUrl: any = data.captioned_video_url
            setVideoUrl(captionedUrl)
            setPlayableVideoUrl(captionedUrl)
            resolve({ url: captionedUrl })
          } else {
            setTimeout(checkCaptionedStatus, POLLING_INTERVAL)
          }
        } catch (err) {
          reject(err)
        }
      }
      checkCaptionedStatus()
    })
  }

  const handleGenerateNarration = async (): Promise<void> => {
    if (!prompt) return

    setLoading(true)
    setError("")
    setGenerated(false)

    try {
      const narrationData = await generateNarration(prompt, duration)
      setScript(narrationData)
      setNarration(narrationData.script)
      setShowNarrationEditor(true)
    } catch (err) {
      console.error("Error generating narration:", err)
      setError(`Failed to generate narration: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = async (): Promise<void> => {
    if (!script || !user) return

    setLoading(true)
    setError("")
    setGenerated(false)
    setShowNarrationEditor(false)

    try {
      // Update script with the edited narration
      const updatedScript = { ...script, script: narration }
      const jobId = await generateVideo(updatedScript, voice, duration)
      console.log("Video generation job created: ", jobId)

      const videoData = await pollJobStatus(jobId)

      // Get the final video URL from the returned data
      const finalVideoUrl = videoData.url || videoUrl

      if (!finalVideoUrl) {
        throw new Error("Failed to retrieve video URL")
      }

      setGenerated(true)
      console.log("Video URL retrieved successfully:", finalVideoUrl)
      setShowPreviewDrawer(true)

      // Store video in Supabase
      try {
        await storeVideoInSupabase(
          finalVideoUrl,
          user.id,
          duration,
          prompt, // Using the prompt as the title
          narration // Using the narration as the description
        )
        console.log("Video stored in Supabase successfully")
      } catch (storeErr) {
        console.error("Error storing video in Supabase:", storeErr)
        setError(`Video generated but failed to save: ${storeErr instanceof Error ? storeErr.message : "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error in video generation process:", err)
      setError(`Failed to generate video: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleNarrationDialogClose = (open: boolean) => {
    if (!open && showNarrationEditor) {
      setShowNarrationWarning(true)
    }
  }

  const confirmNarrationClose = () => {
    setShowNarrationEditor(false)
    setShowNarrationWarning(false)
  }

  const handlePreviewDrawerClose = (open: boolean) => {
    if (!open && showPreviewDrawer) {
      setShowPreviewWarning(true)
    }
  }

  const confirmPreviewClose = () => {
    setShowPreviewDrawer(false)
    setShowPreviewWarning(false)
  }

  return (
    <div className="md:grid gap-6 md:grid-cols-2 relative md:space-y-0 space-y-5">
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

      {(narration && !showNarrationEditor) ? (
        <div className="rounded-full w-fit mx-auto col-span-2">
          <Button
            disabled={loading || !narration}
            className="rounded-full p-4 bg-green-600 shadow-sm shadow-neutral-500 animate-pulse"
            onClick={() => setShowNarrationEditor(true)}
          >
            <Video className="h-5 w-5" />
            <span className="ml-2">Reopen Narration</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-full w-fit mx-auto col-span-2">
          <Button onClick={handleGenerateNarration} disabled={!prompt || loading} className="w-fit gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-3xl">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Narration
              </>
            )}
          </Button>
        </div>
      )}

      <Dialog open={showNarrationEditor} onOpenChange={handleNarrationDialogClose}>
        <DialogContent className="sm:max-w-[600px] bg-neutral-950 text-white border-none rounded-3xl shadow-sm shadow-neutral-500">
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
            <div className="flex gap-2 text-sm text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <p>
                Don't switch from <span className="font-bold text-yellow-200">Text To Video To Narration Video</span>, you may lose your video and credit.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNarrationWarning(true)}
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

      <Dialog open={showNarrationWarning} onOpenChange={setShowNarrationWarning}>
        <DialogContent className="bg-neutral-950 text-white border-none shadow-sm shadow-neutral-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Warning
            </DialogTitle>
            <DialogDescription>
              Closing or canceling the narration editor may result in losing your credits and video progress. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNarrationWarning(false)}
              className="w-fit gap-2 bg-transparent rounded-3xl"
            >
              Continue Editing
            </Button>
            <Button
              variant="destructive"
              onClick={confirmNarrationClose}
              className="w-fit gap-2 rounded-3xl"
            >
              Close Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {videoUrl && (
        <Drawer open={showPreviewDrawer} onOpenChange={handlePreviewDrawerClose}>
          <DrawerContent className="text-white bg-transparent backdrop-blur-lg border-none shadow-md shadow-neutral-500">
            <div className="mx-auto w-full md:max-w-2xl">
              <div className="p-4 flex flex-col items-center justify-end">
                <VideoPreview
                  download={playableVideoUrl}
                  generated={generated}
                  videoUrl={videoUrl}
                  loading={loading}
                  onRegenerate={handleGenerateNarration}
                />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button onClick={confirmPreviewClose} className="gap-2 bg-transparent rounded-3xl" variant="outline">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <Dialog open={showPreviewWarning} onOpenChange={setShowPreviewWarning}>
        <DialogContent className="bg-neutral-950 text-white border-none shadow-sm shadow-neutral-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Warning
            </DialogTitle>
            <DialogDescription>
              Closing the video preview may result in losing your credits and video progress. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreviewWarning(false)}
              className="w-fit gap-2 bg-transparent rounded-3xl"
            >
              Continue Viewing
            </Button>
            <Button
              variant="destructive"
              onClick={confirmPreviewClose}
              className="w-fit gap-2 rounded-3xl"
            >
              Close Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {generated && !showPreviewDrawer && (
        <Button
          className="fixed bottom-16 right-4 rounded-full p-4 shadow-lg"
          onClick={() => setShowPreviewDrawer(true)}
        >
          <Video className="h-5 w-5" />
          <span className="ml-2">Reopen Preview</span>
        </Button>
      )}
    </div>
  )
}