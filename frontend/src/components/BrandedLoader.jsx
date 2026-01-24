/**
 * BrandedLoader - Universal Star Loader Animation
 * Features: Custom star SVG with animated gradient trail effect
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inline SVG Star Loader Component
const StarLoaderSVG = ({ size = 40 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none"
    width={size}
    height={size}
    className="star-loader-svg"
  >
    <defs>
      {/* Gradient: White (hot front) -> Violet */}
      <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#d8b4fe" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>

    <style>{`
      @keyframes travel {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }

      .star-path {
        stroke-width: 4;
        stroke-linejoin: round;
        stroke-linecap: round;
        fill: none;
      }

      .loader-path {
        stroke: url(#shineGradient);
        stroke-dasharray: 18 82; 
        animation: travel 1.2s linear infinite;
      }
    `}</style>

    {/* The Balanced Star Shape */}
    <path 
      className="star-path loader-path" 
      pathLength="100"
      d="M50 16.5 L60.8 40.5 L86.5 42.5 L67 60 L72.5 85 L50 71.5 L27.5 85 L33 60 L13.5 42.5 L39.2 40.5 Z" 
    />
  </svg>
);

const BrandedLoader = ({ 
  size = 'default', 
  fullScreen = false,
  isLoading = true
}) => {
  // Size mapping for the star loader
  const sizeValues = {
    small: 24,
    default: 40,
    large: 56,
    xlarge: 72
  };
  
  const loaderSize = typeof size === 'number' ? size : (sizeValues[size] || sizeValues.default);

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Main Star Loader */}
        <StarLoaderSVG size={loaderSize} />
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 blur-xl opacity-30 -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );

  // Full screen overlay version
  if (fullScreen) {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md" />
            
            {/* Loader content */}
            <div className="relative z-10">
              <LoaderContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Inline version
  if (!isLoading) return null;
  
  return <LoaderContent />;
};

// Export the raw SVG component for inline use
export { StarLoaderSVG };
export default BrandedLoader;
