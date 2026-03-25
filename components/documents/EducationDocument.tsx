'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { StoredDocument, Participant } from '@/lib/store/documentStore';

interface EducationDocumentProps {
  document: StoredDocument;
  onSignatureClick?: (participant: Participant) => void;
  onAuthorSignatureClick?: () => void;
  interactive?: boolean;
}

export const EducationDocument: React.FC<EducationDocumentProps> = ({
  document,
  onSignatureClick,
  onAuthorSignatureClick,
  interactive = false,
}) => {
  const allRisks = [
    ...document.risks.map((r) => r.hazard),
    ...document.customRisks,
  ];

  return (
    <div className="bg-white text-black p-6 print:p-4 text-sm">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-1">안전보건교육 실시 일지</h1>
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
              교육일시
            </td>
            <td className="border border-gray-400 px-3 py-2 w-32">
              {document.workDate}
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
              교육장소
            </td>
            <td className="border border-gray-400 px-3 py-2">
              현장 내 교육장
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              대상공종
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.tradeName}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              교육인원
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.participants?.length || document.workerCount || '-'}명
            </td>
          </tr>
        </tbody>
      </table>

      {/* 교육 종류 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          교육 종류
        </div>
        <div className="border border-gray-400 border-t-0 p-3">
          <div className="flex flex-wrap gap-6">
            {['정기교육', '채용시 교육', '작업내용 변경시', '특별교육'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input type="checkbox" checked={(document.educationType || '정기교육') === type} readOnly className="w-4 h-4" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 교육 내용 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          교육 내용
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 px-3 py-2 w-12">No</th>
              <th className="border border-gray-400 px-3 py-2">교육 항목</th>
              <th className="border border-gray-400 px-3 py-2 w-20">시간</th>
              <th className="border border-gray-400 px-3 py-2">주요 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">1</td>
              <td className="border border-gray-400 px-3 py-2">위험성평가 이해</td>
              <td className="border border-gray-400 px-3 py-2 text-center">15분</td>
              <td className="border border-gray-400 px-3 py-2">위험성평가 개념 및 절차</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">2</td>
              <td className="border border-gray-400 px-3 py-2">{document.tradeName} 위험요인</td>
              <td className="border border-gray-400 px-3 py-2 text-center">30분</td>
              <td className="border border-gray-400 px-3 py-2">
                {allRisks.slice(0, 3).join(', ')}
                {allRisks.length > 3 && ` 외 ${allRisks.length - 3}건`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">3</td>
              <td className="border border-gray-400 px-3 py-2">안전보호구 착용법</td>
              <td className="border border-gray-400 px-3 py-2 text-center">10분</td>
              <td className="border border-gray-400 px-3 py-2">안전모, 안전화, 안전대 착용</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">4</td>
              <td className="border border-gray-400 px-3 py-2">비상시 행동요령</td>
              <td className="border border-gray-400 px-3 py-2 text-center">5분</td>
              <td className="border border-gray-400 px-3 py-2">대피로, 비상연락망 숙지</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 참석자 서명 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold flex justify-between items-center">
          <span>참석자 명단 및 서명</span>
          {interactive && document.participants && document.participants.length > 0 && (
            <span className="text-xs font-normal text-gray-600">
              {document.participants.filter((p) => p.signature).length}/{document.participants.length}명 완료
            </span>
          )}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs">
              <th className="border border-gray-400 px-2 py-1 w-8">No</th>
              <th className="border border-gray-400 px-2 py-1 w-20">성명</th>
              <th className="border border-gray-400 px-2 py-1 w-16">서명</th>
              <th className="border border-gray-400 px-2 py-1 w-8">No</th>
              <th className="border border-gray-400 px-2 py-1 w-20">성명</th>
              <th className="border border-gray-400 px-2 py-1 w-16">서명</th>
              <th className="border border-gray-400 px-2 py-1 w-8">No</th>
              <th className="border border-gray-400 px-2 py-1 w-20">성명</th>
              <th className="border border-gray-400 px-2 py-1 w-16">서명</th>
              <th className="border border-gray-400 px-2 py-1 w-8">No</th>
              <th className="border border-gray-400 px-2 py-1 w-20">성명</th>
              <th className="border border-gray-400 px-2 py-1 w-16">서명</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((row) => (
              <tr key={row}>
                {[0, 1, 2, 3].map((col) => {
                  const num = row * 4 + col + 1;
                  const participant = document.participants?.[num - 1];
                  const hasSigned = !!participant?.signature;
                  const canSign = interactive && participant && onSignatureClick;
                  return (
                    <React.Fragment key={col}>
                      <td className="border border-gray-400 px-1 py-1 text-center text-xs">
                        {num}
                      </td>
                      <td className="border border-gray-400 px-1 py-1 h-8 text-xs text-center">
                        {participant?.name || ''}
                      </td>
                      <td
                        className={cn(
                          'border border-gray-400 px-1 py-1',
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
                              className="h-5 w-full object-contain"
                            />
                            {participant!.signedAt && (
                              <span className="text-[7px] text-gray-500">
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
                          <span className="text-[10px] text-blue-600 font-medium flex items-center justify-center">
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

      {/* 교육실시자 및 확인자 */}
      <div className="flex justify-end gap-8 mb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">교육실시자:</span>
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
        <div className="flex items-center gap-4">
          <span className="font-semibold">확인자:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {/* 확인자 */}
          </span>
          <span className="text-xs text-gray-400">(인)</span>
        </div>
      </div>

      {/* 안내문 */}
      <div className="text-xs text-gray-600 text-center mt-6 pt-4 border-t border-gray-300">
        ※ 이 서류는 산업안전보건법에 따라 <strong>3년간 보관</strong>하여야 합니다.
      </div>
    </div>
  );
};
