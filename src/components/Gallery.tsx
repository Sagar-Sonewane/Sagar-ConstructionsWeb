"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  category: "construction" | "renovation" | "plumbing" | "tiles";
  title: string;
  location: string;
}

export default function Gallery() {
  const categories = [
    { key: "all", name: "All Projects" },
    { key: "construction", name: "Construction" },
    { key: "renovation", name: "Renovation" },
    { key: "plumbing", name: "Plumbing" },
    { key: "tiles", name: "Tile Work" },
  ];

  const items: GalleryItem[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      category: "construction",
      title: "The Golden Villa",
      location: "Khat Road, Bhandara",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      category: "renovation",
      title: "Wood & Granite Kitchen",
      location: "Civil Lines, Bhandara",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      category: "tiles",
      title: "Minimalist Stone Bath",
      location: "Trimurti Nagar, Bhandara",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      category: "construction",
      title: "Modern Courtyard Home",
      location: "Lakhni Road, Bhandara",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      category: "plumbing",
      title: "Premium Pipeline Setup",
      location: "Tumsar, Bhandara",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      category: "renovation",
      title: "First-Floor Extension",
      location: "Khat Road, Bhandara",
    },
  ];

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === "all"
    ? items
    : items.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-bg-cream relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <span className="font-display text-[13px] font-semibold text-secondary-sage tracking-wider uppercase mb-3 block">
            Gallery
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
            Handcrafted Spaces We Built
          </h2>
          <p className="font-body text-base text-text-charcoal/80 leading-relaxed">
            Take a look at some of the warm, sunlit sanctuaries we have had the honor to construct or restore.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                activeFilter === cat.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-text-charcoal/70 hover:text-primary hover:bg-outline/20 border border-outline/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Masonry Layout */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative aspect-[4/3] rounded-[24px] overflow-hidden cursor-pointer shadow-sm hover:shadow-md border border-outline/15 bg-surface"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-500 ease-out-expo"
                />
                
                {/* Hover overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out-expo z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-container mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="font-body text-[12px] text-white/70">
                      {item.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <ZoomIn size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-10"
              onClick={() => setLightboxItem(null)}
            >
              <button
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors focus:outline-none"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image"
              >
                <X size={28} />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 30 }}
                className="relative max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.title}
                  className="w-full h-auto max-h-[80vh] object-contain mx-auto bg-surface/5"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white text-left">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-secondary-sage mb-1 block">
                    {lightboxItem.category}
                  </span>
                  <h3 className="font-display text-lg font-bold">
                    {lightboxItem.title}
                  </h3>
                  <p className="font-body text-[13px] text-white/60">
                    {lightboxItem.location}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
