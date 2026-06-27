"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldAlert, Send } from "lucide-react";

export default function PropertyAssistance() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="property-assistance" className="py-24 bg-bg-cream relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Explanation */}
          <div className="lg:col-span-5">
            <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
              Property Network
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
              Private, Trusted Property Assistance in Bhandara
            </h2>
            <p className="font-body text-base text-text-charcoal/80 leading-relaxed mb-6">
              Unlike public property websites, we do not publicly list properties to ensure privacy and eliminate spam agents.
            </p>
            <p className="font-body text-base text-text-charcoal/80 leading-relaxed mb-8">
              Instead, we run a private network connecting local buyers and sellers in Bhandara. We verify documentation and assist in fair pricing and legal setups so you are never left alone.
            </p>
            
            <div className="flex items-start gap-3 bg-surface p-5 rounded-2xl border border-outline/30">
              <ShieldAlert size={20} className="text-secondary-sage shrink-0 mt-0.5" />
              <p className="font-body text-[13px] leading-relaxed text-text-charcoal/70">
                <strong>Zero Public Listings:</strong> Your details and intent remain secure with Sagar. We only match you with verified local parties.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-[24px] p-8 border border-outline/10 shadow-sm">
              {/* Tab Selector */}
              <div className="flex bg-bg-cream p-1.5 rounded-full mb-8 max-w-[280px]">
                <button
                  onClick={() => { setActiveTab("buy"); setSubmitted(false); }}
                  className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-300 ${
                    activeTab === "buy" ? "bg-primary text-white" : "text-text-charcoal/70 hover:text-primary"
                  }`}
                >
                  I Want to Buy
                </button>
                <button
                  onClick={() => { setActiveTab("sell"); setSubmitted(false); }}
                  className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-300 ${
                    activeTab === "sell" ? "bg-primary text-white" : "text-text-charcoal/70 hover:text-primary"
                  }`}
                >
                  I Want to Sell
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary-sage/10 text-secondary-sage rounded-full flex items-center justify-center mx-auto mb-6">
                      <KeyRound size={28} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary mb-2">
                      Request Submitted With Care
                    </h3>
                    <p className="font-body text-[14px] text-text-charcoal/70 max-w-sm mx-auto">
                      Thank you. A friendly team member from Sagar Constructions will reach out to you within 24 hours to discuss details.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                        Preferred Location / Area in Bhandara
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Trimurti Nagar, Khat Road"
                        className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                        {activeTab === "buy"
                          ? "Budget & Property Preferences (e.g. 3 BHK House, Plot Size)"
                          : "Property Details (e.g. Plot dimensions, House Age, Expected Price)"}
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please share specific requirements so we can assist you better."
                        className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-tertiary text-white font-semibold py-4 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01]"
                    >
                      <Send size={15} />
                      <span>Submit Details Confidentially</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
