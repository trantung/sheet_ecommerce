import Image from "next/image"

export default function Banner() {
  return (
    <section className="relative h-96 bg-gradient-to-r from-slate-400 to-slate-500 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/hero-flower.png" alt="Beautiful flower" fill className="object-cover opacity-80" />
      </div>
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Store Multi Purpose</h1>
          <p className="text-lg opacity-90">This is a demo of our multi purpose template</p>
        </div>
      </div>
    </section>
  )
}
