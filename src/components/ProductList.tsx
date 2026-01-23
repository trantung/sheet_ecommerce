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
  variant?: "new-arrival" | "best-selling"
}

export default function ProductList({ products, title, variant = "new-arrival" }: ProductListProps) {
  const blockClass = variant === "best-selling" ? "block block-best-selling mt-20 px-4" : "block block-new-arrival mt-20 px-4"
  
  return (
    <div className={blockClass}>
      <div className="block mx-auto w-full max-w-7xl">
        <div className="block-title">
          <span className="text-2xl font-bold">{title}</span>
        </div>
        <div className="block block-products mt-10">
          <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
