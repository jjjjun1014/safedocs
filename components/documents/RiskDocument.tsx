'use client';

import React, { useState } from 'react';
import type { StoredDocument } from '@/lib/store/documentStore';
import { documentStore } from '@/lib/store/documentStore';

interface RiskDocumentProps {
  document: StoredDocument;
  interactive?: boolean;
}

const getRiskLevel = (likelihood: number, severity: number) => {
  const score = likelihood * severity;
  if (score >= 12) return { level: '허용불가', color: 'text-red-600', bgColor: 'bg-red-100' };
  if (score >= 5) return { level: '개선필요', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  return { level: '허용가능', color: 'text-green-600', bgColor: 'bg-green-100' };
};

const cycleValue = (current: number): 1 | 2 | 3 | 4 => {
  return (current >= 4 ? 1 : current + 1) as 1 | 2 | 3 | 4;
};

export const RiskDocument: React.FC<RiskDocumentProps> = ({ document: initialDoc, interactive = false }) => {
  const [doc, setDoc] = useState(initialDoc);

  const allRisks = [
    ...doc.risks,
    ...doc.customRisks.map((r) => ({
      hazard: r,
      riskType: '기타',
      likelihood: 2 as const,
      severity: 2 as const,
      measure: '안전수칙 준수',
    })),
  ];

  const handleRiskLevelClick = (riskIndex: number, field: 'likelihood' | 'severity') => {
    if (!interactive) return;
    // Only update risks from the original document.risks array (not custom ones)
    if (riskIndex >= doc.risks.length) return;
    
    const updatedRisks = [...doc.risks];
    const current = updatedRisks[riskIndex][field];
    updatedRisks[riskIndex] = { ...updatedRisks[riskIndex], [field]: cycleValue(current) };
    
    const updatedDoc = { ...doc, risks: updatedRisks, updatedAt: new Date().toISOString() };
    documentStore.save(updatedDoc);
    setDoc(updatedDoc);
  };

  return (
    <div className="bg-white text-black p-6 print:p-4 text-sm">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-1">위험성평가서</h1>
        <p className="text-xs text-gray-600">산업안전보건법 제36조</p>
      </div>

      {/* 기본 정보 */}
      <table className="w-full border-collapse border border-gray-400 mb-4">
        <tbody>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold w-24">
              현장명
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {doc.siteName || '-'}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold w-24">
              평가일
            </td>
            <td className="border border-gray-400 px-3 py-2 w-32">
              {doc.workDate}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              평가대상
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {doc.tradeName}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              평가자
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {doc.evaluator || doc.author}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              하도급사
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {doc.subcontractor || '-'}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              소장
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {doc.siteManager || '-'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 위험성평가 결과 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          위험성평가 결과
          {interactive && <span className="text-xs font-normal text-gray-500 ml-2">(숫자 클릭으로 등급 변경)</span>}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs">
              <th className="border border-gray-400 px-2 py-2 w-10" rowSpan={2}>No</th>
              <th className="border border-gray-400 px-2 py-2" rowSpan={2}>작업명</th>
              <th className="border border-gray-400 px-2 py-2" rowSpan={2}>위험요인</th>
              <th className="border border-gray-400 px-2 py-2 w-16" rowSpan={2}>재해유형</th>
              <th className="border border-gray-400 px-2 py-2" colSpan={3}>현재 위험성</th>
              <th className="border border-gray-400 px-2 py-2" rowSpan={2}>안전대책</th>
              <th className="border border-gray-400 px-2 py-2" colSpan={3}>개선 후</th>
            </tr>
            <tr className="bg-gray-50 text-xs">
              <th className="border border-gray-400 px-1 py-1 w-8">가능성</th>
              <th className="border border-gray-400 px-1 py-1 w-8">중대성</th>
              <th className="border border-gray-400 px-1 py-1 w-10">크기</th>
              <th className="border border-gray-400 px-1 py-1 w-8">가능성</th>
              <th className="border border-gray-400 px-1 py-1 w-8">중대성</th>
              <th className="border border-gray-400 px-1 py-1 w-10">크기</th>
            </tr>
          </thead>
          <tbody>
            {allRisks.length === 0 ? (
              <tr>
                <td colSpan={11} className="border border-gray-400 px-3 py-4 text-center text-gray-500">
                  등록된 위험요인이 없습니다
                </td>
              </tr>
            ) : (
              allRisks.map((risk, index) => {
                const score = risk.likelihood * risk.severity;
                const riskLevel = getRiskLevel(risk.likelihood, risk.severity);
                const improvedL = Math.max(1, risk.likelihood - 1);
                const improvedS = Math.max(1, risk.severity - 1);
                const improvedScore = improvedL * improvedS;
                const improvedLevel = getRiskLevel(improvedL, improvedS);
                const canClick = interactive && index < doc.risks.length;
                
                return (
                  <tr key={index} className="text-xs">
                    <td className="border border-gray-400 px-2 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-2">{doc.tradeName}</td>
                    <td className="border border-gray-400 px-2 py-2">{risk.hazard}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center">{risk.riskType}</td>
                    <td
                      className={`border border-gray-400 px-2 py-2 text-center ${canClick ? 'cursor-pointer hover:bg-blue-50 select-none' : ''}`}
                      onClick={() => canClick && handleRiskLevelClick(index, 'likelihood')}
                    >
                      {risk.likelihood}
                    </td>
                    <td
                      className={`border border-gray-400 px-2 py-2 text-center ${canClick ? 'cursor-pointer hover:bg-blue-50 select-none' : ''}`}
                      onClick={() => canClick && handleRiskLevelClick(index, 'severity')}
                    >
                      {risk.severity}
                    </td>
                    <td className={`border border-gray-400 px-2 py-2 text-center font-bold ${riskLevel.color} ${riskLevel.bgColor}`}>
                      {score}
                    </td>
                    <td className="border border-gray-400 px-2 py-2">{risk.measure}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center">{improvedL}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center">{improvedS}</td>
                    <td className={`border border-gray-400 px-2 py-2 text-center font-bold ${improvedLevel.color} ${improvedLevel.bgColor}`}>
                      {improvedScore}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 위험성 판단 기준 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          위험성 판단 기준
        </div>
        <div className="border border-gray-400 border-t-0 p-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-1">가능성/중대성 등급</p>
              <ul className="space-y-0.5">
                <li>4 = 매우 높음</li>
                <li>3 = 높음</li>
                <li>2 = 보통</li>
                <li>1 = 낮음</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">위험크기 = 가능성 × 중대성</p>
              <ul className="space-y-0.5">
                <li className="text-red-600">12 이상: 허용불가 (즉시 조치)</li>
                <li className="text-yellow-600">5 ~ 11: 개선필요 (조치 후 작업)</li>
                <li className="text-green-600">4 이하: 허용가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 특이사항 */}
      {doc.specialNotes && (
        <div className="mb-4">
          <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
            특이사항
          </div>
          <div className="border border-gray-400 border-t-0 px-3 py-3 whitespace-pre-wrap">
            {doc.specialNotes}
          </div>
        </div>
      )}

      {/* 참석자 명단 (있는 경우) */}
      {doc.participants && doc.participants.length > 0 && (
        <div className="mb-4">
          <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
            위험성평가 참여자 ({doc.participants.length}명)
          </div>
          <div className="border border-gray-400 border-t-0 p-3">
            <div className="flex flex-wrap gap-2">
              {doc.participants.map((p, index) => (
                <span key={p.id || index} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                  {p.name}
                  {p.role && <span className="text-gray-500 ml-1">({p.role})</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 서명란 */}
      <div className="flex justify-end gap-8 mb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">평가자:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {doc.evaluator || doc.author}
          </span>
          <span>(인)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">소장:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {doc.siteManager || ''}
          </span>
          <span>(인)</span>
        </div>
      </div>

      {/* 안내문 */}
      <div className="text-xs text-gray-600 text-center mt-6 pt-4 border-t border-gray-300">
        ※ 이 서류는 산업안전보건법에 따라 <strong>3년간 보관</strong>하여야 합니다.
      </div>
    </div>
  );
};
