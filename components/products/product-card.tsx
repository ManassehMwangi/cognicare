import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { Product, Category } from '@prisma/client'

interface ProductCardProps {
  product: Product & {
    category: Category
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  // Generate a mock rating between 3.5 and 5.0
  const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* 1. Picture */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {product.category.name}
          </Badge>
        </div>

        {/* Content area with proper spacing */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          {/* 2. Name of the product */}
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* 3. Brief description */}
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* 4. Rating */}
          <StarRating rating={rating} />

          {/* 5. Price */}
          <div className="flex items-center justify-start">
            <span className="text-xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* 6. Add to cart button */}
          <Button className="w-full mt-2">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}