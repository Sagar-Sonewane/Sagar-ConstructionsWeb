"use client";

import { motion } from "framer-motion";
import { Home, Hammer, Paintbrush, Droplets, Grid, Landmark, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Home className="text-primary" size={28} />,
      title: "Residential Construction",
      description: "From foundation laying to final styling, we build custom homes with architectural clarity, ensuring your new space is safe, warm, and tailored.",
      cta: "Explore Our Process",
      link: "#how-we-work",
    },
    {
      icon: <Hammer className="text-primary" size={28} />,
      title: "Home Repairs & Care",
      description: "Minor leaks, structural cracks, woodwork, or plastering. We handle necessary repairs with precision to keep your house sturdy and secure.",
      cta: "Request Repair Quote",
      link: "#contact",
    },
    {
      icon: <Paintbrush className="text-primary" size={28} />,
      title: "Renovations & Expansion",
      description: "Need an extra room, a modern kitchen layout, or structural updates? We expand and remodel existing structures beautifully.",
      cta: "Schedule Consultation",
      link: "#contact",
    },
    {
      icon: <Droplets className="text-primary" size={28} />,
      title: "Plumbing & Pipelines",
      description: "Complete water pipeline installations, concealed piping, drainage planning, and bathroom/toilet fixtures laid for leakproof longevity.",
      cta: "Get Plumbing Quote",
      link: "#contact",
    },
    {
      icon: <Grid className="text-primary" size={28} />,
      title: "Tile & Marble Fitting",
      description: "Flawless bathroom tiles, kitchen counters, marble flooring, and exterior wall cladding fitted with absolute alignment and care.",
      cta: "View Layout Designs",
      link: "#contact",
    },
    {
      icon: <Landmark className="text-primary" size={28} />,
      title: "Property Assistance",
      description: "Connecting verified property buyers and sellers in the Bhandara region. Trustworthy documentation and transparent dealings.",
      cta: "Check Available Properties",
      link: "#property-assistance",
    },
  ];

  return (
    <section id="services" className="py-24 bg-surface relative">
      {/* Background soft lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary-sage/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
            What We Do
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
            Honest Craftsmanship For Your Home
          </h2>
          <p className="font-body text-base sm:text-lg text-text-charcoal/80 leading-relaxed">
            Whether you are building a new sanctuary from scratch or maintaining the one you cherish, we deliver every service with personal care and high attention to detail.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              key={service.title}
              className="bg-bg-cream p-8 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col justify-between group border border-outline/10 hover:border-outline/50"
            >
              <div>
                <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-outline/25 group-hover:scale-105 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-primary mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-text-charcoal/70 mb-8">
                  {service.description}
                </p>
              </div>
              
              <a
                href={service.link}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-accent-terracotta hover:text-primary transition-colors group-hover:translate-x-1 transition-transform"
              >
                <span>{service.cta}</span>
                <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
