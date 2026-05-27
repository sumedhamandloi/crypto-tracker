"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-800 px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-green-400 font-bold text-lg">CryptoTracker</span>
        {session ? (
          <div className="flex items-center gap-4">
            <Image
              src={session.user?.image || ""}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-gray-300">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}