/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { useAppContext } from '../lib/context.tsx';
import { ShirtIcon } from './icons.tsx';

const ApiKeyModal: React.FC = () => {
  const [key, setKey] = useState('');
  const { setApiKey } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setApiKey(key.trim());
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in border">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <ShirtIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
            Enter Your Gemini API Key
        </h1>
        <p className="mt-2 text-gray-600">
            To use this virtual try-on application, you need a Google Gemini API key. Please get your key from Google AI Studio and paste it below.
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full px-4 py-3 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-colors"
            aria-label="Gemini API Key"
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full mt-4 px-6 py-3 text-base font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save and Start
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Your key is saved in your browser's session storage.
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-gray-800 ml-1">
             Get a key here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
