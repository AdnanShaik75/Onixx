import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FOOTER_SHOP, FOOTER_SUPPORT, FOOTER_COMPANY } from "@/lib/data";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-section border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link href="/" aria-label="ONIXX Home" className="inline-block mb-6">
              <img
                src="/Onixx/logo.svg"
                alt="ONIXX"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-8 max-w-[280px]">
              Premium watches and accessories curated for timeless style, quality,
              and everyday confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs tracking-[1px] uppercase text-muted hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[2px] uppercase text-foreground font-medium mb-6">
              SHOP
            </h4>
            <ul className="space-y-3">
              {FOOTER_SHOP.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[2px] uppercase text-foreground font-medium mb-6">
              SUPPORT
            </h4>
            <ul className="space-y-3">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[2px] uppercase text-foreground font-medium mb-6">
              COMPANY
            </h4>
            <ul className="space-y-3">
              {FOOTER_COMPANY.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 lg:my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} ONIXX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted hover:text-gold transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted hover:text-gold transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-muted hover:text-gold transition-colors duration-300"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
