import ProductCard from "./ProductCard"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
}

interface RelatedProductsProps {
  products: Product[]
  title?: string
}

export default function RelatedProducts({ products, title = "Related Products" }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="block">
      <div className="block mx-auto w-full max-w-7xl">
        <div className="block-title">
          <span className="text-2xl font-bold">{title}</span>
        </div>
        <div className="block block-products mt-10">
          <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
