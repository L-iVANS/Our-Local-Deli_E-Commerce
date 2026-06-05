"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogStory } from "@/src/data/blogsData";

const OmegaStories = ({ stories }: { stories: BlogStory[] }) => {
  return (
    <section id="local-stories" className="py-12 md:py-24 bg-[#212121] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black">
            Our Local Deli Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                  }}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                  {story.excerpt}
                </p>
                <div className="pt-2">
                  <Link href={story.link || "#"} className="inline-flex items-center text-primary font-bold text-sm tracking-wide hover:underline transition-all">
                    Read more ›
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OmegaStories;
