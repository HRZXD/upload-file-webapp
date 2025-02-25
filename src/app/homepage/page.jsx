'use client';

import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    } else if (status === 'authenticated') {
      fetchUser();
      saveUser();
    }
  }, [status, router]);

  const fetchUser = async () => {
    try {
      setError('');
      const response = await fetch(`/api/getData?email=${session?.user?.email}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        const urls = data.file.map((file) => [file.url, file.id]);
        setImageUrl(urls);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch images');
    }
  };

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      Swal.fire({
        icon: 'success',
        title: 'Copied to the clipboard',
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const saveUser = async () => {
    try {
      await fetch('/api/saveUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name,
        }),
      });
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return setError('Please select a file');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', session?.user?.email);

    try {
      Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      Swal.close();
      if (response.ok) {
        Swal.fire({
          title: 'Upload Successfully',
          icon: 'success',
          draggable: true,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Upload Failed',
        });
      }

      setError('');
      fetchUser();
    } catch (err) {
      setError('Error uploading file');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDelete = async (id, event) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => { // Fix: make the function async here
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('email', session?.user?.email);
        try {
          Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
    
          const response = await fetch('/api/deleteImg', {
            method: 'POST',
            body: formData,
          });
    
          const data = await response.json();
          Swal.close();
    
          if (response.ok) {
            Swal.fire({
              title: 'Delete Successfully',
              icon: 'success',
              draggable: true,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Delete Failed',
            });
          }
    
          setError('');
          fetchUser();
        } catch (err) {
          setError('Error deleting file');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while deleting the file.',
          });
        }
      }
    });    
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Redirecting...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-bold">Welcome, {session?.user?.name}!</p>
        <p className="text-sm text-gray-600">{session?.user?.email}</p>
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

          {imageUrl.map((item, index) => (
            <div key={index} className="border p-2 rounded-lg shadow-md">
              <img src={item[0]} alt="Uploaded file" className="rounded-lg" width={"216px"} />
              <form onSubmit={(e) => handleDelete(item[1], e)}>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded mt-2">
                  Delete
                </button>
              </form>
              <button onClick={() => handleCopy(item[0])}>Copy Link</button>
            </div>
          ))}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;