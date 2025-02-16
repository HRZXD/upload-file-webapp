"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

function Home() {
    const { status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false); // Ensure rendering only on the client

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace('/homepage');
        }
    }, [status, router]);

    if (!mounted) return null;  // Avoid hydration mismatch

    if (status === "loading") return <p>Loading...</p>;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {status !== "authenticated" ? (
          <GoogleButton onClick={() => signIn("google")} />
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    );
}

export default Home;
