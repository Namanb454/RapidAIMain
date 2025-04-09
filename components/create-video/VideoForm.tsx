// src/components/create-video/VideoForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Loader2 } from "lucide-react"
import { VideoFormProps, DurationOption, VoiceOption } from "@/types/video"
import { JSX } from "react"

export default function VideoForm({
  textareaLabel,
  textareaPlaceholder,
  textareaValue,
  onTextareaChange,
  duration,
  setDuration,
  voice,
  setVoice,
  error,
  onSubmit,
  isSubmitDisabled,
  loading,
  title,
  description
}: VideoFormProps): JSX.Element {
  const voices: VoiceOption[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
  const durations: DurationOption[] = ["30-45", "45-60", "60-90"]

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">{textareaLabel}</Label>
          <Textarea
            id="text-input"
            placeholder={textareaPlaceholder}
            className="min-h-32 resize-none"
            value={textareaValue}
            onChange={onTextareaChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <RadioGroup 
            value={duration} 
            onValueChange={(value) => setDuration(value as DurationOption)}
            className="flex flex-wrap gap-4"
          >
            {durations.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`duration-${option}`} />
                <Label htmlFor={`duration-${option}`}>{option} seconds</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <Select value={voice} onValueChange={(value) => setVoice(value as VoiceOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voiceOption) => (
                <SelectItem key={voiceOption} value={voiceOption}>
                  {voiceOption.charAt(0).toUpperCase() + voiceOption.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} className="w-full gap-2">
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
  )
}