/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons.tsx';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/80">
      <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <ShirtIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-serif tracking-wider text-gray-800">
            Sanal Mağaza
          </h1>
      </div>
    </header>
  );
};

export default Header;
