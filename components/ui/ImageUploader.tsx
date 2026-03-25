'use client';

import React, { useRef, useState } from 'react';
import { Plus, X, Camera, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeKB?: number;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  maxSizeKB = 500,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    setIsCompressing(true);

    try {
      const newImages: string[] = [];
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        // 이미지 압축 옵션
        const options = {
          maxSizeMB: maxSizeKB / 1024,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        // 압축
        const compressedFile = await imageCompression(file, options);
        
        // Base64로 변환
        const base64 = await fileToBase64(compressedFile);
        newImages.push(base64);
      }

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
    } finally {
      setIsCompressing(false);
      // input 초기화 (같은 파일 다시 선택 가능하도록)
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleAddClick = () => {
    inputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">
          사진 첨부
        </span>
        <span className="text-xs text-text-muted">
          {images.length}/{maxImages}장
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 기존 이미지들 */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
          >
            <img
              src={image}
              alt={`사진 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {canAddMore && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isCompressing}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-text-muted hover:text-primary transition-colors disabled:opacity-50"
          >
            {isCompressing ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="text-xs">추가</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-text-muted">
        모바일: 카메라/앨범 선택 가능 | 최대 {maxSizeKB}KB로 자동 압축
      </p>
    </div>
  );
};

// 파일을 Base64로 변환
function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
