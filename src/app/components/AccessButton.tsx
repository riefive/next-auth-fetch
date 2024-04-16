'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const AccessButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">{session.user.name}</p>
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <Link href={"/signin"} className="flex gap-4 ml-auto text-green-600">
      Sign In
    </Link>
  );
};

export default AccessButton;
