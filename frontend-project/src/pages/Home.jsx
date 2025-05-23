import React from 'react';
import MenuBar from '../components/MenuBar';

export default function Home() {
  return (
    <>
    <MenuBar />
    
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome Home</h1>
      <p className="text-gray-700">You are logged in or browsing the app.</p>
    </div>
    </>
  );
}
