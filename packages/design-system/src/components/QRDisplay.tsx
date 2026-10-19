'use client';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

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

function generateQRMatrix(text: string, modules = 25): boolean[][] {
  const matrix: boolean[][] = [];
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) & 0x7fffffff;

  for (let r = 0; r < modules; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < modules; c++) {
      const inFinder = (r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7);
      if (inFinder) {
        const dr = r < 7 ? r : r - (modules - 7);
        const dc = c < 7 ? c : c - (modules - 7);
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        const inGap = (r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8);
        row.push(inGap && !onBorder && !inCore ? false : (onBorder || inCore));
      } else {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        row.push((seed & 1) === 1);
      }
    }
    matrix.push(row);
  }
  return matrix;
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
  const matrix = generateQRMatrix(frameData);
  const modules = matrix.length;
  const cellSize = size / modules;

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="bg-white p-4 rounded-2xl shadow-card border border-surface-100">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
            <rect width={size} height={size} fill="#ffffff" />
            {matrix.map((row, r) =>
              row.map((on, c) =>
                on ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="#0f172a"
                  />
                ) : null
              )
            )}
          </svg>
        </div>
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
    </div>
  );
}
