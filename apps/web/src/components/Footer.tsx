import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="brand">
            <Image src="/logo.png" alt="" width={28} height={28} />
          </div>
          <p className="faint t-label">Buy, rent, lease and bid on inspected vehicles.</p>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/vehicles">Marketplace</Link>
            <Link href="/auctions">Auctions</Link>
            <Link href="/account">Account</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </nav>
        </div>
        <div className="footer-base faint t-label">
          <span>© 2026 RideWithMe. All rights reserved.</span>
          <span>
            Built with <span aria-label="love" role="img">❤️</span> by{' '}
            <a href="https://beepeelabs.cv" target="_blank" rel="noopener noreferrer" className="footer-credit">
              BeepeeLabs
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
