import Link from "next/link";
import { Icons } from "@/components/icons";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center ml-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center gap-2 md:gap-3 mr-4 h-8">
                  <img
                    src="/logos/logo-dark.svg"
                    alt="Logo"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icons.github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icons.linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="ml-4 text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Brandcraft. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className=" h-16 w-16 relative">
                <Image
                  src="/logos/bolt-dark.png"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
