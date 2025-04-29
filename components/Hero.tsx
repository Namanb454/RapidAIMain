import React, { useState } from 'react'
import Image from 'next/image'

import { motion } from 'framer-motion'

const Hero = () => {
    const containerVariants = {
        hidden: { y: 200, opacity: 0 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.3, // Delay between children
                duration: 0.6
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8  mx-auto h-screen overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid lg:grid-cols2 gap-12 items-center text-center">
                <div className='space-y-10 relative'>
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Transform Text into
                        <span className="bg-gradient-to-r from-indigo-300 to-purple-500 bg-clip-text text-transparent"> Engaging Videos</span>
                    </motion.h1>
                    <motion.div
                        variants={itemVariants}
                        className='relative px-5 md:max-w-7xl xl:w-full min-h-screen mx-auto z-10'>
                        {/* shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] shadow-indigo-500 */}
                        <Image
                            className='md:block hidden w-full rounded-3xl'
                            src='create-video.png'
                            width={100}
                            height={100}
                            alt='Create Video'
                        />
                        <Image
                            className='md:hidden block w-full rounded-3xl object-'
                            src='create-video0.png'
                            width={100}
                            height={100}
                            alt='Create Video'
                        />
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className='absolute inset-y-5 rounded-3xl w-full animate-tilt h-full bg-gradient-to-r from-indigo-50 to-indigo-500 blur-3xl'>
                    </motion.div>

                    {/* <p className="text-xl text-neutral-300 mb-8">
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
                    </div> */}
                </div>
                {/* <div className="relative">
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
                </div> */}
            </motion.div>
        </section>
    )
}

export default Hero