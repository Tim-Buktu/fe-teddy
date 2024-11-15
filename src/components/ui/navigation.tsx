// src/components/navigation.tsx

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="flex space-x-4">
        <li>
          <Link href="/sign-up">Sign Up</Link>
        </li>
        <li>
          <Link href="/pet-store">Pet Store</Link>
        </li>
      </ul>
    </nav>
  );
}
