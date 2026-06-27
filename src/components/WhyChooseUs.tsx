"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Coins, Sparkles, MessageCircle } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: <ShieldCheck size={28} className="text-secondary-sage" />,
      title: "We Treat Your Home Like Our Own",
      description: "We represent family-owned values. Every brick, conduit, or tile is placed with the exact same dedication we would give our own children's sanctuary.",
    },
    {
      icon: <Coins size={28} className="text-secondary-sage" />,
      title: "Honest, Respectful Pricing",
      description: "We understand a home is built with a lifetime of hard-earned savings. We offer fair, transparent quotation layouts without any post-contract hidden fees.",
    },
    {
      icon: <Sparkles size={28} className="text-secondary-sage" />,
      title: "Uncompromising Quality",
      description: "No cheap material swaps. We use trusted brands and premium sands, bricks, and fittings that are certified to stand strong for decades.",
    },
    {
      icon: <MessageCircle size={28} className="text-secondary-sage" />,
      title: "Transparent & Friendly Updates",
      description: "No mystery. You will always know what phase is happening next. We send progress notes and remain available for any changes you desire.",
    },
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-bg-cream relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
            Why Sagar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
            Designed for Trust, Built for Families.
          </h2>
          <p className="font-body text-base text-text-charcoal/80 leading-relaxed">
            Over the last two decades, Bhandara families have trusted Sagar Constructions with their dream homes because we treat construction as a relationship, not a transaction.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {points.map((point, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={point.title}
              className="flex gap-6 group"
            >
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center shrink-0 border border-outline/25 group-hover:bg-primary-earth/5 transition-colors duration-300">
                {point.icon}
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-primary mb-2">
                  {point.title}
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-text-charcoal/70">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
