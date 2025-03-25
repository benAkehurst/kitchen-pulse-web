import Link from 'next/link';

export default function RegisterCTA() {
  return (
    // TODO: ADD THE CORRECT LINK
    <Link href="/" className="text-lg mt-2 mb-4">
      Don&apos;t have an account?{' '}
      <span className="text-blue-800 font-bold">Contact us here</span>
    </Link>
  );
}
