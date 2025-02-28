'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  MessageSquare,
  User,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onToggle: (isCollapsed: boolean) => void;
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/account', label: 'Account', icon: User },
];

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    onToggle(!isCollapsed);
  }, [isCollapsed, onToggle]);

  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-gray-600 text-white h-screen p-6 fixed left-0 top-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-3xl font-bold">Kitchen Pulse</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronLast /> : <ChevronFirst />}
          </button>
        </div>

        <nav>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === link.href ? 'bg-gray-800' : 'hover:bg-gray-700'
                  }`}
                >
                  <link.icon className="w-6 h-6" />
                  {!isCollapsed && (
                    <span className="ml-4 text-xl font-bold">{link.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={() => setIsOpen(true)} aria-label="Open menu">
            <Menu size={32} className="text-gray-800" />
          </button>
        </div>
      )}

      {/* Mobile Slide-Out Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        >
          <nav
            className="fixed left-0 top-0 w-64 bg-gray-800 text-white h-full p-6 shadow-lg z-50"
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
