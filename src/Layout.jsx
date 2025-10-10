import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PromoBar from './PromoBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <PromoBar />
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
