"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/Button";

const placeholderImg = "/assets/placeholder.png";

type Product = {
  id: string | number;
  name: string;
  price: string;
  image?: string;
};

const ProductCatalog = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(8);

  const handleProductClick = (productId: string | number) => {
    router.push(`/catalog?productId=${productId}`);
  };

  const handleViewMore = () => {
    router.push("/catalog");
  };

  return (
    <section id="product-catalog" className="pt-12 pb-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black text-accent text-center">
            Our Products 
          </h2>
          <div className="w-16 h-0.5 bg-accent rounded-full opacity-30" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
          {products.slice(0, visibleCount).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative aspect-square mb-8 bg-[#F4F4F4] rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-700 group-hover:bg-[#EFEFEF]">
                <img
                  src={product.image || placeholderImg}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholderImg;
                  }}
                />
              </div>
              <div className="flex flex-col flex-grow items-start space-y-2 px-2">
                <h3 className="text-xl font-bold text-secondary font-display group-hover:text-primary transition-colors leading-tight line-clamp-1 truncate">
                  {product.name}
                </h3>

                <p className="text-neutral-500 font-bold text-base mb-4 opacity-80">{product.price}</p>
                <Button
                  className="w-full mt-auto bg-primary hover:opacity-90 text-white rounded-2xl py-6 h-auto text-base font-bold shadow-[0_10px_20px_rgba(10,58,43,0.15)] transition-all duration-300"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewMore}
            className="border-primary text-primary hover:bg-primary/5 rounded-full px-12 py-6 h-auto font-bold"
          >
            {products.length > visibleCount ? "View All Products" : "Visit Full Catalog"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;