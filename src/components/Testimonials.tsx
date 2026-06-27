"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Nikhil Deshmukh",
      location: "Khat Road, Bhandara",
      role: "Dream Home Owner",
      rating: 5,
      type: "Residential Build",
      quote: "Sagar Constructions built our home in 2022. Having spent my life's savings, I was terrified of contracting issues. But Mr. Sonewane and his team treated us like family. No hidden charges, no cheap shortcuts. They built a beautiful sanctuary for my children.",
    },
    {
      name: "Meena Patwardhan",
      location: "Trimurti Nagar, Bhandara",
      role: "Home Renovation",
      rating: 5,
      type: "Renovation",
      quote: "We hired them to remodel our kitchen and add a first-floor room. The plumbing and tile alignment are absolute perfection. They clean up their work site daily and communicate with complete transparency. Highly recommended!",
    },
    {
      name: "Dr. Rajesh Gadkari",
      location: "Civil Lines, Bhandara",
      role: "Clinic Construction",
      rating: 5,
      type: "Commercial & Private Build",
      quote: "The level of professionalism and honesty they bring is very rare. Their quote layout was incredibly detailed. Every cement bag and pipe brand was laid out beforehand, and they stuck to the schedule. Sagar Constructions is the gold standard.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
              Testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
              What Families Say About Sagar
            </h2>
          </div>
          
          {/* Google Review Badge Indicator */}
          <div className="flex items-center gap-3 bg-bg-cream border border-outline/35 px-5 py-3 rounded-full shadow-sm">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span className="font-body text-[13px] font-semibold text-primary">
              5.0 Rating on Google Reviews
            </span>
          </div>
        </div>

        {/* Carousel / Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Mark background */}
          <Quote className="absolute -top-10 -left-10 text-primary-earth/5 w-32 h-32 -rotate-12 pointer-events-none" />
          
          <div className="bg-bg-cream rounded-[32px] p-8 md:p-12 border border-outline/10 shadow-sm relative z-10">
            <div className="flex gap-1 text-yellow-500 mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="font-body text-base md:text-lg text-text-charcoal leading-relaxed mb-8 italic">
              "{testimonials[activeIndex].quote}"
            </p>

            <div className="flex items-center justify-between border-t border-outline/20 pt-6">
              <div>
                <h4 className="font-display text-base font-bold text-primary">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="font-body text-[13px] text-text-charcoal/60">
                  {testimonials[activeIndex].location} • <span className="text-secondary-sage font-medium">{testimonials[activeIndex].type}</span>
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-outline hover:bg-surface flex items-center justify-center text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-sage/35"
                  aria-label="Previous review"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-outline hover:bg-surface flex items-center justify-center text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-sage/35"
                  aria-label="Next review"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
