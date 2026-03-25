'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { SignaturePad, SignaturePadRef } from './SignaturePad';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantRole?: string;
  onComplete: (signatureData: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  participantName,
  participantRole,
  onComplete,
}) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasDrawn(false);
    }
  }, [isOpen]);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setHasDrawn(false);
  };

  const handleComplete = () => {
    if (hasDrawn && !signaturePadRef.current?.isEmpty()) {
      const signatureData = signaturePadRef.current!.toDataURL();
      onComplete(signatureData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="서명" size="md">
      <div className="space-y-4">
        {/* 참석자 정보 */}
        <div className="text-center pb-3 border-b border-border">
          <p className="text-lg font-semibold text-text-primary">
            {participantName}
          </p>
          {participantRole && (
            <p className="text-sm text-text-secondary">{participantRole}</p>
          )}
        </div>

        {/* 서명 패드 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-text-muted">
            아래 영역에 서명해 주세요
          </p>
          <SignaturePad
            ref={signaturePadRef}
            width={300}
            height={150}
            penColor="black"
            backgroundColor="white"
            onEnd={() => setHasDrawn(true)}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClear} fullWidth>
            <RotateCcw className="w-4 h-4 mr-2" />
            지우기
          </Button>
          <Button
            onClick={handleComplete}
            fullWidth
            disabled={!hasDrawn}
          >
            <Check className="w-4 h-4 mr-2" />
            완료
          </Button>
        </div>
      </div>
    </Modal>
  );
};
