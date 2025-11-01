/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Header from './Header.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
