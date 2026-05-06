'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-5 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-navy/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair)] text-xl text-white tracking-wide"
        >
          Sailing <span className="text-red-light italic">Plan B</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase transition-colors duration-200 ${
                  pathname === href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center gap-10 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`font-[family-name:var(--font-playfair)] text-4xl font-bold transition-colors duration-200 ${
              pathname === href ? 'text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
        <a
          href="https://www.instagram.com/sailing.planb"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-200 mt-4"
        >
          Instagram
        </a>
      </div>
    </>
  )
}