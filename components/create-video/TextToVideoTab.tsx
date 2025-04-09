// src/components/create-video/TextToVideoTab.tsx
"use client"

import { JSX, useState } from "react"
import { SharedVideoProps } from "@/types/video"
import VideoForm from "./VideoForm"
import VideoPreview from "./VideoPreview"
import { generateNarration, generateVideo, checkJobStatus } from "@/app/actions/video-actions"

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

  const pollJobStatus = async (jobId: string): Promise<string> => {
    const POLLING_INTERVAL = 4000; // 4 seconds

    // This function returns a promise that resolves when the job is completed
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const data: any = await checkJobStatus(jobId);
          console.log("Job status check:", data);

          // Check if the job is completed
          if (data.status === "completed" && data?.output_path) {
            console.log(data?.output_path);
            setVideoUrl(data?.output_path);
            resolve(data?.output_path); // Return the video URL
            return;
          } else {
            // Job not completed yet, check again after interval
            setTimeout(checkStatus, POLLING_INTERVAL);
            return;
          }
        } catch (err) {
          reject(err);
        }
      };

      // Start checking status
      checkStatus();
    });
  };

  const handleGenerate = async (): Promise<void> => {
    if (!prompt) return

    setLoading(true)
    setError("")
    setGenerated(false)

    try {
      // Step 1: Generate narration using server action
      const narrationData = await generateNarration(prompt, duration);

      // Step 2: Generate video using server action
      const jobId = await generateVideo(narrationData, voice, duration);
      console.log("Video generation job created:", jobId);

      // Step 3: Poll for job completion until status is "completed"
      const finalVideoUrl = await pollJobStatus(jobId);

      setVideoUrl(finalVideoUrl);
      setGenerated(true);
      console.log("Video URL retrieved successfully:", finalVideoUrl);
    } catch (err) {
      console.error("Error in video generation process:", err);
      setError(`Failed to generate video: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
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
        onSubmit={handleGenerate}
        isSubmitDisabled={!prompt || loading}
        loading={loading}
        title="Video Description"
        description="Describe the video you want to generate in detail"
      />

      <VideoPreview
        generated={generated}
        videoUrl={videoUrl}
        loading={loading}
        onRegenerate={handleGenerate}
      />
    </div>
  )
}