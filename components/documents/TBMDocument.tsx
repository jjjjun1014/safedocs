'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { StoredDocument, Participant } from '@/lib/store/documentStore';

interface TBMDocumentProps {
  document: StoredDocument;
  onSignatureClick?: (participant: Participant) => void;
  onAuthorSignatureClick?: () => void;
  onSpecialNotesClick?: () => void;
  interactive?: boolean;
}

export const TBMDocument: React.FC<TBMDocumentProps> = ({
  document,
  onSignatureClick,
  onAuthorSignatureClick,
  onSpecialNotesClick,
  interactive = false,
}) => {
  const allRisks = [
    ...document.risks.map((r) => ({
      hazard: r.hazard,
      riskType: r.riskType,
      measure: r.measure,
    })),
    ...document.customRisks.map((r) => ({
      hazard: r,
      riskType: '기타',
      measure: '안전수칙 준수',
    })),
  ];

  return (
    <div className="bg-white text-black p-6 print:p-4 text-sm">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-1">작업 전 안전점검회의(TBM) 일지</h1>
        <p className="text-xs text-gray-600">산업안전보건법 제29조</p>
      </div>

      {/* 기본 정보 */}
      <table className="w-full border-collapse border border-gray-400 mb-4">
        <tbody>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold w-24">
              현장명
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.siteName || '-'}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold w-24">
              작성일
            </td>
            <td className="border border-gray-400 px-3 py-2 w-32">
              {document.workDate}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              공종
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.tradeName}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              날씨
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.weather || '-'}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              하도급사
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.subcontractor || '-'}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              참석인원
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.participants?.length || document.workerCount || '-'}명
            </td>
          </tr>
        </tbody>
      </table>

      {/* 오늘의 작업 내용 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ① 오늘의 작업 내용
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 px-3 py-2 w-12">No</th>
              <th className="border border-gray-400 px-3 py-2">작업공종</th>
              <th className="border border-gray-400 px-3 py-2">작업장소</th>
              <th className="border border-gray-400 px-3 py-2 w-24">투입인원</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">1</td>
              <td className="border border-gray-400 px-3 py-2">{document.tradeName}</td>
              <td className="border border-gray-400 px-3 py-2">현장 내</td>
              <td className="border border-gray-400 px-3 py-2 text-center">
                {document.participants?.length || document.workerCount || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 오늘의 위험요인 및 안전대책 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ② 오늘의 위험요인 및 안전대책
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 px-3 py-2 w-12">No</th>
              <th className="border border-gray-400 px-3 py-2">위험요인</th>
              <th className="border border-gray-400 px-3 py-2 w-24">재해유형</th>
              <th className="border border-gray-400 px-3 py-2">안전대책</th>
            </tr>
          </thead>
          <tbody>
            {allRisks.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-gray-400 px-3 py-2 text-center text-gray-500">
                  등록된 위험요인이 없습니다
                </td>
              </tr>
            ) : (
              allRisks.map((risk, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-400 px-3 py-2">{risk.hazard}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{risk.riskType}</td>
                  <td className="border border-gray-400 px-3 py-2">{risk.measure}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 특별 전달사항 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ③ 특별 전달사항
        </div>
        <div
          className={cn(
            'border border-gray-400 border-t-0 px-3 py-4 min-h-[60px] whitespace-pre-wrap',
            interactive && 'cursor-pointer hover:bg-blue-50 transition-colors'
          )}
          onClick={() => interactive && onSpecialNotesClick?.()}
        >
          {document.specialNotes || (interactive ? (
            <span className="text-gray-400 text-sm">클릭하여 전달사항 입력</span>
          ) : '')}
        </div>
      </div>

      {/* 참석자 서명 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold flex justify-between items-center">
          <span>④ 참석자 서명</span>
          {interactive && document.participants && document.participants.length > 0 && (
            <span className="text-xs font-normal text-gray-600">
              {document.participants.filter((p) => p.signature).length}/{document.participants.length}명 완료
            </span>
          )}
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {[0, 1, 2, 3, 4].map((row) => (
              <tr key={row}>
                {[0, 1, 2].map((col) => {
                  const num = row * 3 + col + 1;
                  const participant = document.participants?.[num - 1];
                  const hasSigned = !!participant?.signature;
                  const canSign = interactive && participant && onSignatureClick;
                  return (
                    <React.Fragment key={col}>
                      <td className="border border-gray-400 px-2 py-1 w-8 text-center text-xs bg-gray-50">
                        {num}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 w-20 text-center text-xs">
                        {participant?.name || ''}
                        {participant?.role && (
                          <span className="text-[10px] text-gray-500 block">({participant.role})</span>
                        )}
                      </td>
                      <td
                        className={cn(
                          'border border-gray-400 px-2 py-1 w-16 h-10',
                          canSign && 'cursor-pointer hover:bg-blue-50 transition-colors',
                          hasSigned && 'bg-green-50'
                        )}
                        onClick={() => canSign && onSignatureClick(participant)}
                      >
                        {hasSigned ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={participant!.signature}
                              alt="서명"
                              className="h-6 w-full object-contain"
                            />
                            {participant!.signedAt && (
                              <span className="text-[8px] text-gray-500">
                                {new Date(participant!.signedAt).toLocaleDateString('ko-KR', {
                                  month: 'numeric',
                                  day: 'numeric',
                                })}{' '}
                                {new Date(participant!.signedAt).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </span>
                            )}
                          </div>
                        ) : canSign ? (
                          <span className="text-xs text-blue-600 font-medium flex items-center justify-center">
                            서명
                          </span>
                        ) : null}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 작성자 */}
      <div className="flex justify-end gap-8 mb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">작성자:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {document.author}
          </span>
          <div
            className={cn(
              'w-16 h-12 border border-gray-400 flex items-center justify-center',
              interactive && 'cursor-pointer hover:bg-blue-50 transition-colors',
              document.authorSignature && 'bg-green-50'
            )}
            onClick={() => interactive && onAuthorSignatureClick?.()}
          >
            {document.authorSignature ? (
              <div className="flex flex-col items-center">
                <img
                  src={document.authorSignature}
                  alt="작성자 서명"
                  className="h-6 w-full object-contain"
                />
                {document.authorSignedAt && (
                  <span className="text-[8px] text-gray-500">
                    {new Date(document.authorSignedAt).toLocaleDateString('ko-KR', {
                      month: 'numeric',
                      day: 'numeric',
                    })}{' '}
                    {new Date(document.authorSignedAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                )}
              </div>
            ) : interactive ? (
              <span className="text-xs text-blue-600 font-medium">서명</span>
            ) : (
              <span className="text-xs text-gray-400">(인)</span>
            )}
          </div>
        </div>
      </div>

      {/* 안내문 */}
      <div className="text-xs text-gray-600 text-center mt-6 pt-4 border-t border-gray-300">
        {document.lastModifiedAt && (
          <p className="mb-1">최종 수정: {new Date(document.lastModifiedAt).toLocaleString('ko-KR')}</p>
        )}
        ※ 이 서류는 산업안전보건법에 따라 <strong>3년간 보관</strong>하여야 합니다.
      </div>
    </div>
  );
};
