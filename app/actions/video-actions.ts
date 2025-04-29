'use server'

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'

interface JobStatusResponse {
    status: string;
    video_url?: string;
}

export async function storeVideoInSupabase(
  videoUrl: string,
  userId: string,
  duration: string,
  title?: string,
  description?: string
): Promise<void> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        video_url: videoUrl,
        duration,
        title,
        description,
        status: 'completed'
      })
      .select()

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Failed to store video in Supabase: ${error.message}`)
    }

    console.log('Successfully stored video:', data)
  } catch (error) {
    console.error('Error in storeVideoInSupabase:', error)
    throw error
  }
}

export async function generateNarration(scriptPrompt: string, timeLimit: string): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RaILWAY_API_KEY}/generate-narration/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "script_prompt": scriptPrompt,
            "time_limit": timeLimit,
        }),
    });

    if (!response.ok) {
        throw new Error(`Narration API request failed with status ${response.status}`);
    }

    return response.json();
}

/**
 * Generates a video based on narration data, voice, and time limit
 */
export async function generateVideo(narrationData: any, voice: string, timeLimit: string): Promise<string> {
    const videoResponse = await fetch(`${process.env.NEXT_PUBLIC_RaILWAY_API_KEY}/generate-short/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "script_prompt": narrationData,
            "voice": voice,
            "time_limit": timeLimit,
        }),
    });

    if (!videoResponse.ok) {
        throw new Error(`Video generation failed with status ${videoResponse.status}`);
    }

    const videoData = await videoResponse.json();
    return videoData.job_id;
}

/**
 * Checks the status of a job and returns the video URL when completed
 */
export async function checkJobStatus(jobId: string): Promise<JobStatusResponse> {
    const params = new URLSearchParams({
        job_id: jobId
    });

    const response: any = await fetch(`${process.env.NEXT_PUBLIC_STATUS_API_KEY}/job-status?${params.toString()}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response?.status == "completed") {
        return response.json();
    }

    if (response?.status == "failed") {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    if (!response.ok) {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    return response.json();
}