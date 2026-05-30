"use client";
import { motion } from "framer-motion";
import { Camera, Clapperboard, ArrowRight, ShoppingBag } from "lucide-react";
import { SocialAccount } from "@/src/data/socialsData";

export default function SocialsSection({ data }: { data: SocialAccount[] }) {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Camera size={26} />;
      case "tiktok":
        return <Clapperboard size={24} />;
      case "shopee":
        return <ShoppingBag size={24} />;
      default:
        return <Camera size={26} />;
    }
  };

  const getIconBg = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500";
      case "tiktok":
        return "bg-black";
      case "shopee":
        return "bg-[#EE4D2D]"; // Shopee Orange
      default:
        return "bg-gray-800";
    }
  };

  return (
    <section className="py-12 md:py-24 bg-[#F9F9F9] w-full overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12">
        
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif text-secondary mb-5 tracking-tight">Join Our Community</h2>
          <p className="text-gray-500 font-medium tracking-wide max-w-xl mx-auto">Stay connected for daily inspiration, exclusive recipes, and modern houseware tips.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
          
          {data.map((account, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col gap-10"
            >
              {/* Top Info */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${getIconBg(account.platform)} rounded-full flex items-center justify-center mb-6 text-white shadow-lg`}>
                  {getIcon(account.platform)}
                </div>
                <h3 className="text-3xl font-serif text-secondary mb-1">{account.platform}</h3>
                <p className="text-primary font-bold text-sm mb-4 tracking-wider">{account.username}</p>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs opacity-80">
                  {account.description}
                </p>
              </div>

              {/* Middle Image Highlights - NOW BIGGER */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {account.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative group shadow-sm transition-all duration-300 hover:shadow-md">
                    <img 
                      src={img} 
                      alt={`${account.platform} post ${i+1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-auto border-t border-gray-100 pt-8 flex justify-center">
                <a 
                  href={account.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-secondary hover:text-primary transition-all group"
                >
                  Follow Us
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}