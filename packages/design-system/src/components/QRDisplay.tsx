'use client';
import { clsx } from 'clsx';
import { Icon } from './Icon';

export interface QRDisplayProps {
  data: string;
  size?: number;
  frameIndex?: number;
  totalFrames?: number;
  animated?: boolean;
  fps?: number;
  className?: string;
  onFrameChange?: (index: number) => void;
}

export function QRDisplay({
  data,
  size = 256,
  frameIndex,
  totalFrames,
  animated = false,
  fps = 2,
  className,
  onFrameChange,
}: QRDisplayProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!animated || !totalFrames || totalFrames <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % totalFrames;
        onFrameChange?.(next);
        return next;
      });
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [animated, totalFrames, fps, onFrameChange]);

  const displayIndex = frameIndex ?? currentFrame;
  const frameData = totalFrames && totalFrames > 1 ? `${data}::${displayIndex}/${totalFrames}` : data;

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="bg-white p-4 rounded-xl shadow-card">
        <div id={`qr-${displayIndex}`} className="qr-code" />
      </div>
      {totalFrames && totalFrames > 1 && (
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <span>Frame {displayIndex + 1} of {totalFrames}</span>
          <div className="flex gap-1">
            {Array.from({ length: totalFrames }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  i === displayIndex ? 'bg-primary-600' : 'bg-surface-300'
                )}
              />
            ))}
          </div>
        </div>
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('qr-${displayIndex}');
              if (el && !el.hasChildNodes()) {
                var qr = new QRCode(el, {
                  text: ${JSON.stringify(frameData)},
                  width: ${size},
                  height: ${size},
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  correctLevel: QRCode.CorrectLevel.M
                });
              }
            })();
          `,
        }}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';