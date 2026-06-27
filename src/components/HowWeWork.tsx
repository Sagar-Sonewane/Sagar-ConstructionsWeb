"use client";

import { motion } from "framer-motion";
import { PhoneCall, MapPin, NotepadText, FileSpreadsheet, HardHat, Key } from "lucide-react";

export default function HowWeWork() {
  const steps = [
    {
      num: "01",
      icon: <PhoneCall className="text-accent-terracotta" size={24} />,
      title: "Call Us",
      description: "Reach out via call, WhatsApp, or form. We will schedule a warm introductory chat to hear your dreams.",
    },
    {
      num: "02",
      icon: <MapPin className="text-accent-terracotta" size={24} />,
      title: "Site Visit",
      description: "We visit your plot or property in Bhandara to assess parameters, measurements, and soil conditions.",
    },
    {
      num: "03",
      icon: <NotepadText className="text-accent-terracotta" size={24} />,
      title: "Detailed Planning",
      description: "We draft architectural outlines, choose materials, and schedule timelines tailored to your desires.",
    },
    {
      num: "04",
      icon: <FileSpreadsheet className="text-accent-terracotta" size={24} />,
      title: "Honest Quotation",
      description: "We present a comprehensive, itemized cost layout. No hidden clauses, no post-contract surprises.",
    },
    {
      num: "05",
      icon: <HardHat className="text-accent-terracotta" size={24} />,
      title: "Construction Begins",
      description: "Our dedicated master craftsmen begin laying foundations, bricks, and conduits under strict quality checks.",
    },
    {
      num: "06",
      icon: <Key className="text-accent-terracotta" size={24} />,
      title: "Dream Delivered",
      description: "We hand over your keys. You step into a premium, sunlit sanctuary built to last generations.",
    },
  ];

  return (
    <section id="how-we-work" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
            Our Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
            The Journey to Your Dream Home
          </h2>
          <p className="font-body text-base text-text-charcoal/80 leading-relaxed">
            From the initial phone call to stepping through your front door, we keep you informed, supported, and relaxed.
          </p>
        </div>

        {/* Steps Grid / Timeline */}
        <div className="relative">
          {/* Timeline Center Line (Desktop) */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline/40 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={step.num}
                className="bg-bg-cream p-6 rounded-[24px] shadow-sm border border-outline/10 flex flex-col items-center text-center justify-between group hover:border-outline/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  {/* Step Number */}
                  <span className="font-display text-[12px] font-bold text-secondary-sage/60 uppercase tracking-widest mb-4">
                    Step {step.num}
                  </span>

                  {/* Icon Wrapper */}
                  <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-5 border border-outline/35 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-body text-[13px] leading-relaxed text-text-charcoal/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
