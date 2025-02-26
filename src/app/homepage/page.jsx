'use client';

import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import '../globals.css'

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [error, setError] = useState('');
  const [statusFile, setStatusFile] = useState(false);

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
        title: 'ก็อปลิงค์สำเร็จ',
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = async (link, name) => {
    try {
      const response = await fetch(link);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.jpg`; // Ensure the file is downloaded
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Clean up the object URL to free memory
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
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
    if (!file) return setError('กรุณาอัพโหลดรูปภาพ');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', session?.user?.email);

    try {
      Swal.fire({
        title: 'กำลังดำเนินการส่งรูป...',
        text: 'กรุณารอสักครู่',
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
          title: 'อัพโหลดสำเร็จ',
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
      setFile(null);
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
      title: "คุณแน่ใจที่จะลบรูปภาพนี้ใช่ไหม",
      text: "จะไม่สามารถกู้คืนได้อีก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยันการลบ"
    }).then(async (result) => { // Fix: make the function async here
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('email', session?.user?.email);
        try {
          Swal.fire({
            title: 'กำลังดำเนินการลบรูป...',
            text: 'กรุณารอสักครู่',
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
              title: 'ลบสำเร็จ',
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
    <div className="flex flex-col min-h-screen">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">NoByte</a>
        </div>
        <p className="flex-none text-base font-bold hidden lg:flex">ยินดีต้อนรับ, {session?.user?.name}</p>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={session?.user?.image} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a onClick={() => signOut({ redirect: false }).then(() => router.replace('/'))}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">อัพโหลดรูปภาพ</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">คลิกเพื่ออัพโหลดรูป</span></p>
                      <p className="text-xs text-gray-500">PNG, JPG และไฟล์รูปอื่นๆ</p>
                  </div>
                  <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            {file && <p className="text-red-500 mt-2">คุณได้อัพโหลดรูปเข้ามาแล้ว กรุณากดอัพโหลด</p>}
            {(error && !file) && <p className="text-red-500 mt-2">{error}</p>}
            <button type="submit" className="px-4 py-2 btn btn-outline btn-info mt-2 mb-2">
              อัพโหลด
            </button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {imageUrl.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
                <img src={item[0]} alt="Uploaded file" className="rounded-lg mb-4" />
                <div className="flex justify-between items-center">
                  <button onClick={() => handleCopy(item[0])} className="px-4 py-2 btn btn-outline btn-success">
                    แชร์ลิงค์
                  </button>
                  <button onClick={() => handleDownload(item[0], item[1])} className="px-4 py-2 btn btn-outline btn-primary">
                    ดาวน์โหลด
                  </button>
                  <form onSubmit={(e) => handleDelete(item[1], e)}>
                    <button type="submit" className="px-4 py-2 btn btn-outline btn-error">
                      ลบภาพนี้
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;