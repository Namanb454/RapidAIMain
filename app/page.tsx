'use client';

import { FileEdit, Video, Sparkles, Zap, Globe, Layout } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import PricingPlan from '@/components/PricingPlan';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Example from '@/components/Example';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-neutral-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Everything you need to create professional videos without design or video editing skills
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Sparkles}
                title="AI-Powered Generation"
                description="Transform text prompts into fully realized videos with our advanced AI algorithms."
              />
              <FeatureCard
                icon={FileEdit}
                title="Editable Narration"
                description="Customize the AI-generated narration to perfectly match your brand voice and style."
              />
              <FeatureCard
                icon={Zap}
                title="Fast Rendering"
                description="Generate high-quality videos in minutes instead of hours or days."
              />
              <FeatureCard
                icon={Video}
                title="Multiple Formats"
                description="Export videos in various formats optimized for social media, presentations, or websites."
              />
              <FeatureCard
                icon={Globe}
                title="Multi-language Support"
                description="Create videos in multiple languages with accurate translations and native-sounding narration."
              />
              <FeatureCard
                icon={Layout}
                title="Customizable Templates"
                description="Choose from dozens of pre-designed templates or create your own unique style."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Examples Section */}
        <Example />
        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Hear from content creators who have transformed their video production with VideoGen
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="VideoGen has completely transformed my content creation workflow. What used to take days now takes minutes, and the quality is incredible!"
                author="Sarah Johnson"
                role="Content Creator"
                company="Tech Insights"
              />
              <TestimonialCard
                quote="As a marketing team of one, VideoGen has been a game-changer. I can now produce professional videos for our campaigns without hiring a production team."
                author="Michael Chen"
                role="Marketing Manager"
                company="StartupBoost"
              />
              <TestimonialCard
                quote="The editable narration feature is brilliant. I can maintain my brand voice while saving countless hours of production time."
                author="Jessica Williams"
                role="YouTube Creator"
                company="Learn With Jess"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8 bg-neutral-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Choose the plan that works best for your video creation needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <PricingPlan
                title="Starter"
                price="29"
                description="Perfect for individuals and small content creators"
                features={[
                  "10 videos per month",
                  "Up to 3 minutes per video",
                  "720p resolution",
                  "Basic editing tools",
                  "Standard narration voices",
                  "Email support"
                ]}
              />
              <PricingPlan
                title="Professional"
                price="79"
                description="Ideal for growing businesses and content teams"
                features={[
                  "30 videos per month",
                  "Up to 10 minutes per video",
                  "1080p resolution",
                  "Advanced editing tools",
                  "Premium narration voices",
                  "Priority support",
                  "Custom templates"
                ]}
                popular={true}
              />
              <PricingPlan
                title="Enterprise"
                price="199"
                description="For large organizations with custom needs"
                features={[
                  "Unlimited videos",
                  "Unlimited video length",
                  "4K resolution",
                  "Full editing suite",
                  "All narration voices",
                  "24/7 dedicated support",
                  "Custom branding",
                  "API access"
                ]}
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>

  );
}