import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Input } from './ui/input'
import Prompt from './Prompt'

const Hero = () => {
    const [prompt, setPrompt] = useState('');

    const examplePrompts = [
        "Create an explainer video about renewable energy using vibrant animations",
        "Make a product showcase video for a new smartwatch with dynamic transitions",
        "Generate a travel montage video of Paris with smooth camera movements and upbeat narration",
        "Create a cooking tutorial for making pasta with step-by-step visual instructions"
    ];

    const handleExampleClick = (text: string) => {
        setPrompt(text);
    };

    return (
        <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Transform Text into
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"> Engaging Videos</span>
                    </h1>
                    <p className="text-xl text-neutral-300 mb-8">
                        Generate professional videos with custom narration from just a text prompt. Edit, refine, and export in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                            Try For Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-neutral-700 text-black">
                            View Examples <Play className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex items-center space-x-4 text-neutral-300">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" />
                            ))}
                        </div>
                        <p>Trusted by 2,000+ content creators worldwide</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-1">
                        <div className="bg-neutral-900 rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Generate Your Video</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-neutral-400 block mb-2">Enter your prompt</label>
                                    <Input
                                        placeholder="Describe the video you want to create..."
                                        className="bg-neutral-800 border-neutral-700"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-neutral-400 block mb-2">Or try one of our examples</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {examplePrompts.map((text, index) => (
                                            <Prompt key={index} prompt={text} onClick={handleExampleClick} />
                                        ))}
                                    </div>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Generate Video <Sparkles className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -top-4 -left-4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero