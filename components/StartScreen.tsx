/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon, CameraIcon } from './icons.tsx';
import { Compare } from './ui/compare.tsx';
import { generateModelImage } from '../services/geminiService.ts';
import Spinner from './Spinner.tsx';
import { getFriendlyErrorMessage } from '../lib/utils.ts';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'Failed to create model'));
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-12"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
            Create Your Model for Any Look.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Ever wondered how an outfit would look on you? Stop guessing. Upload a photo and see for yourself. Our AI creates your personal model, ready to try on anything.
          </p>
          
          <div className="mt-8 w-full max-w-xs">
            <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors">
              <UploadCloudIcon className="w-5 h-5 mr-3" />
              Upload Photo
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} />
            <p className="text-gray-500 text-xs mt-2 px-2">By uploading, you agree not to create harmful, explicit, or unlawful content. This service is for creative and responsible use only.</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="w-full border-t border-gray-200 my-12"></div>
          
          <div className="w-full">
            <h2 className="text-3xl font-serif text-gray-800 mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-lg font-bold text-gray-700 mb-3 border border-gray-200">1</div>
                <h3 className="font-semibold text-lg text-gray-800">Upload Your Photo</h3>
                <p className="text-gray-600 text-sm mt-1">Choose a clear photo of yourself.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-lg font-bold text-gray-700 mb-3 border border-gray-200">2</div>
                <h3 className="font-semibold text-lg text-gray-800">AI Creates Your Model</h3>
                <p className="text-gray-600 text-sm mt-1">We generate a neutral model from it.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-lg font-bold text-gray-700 mb-3 border border-gray-200">3</div>
                <h3 className="font-semibold text-lg text-gray-800">Style Your Look</h3>
                <p className="text-gray-600 text-sm mt-1">Try on any item from the wardrobe.</p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-200 my-12"></div>

          <div className="w-full">
            <h2 className="flex items-center justify-center text-3xl font-serif text-gray-800 mb-8">
              <CameraIcon className="w-7 h-7 mr-3 text-gray-600"/>
              Photo Tips for Best Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <img src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400" alt="A clear, full-body shot of a person" className="rounded-lg mb-2 w-full max-w-[200px] aspect-[2/3] object-cover border border-gray-200 bg-gray-100"/>
                <p className="text-sm font-medium text-gray-700">Clear, full-body shot</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" alt="A well-lit portrait of a person" className="rounded-lg mb-2 w-full max-w-[200px] aspect-[2/3] object-cover border border-gray-200 bg-gray-100"/>
                <p className="text-sm font-medium text-gray-700">Well-lit portrait</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400" alt="A person against a simple background" className="rounded-lg mb-2 w-full max-w-[200px] aspect-[2/3] object-cover border border-gray-200 bg-gray-100"/>
                <p className="text-sm font-medium text-gray-700">Simple background</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                The New You
              </h1>
              <p className="mt-2 text-md text-gray-600">
                Drag the slider to see your transformation.
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-3 text-lg text-gray-700 font-serif mt-6">
                <Spinner />
                <span>Generating your model...</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left text-red-600 max-w-md mt-6">
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm mb-4">{error}</p>
                <button onClick={reset} className="text-sm font-semibold text-gray-700 hover:underline">Try Again</button>
              </div>
            }
            
            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                  <button 
                    onClick={reset}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    Use Different Photo
                  </button>
                  <button 
                    onClick={() => onModelFinalized(generatedModelUrl)}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors"
                  >
                    Proceed to Styling &rarr;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div 
              className={`relative rounded-[1.25rem] transition-all duration-700 ease-in-out ${isGenerating ? 'border border-gray-300 animate-pulse' : 'border border-transparent'}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[400px] lg:h-[600px] rounded-2xl bg-gray-200"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
