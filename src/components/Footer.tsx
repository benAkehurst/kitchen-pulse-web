import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-4 bottom-0 left-0 fixed">
      <nav className="grid grid-flow-col gap-2">
        <Link className="link link-hover" href="/about-us">
          About us
        </Link>
        <Link className="link link-hover" href="/contact-us">
          Contact
        </Link>
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved by
          Kitchen Pulse
        </p>
      </aside>
    </footer>
  );
}
