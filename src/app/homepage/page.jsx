'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUser = async () => {
    try {
      setError('');
      const response = await fetch(`/api/getData?email=${session.user?.email}` , {
        method: 'GET',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching user');
      }
      setImageUrl(data.file);
      
    } catch (err) {
      console.log(err);
    }
  };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!file) {
        setError('Please select a file');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', session.user?.email);
  
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          setUploadedImage(data.data.secure_url); // Cloudinary file URL
          setError('');
          fetchUser();
        } else {
          setError(data.message || 'Upload failed');
        }
      } catch (err) {
        setError('Error uploading file');
      }
    };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }

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
        console.log(data.message);
        setHasFetchedUser(true);
      };
      fetchUser();
      saveUser();
    }
  }, [status, router, session, hasFetchedUser, handleSubmit]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
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
          <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Upload Image</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} className="mb-2" />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Upload
              </button>
            </form>
            {imageUrl.map((url, index) => {
            return (
              <div key={index} className="mt-4">
                <img src={url} alt="Uploaded" className="w-2 rounded-lg mt-2" height={"126px"} />
              </div>
            )})}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {/* {uploadedImage && (
              <div className="mt-4">
                <p className="text-green-500">Uploaded Successfully!</p>
                <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg mt-2" />
              </div>
            )} */}
          </div>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}

export default HomePage;