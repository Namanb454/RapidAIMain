// src/components/create-video/NarrationToVideoTab.tsx
"use client"

import { JSX, useState, useEffect } from "react"
import { SharedVideoProps } from "@/types/video"
import VideoForm from "./VideoForm"
import VideoPreview from "./VideoPreview"
import { generateVideoFromNarration } from "@/app/actions/narration-actions"
import { CaptionVideo, RawCaptionVideo, storeVideoInSupabase } from "@/app/actions/video-actions"
import { useAuth } from "@/context/auth-context"
import VideoFields from "./VideoFields"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer"
import { AlertCircle, Loader2, Video, Wand2 } from "lucide-react"

// Character limits based on duration ranges
const DURATION_CHAR_LIMITS: Record<string, number> = {
  "30-45": 750,  // 30-45 sec: ~110 words, ~750 characters max
  "45-60": 1000, // 45-60 sec: ~150 words, ~1000 characters max
  "60-90": 1400  // 60-90 sec: ~225 words, ~1400 characters max
};

// Function to extract the upper bound of the duration range for API calls
const getMaxDuration = (durationRange: string): number => {
  const upperBound = durationRange.split("-")[1];
  return parseInt(upperBound, 10);
};

export default function NarrationToVideoTab({
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
  const { user } = useAuth()
  const [script, setScript] = useState<string>("")
  const [charCount, setCharCount] = useState<number>(0)
  const [charLimit, setCharLimit] = useState<number>(DURATION_CHAR_LIMITS[duration] || 750)
  const [showNarrationEditor, setShowNarrationEditor] = useState<boolean>(false)
  const [showNarrationWarning, setShowNarrationWarning] = useState<boolean>(false)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState<boolean>(false)
  const [showPreviewWarning, setShowPreviewWarning] = useState<boolean>(false)
  const [playableVideoUrl, setPlayableVideoUrl] = useState<string>("")

  // Update character limit when duration changes
  useEffect(() => {
    setCharLimit(DURATION_CHAR_LIMITS[duration] || 750);

    // If current script exceeds the new limit, truncate it
    if (script.length > DURATION_CHAR_LIMITS[duration]) {
      setScript(script.substring(0, DURATION_CHAR_LIMITS[duration]));
      setCharCount(DURATION_CHAR_LIMITS[duration]);
    }
  }, [duration, script.length]);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // Enforce character limit based on selected duration
    if (newText.length <= charLimit) {
      setScript(newText);
      setCharCount(newText.length);
    }
  };

  const pollJobStatus = async (jobId: string): Promise<string> => {
    const POLLING_INTERVAL = 4000 // 4 seconds

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const data: any = await RawCaptionVideo(jobId)
          console.log("Raw Video:", data)

          if (data) {
            console.log("Video URL: ", data)
            setVideoUrl(data)
            setPlayableVideoUrl(data.raw_video_url)
            handleCaptionVideo(jobId)
            resolve(data)
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

  const handleCaptionVideo = async (jobId: string): Promise<void> => {
    const POLLING_INTERVAL = 4000 // 4 seconds

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const captionedVideo: any = await CaptionVideo(jobId)
          console.log("Captioned Video:", captionedVideo)

          if (captionedVideo) {
            console.log("Video URL: ", captionedVideo)
            setVideoUrl(captionedVideo)
            setPlayableVideoUrl(captionedVideo.captioned_video_url)
            resolve(captionedVideo)
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

  const handleGenerateVideo = async (): Promise<void> => {
    if (!script || !user) return

    setLoading(true)
    setError("")
    setGenerated(false)

    try {
      // Generate video using server action
      const videoData = await generateVideoFromNarration(script, voice, duration);
      console.log("Video generation response:", videoData);

      // If the API has shifted to using job IDs like the TextToVideo endpoint
      if (videoData.job_id) {
        const finalVideoUrl = await pollJobStatus(videoData.job_id);
        // Store video in Supabase
        await storeVideoInSupabase(
          finalVideoUrl,
          user.id,
          duration,
          script.substring(0, 50), // Using first 50 chars of script as title
          script // Using full script as description
        );
      } else {
        // Use the direct URL if the API still provides it
        setVideoUrl(videoData.url || "");
        // Store video in Supabase
        await storeVideoInSupabase(
          videoData.url,
          user.id,
          duration,
          script.substring(0, 50),
          script
        );
      }

      setGenerated(true);
      setShowPreviewDrawer(true);
    }
    catch (error) {
      console.error("Error generating video:", error);
      setError(`Failed to generate video: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  const handleNarrationDialogClose = (open: boolean) => {
    if (!open && showNarrationEditor) {
      setShowNarrationWarning(true);
    }
  }

  const confirmNarrationClose = () => {
    setShowNarrationEditor(false);
    setShowNarrationWarning(false);
  }

  const handlePreviewDrawerClose = (open: boolean) => {
    if (!open && showPreviewDrawer) {
      setShowPreviewWarning(true);
    }
  }

  const confirmPreviewClose = () => {
    setShowPreviewDrawer(false);
    setShowPreviewWarning(false);
  }

  // Get approximate word count for display
  const getApproxWordCount = (): number => {
    // Average English word is ~6 characters including space
    return Math.round(charCount / 6);
  };

  // Get word limit based on selected duration range
  const getWordLimit = (): number => {
    switch (duration) {
      case "30-45": return 110;
      case "45-60": return 150;
      case "60-90": return 225;
      default: return 110;
    }
  };

  return (
    <div className="md:grid gap-6 md:grid-cols-2 relative md:space-y-0 space-y-5">
      <VideoForm
        textareaLabel="Enter your narration script"
        textareaPlaceholder="Enter your full narration script here..."
        textareaValue={script}
        onTextareaChange={handleScriptChange}
        duration={duration}
        setDuration={setDuration}
        voice={voice}
        setVoice={setVoice}
        error={error}
        onSubmit={handleGenerateVideo}
        isSubmitDisabled={!script || loading}
        loading={loading}
        title="Video Description"
        description={`Narration script (${charCount}/${charLimit} characters, ~${getApproxWordCount()}/${getWordLimit()} words)`}
      />

      <VideoFields
        textareaLabel="Enter your narration script"
        textareaPlaceholder="Enter your full narration script here..."
        textareaValue={script}
        onTextareaChange={handleScriptChange}
        duration={duration}
        setDuration={setDuration}
        voice={voice}
        setVoice={setVoice}
        error={error}
        onSubmit={handleGenerateVideo}
        isSubmitDisabled={!script || loading}
        loading={loading}
        title="Music Selection"
        description="Select your best music to add in background"
      />

      {generated ? (
        <div className="rounded-full w-fit mx-auto col-span-2">
          <Button
            disabled={loading}
            className="rounded-full p-4 bg-green-600 shadow-sm shadow-neutral-500 animate-pulse"
            onClick={() => setShowPreviewDrawer(true)}
          >
            <Video className="h-5 w-5" />
            <span className="ml-2">View Video</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-full w-fit mx-auto col-span-2">
          <Button onClick={handleGenerateVideo} disabled={!script || loading} className="w-fit gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-3xl">
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
        </div>
      )}

      {/* Narration Editor Dialog */}
      <Dialog open={showNarrationEditor} onOpenChange={handleNarrationDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Narration</DialogTitle>
            <DialogDescription>
              Make changes to your narration script here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={script}
              onChange={handleScriptChange}
              placeholder="Enter your narration script..."
              className="min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground">
              {charCount}/{charLimit} characters (~{getApproxWordCount()}/{getWordLimit()} words)
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmNarrationClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Drawer */}
      {videoUrl && (
        <Drawer open={showPreviewDrawer} onOpenChange={handlePreviewDrawerClose}>
          <DrawerContent className="text-white bg-transparent backdrop-blur-lg border-none shadow-md shadow-neutral-500">
            <div className="mx-auto w-full max-w-2xl items-center">

              <div className="p-4">
                <VideoPreview
                download={playableVideoUrl}
                  generated={generated}
                  videoUrl={videoUrl}
                  loading={loading}
                  onRegenerate={handleGenerateVideo}
                />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button onClick={confirmPreviewClose} className="gap-2 bg-transparent rounded-3xl bg-neutral-900" variant="outline">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}