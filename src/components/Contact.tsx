"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Send, MessageSquare, ChevronDown, RefreshCw, Upload, FileText, X } from "lucide-react";
import confetti from "canvas-confetti";
import { submitContactForm } from "@/app/actions";
import { showToastNotification } from "@/components/FormModals";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/validation/schemas";


export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("New Home Construction");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];
      let hasError = false;

      filesArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          showToastNotification(`File ${file.name} is too large. Max size is 5MB.`, "error");
          hasError = true;
          return;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          showToastNotification(`File ${file.name} must be a JPEG, PNG, or WebP image.`, "error");
          hasError = true;
          return;
        }
        validFiles.push(file);
      });

      if (!hasError) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const servicesList = [
    "New Home Construction",
    "Home Renovation / Additions",
    "Plumbing & Fixtures Work",
    "Tile & Marble Alignment",
    "Property Buy/Sell Assistance",
    "Other Services"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Append files
    formData.delete("images");
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await submitContactForm(null, formData);
      if (res.success) {
        setSubmitted(true);
        setSelectedFiles([]); // Reset files
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#1c3d3a", "#5a7d75", "#c68a6b", "#eae5dc"],
        });
        showToastNotification("Consultation request submitted successfully!", "success");
      } else if (res.errors) {
        setErrors(res.errors);
        showToastNotification("Please correct the errors in the form.", "error");
      } else {
        showToastNotification(res.message || "Something went wrong.", "error");
      }
    } catch (err) {
      showToastNotification("Network connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section id="contact" className="py-24 bg-surface relative">
      {/* Soft light leaks background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent-terracotta/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
                Get In Touch
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
                Let’s Talk About Your Sanctuary
              </h2>
              <p className="font-body text-base text-text-charcoal/80 leading-relaxed mb-10">
                Have a question about building plans, price estimates, or a small home repair? Our friendly team is ready to welcome you.
              </p>

              {/* Contact info list */}
              <ul className="space-y-6 mb-10">
                <li className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-bg-cream border border-outline/35 flex items-center justify-center text-secondary-sage shrink-0 shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-primary mb-1">
                      Our Office
                    </h4>
                    <p className="font-body text-[14px] text-text-charcoal/70">
                      Sagar Constructions Office, Khat Road, Bhandara, Maharashtra, 441904
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-bg-cream border border-outline/35 flex items-center justify-center text-secondary-sage shrink-0 shadow-sm">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-primary mb-1">
                      Working Hours
                    </h4>
                    <p className="font-body text-[14px] text-text-charcoal/70">
                      Monday – Saturday: 9:00 AM – 7:00 PM <br />
                      Sunday: Closed (Family Time)
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-bg-cream border border-outline/35 flex items-center justify-center text-secondary-sage shrink-0 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-primary mb-1">
                      Call Direct
                    </h4>
                    <p className="font-body text-[14px] text-text-charcoal/70">
                      <a href="tel:+918805192038" className="hover:underline hover:text-primary">
                        +91 88051 92038
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Actions (Call & WhatsApp) */}
            <div className="flex flex-wrap gap-4 mt-auto">
              <a
                href="tel:+918805192038"
                className="inline-flex items-center gap-2 bg-primary hover:bg-tertiary text-white px-6 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 shadow-sm"
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/918805192038"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white px-6 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 shadow-sm"
              >
                <MessageSquare size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="lg:col-span-7">
            <div className="bg-bg-cream rounded-[24px] p-8 md:p-10 border border-outline/20 shadow-sm">
              <h3 className="font-display text-xl font-bold text-primary mb-2">
                Book a Free Consultation
              </h3>
              <p className="font-body text-[13px] text-text-charcoal/60 mb-8">
                Share your ideas with us, and we will arrange a site visit or plan discussion.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary-sage/10 text-secondary-sage rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock size={28} className="animate-spin-slow" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary mb-2">
                      Consultation Request Sent
                    </h3>
                    <p className="font-body text-[14px] text-text-charcoal/70 max-w-sm mx-auto">
                      Thank you. We have received your query. A friendly team representative will call you shortly to confirm a timing.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Honeypot Spam Protection */}
                    <input
                      type="text"
                      name="website"
                      className="hidden"
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          disabled={loading}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{errors.fullName[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          required
                          disabled={loading}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{errors.phone[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          disabled={loading}
                          placeholder="e.g. ramesh@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {errors.email && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{errors.email[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Service Desired
                        </label>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] text-text-charcoal/80 cursor-pointer flex items-center justify-between text-left disabled:opacity-60"
                          >
                            <span>{selectedService}</span>
                            <motion.span
                              animate={{ rotate: isSelectOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-text-charcoal/50"
                            >
                              <ChevronDown size={16} />
                            </motion.span>
                          </button>
                          
                          <input type="hidden" name="serviceInterested" value={selectedService} />

                          <AnimatePresence>
                            {isSelectOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 left-0 right-0 top-full mt-2 bg-bg-cream border border-outline/35 rounded-xl shadow-xl p-2 space-y-1"
                              >
                                {servicesList.map((service) => (
                                  <button
                                    key={service}
                                    type="button"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setIsSelectOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
                                      selectedService === service
                                        ? "bg-surface font-semibold text-primary"
                                        : "text-text-charcoal/80 hover:bg-surface hover:text-primary"
                                    }`}
                                  >
                                    {service}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                     <div>
                      <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                        Message / Dream Home Ideas
                      </label>
                      <textarea
                        rows={4}
                        name="message"
                        required
                        disabled={loading}
                        placeholder="Tell us about your home dreams or the repair work you need."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none disabled:opacity-60"
                      />
                      {errors.message && (
                        <p className="text-[11px] text-accent-terracotta mt-1">{errors.message[0]}</p>
                      )}
                    </div>

                    {/* Image Upload Area */}
                    <div>
                      <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2 flex items-center justify-between">
                        <span>Attach Layout Drawings or Site Images (Optional)</span>
                        <span className="text-[11px] text-text-charcoal/50">Max 5MB each, Images only</span>
                      </label>

                      <div
                        onClick={() => !loading && fileInputRef.current?.click()}
                        className="border-2 border-dashed border-outline/40 hover:border-secondary-sage/60 rounded-2xl p-6 text-center cursor-pointer bg-surface/50 transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={loading}
                          className="hidden"
                        />
                        <Upload size={22} className="text-text-charcoal/40 group-hover:text-secondary-sage transition-colors" />
                        <span className="text-[13px] font-semibold text-text-charcoal/70">
                          Click to upload images
                        </span>
                        <span className="text-[11px] text-text-charcoal/40">
                          Supports JPEG, PNG, WebP, GIF
                        </span>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-outline/30 text-[12px]">
                              <div className="flex items-center gap-2 truncate">
                                <FileText size={14} className="text-secondary-sage shrink-0" />
                                <span className="truncate text-text-charcoal/80 font-medium">{file.name}</span>
                                <span className="text-[10px] text-text-charcoal/40">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="text-accent-terracotta hover:text-primary transition-colors p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>


                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent-terracotta hover:bg-primary text-white font-semibold py-4 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-accent-terracotta/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                      <span>{loading ? "Sending Enquiry..." : "Book Free Appointment"}</span>
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
