"use client";

import { motion } from "framer-motion";
import { Heart, Landmark, Users, Award } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Heart className="text-accent-terracotta" size={24} />,
      title: "Family Values & Trust",
      description: "We treat your future home like we would treat our own. Every project is anchored in honesty and care.",
    },
    {
      icon: <Landmark className="text-accent-terracotta" size={24} />,
      title: "Fair & Transparent Pricing",
      description: "No hidden charges. We respect your hard-earned life savings and work transparently within your budget.",
    },
    {
      icon: <Users className="text-accent-terracotta" size={24} />,
      title: "Friendly, Dedicated Team",
      description: "A warm, helpful approach from design consultation through the final brush stroke.",
    },
    {
      icon: <Award className="text-accent-terracotta" size={24} />,
      title: "Experienced Craftsmen",
      description: "Proudly building structures since 2005. Every wall we lay represents quality and longevity.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-bg-cream relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Heading and Brand Narrative */}
          <div className="lg:col-span-5">
            <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
              Who We Are
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
              We Don't Just Build Walls. We Build Your Sanctuary.
            </h2>
            <p className="font-body text-base text-text-charcoal/80 leading-relaxed mb-6">
              Founded in 2005 by Mr. Natthuji Sonewane, Sagar Constructions was born out of a simple promise: to help families in Bhandara realize their dream homes with absolute honesty and care.
            </p>
            <p className="font-body text-base text-text-charcoal/80 leading-relaxed">
              We know that building or repairing a home is an emotional journey. You are not buying concrete—you are investing your hard-earned savings into a lifetime of future memories. That is why we place trust and open communication above everything else we do.
            </p>
          </div>

          {/* Right Column: Core Values Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={val.title}
                className="bg-surface p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline/10"
              >
                <div className="w-12 h-12 bg-bg-cream rounded-full flex items-center justify-center mb-5">
                  {val.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-primary mb-2">
                  {val.title}
                </h3>
                <p className="font-body text-[14px] text-text-charcoal/70 leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
