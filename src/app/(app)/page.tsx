'use client';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { motion } from 'framer-motion';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';

export default function Home() {
  // const [emblaRef] = useEmblaCarousel({ duration: 500 })
  return (
    <>
      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center text-center px-6 md:px-24 py-16 min-h-screen bg-white overflow-hidden">
      
      {/* 🌀 Animated Grid Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      />

      {/* 🚀 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-3xl"
      >
        <AnimatedShinyText>Echo Without Limits</AnimatedShinyText>

        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Anonymously Connect. <br className="hidden md:inline" />
          Speak Freely with <span className="text-primary">Random Echoes</span>
        </motion.h1>

        <motion.p
          className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          A safe, private platform where your identity remains yours alone.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* 🎠 Carousel */}
      <motion.div
        className="mt-16 w-full max-w-lg md:max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="shadow-md flex flex-col items-center border border-muted">
                  <CardHeader className='flex '>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-primary" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>
    </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-black  text-white">
        © 2025 Random Echoes. All rights reserved.
      </footer>
    </>
  );
}