/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { RotateCcwIcon } from './icons.tsx';
import Spinner from './Spinner.tsx';
import { AnimatePresence, motion } from 'framer-motion';

interface CanvasProps {
  displayImageUrl: string | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
  onSelectPose: (index: number) => void;
  poseInstructions: string[];
  currentPoseIndex: number;
  availablePoseKeys: string[];
}

const Canvas: React.FC<CanvasProps> = ({ displayImageUrl, onStartOver, isLoading, loadingMessage, onSelectPose, poseInstructions, currentPoseIndex, availablePoseKeys }) => {
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative animate-zoom-in group">
      {/* Start Over Button */}
      <button 
          onClick={onStartOver}
          className="absolute top-4 left-4 z-30 flex items-center justify-center text-center bg-white/60 border border-gray-300/80 text-gray-700 font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-white hover:border-gray-400 active:scale-95 text-sm backdrop-blur-sm"
      >
          <RotateCcwIcon className="w-4 h-4 mr-2" />
          Start Over
      </button>

      {/* Image Display or Placeholder */}
      <div className="relative w-full h-full flex items-center justify-center flex-grow">
        {displayImageUrl ? (
          <img
            key={displayImageUrl} // Use key to force re-render and trigger animation on image change
            src={displayImageUrl}
            alt="Virtual try-on model"
            className="max-w-full max-h-full object-contain transition-opacity duration-500 animate-fade-in rounded-lg"
          />
        ) : (
            <div className="w-[400px] h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
              <Spinner />
              <p className="text-md font-serif text-gray-600 mt-4">Loading Model...</p>
            </div>
        )}
        
        <AnimatePresence>
          {isLoading && (
              <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
              >
                  <Spinner />
                  {loadingMessage && (
                      <p className="text-lg font-serif text-gray-700 mt-4 text-center px-4">{loadingMessage}</p>
                  )}
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Pose Controls */}
      {displayImageUrl && (
        <motion.div 
          className="w-full max-w-lg pt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {poseInstructions.map((pose, index) => {
                const isActive = index === currentPoseIndex;
                const isAvailable = availablePoseKeys.includes(pose);

                const getButtonClass = () => {
                  if (isActive) {
                    return "bg-gray-900 text-white border-gray-900";
                  }
                  if (isAvailable) {
                    return "bg-gray-200 text-gray-800 border-gray-200 hover:bg-gray-300 hover:border-gray-300";
                  }
                  return "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400";
                }

                return (
                  <button
                      key={pose}
                      onClick={() => onSelectPose(index)}
                      disabled={isLoading}
                      className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full border transition-colors duration-200 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass()}`}
                  >
                      {pose}
                  </button>
                )
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Canvas;
