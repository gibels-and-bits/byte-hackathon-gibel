'use client';

import React, { useRef, useEffect } from 'react';

interface ReceiptPreviewProps {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  width?: number;
  height?: number;
  className?: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ 
  canvasRef: externalCanvasRef,
  width = 384,
  height = 800,
  className = ''
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Set white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [canvasRef, width, height]);
  
  return (
    <div className={`bg-gray-900 p-4 rounded-lg ${className}`}>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-center">
          <div className="bg-white shadow-2xl rounded border-2 border-gray-600" style={{ width: `${width}px` }}>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="block"
              style={{ 
                imageRendering: 'pixelated',
                minHeight: '400px',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 