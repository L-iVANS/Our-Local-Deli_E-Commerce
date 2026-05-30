"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Eye, Target, ChevronDown, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function AboutUsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="about-us" className="relative w-full overflow-hidden bg-white">

      {/* Background Section */}
      <div className="relative w-full h-auto min-h-[450px] md:min-h-[600px] overflow-hidden transition-all duration-700 ease-in-out">

        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0 bg-[url('/assets/modernkitchen_bg.png')] bg-cover bg-center transition-transform duration-1000 ease-in-out opacity-90"
          style={{ transform: isExpanded ? 'scale(1.08)' : 'scale(1.0)' }}
        />

        {/* Dark Overlay Layer */}
        <div className="absolute inset-0 z-10 bg-[#1A1A1A]/60 backdrop-blur-[1px]" />

        {/* Transition Gradient (The "Fading Bottom") */}
        <div className="absolute bottom-0 left-0 w-full h-[250px] z-20 bg-gradient-to-t from-white via-white/40 to-transparent" />

        {/* Text Content */}
        <div className="relative z-30 max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24 pt-16 pb-24 md:pt-24 md:pb-32 text-center text-white">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] md:text-sm font-medium tracking-[0.4em] uppercase mb-4 md:mb-8 opacity-70">ABOUT US</h2>
            <h3 className="text-lg md:text-3xl lg:text-4xl font-serif max-w-4xl mx-auto leading-relaxed uppercase tracking-wider mb-6 md:mb-12 drop-shadow-sm">
              Helping you prepare and serve food and drinks for your family in the most convenient and time-saving way
            </h3>
          </motion.div>

          {/* Expandable Text Body */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden max-w-4xl mx-auto"
              >
                <div className="space-y-10 py-10 border-t border-white/20">
                  <p className="text-base md:text-lg text-white/90 leading-loose font-light">
                    Omega Houseware is a brand under **Much Prosperity Trading International, Inc. (MPTII)**, dedicated to providing high-quality home and kitchen solutions for modern Filipino households.
                  </p>
                  <p className="text-base md:text-lg text-white/90 leading-loose font-light">
                    Our business focuses on sourcing and distributing practical, well-designed products that meet the evolving needs of families. We continuously expand our product line to ensure access to essential items that are both useful and long-lasting.
                  </p>
                  <p className="text-base md:text-lg text-white/90 leading-loose font-light">
                    Omega means "the last" and the last is usually the BEST. It represents being the final choice—the one that delivers the best value, quality, and satisfaction for your home.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-8 group flex flex-col items-center gap-3 mx-auto transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-60 group-hover:opacity-100 transition-opacity">
              {isExpanded ? "SHOW LESS" : "SHOW MORE"}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
            >
              <ChevronDown size={22} className="text-white/60 group-hover:text-white transition-colors" />
            </motion.div>
          </motion.button>
        </div>
      </div>
      {/* Info Cards Overlay Grid - Sit on the Gradient Transition */}
      <div className="relative z-40 -mt-10 md:-mt-24 max-w-[1600px] mx-auto px-4 md:px-12 lg:px-24 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary/10 transition-colors duration-300">
              <Target className="text-primary" size={24} />
            </div>
            <h4 className="text-lg md:text-2xl font-serif text-secondary mb-4 md:mb-5">Our Mission</h4>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light">
              To provide modern Filipino families with dependable, high-quality, and affordable houseware products that improve everyday living.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary/10 transition-colors duration-300">
              <Eye className="text-primary" size={24} />
            </div>
            <h4 className="text-lg md:text-2xl font-serif text-secondary mb-4 md:mb-5">Our Vision</h4>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light">
              To be recognized as a trusted and leading houseware brand in the Philippines, known for quality, innovation, and customer satisfaction.
            </p>
          </motion.div>

          {/* Our Business */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary/10 transition-colors duration-300">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <h4 className="text-lg md:text-2xl font-serif text-secondary mb-4 md:mb-5">Our Business</h4>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light">
              Omega sources and distributes high-quality houseware products worldwide, ensuring modern families have access to the best home solutions.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary/10 transition-colors duration-300">
              <Diamond className="text-primary" size={24} />
            </div>
            <h4 className="text-lg md:text-2xl font-serif text-secondary mb-4 md:mb-5">Our Values</h4>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="font-bold text-secondary text-[10px] md:text-xs">Magaling (Excellence)</span>
                <span className="text-gray-400 text-[10px] font-light">Continuous improvement in everything we do.</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-secondary text-[10px] md:text-xs">Madiskarte (Resourcefulness)</span>
                <span className="text-gray-400 text-[10px] font-light">Practical solutions for our customers.</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-secondary text-[10px] md:text-xs">Maasahan (Reliability)</span>
                <span className="text-gray-400 text-[10px] font-light">Dependable products you can trust every day.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}