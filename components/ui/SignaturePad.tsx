'use client';

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import SignaturePadLib from 'signature_pad';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
  onBegin?: () => void;
  onEnd?: () => void;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, quality?: number) => string;
  fromDataURL: (dataUrl: string) => Promise<void>;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  (
    {
      width = 320,
      height = 160,
      penColor = 'black',
      backgroundColor = 'white',
      className,
      onBegin,
      onEnd,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePadLib | null>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      
      // Setup high DPI support BEFORE creating signature pad
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
        // Fill background with white
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Create signature pad instance AFTER canvas is properly sized
      signaturePadRef.current = new SignaturePadLib(canvas, {
        penColor,
        backgroundColor,
        minWidth: 0.5,
        maxWidth: 2.5,
      });

      // Add event listeners
      if (onBegin) {
        signaturePadRef.current.addEventListener('beginStroke', onBegin);
      }
      if (onEnd) {
        signaturePadRef.current.addEventListener('endStroke', onEnd);
      }

      return () => {
        signaturePadRef.current?.off();
      };
    }, [width, height, penColor, backgroundColor, onBegin, onEnd]);

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          signaturePadRef.current?.clear();
        },
        isEmpty: () => {
          return signaturePadRef.current?.isEmpty() ?? true;
        },
        toDataURL: (type = 'image/png', quality = 1) => {
          return signaturePadRef.current?.toDataURL(type, quality) ?? '';
        },
        fromDataURL: async (dataUrl: string) => {
          await signaturePadRef.current?.fromDataURL(dataUrl);
        },
      }),
      []
    );

    return (
      <canvas
        ref={canvasRef}
        className={cn(
          'border border-border rounded-lg touch-none',
          className
        )}
        style={{ width, height }}
      />
    );
  }
);

SignaturePad.displayName = 'SignaturePad';
