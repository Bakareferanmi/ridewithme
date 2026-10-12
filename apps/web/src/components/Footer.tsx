import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link href="/" className="brand" aria-label="RideWithMe home">
          <Image src="/logo.png" alt="" width={28} height={28} />
        </Link>
        <p className="faint t-label">Buy, rent, lease and bid on inspected vehicles.</p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/vehicles">Marketplace</Link>
          <Link href="/auctions">Auctions</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
    </footer>
  );
}
