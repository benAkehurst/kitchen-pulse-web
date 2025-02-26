'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/customers', label: 'Customers' },
  { href: '/orders', label: 'Orders' },
  { href: '/messages', label: 'Messages' },
  { href: '/account', label: 'Account' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  //TODO: change the visaul logic based on if the user is logged in or not. If not logged in then I need to hide the compoennt from the dom

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white h-screen p-6 fixed left-0 top-0">
        <h2 className="text-2xl font-bold mb-8">Kitchen Pulse</h2>
        <nav>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block p-2 rounded ${
                    pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <Menu size={32} className="text-gray-800" />
        </button>
      </div>

      {/* Mobile Slide-Out Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        >
          <nav
            className="fixed left-0 top-0 w-64 bg-gray-800 text-white h-full p-6 shadow-lg z-50 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Kitchen Pulse</h2>
              <button onClick={closeMenu} aria-label="Close menu">
                <X size={32} />
              </button>
            </div>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block p-2 rounded ${
                      pathname === link.href
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
