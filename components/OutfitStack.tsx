/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon } from './icons';
import { motion, AnimatePresence, Variants } from 'framer-motion';


interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onClearOutfit: () => void;
}

const cardContainerVariants: Variants = {
  stacked: (length: number) => ({
    height: length > 1 ? (length - 1) * 12 + 68 : 68,
    transition: { type: 'spring', stiffness: 400, damping: 30 }
  }),
  hover: (length: number) => ({
    height: length > 0 ? (length - 1) * 65 + 68 : 68,
    transition: { type: 'spring', stiffness: 400, damping: 30 }
  })
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  stacked: (i: number) => ({
    opacity: 1,
    y: i * 12,
    scale: 1 - (i * 0.04),
    zIndex: -i,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  }),
  hover: (i: number) => ({
    y: i * 65,
    scale: 1,
    zIndex: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  }),
  exit: {
    opacity: 0,
    zIndex: 0,
    y: -30,
    transition: { duration: 0.2 }
  }
};


const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment, onClearOutfit }) => {
  const hasGarments = outfitHistory.length > 1;
  // Reverse the history for visual stacking (item 1 on top)
  const reversedHistory = [...outfitHistory].slice(0).reverse();

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between border-b border-gray-400/50 pb-2 mb-3">
        <h2 className="text-xl font-serif tracking-wider text-gray-800">Outfit Stack</h2>
        {hasGarments && (
          <button
            onClick={onClearOutfit}
            className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Clear all garments"
          >
            Clear All
          </button>
        )}
      </div>

      <motion.div
        className="relative pt-4"
        initial="stacked"
        whileHover="hover"
        animate="stacked"
        custom={outfitHistory.length}
        variants={cardContainerVariants}
      >
        <AnimatePresence>
          {reversedHistory.map((layer, index) => {
            // Original index is needed for the layer number
            const originalIndex = outfitHistory.length - 1 - index;
            const isBaseLayer = originalIndex === 0;

            return (
              <motion.div
                key={layer.garment?.id || `base-${originalIndex}`}
                layout
                custom={index}
                variants={cardVariants}
                initial="initial"
                animate="stacked"
                exit="exit"
                className="absolute top-0 left-0 right-0 flex items-center justify-between bg-white/70 backdrop-blur-md p-2 rounded-lg border border-gray-200/80 shadow-md"
                style={{ originX: 0.5, top: 16 }} // Add top padding offset
              >
                <div className="flex items-center overflow-hidden flex-1">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-gray-600 bg-gray-200 rounded-full">
                      {originalIndex + 1}
                    </span>
                    {layer.garment ? (
                        <img src={layer.garment.url} alt={layer.garment.name} className="flex-shrink-0 w-12 h-12 object-cover rounded-md mr-3" />
                    ) : (
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md mr-3 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                        </div>
                    )}
                    <span className="font-semibold text-gray-800 truncate" title={layer.garment?.name}>
                      {layer.garment ? layer.garment.name : 'Base Model'}
                    </span>
                </div>
                {!isBaseLayer && originalIndex === outfitHistory.length - 1 && (
                   <motion.button
                    onClick={onRemoveLastGarment}
                    className="flex-shrink-0 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                    aria-label={`Remove ${layer.garment?.name}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

        {outfitHistory.length === 1 && (
            <div className="text-center text-sm text-gray-500 pt-10 pb-4">Your stacked items will appear here. Select an item from the wardrobe below.</div>
        )}
    </div>
  );
};

export default OutfitStack;
