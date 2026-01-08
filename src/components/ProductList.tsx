import ProductCard from "./ProductCard"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
}

interface ProductListProps {
  products: Product[]
  title: string
}

export default function ProductList({ products, title }: ProductListProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
