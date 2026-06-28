"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Home, ShieldCheck } from "lucide-react";
import { triggerAppointmentModal, triggerQuotationModal } from "@/components/FormModals";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-surface-container/30 rounded-b-[32px] sm:rounded-b-[48px]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/heroimage.png"
          alt="Warm, sunlit custom built family home"
          className="w-full h-full object-cover object-center scale-[1.03]"
        />
        {/* Soft natural golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-cream via-bg-cream/70 to-bg-cream/20 md:to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Subheading / Tagline */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-secondary-sage/10 text-secondary-sage border border-secondary-sage/20 px-4 py-1.5 rounded-full mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[12px] font-semibold tracking-wider uppercase font-display">
              Sagar Constructions
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.15] mb-6"
          >
            Building Homes with <br />
            <span className="text-accent-terracotta relative">
              Trust, Care & Quality
            </span> <br />
            Since 2005.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-body text-base sm:text-lg text-text-charcoal/80 leading-relaxed mb-10 max-w-2xl"
          >
            From building dream homes to repairs, plumbing, tile fitting and property assistance, Sagar Constructions has proudly served families across Bhandara with honesty, quality and care.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <button
              onClick={triggerAppointmentModal}
              className="inline-flex items-center justify-center gap-2 bg-accent-terracotta text-white hover:bg-primary px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-accent-terracotta/20 hover:shadow-primary/20 cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => triggerQuotationModal("Residential Construction")}
              className="inline-flex items-center justify-center bg-bg-cream/80 backdrop-blur-sm border-2 border-primary text-primary hover:bg-surface px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <span>Request Quotation</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-text-charcoal/70"
          >
            <div className="flex items-center gap-2 bg-bg-cream/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm border border-outline/35">
              <ShieldCheck size={16} className="text-secondary-sage" />
              <span>20+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-bg-cream/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm border border-outline/35">
              <Home size={16} className="text-secondary-sage" />
              <span>Family-Owned & Trusted</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
