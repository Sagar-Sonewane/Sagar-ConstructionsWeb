"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Upload, FileText, Send, CheckCircle, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { submitAppointmentBooking, submitQuotationRequest } from "@/app/actions";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/validation/schemas";

// Reusable Custom Select component for styled options
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

// Reusable Toast Component definition
interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl ${
              toast.type === "success"
                ? "bg-surface border-[#c2d1cc]/60 text-primary"
                : "bg-surface border-accent-terracotta/30 text-accent-terracotta"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-secondary-sage shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-accent-terracotta shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-body text-[13px] font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-charcoal/40 hover:text-text-charcoal transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Global modal triggers
export function triggerAppointmentModal() {
  window.dispatchEvent(new CustomEvent("open-appointment-modal"));
}

export function triggerQuotationModal(serviceName = "Residential Construction") {
  window.dispatchEvent(new CustomEvent("open-quotation-modal", { detail: { service: serviceName } }));
}

export function showToastNotification(message: string, type: "success" | "error" = "success") {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type } }));
}

export default function FormModals() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [quotationOpen, setQuotationOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState("Residential Construction");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form State: Appointment
  const [appLoading, setAppLoading] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appErrors, setAppErrors] = useState<Record<string, string[]>>({});
  const [appSelectedFiles, setAppSelectedFiles] = useState<File[]>([]);
  const appFileInputRef = useRef<HTMLInputElement>(null);

  const handleAppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];
      let hasError = false;

      filesArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          showToast(`File ${file.name} is too large. Max size is 5MB.`, "error");
          hasError = true;
          return;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          showToast(`File ${file.name} must be a JPEG, PNG, or WebP image.`, "error");
          hasError = true;
          return;
        }
        validFiles.push(file);
      });

      if (!hasError) {
        setAppSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeAppFile = (index: number) => {
    setAppSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form State: Quotation
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string[]>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show Toast helper
  const showToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleOpenApp = () => {
      setAppointmentOpen(true);
      setAppSubmitted(false);
      setAppErrors({});
      setAppSelectedFiles([]);
    };

    const handleOpenQuote = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.service) {
        setPrefilledService(customEvent.detail.service);
      }
      setQuotationOpen(true);
      setQuoteSubmitted(false);
      setQuoteErrors({});
      setSelectedFiles([]);
    };

    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        showToast(customEvent.detail.message, customEvent.detail.type);
      }
    };

    window.addEventListener("open-appointment-modal", handleOpenApp);
    window.addEventListener("open-quotation-modal", handleOpenQuote);
    window.addEventListener("show-toast", handleShowToast);

    return () => {
      window.removeEventListener("open-appointment-modal", handleOpenApp);
      window.removeEventListener("open-quotation-modal", handleOpenQuote);
      window.removeEventListener("show-toast", handleShowToast);
    };
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#1c3d3a", "#5a7d75", "#c68a6b", "#eae5dc"],
    });
  };

  // Submit Handlers
  const handleAppointmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (appLoading) return;
    setAppLoading(true);
    setAppErrors({});

    const formData = new FormData(e.currentTarget);
    formData.delete("images");
    appSelectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await submitAppointmentBooking(null, formData);
      if (res.success) {
        setAppSubmitted(true);
        setAppSelectedFiles([]);
        triggerConfetti();
        showToast("Appointment consultation booked successfully!", "success");
      } else if (res.errors) {
        setAppErrors(res.errors);
        showToast("Please correct the errors in the form.", "error");
      } else {
        showToast(res.message || "Something went wrong.", "error");
      }
    } catch (err) {
      showToast("Network connection error. Please try again.", "error");
    } finally {
      setAppLoading(false);
    }
  };

  const handleQuotationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quoteLoading) return;
    setQuoteLoading(true);
    setQuoteErrors({});

    const formData = new FormData(e.currentTarget);
    // Remove existing image fields and append verified files
    formData.delete("images");
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await submitQuotationRequest(null, formData);
      if (res.success) {
        setQuoteSubmitted(true);
        triggerConfetti();
        showToast("Quotation request submitted successfully!", "success");
      } else if (res.errors) {
        setQuoteErrors(res.errors);
        showToast("Please correct the errors in the form.", "error");
      } else {
        showToast(res.message || "Failed to process quotation request.", "error");
      }
    } catch (err) {
      showToast("Server upload timeout. Please check your file size.", "error");
    } finally {
      setQuoteLoading(false);
    }
  };

  // File Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];
      let hasError = false;

      filesArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          showToast(`File ${file.name} is too large. Max size is 5MB.`, "error");
          hasError = true;
          return;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          showToast(`File ${file.name} must be a JPG, PNG, or WebP image.`, "error");
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

  const services = [
    "Residential Construction",
    "Home Repairs & Care",
    "Renovations & Extension",
    "Plumbing & Pipelines",
    "Tile & Marble Alignment",
    "Property Assistance",
    "Other Services",
  ];

  return (
    <>
      {/* 1. APPOINTMENT BOOKING MODAL */}
      <AnimatePresence>
        {appointmentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => !appLoading && setAppointmentOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-bg-cream rounded-[28px] border border-outline/35 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 custom-scrollbar"
            >
              <button
                disabled={appLoading}
                onClick={() => setAppointmentOpen(false)}
                className="absolute top-5 right-5 p-2 text-text-charcoal/50 hover:text-primary hover:bg-surface rounded-full transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {appSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary-sage/10 text-secondary-sage rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mb-3">
                      Appointment Booked!
                    </h3>
                    <p className="font-body text-[14px] text-text-charcoal/80 max-w-md mx-auto leading-relaxed">
                      Thank you. We have securely saved your booking. Our architect or supervisor will contact you shortly on your phone to confirm a time for the visit.
                    </p>
                    <button
                      onClick={() => setAppointmentOpen(false)}
                      className="mt-8 bg-primary hover:bg-tertiary text-white px-8 py-3 rounded-full text-[14px] font-semibold transition-all duration-300"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6 pr-8">
                      <span className="font-display text-[11px] font-bold text-secondary-sage tracking-wider uppercase mb-1 block">
                        Schedule Call or Site Visit
                      </span>
                      <h3 className="font-display text-2xl font-bold text-primary">
                        Book a Private Appointment
                      </h3>
                      <p className="font-body text-[13px] text-text-charcoal/60 mt-1">
                        Select your date, time, and service so we can make the appropriate expert available.
                      </p>
                    </div>

                    <form onSubmit={handleAppointmentSubmit} className="space-y-4">
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
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            disabled={appLoading}
                            placeholder="e.g. Anand Deshmukh"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {appErrors.fullName && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{appErrors.fullName[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            disabled={appLoading}
                            placeholder="e.g. 9876543210"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {appErrors.phone && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{appErrors.phone[0]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            name="email"
                            disabled={appLoading}
                            placeholder="e.g. anand@gmail.com"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {appErrors.email && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{appErrors.email[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Selected Service
                          </label>
                          <CustomSelect
                            name="selectedService"
                            disabled={appLoading}
                            defaultValue="Residential Construction"
                            options={services}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5 flex items-center gap-1">
                            <Calendar size={14} className="text-secondary-sage" />
                            <span>Preferred Date</span>
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            required
                            disabled={appLoading}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60 cursor-pointer"
                          />
                          {appErrors.preferredDate && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{appErrors.preferredDate[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5 flex items-center gap-1">
                            <Clock size={14} className="text-secondary-sage" />
                            <span>Preferred Time</span>
                          </label>
                          <CustomSelect
                            name="preferredTime"
                            disabled={appLoading}
                            defaultValue="Morning (9 AM - 12 PM)"
                            options={[
                              "Morning (9 AM - 12 PM)",
                              "Afternoon (12 PM - 3 PM)",
                              "Evening (3 PM - 6 PM)",
                              "Late Evening (6 PM - 7 PM)"
                            ]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5 flex items-center gap-1">
                          <MapPin size={14} className="text-secondary-sage" />
                          <span>Site / Residence Address</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          disabled={appLoading}
                          placeholder="Plot details or street address in Bhandara"
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                        />
                        {appErrors.address && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{appErrors.address[0]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                          Additional Notes or Specific Instructions (Optional)
                        </label>
                        <textarea
                          name="additionalNotes"
                          rows={3}
                          disabled={appLoading}
                          placeholder="Tell us if you want structural advice, valuation assistance, or repair work details."
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none disabled:opacity-60"
                        />
                      </div>

                      {/* Image Upload Area */}
                      <div>
                        <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5 flex items-center justify-between">
                          <span>Attach Layout Drawings or Site Images (Optional)</span>
                          <span className="text-[11px] text-text-charcoal/50">Max 5MB each, Images only</span>
                        </label>

                        <div
                          onClick={() => !appLoading && appFileInputRef.current?.click()}
                          className="border-2 border-dashed border-outline/40 hover:border-secondary-sage/60 rounded-2xl p-6 text-center cursor-pointer bg-surface/50 transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                        >
                          <input
                            type="file"
                            ref={appFileInputRef}
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleAppFileChange}
                            disabled={appLoading}
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

                        {appSelectedFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {appSelectedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-outline/30 text-[12px]">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText size={14} className="text-secondary-sage shrink-0" />
                                  <span className="truncate text-text-charcoal/80 font-medium">{file.name}</span>
                                  <span className="text-[10px] text-text-charcoal/40">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAppFile(idx)}
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
                        disabled={appLoading}
                        className="w-full bg-accent-terracotta hover:bg-primary text-white font-semibold py-4 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-accent-terracotta/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                      >
                        {appLoading ? (
                          <RefreshCw size={15} className="animate-spin" />
                        ) : (
                          <Send size={15} />
                        )}
                        <span>{appLoading ? "Booking Appointment..." : "Confirm Free Appointment"}</span>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. QUOTATION REQUEST MODAL */}
      <AnimatePresence>
        {quotationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => !quoteLoading && setQuotationOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-bg-cream rounded-[28px] border border-outline/35 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 custom-scrollbar"
            >
              <button
                disabled={quoteLoading}
                onClick={() => setQuotationOpen(false)}
                className="absolute top-5 right-5 p-2 text-text-charcoal/50 hover:text-primary hover:bg-surface rounded-full transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {quoteSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary-sage/10 text-secondary-sage rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mb-3">
                      Quotation Request Received!
                    </h3>
                    <p className="font-body text-[14px] text-text-charcoal/80 max-w-md mx-auto leading-relaxed">
                      Thank you. We have successfully stored your request. Our surveyor will inspect the details and get back to you with a detailed estimate within 48 hours.
                    </p>
                    <button
                      onClick={() => setQuotationOpen(false)}
                      className="mt-8 bg-primary hover:bg-tertiary text-white px-8 py-3 rounded-full text-[14px] font-semibold transition-all duration-300"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6 pr-8">
                      <span className="font-display text-[11px] font-bold text-secondary-sage tracking-wider uppercase mb-1 block">
                        Cost Estimation
                      </span>
                      <h3 className="font-display text-2xl font-bold text-primary">
                        Request a Work Quotation
                      </h3>
                      <p className="font-body text-[13px] text-text-charcoal/60 mt-1">
                        Describe your structure and attach any site photos or drawing layouts to receive an accurate quote.
                      </p>
                    </div>

                    <form onSubmit={handleQuotationSubmit} className="space-y-4">
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
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            disabled={quoteLoading}
                            placeholder="e.g. Nilesh Sonwane"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {quoteErrors.fullName && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.fullName[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            disabled={quoteLoading}
                            placeholder="e.g. 9876543210"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {quoteErrors.phone && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.phone[0]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            name="email"
                            disabled={quoteLoading}
                            placeholder="e.g. nilesh@gmail.com"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {quoteErrors.email && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.email[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Service Category
                          </label>
                          <CustomSelect
                            name="service"
                            disabled={quoteLoading}
                            value={prefilledService}
                            onChange={setPrefilledService}
                            options={services}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Estimated Budget Range
                          </label>
                          <input
                            type="text"
                            name="estimatedBudget"
                            required
                            disabled={quoteLoading}
                            placeholder="e.g. 15-20 Lakhs or 50,000 INR"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {quoteErrors.estimatedBudget && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.estimatedBudget[0]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                            Plot Dimensions / Work Area
                          </label>
                          <input
                            type="text"
                            name="plotSize"
                            required
                            disabled={quoteLoading}
                            placeholder="e.g. 30x50 ft, 1500 sqft, 2 rooms"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] disabled:opacity-60"
                          />
                          {quoteErrors.plotSize && (
                            <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.plotSize[0]}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5">
                          Project Details & Description
                        </label>
                        <textarea
                          name="projectDescription"
                          rows={3}
                          required
                          disabled={quoteLoading}
                          placeholder="Describe the exact construction, renovation, plumbing, or alignment requirements you need."
                          className="w-full px-4 py-3 rounded-xl bg-surface border border-outline focus:outline-none focus:ring-2 focus:ring-secondary-sage/30 focus:border-secondary-sage transition-all text-[14px] resize-none disabled:opacity-60"
                        />
                        {quoteErrors.projectDescription && (
                          <p className="text-[11px] text-accent-terracotta mt-1">{quoteErrors.projectDescription[0]}</p>
                        )}
                      </div>

                      {/* Image Upload Area */}
                      <div>
                        <label className="block text-[12px] font-bold text-text-charcoal/80 mb-1.5 flex items-center justify-between">
                          <span>Attach Layout Drawings or Site Images (Optional)</span>
                          <span className="text-[11px] text-text-charcoal/50">Max 5MB each, Images only</span>
                        </label>

                        <div
                          onClick={() => !quoteLoading && fileInputRef.current?.click()}
                          className="border-2 border-dashed border-outline/40 hover:border-secondary-sage/60 rounded-2xl p-6 text-center cursor-pointer bg-surface/50 transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={quoteLoading}
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
                          <div className="mt-3 space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-surface border border-outline/35 rounded-xl px-3 py-2 text-[12px]"
                              >
                                <div className="flex items-center gap-2 text-text-charcoal/80 max-w-[80%]">
                                  <FileText size={14} className="text-secondary-sage shrink-0" />
                                  <span className="truncate font-semibold">{file.name}</span>
                                  <span className="text-text-charcoal/40 shrink-0">
                                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  disabled={quoteLoading}
                                  onClick={() => removeFile(index)}
                                  className="text-accent-terracotta hover:text-red-700 font-bold p-1 disabled:opacity-50"
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
                        disabled={quoteLoading}
                        className="w-full bg-primary hover:bg-tertiary text-white font-semibold py-4 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                      >
                        {quoteLoading ? (
                          <RefreshCw size={15} className="animate-spin" />
                        ) : (
                          <Send size={15} />
                        )}
                        <span>{quoteLoading ? "Submitting Request..." : "Request Cost Estimate"}</span>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. FLOATING TOAST LIST */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
