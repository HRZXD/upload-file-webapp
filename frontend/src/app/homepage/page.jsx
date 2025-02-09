'use client';
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);  // New state to track if fetch has already been called

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }

    // Save user email to MongoDB when authenticated and only once
    if (status === 'authenticated' && !hasFetchedUser) {
      const saveUser = async () => {
        const response = await fetch('/api/saveUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user?.email,
            name: session.user?.name,
          }),
        });
        const data = await response.json();
        console.log(data.message); // Logs either "User saved successfully" or "User already exists"
        setHasFetchedUser(true);  // Mark that the fetch has been called
      };
      
      saveUser();
    }
  }, [status, router, session, hasFetchedUser]);  // Adding `hasFetchedUser` as a dependency

  if (!isClient) return null;
  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'authenticated' ? (
        <div className="text-center">
          <p className="text-lg font-bold">Welcome, {session.user?.name}!</p>
          <p className="text-sm text-gray-600">{session.user?.email}</p>
          <button
            onClick={() => signOut({ redirect: false }).then(() => router.replace('/'))}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}

export default HomePage;
