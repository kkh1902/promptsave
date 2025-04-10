import Link from "next/link"

interface FooterLink {
  href: string
  label: string
}

interface FooterProps {
  links?: FooterLink[]
}

export function Footer({ links = [] }: FooterProps) {
  const defaultLinks: FooterLink[] = [
    { href: "#", label: "Terms" },
    { href: "#", label: "Privacy" },
    { href: "#", label: "Safety" },
    { href: "#", label: "API" },
  ]

  const footerLinks = links.length > 0 ? links : defaultLinks

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-muted-foreground">© Civitai {new Date().getFullYear()}. All rights reserved.</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
} 