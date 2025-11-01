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
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </motion.div>
      ) : (
        <motion.div
          key="comparison"
          className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Your Personal Model is Ready</h2>
            <p className="mt-2 text-lg text-gray-600 max-w-xl">Slide to compare your original photo with your AI-generated fashion model. Happy with the result? Let's start trying on some clothes!</p>
          </div>
          
          <div className="mt-8 relative">
            {isGenerating && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl">
                    <Spinner />
                    <p className="mt-4 font-serif text-lg text-gray-700">Creating your model...</p>
                </div>
            )}
            <Compare 
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? undefined}
                className="w-[300px] h-[450px] md:w-[400px] md:h-[600px] rounded-2xl shadow-2xl bg-gray-100"
                slideMode='hover'
                autoplay={true}
            />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
             <button
                onClick={() => generatedModelUrl && onModelFinalized(generatedModelUrl)}
                disabled={!generatedModelUrl || isGenerating}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Start Styling
            </button>
            <button onClick={reset} className="w-full sm:w-auto text-base font-semibold text-gray-700">
                Or upload another photo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
