import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        Create stunning videos in just three simple steps
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative">
                        <div className="absolute -top-6 left-6 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">1</div>
                        <h3 className="text-xl font-medium text-white mt-4 mb-3">Enter Your Prompt</h3>
                        <p className="text-neutral-400 mb-4">
                            Describe the video you want to create in detail. Add information about style, tone, and pacing.
                        </p>
                        <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80" alt="Enter prompt" className="rounded-lg w-full" />
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative">
                        <div className="absolute -top-6 left-6 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">2</div>
                        <h3 className="text-xl font-medium text-white mt-4 mb-3">Customize Your Video</h3>
                        <p className="text-neutral-400 mb-4">
                            Edit the AI-generated narration, adjust visual elements, and fine-tune the pacing to match your vision.
                        </p>
                        <img src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80" alt="Customize video" className="rounded-lg w-full" />
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative">
                        <div className="absolute -top-6 left-6 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">3</div>
                        <h3 className="text-xl font-medium text-white mt-4 mb-3">Export & Share</h3>
                        <p className="text-neutral-400 mb-4">
                            Download your video in your preferred format or share it directly to social media platforms.
                        </p>
                        <img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80" alt="Export video" className="rounded-lg w-full" />
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks