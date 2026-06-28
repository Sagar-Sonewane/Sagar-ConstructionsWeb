"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldAlert, Send, RefreshCw, Upload, FileText, X, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { submitBuyProperty, submitSellProperty } from "@/app/actions";
import { showToastNotification } from "@/components/FormModals";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/validation/schemas";

// Custom Select component for styled options
interface CustomSelectProps {
  name: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  className?: string;
  bgClass?: string;
}

function CustomSelect({
  name,
  options,
  defaultValue,
  value,
  onChange,
  disabled,
  className = "",
  bgClass = "bg-surface",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl ${bgClass} border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] text-text-charcoal/80 cursor-pointer flex items-center justify-between text-left disabled:opacity-60`}
      >
        <span>{selectedValue}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-charcoal/50"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <input type="hidden" name={name} value={selectedValue} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 top-full mt-2 bg-bg-cream border border-outline/35 rounded-xl shadow-xl p-2 space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  selectedValue === option
                    ? "bg-surface-container font-semibold text-primary"
                    : "text-text-charcoal/80 hover:bg-surface-container hover:text-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PropertyAssistance() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [submitted, setSubmitted] = useState(false);
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
          showToastNotification(`File ${file.name} must be a JPG, PNG, or WebP image.`, "error");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (activeTab === "buy") {
        res = await submitBuyProperty(null, formData);
      } else {
        formData.delete("images");
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
        res = await submitSellProperty(null, formData);
      }

      if (res.success) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#1c3d3a", "#5a7d75", "#c68a6b", "#eae5dc"],
        });
        showToastNotification(
          activeTab === "buy"
            ? "Requirements submitted successfully!"
            : "Property listing submitted successfully!",
          "success"
        );
      } else if (res.errors) {
        setErrors(res.errors);
        showToastNotification("Please correct the errors in the form.", "error");
      } else {
        showToastNotification(res.message || "Failed to process request.", "error");
      }
    } catch (err) {
      showToastNotification("Network connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
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
                  onClick={() => { setActiveTab("buy"); setSubmitted(false); setErrors({}); setSelectedFiles([]); }}
                  className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    activeTab === "buy" ? "bg-primary text-white" : "text-text-charcoal/70 hover:text-primary"
                  }`}
                >
                  I Want to Buy
                </button>
                <button
                  onClick={() => { setActiveTab("sell"); setSubmitted(false); setErrors({}); setSelectedFiles([]); }}
                  className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
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
                    <button
                      onClick={() => { setSubmitted(false); setSelectedFiles([]); }}
                      className="mt-6 bg-primary hover:bg-tertiary text-white px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300"
                    >
                      Submit Another Request
                    </button>
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
                    {/* Honeypot Spam Protection */}
                    <input
                      type="text"
                      name="website"
                      className="hidden"
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          disabled={loading}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
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
                          className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{errors.phone[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          disabled={loading}
                          placeholder="e.g. rahul@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {errors.email && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{errors.email[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                          Property Type
                        </label>
                        <CustomSelect
                          name="propertyType"
                          disabled={loading}
                          bgClass="bg-bg-cream"
                          options={[
                            "Plot / Land",
                            "House / Villa",
                            "Apartment / Flat",
                            "Commercial Property",
                            "Other"
                          ]}
                        />
                      </div>
                    </div>

                    {activeTab === "buy" ? (
                      <>
                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                            Preferred Location / Area in Bhandara
                          </label>
                          <input
                            type="text"
                            name="preferredLocation"
                            required
                            disabled={loading}
                            placeholder="e.g. Trimurti Nagar, Khat Road"
                            className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {errors.preferredLocation && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{errors.preferredLocation[0]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                            Budget Range (e.g. 25-30 Lakhs)
                          </label>
                          <input
                            type="text"
                            name="budget"
                            required
                            disabled={loading}
                            placeholder="e.g. 30 Lakhs"
                            className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {errors.budget && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{errors.budget[0]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                            Specific Requirements & Preferences
                          </label>
                          <textarea
                            rows={4}
                            name="requirements"
                            required
                            disabled={loading}
                            placeholder="Please share specific requirements (e.g. facing direction, road width, configuration) so we can assist you better."
                            className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none disabled:opacity-60"
                          />
                          {errors.requirements && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{errors.requirements[0]}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                            Property Location in Bhandara
                          </label>
                          <input
                            type="text"
                            name="propertyLocation"
                            required
                            disabled={loading}
                            placeholder="e.g. Khat Road, near Main Market"
                            className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {errors.propertyLocation && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{errors.propertyLocation[0]}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                              Property Size / Area (e.g. 1500 sqft)
                            </label>
                            <input
                              type="text"
                              name="area"
                              required
                              disabled={loading}
                              placeholder="e.g. 30x50 ft or 1500 sqft"
                              className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                            />
                            {errors.area && (
                              <p className="text-[11px] text-accent-terracotta mt-1">{errors.area[0]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                              Expected Price
                            </label>
                            <input
                              type="text"
                              name="expectedPrice"
                              required
                              disabled={loading}
                              placeholder="e.g. 45 Lakhs"
                              className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                            />
                            {errors.expectedPrice && (
                              <p className="text-[11px] text-accent-terracotta mt-1">{errors.expectedPrice[0]}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2">
                            Property Description & Details
                          </label>
                          <textarea
                            rows={3}
                            name="propertyDescription"
                            required
                            disabled={loading}
                            placeholder="Please share house details, construction age, legal paperwork status, etc."
                            className="w-full px-4 py-3 rounded-xl bg-bg-cream border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none disabled:opacity-60"
                          />
                          {errors.propertyDescription && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{errors.propertyDescription[0]}</p>
                          )}
                        </div>

                        {/* Image Upload Area */}
                        <div>
                          <label className="block text-[13px] font-semibold text-text-charcoal/80 mb-2 flex items-center justify-between">
                            <span>Upload Property Photos (Optional)</span>
                            <span className="text-[11px] text-text-charcoal/50">Max 5MB each, Images only</span>
                          </label>

                          <div
                            onClick={() => !loading && fileInputRef.current?.click()}
                            className="border-2 border-dashed border-outline/40 hover:border-secondary-sage/60 rounded-2xl p-6 text-center cursor-pointer bg-bg-cream transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
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
                              Click to upload property images
                            </span>
                          </div>

                          {selectedFiles.length > 0 && (
                            <div className="mt-3 space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                              {selectedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-surface border border-outline/35 rounded-xl px-3 py-2 text-[12px]"
                                >
                                  <div className="flex items-center gap-2 text-text-charcoal/80 max-w-[85%]">
                                    <FileText size={14} className="text-secondary-sage shrink-0" />
                                    <span className="truncate font-semibold">{file.name}</span>
                                    <span className="text-text-charcoal/40 shrink-0">
                                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => removeFile(index)}
                                    className="text-accent-terracotta hover:text-red-700 font-bold p-1 disabled:opacity-50 cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-tertiary text-white font-semibold py-4 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                      <span>
                        {loading
                          ? "Submitting Details..."
                          : activeTab === "buy"
                          ? "Submit Buying Requirements"
                          : "Submit Property for Sale"}
                      </span>
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
