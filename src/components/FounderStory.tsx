"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function FounderStory() {
  return (
    <section id="founder-story" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Portrait & Decorative Element */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-secondary-sage/10 rounded-[32px] translate-x-3 translate-y-3 z-0" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 aspect-[4/5] rounded-[32px] overflow-hidden border border-outline/35 shadow-md bg-bg-cream"
            >
              <img
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80"
                alt="Mr. Natthuji Sonewane, Founder of Sagar Constructions"
                className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>

          {/* Right Column: Founder Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
              Our Foundations
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
              A Message From Our Founder
            </h2>
            
            <div className="space-y-5 font-body text-base text-text-charcoal/80 leading-relaxed mb-8">
              <p>
                "When I started Sagar Constructions back in 2005, my goal was not to create the biggest commercial enterprise in Maharashtra. I simply wanted to build a company where a neighbor could walk in, shake hands, and trust us to build their dream home without fearing hidden costs or cheap craftsmanship."
              </p>
              <p>
                "Over the years, our team has grown, and we have helped construct dozens of sanctuaries across Bhandara. But our core belief has remained exactly the same: construction is not about cement and steel. It is about honoring a family’s life savings. We build with care, we price with honesty, and we stand by our work long after the keys are delivered."
              </p>
            </div>

            {/* Quote Block */}
            <div className="relative bg-bg-cream p-6 rounded-2xl border-l-4 border-accent-terracotta border border-outline/20 mb-8 shadow-sm">
              <Quote className="absolute -top-3 right-6 text-accent-terracotta/10 w-12 h-12 rotate-180" />
              <p className="font-display text-base md:text-lg font-semibold text-primary italic leading-relaxed">
                "Our greatest satisfaction comes from seeing families happily move into the homes we helped create."
              </p>
            </div>

            {/* Sign-off Signature */}
            <div>
              <h4 className="font-display text-base font-bold text-primary mb-0.5">
                Mr. Natthuji Sonewane
              </h4>
              <p className="font-body text-[13px] text-text-charcoal/50">
                Founder, Sagar Constructions
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
