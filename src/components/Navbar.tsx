"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  Home,
  Hammer,
  Paintbrush,
  Droplets,
  Grid,
  Landmark,
} from "lucide-react";
import { triggerAppointmentModal } from "@/components/FormModals";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const serviceLinks = [
    {
      name: "Residential Construction",
      href: "#services",
      desc: "Custom home builds",
      icon: <Home size={16} className="text-secondary-sage" />,
    },
    {
      name: "Home Repairs & Care",
      href: "#services",
      desc: "Maintenance & repairs",
      icon: <Hammer size={16} className="text-secondary-sage" />,
    },
    {
      name: "Renovations & Extension",
      href: "#services",
      desc: "Expand existing spaces",
      icon: <Paintbrush size={16} className="text-secondary-sage" />,
    },
    {
      name: "Plumbing & Pipelines",
      href: "#services",
      desc: "Leakproof water systems",
      icon: <Droplets size={16} className="text-secondary-sage" />,
    },
    {
      name: "Tile & Marble Alignment",
      href: "#services",
      desc: "Precision flooring",
      icon: <Grid size={16} className="text-secondary-sage" />,
    },
    {
      name: "Property Assistance",
      href: "#property-assistance",
      desc: "Private local network",
      icon: <Landmark size={16} className="text-secondary-sage" />,
    },
  ];

  const mainLinks = [
    { name: "About", href: "#about" },
    { name: "Why Us", href: "#why-choose-us" },
    { name: "Our Process", href: "#how-we-work" },
    { name: "Gallery", href: "#gallery" },
    { name: "Founder Story", href: "#founder-story" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-bg-cream/90 backdrop-blur-md shadow-sm border-b border-outline/20"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <a
            href="#"
            className="font-display text-xl md:text-2xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Sagar <span className="font-light text-secondary-sage">Constructions</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a
              href="#about"
              className="text-[14px] font-medium text-text-charcoal/75 hover:text-primary transition-colors duration-300 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-tertiary hover:after:w-full after:transition-all after:duration-300"
            >
              About
            </a>

            {/* Hover Dropdown Wrapper */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`text-[14px] font-medium transition-colors duration-300 whitespace-nowrap flex items-center gap-1 focus:outline-none ${
                  isDropdownOpen ? "text-primary" : "text-text-charcoal/75 hover:text-primary"
                }`}
              >
                <span>Services</span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[480px] bg-bg-cream rounded-2xl border border-outline/35 shadow-xl p-6 grid grid-cols-2 gap-4 z-50"
                  >
                    {serviceLinks.map((service) => (
                      <a
                        key={service.name}
                        href={service.href}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface transition-colors duration-300 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface border border-outline/45 flex items-center justify-center shrink-0 group-hover:bg-bg-cream transition-colors">
                          {service.icon}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-primary group-hover:text-accent-terracotta transition-colors leading-tight">
                            {service.name}
                          </h4>
                          <p className="text-[11px] text-text-charcoal/60 leading-normal mt-0.5">
                            {service.desc}
                          </p>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Flat Links */}
            {mainLinks.slice(1).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] font-medium text-text-charcoal/75 hover:text-primary transition-colors duration-300 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-tertiary hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <button
              onClick={triggerAppointmentModal}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-tertiary px-6 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-[1.03] shadow-md shadow-primary/5 hover:shadow-tertiary/10 cursor-pointer"
            >
              <PhoneCall size={15} />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text-charcoal hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] sm:w-[320px] bg-bg-cream z-50 lg:hidden shadow-2xl flex flex-col p-6 sm:p-8 border-l border-outline/30 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <span className="font-display text-lg font-bold text-primary">
                  Sagar <span className="font-light text-secondary-sage">Constructions</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text-charcoal hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links list */}
              <div className="flex flex-col space-y-3 my-auto">
                <a
                  href="#about"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-text-charcoal/80 hover:text-primary transition-colors py-1.5 border-b border-outline/10"
                >
                  About
                </a>

                {/* Collapsible Mobile Services */}
                <div className="py-1.5 border-b border-outline/10">
                  <button
                    onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                    className="w-full flex items-center justify-between text-base font-semibold text-text-charcoal/80 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>Our Services</span>
                    <motion.span
                      animate={{ rotate: isMobileServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-3 space-y-2 mt-2"
                      >
                        {serviceLinks.map((service) => (
                          <a
                            key={service.name}
                            href={service.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-[14px] text-text-charcoal/70 hover:text-primary py-1.5"
                          >
                            {service.icon}
                            <span>{service.name}</span>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {mainLinks.slice(1).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-semibold text-text-charcoal/80 hover:text-primary transition-colors py-1.5 border-b border-outline/10"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-8 shrink-0">
                <button
                  onClick={() => { setIsOpen(false); triggerAppointmentModal(); }}
                  className="w-full justify-center inline-flex items-center gap-2 bg-primary text-white hover:bg-tertiary px-6 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 cursor-pointer"
                >
                  <PhoneCall size={16} />
                  <span>Free Consultation</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
