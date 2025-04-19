// src/components/create-video/VideoForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Loader2, Music, Play, Speech, Timer } from "lucide-react"
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
  const musics = [
    {
        'music': "BladeRunner",
    },
    {
        'music': "Snowfall",
    },
    {
        'music': "Another Love",
    },
    {
        'music': "Else-Paris",
    },
]
  return (
    <Card className="md:col-span-1 bg-neutral-950 text-white border-neutral-800 rounded-3xl">
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
            className="min-h-80 resize-none bg-neutral-900 text-white border-neutral-800 rounded-lg"
            value={textareaValue}
            onChange={onTextareaChange}
          />
        </div>
        {/* <Label htmlFor="voice" className="text-lg flex items-center gap-2">
                    <Music className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                    Music Selection</Label>
                <div className="grid grid-cols-2 gap-4">
                    {musics.map((item, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-center border border-neutral-800 hover:border-2 hover:border-indigo-500 w-full p-2 mx-auto text-center rounded-lg text-sm">
                                <Play className="bg-neutral-800 p-2 rounded-lg w-8 h-8" />
                                {item.music}
                            </div>
                        )
                    })}
                </div> */}
                {/* <div className="space-y-2">
                    <Label htmlFor="voice" className="text-lg flex items-center gap-2">
                        <Speech className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                        Voice</Label>
                    <Select value={voice} onValueChange={(value) => setVoice(value as VoiceOption)}>
                        <SelectTrigger className="w-full bg-neutral-900 border-0 rounded-lg backdrop-blur-2xl">
                            <SelectValue placeholder="Select a voice" className="bg-neutral-950 border-0 rounded-lg" />
                        </SelectTrigger>
                        <SelectContent className="border-neutral-800 bg-neutral-900 rounded-lg">
                            {voices.map((voiceOption) => (
                                <SelectItem key={voiceOption} value={voiceOption} className="bg-neutral-900 text-white border-0 rounded-lg">
                                    {voiceOption.charAt(0).toUpperCase() + voiceOption.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> */}
                {/* <div className="space-y-2">
                    <Label htmlFor="voice" className="text-lg flex items-center gap-2">
                        <Speech className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                        Voice</Label>
                    <RadioGroup
                        value={voice}
                        onValueChange={(value) => setVoice(value as VoiceOption)}
                        className="grid grid-cols-2 gap-4 capitalize"
                    >
                        {voices.map((voiceOption) => (
                            <div key={voiceOption} className="flex items-center space-x-2">
                                <RadioGroupItem value={voiceOption} className="text-indigo-300 bg-neutral-800" />
                                <Label htmlFor={`duration-${voiceOption}`}>{voiceOption}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label className="text-lg flex items-center gap-2">
                        <Timer className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                        Duration
                    </Label>
                    <RadioGroup
                        value={duration}
                        onValueChange={(value) => setDuration(value as DurationOption)}
                        className="flex flex-wrap gap-4"
                    >
                        {durations.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`duration-${option}`} className="text-indigo-300 bg-neutral-800" />
                                <Label htmlFor={`duration-${option}`}>{option} seconds</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )} */}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-3xl">
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