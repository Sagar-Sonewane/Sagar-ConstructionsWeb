"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const faqs: FAQItem[] = [
    {
      question: "Do you build houses outside Bhandara city?",
      answer: "Yes, we proudly serve families across the entire Bhandara district, including nearby towns like Lakhni, Tumsar, and Sakoli. Reach out to verify if we can cover your specific village location.",
    },
    {
      question: "Are your price quotations final, or will there be hidden costs?",
      answer: "We represent honesty. Our initial quotation layouts are highly detailed and itemized. The price we agree upon in the contract is the price you pay. Unless you request layout changes during construction, there are absolutely zero post-contract hidden fees.",
    },
    {
      question: "What brands of cement, steel, and pipes do you use?",
      answer: "We never compromise on safety. We use premium certified brands (like Birla/UltraTech Cement, Tata Tiscon steel, and Astral/Supreme pipelines). Every specific material is detailed in your contract sheet before work begins.",
    },
    {
      question: "We want to buy a home or land in Bhandara. How can we check options?",
      answer: "To ensure safety and privacy, we do not post public property lists. Please submit our Property Assistance Form with your budget and preferred area. We will cross-match you with verified sellers in our private local network.",
    },
    {
      question: "Do you accept smaller projects like tile fitting or minor pipe repairs?",
      answer: "Yes! While we build full houses, we also believe in helping families maintain their sanctuaries. Our dedicated division handles kitchen restorations, bathroom tile alignments, leak repairs, and general plumbing works with the same level of care.",
    },
    {
      question: "Is the initial consultation completely free?",
      answer: "Absolutely. We believe trust starts with a conversation. We will visit your site, discuss your requirements, and provide a basic layout suggestion and quotation outline free of charge.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-bg-cream relative">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
            Common Inquiries
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-base text-text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
            We believe in complete transparency. If you have any other questions, please contact our friendly team directly.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-surface rounded-2xl border border-outline/15 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className="text-secondary-sage shrink-0 mt-1" size={18} />
                    <span className="font-display text-base font-bold text-primary leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-text-charcoal/50 shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pl-14 border-t border-outline/10 pt-4">
                        <p className="font-body text-[14px] leading-relaxed text-text-charcoal/75">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
