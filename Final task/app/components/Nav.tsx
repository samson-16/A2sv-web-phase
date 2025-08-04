"use client";

import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react"

// function AuthButton(){
//     const { data: session } = useSession()

//     if (session) {
//         return (
//            <>
//            {session.user?.name}
//            <button onClick={() => signOut()} className="btn">
//                Sign out
//            </button>
//            </>
//         )
//     }
//      return (
//     <>

//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   )

// }

// export default function Nav() {
//     return (
//         <nav>
//             <AuthButton />
//         </nav>
//     )
// }

import React from "react";
import { useSession, signOut } from "next-auth/react";

const Nav = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#4640DE] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-end p-4 gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href="/bookmarks"
              className="px-4 py-2 rounded-md text-white font-semibold underline-offset-4 decoration-transparent hover:decoration-white focus-visible:decoration-white transition-all bg-white/10 hover:bg-white/20"
            >
              Bookmarks
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-2 px-4 py-2 rounded-md bg-red-500 text-white font-semibold underline-offset-4 decoration-transparent hover:decoration-white focus-visible:decoration-white hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-white font-semibold underline-offset-4 decoration-transparent hover:decoration-white focus-visible:decoration-white transition-all bg-white/10 hover:bg-white/20"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="ml-2 px-4 py-2 rounded-md bg-[#4640DE] text-white font-semibold underline-offset-4 decoration-transparent hover:decoration-white focus-visible:decoration-white hover:bg-[#332ebc] transition-all"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
