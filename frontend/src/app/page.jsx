'use client';
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

function Home() {
    const { status } = useSession();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false); // Ensures this is client-side

    useEffect(() => {
        setIsClient(true);  // Ensure this runs only on the client
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace('/homepage');  // Redirect to /home after login
        }
    }, [status, router]);

    if (!isClient) return null;  // Avoid rendering on the server

    if (status === "loading") return <p>Loading...</p>;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {status !== "authenticated" ? (
          <GoogleButton onClick={() => signIn('google')} />
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    );
}

export default Home;
