'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500 ${
        scrolled
          ? 'bg-navy/90 backdrop-blur-md shadow-lg'
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

      {/* Links */}
      <ul className="flex gap-8">
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
    </nav>
  )
}