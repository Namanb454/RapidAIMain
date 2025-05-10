// src/components/create-video/NarrationToVideoTab.tsx
"use client"

import { JSX, useState, useEffect } from "react"
import { SharedVideoProps } from "@/types/video"
import VideoForm from "./VideoForm"
import VideoPreview from "./VideoPreview"
import { generateVideoFromNarration } from "@/app/actions/narration-actions"
import { CaptionVideo, RawVideo, storeVideoInSupabase } from "@/app/actions/video-actions"
import { useAuth } from "@/context/auth-context"
import VideoFields from "./VideoFields"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { AlertCircle, Loader2, Video, Wand2 } from "lucide-react"

// Character limits based on duration ranges
const DURATION_CHAR_LIMITS: Record<string, number> = {
  "30-45": 750,  // 30-45 sec: ~110 words, ~750 characters max
  "45-60": 1000, // 45-60 sec: ~150 words, ~1000 characters max
  "60-90": 1400  // 60-90 sec: ~225 words, ~1400 characters max
};

export default function NarrationToVideoTab({
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
  const [script, setScript] = useState<string>("")
  const [charCount, setCharCount] = useState<number>(0)
  const [charLimit, setCharLimit] = useState<number>(DURATION_CHAR_LIMITS[duration] || 750)
  const [showNarrationEditor, setShowNarrationEditor] = useState<boolean>(false)
  const [showNarrationWarning, setShowNarrationWarning] = useState<boolean>(false)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState<boolean>(false)
  const [showPreviewWarning, setShowPreviewWarning] = useState<boolean>(false)
  const [playableVideoUrl, setPlayableVideoUrl] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isRawVideo, setIsRawVideo] = useState<boolean>(false)
  const [isCaptioning, setIsCaptioning] = useState<boolean>(false)

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

          const data = await RawVideo(jobId)
          console.log("Raw Video Status:", data.status)

          if (data.raw_video_url) {
            console.log("Video Status URL: ", data.raw_video_url)
            const rawVideoUrl: any = data.raw_video_url
            setVideoUrl(rawVideoUrl)
            setPlayableVideoUrl(rawVideoUrl)
            setIsRawVideo(true)
            setGenerated(true)

            // Show the preview with raw video first
            setShowPreviewDrawer(true)

            // Now start captioning process
            try {
              setIsCaptioning(true)
              const captionedData = await handleCaptionVideo(jobId)
              setIsCaptioning(false)
              resolve(captionedData)
            } catch (err) {
              // If captioning fails, we still have the raw video URL
              setIsCaptioning(false)
              console.error("Error in captioning video:", err)
              resolve({ url: rawVideoUrl })
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

    return new Promise((resolve, reject) => {
      const checkCaptionedStatus = async () => {
        try {
          const data = await CaptionVideo(jobId)
          console.log("Captioned Video Status:", data.status)

          if (data.captioned_video_url) {
            console.log("Captioned Video URL: ", data.captioned_video_url)
            const captionedUrl: any = data.captioned_video_url
            setVideoUrl(captionedUrl)
            setPlayableVideoUrl(captionedUrl)
            setIsRawVideo(false)
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

  const handleGenerateVideo = async (): Promise<void> => {
    if (!script || !user) return

    setLoading(true)
    setError("")
    setGenerated(false)
    setShowNarrationEditor(false)
    setIsRawVideo(false)
    setIsCaptioning(false)
    setVideoUrl("")
    setPlayableVideoUrl("")

    try {
      // Generate video using server action
      const videoData = await generateVideoFromNarration(script, voice, duration);
      console.log("Video generation response:", videoData);

      // If the API has shifted to using job IDs like the TextToVideo endpoint
      if (videoData.job_id) {
        try {
          await pollJobStatus(videoData.job_id);
          // Note: We don't need to set final URL here as it's handled in pollJobStatus
        } catch (pollingError) {
          console.error("Error during video polling:", pollingError);
          setError(`Failed to generate video: ${pollingError instanceof Error ? pollingError.message : "Video generation timed out after 3 minutes"}`);
          setLoading(false);
          return;
        }
      } else if (videoData.url) {
        // Use the direct URL if the API still provides it
        // For backward compatibility
        const directUrl = videoData.url;
        setVideoUrl(directUrl);
        setPlayableVideoUrl(directUrl);
        setIsRawVideo(true); // Assume it's raw if using direct URL
        setGenerated(true);
        setShowPreviewDrawer(true);
      } else {
        throw new Error("No video URL or job ID returned from API");
      }

      // Store video in Supabase - using the current videoUrl which should be set either by polling or direct
      try {
        // Wait a bit to ensure we have the latest URL
        setTimeout(async () => {
          if (videoUrl) {
            await storeVideoInSupabase(
              videoUrl,
              user.id,
              duration,
              script.substring(0, 50), // Using first 50 chars of script as title
              script // Using full script as description
            );
            console.log("Video stored in Supabase successfully");
          }
        }, 1000);
      } catch (storeErr) {
        console.error("Error storing video in Supabase:", storeErr);
        setError(`Video generated but failed to save: ${storeErr instanceof Error ? storeErr.message : "Unknown error"}`);
      }
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
        <DialogContent className="sm:max-w-[600px] bg-neutral-950 text-white border-none rounded-3xl shadow-sm shadow-neutral-500">
          <DialogHeader>
            <DialogTitle>Edit Narration</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Make changes to your narration script here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={script}
              onChange={handleScriptChange}
              placeholder="Enter your narration script..."
              className="min-h-[200px] bg-neutral-900 border-none rounded-3xl"
            />
            <div className="text-sm text-neutral-400">
              {charCount}/{charLimit} characters (~{getApproxWordCount()}/{getWordLimit()} words)
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
              disabled={loading || !script}
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

      {/* Preview Drawer */}
      {videoUrl && (
        <Drawer open={showPreviewDrawer} onOpenChange={handlePreviewDrawerClose}>
          <DrawerContent className="text-white bg-transparent backdrop-blur-lg border-none shadow-md shadow-neutral-500">
            <div className="mx-auto w-full md:max-w-2xl">
              <DrawerHeader>
                <DrawerTitle className="text-center">
                  {isRawVideo ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>Preview (Raw Video)</span>
                      {isCaptioning && (
                        <div className="flex items-center gap-1 text-yellow-300 text-sm font-normal animate-pulse">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Adding captions...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    "Preview (Captioned Video)"
                  )}
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4 flex flex-col items-center justify-end">
                <VideoPreview
                  download={playableVideoUrl}
                  generated={generated}
                  videoUrl={videoUrl}
                  loading={loading}
                  onRegenerate={handleGenerateVideo}
                  isRawVideo={isRawVideo}
                  isCaptioning={isCaptioning}
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