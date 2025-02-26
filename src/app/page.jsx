"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";
import './globals.css'

function Home() {
    const { status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false); // Ensure rendering only on the client
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
      <div className="flex flex-col min-h-screen">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 z-[1] mt-3 w-52 p-2 shadow">
                <li><a onClick={() => setIsModalOpen(true)}>ติดต่อเรา</a></li>
                <li><a className="btn" onClick={() => signIn("google")}>เข้าสู่ระบบ</a></li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl">NoByte</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><a onClick={() => setIsModalOpen(true)}>ติดต่อเรา</a></li>
            </ul>
          </div>
          <div className="navbar-end hidden lg:flex">
            <a className="btn mr-5" onClick={() => signIn("google")}>เข้าสู่ระบบ</a>
          </div>
        </div>
        <div className="flex flex-col justify-center flex-grow bg-white p-6 rounded-lg">
          <div className="flex flex-col lg:flex-row justify-center items-center mb-4">
            <div className="flex flex-col mb-4 lg:mb-0 lg:mr-8 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">NoByte</h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-2">รับฝากรูป-แชร์รูป ที่ปลอดภัย สะดวกและรวดเร็ว</p>
              <a className="btn" onClick={() => signIn("google")}>สมัครเลย</a>
            </div>
            <img className="w-full max-w-xs lg:max-w-2xl rounded-lg shadow-md" src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Notebook work with statistics on sofa business by Lukas Blazek in unsplash" />
          </div>
        </div>
        <footer className="bg-base-100 text-center py-4 mt-4">
          <p className="text-gray-600 mr-2">&copy; 2025 NoByte. All rights reserved.</p>
        </footer>
        {/* {status !== "authenticated" ? (
          <GoogleButton onClick={() => signIn("google")} />
        ) : (
          <p>Redirecting...</p>
        )} */}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal modal-open">
              <div className="modal-box">
                <h2 className="font-bold text-lg">ติดต่อเรา</h2>
                <p className="py-4">Email : <a href="mailto:chayakorn261@gmail.com" className="text-blue-500">chayakorn261@gmail.com</a></p>
                <p>
                  Phone : <span className="text-blue-500">+66 061-840-5251</span>
                </p>
                <p className="py-4">
                    Github : {' '}
                    <a
                        href="https://github.com/HRZXD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        @hrzdev
                    </a>
                </p>
                <p>
                    Instagram : {' '}
                    <a
                        href="https://www.instagram.com/_hr1pct/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        _hr1pct
                    </a>
                </p>
                <div className="modal-action">
                  <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Home;