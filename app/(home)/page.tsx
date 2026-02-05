import prisma from '@/lib/prisma'
import Link from 'next/link'
import { BannerCarousel } from '@/components/home/banner-carousel'
import { LatestProducts } from '@/components/home/latest-products'
import { StudyCategories } from '@/components/home/study-categories'
import { HowItWorks } from '@/components/home/how-it-works'
import { StudyStats } from '@/components/home/study-stats'


async function getLatestProducts() {
  try {
    return await prisma.product.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        reviews: true,
      },
    })
  } catch (error) {
    console.warn('Database connection failed, using mock data:', error)
    // Return mock data if database fails
    return [
      {
        id: 'mock-1',
        name: 'USMLE Step 1 Review Guide',
        description: 'Comprehensive review for USMLE Step 1 with practice questions and high-yield topics',
        price: 49.99,
        images: ['/images/book1.jpg', '/images/book2.jpg'],
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'mock-cat-1',
        category: {
          id: 'mock-cat-1',
          name: 'Exam Prep',
          description: 'Study guides and practice materials',
          image: '/images/banner2.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        reviews: [],
      },
      {
        id: 'mock-2',
        name: 'Medical-Surgical Nursing Textbook',
        description: 'Authoritative textbook covering medical-surgical nursing concepts and care',
        price: 129.99,
        images: ['/images/book5.jpg', '/images/book6.jpg'],
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'mock-cat-2',
        category: {
          id: 'mock-cat-2',
          name: 'Textbooks',
          description: 'Core textbooks for medical education',
          image: '/images/banner2.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        reviews: [],
      },
    ]
  }
}

export default async function HomePage() {
  const latestProducts = await getLatestProducts()

  return (
    <div className="space-y-16">
      

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Help for Your Studies
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Download summaries, lecture notes, practice exams, quizzes, and other study documents,
            or connect with students who can help you excel in your courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
              className="px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:brightness-110 inline-block text-center"
            >
              Browse Study Materials
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Study Materials */}
      <LatestProducts products={latestProducts} />

      {/* Study Categories */}
      <StudyCategories />

      {/* How It Works */}
      <HowItWorks />

      {/* Stats Section */}
      <StudyStats />


    </div>
  )
}