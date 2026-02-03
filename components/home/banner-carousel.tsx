'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const banners = [
  {
    id: 3,
    image: '/images/banner3.jpg',
    title: 'Earn Money from Your Notes',
    subtitle: 'Upload your study materials and help other students while earning',
  },
  {
    id: 4,
    image: '/images/banner5.jpg',
    title: 'Join Study Communities',
    subtitle: 'Connect with students from your university and study together',
  },
  {
    id: 5,
    image: '/images/banner3.jpg',
    title: 'Achieve Higher Grades',
    subtitle: 'Quality study resources to boost your academic performance',
  },
]

export function BannerCarousel() {
  const [isMounted, setIsMounted] = React.useState(false)
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Show first banner as fallback during SSR
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <Card className="border-0 rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-[300px] md:h-[400px] lg:h-[450px]">
                <Image
                  src={banners[0].image}
                  alt={banners[0].title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 px-4">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                      {banners[0].title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
                      {banners[0].subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative">
                <Card className="border-0 rounded-2xl overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative h-[300px] md:h-[400px] lg:h-[450px]">
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={banner.id === 1}
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white space-y-4 px-4">
                          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                            {banner.title}
                          </h1>
                          <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
                            {banner.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 rounded-full" />
        <CarouselNext className="right-4 rounded-full" />
      </Carousel>
      </div>
    </section>
  )
}