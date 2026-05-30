"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, User, MessageCircle, SendIcon } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

const ContactSection = () => {
  return (
    <section id="contact-us" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start max-w-6xl mx-auto">
          {/* Left Side: Contact Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-6xl font-display font-black text-primary leading-tight">
                Contact Section
              </h2>
              <p className="text-secondary text-xl md:text-3xl font-display font-bold leading-tight max-w-md">
                Visit us. Reach out. <br />
                We'd love to help.
              </p>
            </div>

            <div className="space-y-10 pt-4">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-secondary">Our Showroom</h4>
                  <p className="text-neutral-500 text-sm">123 Houseware Ave, Quezon City, Metro Manila, Philippines</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-secondary">Call Us</h4>
                  <p className="text-neutral-500 text-sm">+63 917 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-secondary">Email</h4>
                  <p className="text-neutral-500 text-sm">hello@omegahouseware.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-secondary">Showroom Hours</h4>
                  <p className="text-neutral-500 text-sm">Monday - Saturday, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-6 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-neutral-50 relative z-10"
          >
            <form className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-[0.1em] ml-1">Full Name <span className="text-primary">*</span></label>
                  <input type="text" className="w-full bg-[#F6F6F6] border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-400" placeholder="Juan dela Cruz" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-[0.1em] ml-1">Email Address <span className="text-primary">*</span></label>
                  <input type="email" className="w-full bg-[#F6F6F6] border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-400" placeholder="juan@email.com" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-secondary uppercase tracking-[0.1em] ml-1">Subject <span className="text-primary">*</span></label>
                <input type="text" className="w-full bg-[#F6F6F6] border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-400" placeholder="Wholesale Inquiry" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-secondary uppercase tracking-[0.1em] ml-1">Message <span className="text-primary">*</span></label>
                <textarea rows={5} className="w-full bg-[#F6F6F6] border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-neutral-400" placeholder="How can we help you?" />
              </div>
              <button className="w-full bg-[#4A4A4A] hover:bg-secondary text-white rounded-2xl py-6 h-auto text-base font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-black/10 active:scale-95">
                Send Message
                <span className="text-xs opacity-60">▲</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;