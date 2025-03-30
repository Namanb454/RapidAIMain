import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Play } from 'lucide-react'

const Example = () => {
    return (
        <section id="examples" className="py-20 px-4 md:px-6 lg:px-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Video Examples</h2>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        See what&apos;s possible with VideoGen
                    </p>
                </div>

                <Tabs defaultValue="business" className="w-full">
                    <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8">
                        <TabsTrigger value="business" className="data-[state=active]:bg-indigo-600">Business</TabsTrigger>
                        <TabsTrigger value="education" className="data-[state=active]:bg-indigo-600">Education</TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-indigo-600">Social Media</TabsTrigger>
                        <TabsTrigger value="marketing" className="data-[state=active]:bg-indigo-600">Marketing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="business" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">

                                    <video className='w-full h-full object-cover' width="320" height="240"
                                        preload="auto"
                                        onMouseOver={(e: any) => e.target.play()}
                                        onMouseOut={(e: any) => e.target.pause()}
                                    >
                                        <source src="/Flint.mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Company Overview</h3>
                                    <p className="text-neutral-400">A professional corporate video introducing a tech company&apos;s mission and services.</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" alt="Product demo" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Play className="h-16 w-16 text-white opacity-80" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Product Demonstration</h3>
                                    <p className="text-neutral-400">A detailed walkthrough of a software product&apos;s key features and benefits.</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="education" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">

                                <video className='w-full h-full object-cover' width="320" height="240"
                                        preload="auto"
                                        onMouseOver={(e: any) => e.target.play()}
                                        onMouseOut={(e: any) => e.target.pause()}
                                    >
                                        <source src="/spacewalk.mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Physics Concepts</h3>
                                    <p className="text-neutral-400">An educational video explaining complex physics principles with clear visuals.</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                <video className='w-full h-full object-cover' width="320" height="240"
                                        preload="auto"
                                        onMouseOver={(e: any) => e.target.play()}
                                        onMouseOut={(e: any) => e.target.pause()}
                                    >
                                        <source src="/Hyena.mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Historical Events</h3>
                                    <p className="text-neutral-400">A dynamic retelling of important historical moments with engaging narration.</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="social" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                <video className='w-full h-full object-cover' width="320" height="240"
                                        preload="auto"
                                        onMouseOver={(e: any) => e.target.play()}
                                        onMouseOut={(e: any) => e.target.pause()}
                                    >
                                        <source src="/hustle.mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Travel Vlog</h3>
                                    <p className="text-neutral-400">A captivating travel video showcasing breathtaking destinations and experiences.</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                    <img src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80" alt="Lifestyle video" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Play className="h-16 w-16 text-white opacity-80" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Lifestyle Tips</h3>
                                    <p className="text-neutral-400">A quick and engaging video sharing practical lifestyle tips and advice.</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="marketing" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                <video className='w-full h-full object-cover' width="320" height="240"
                                        preload="auto"
                                        onMouseOver={(e: any) => e.target.play()}
                                        onMouseOut={(e: any) => e.target.pause()}
                                    >
                                        <source src="/got.mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Product Launch</h3>
                                    <p className="text-neutral-400">A striking product launch video that builds excitement and showcases features.</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" alt="Brand story" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Play className="h-16 w-16 text-white opacity-80" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-2">Brand Story</h3>
                                    <p className="text-neutral-400">An emotional storytelling video that connects audiences with a brand&apos;s values.</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>

    )
}

export default Example