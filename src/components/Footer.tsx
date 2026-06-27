import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "About Sagar", href: "#about" },
    { name: "Our Services", href: "#services" },
    { name: "Why Families Choose Us", href: "#why-choose-us" },
    { name: "Our Process", href: "#how-we-work" },
  ];

  const services = [
    { name: "Residential Construction", href: "#services" },
    { name: "Home Repairs & Care", href: "#services" },
    { name: "Renovation & Extensions", href: "#services" },
    { name: "Plumbing & Fitting", href: "#services" },
    { name: "Property Assistance", href: "#property-assistance" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-outline/30 text-text-charcoal/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <span className="font-display text-xl font-bold text-primary block mb-4">
              Sagar <span className="font-light text-secondary-sage">Constructions</span>
            </span>
            <p className="text-[14px] leading-relaxed text-text-charcoal/70 mb-6">
              Making your dreams come to life with care, honesty, and family values since 2005. Based proudly in Bhandara.
            </p>
            <div className="text-[13px] text-text-charcoal/50">
              Founder: Mr. Natthuji Sonewane
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-[15px] font-semibold text-primary tracking-wider uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[14px] text-text-charcoal/70 hover:text-primary hover:underline transition-all flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display text-[15px] font-semibold text-primary tracking-wider uppercase mb-5">
              Our Craft
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-[14px] text-text-charcoal/70 hover:text-primary hover:underline transition-all"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-[15px] font-semibold text-primary tracking-wider uppercase mb-5">
              Reach Out
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[14px] text-text-charcoal/70">
                <MapPin size={18} className="text-secondary-sage shrink-0 mt-0.5" />
                <span>Bhandara, Maharashtra, 441904</span>
              </li>
              <li className="flex items-center gap-3 text-[14px] text-text-charcoal/70">
                <Phone size={18} className="text-secondary-sage shrink-0" />
                <a href="tel:+918805192038" className="hover:text-primary hover:underline">
                  +91 88051 92038
                </a>
              </li>
              <li className="flex items-center gap-3 text-[14px] text-text-charcoal/70">
                <Mail size={18} className="text-secondary-sage shrink-0" />
                <a href="mailto:info@sagarconstructions.com" className="hover:text-primary hover:underline">
                  info@sagarconstructions.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-text-charcoal/50">
          <p>© {currentYear} Sagar Constructions. All rights reserved.</p>
          <p>
            Designed with care in Bhandara.
          </p>
        </div>
      </div>
    </footer>
  );
}
