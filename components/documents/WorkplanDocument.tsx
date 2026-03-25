'use client';

import React from 'react';
import type { StoredDocument } from '@/lib/store/documentStore';

interface WorkplanDocumentProps {
  document: StoredDocument;
}

export const WorkplanDocument: React.FC<WorkplanDocumentProps> = ({ document }) => {
  const allRisks = [
    ...document.risks.map((r) => ({
      hazard: r.hazard,
      measure: r.measure,
    })),
    ...document.customRisks.map((r) => ({
      hazard: r,
      measure: '안전수칙 준수',
    })),
  ];

  return (
    <div className="bg-white text-black p-6 print:p-4 text-sm">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-1">작업계획서</h1>
        <p className="text-xs text-gray-600">산업안전보건기준에 관한 규칙 제38조</p>
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
              하도급사
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.subcontractor || '-'}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              작업일시
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.workDate}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              작업종류
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.tradeName}
            </td>
            <td className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold">
              작업책임자
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {document.author}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 작업 종류 체크 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          작업 유형
        </div>
        <div className="border border-gray-400 border-t-0 p-3">
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>굴착작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>고소작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>중장비작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>비계작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>밀폐공간작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>화기작업</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly className="w-3 h-3" />
              <span>기타</span>
            </label>
          </div>
        </div>
      </div>

      {/* 작업 개요 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ① 작업 개요
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium w-24">
                작업장소
              </td>
              <td className="border border-gray-400 px-3 py-2">
                {document.location || '현장 내'}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium">
                작업내용
              </td>
              <td className="border border-gray-400 px-3 py-2">
                {document.tradeName} 작업
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium">
                투입인원
              </td>
              <td className="border border-gray-400 px-3 py-2">
                {document.participants?.length || document.workerCount || '-'}명
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium">
                사용장비
              </td>
              <td className="border border-gray-400 px-3 py-2">
                {document.equipment || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 작업 순서 및 방법 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ② 작업 순서 및 방법
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 px-3 py-2 w-16">순서</th>
              <th className="border border-gray-400 px-3 py-2 w-32">작업단계</th>
              <th className="border border-gray-400 px-3 py-2">세부작업방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">1</td>
              <td className="border border-gray-400 px-3 py-2">작업 전 점검</td>
              <td className="border border-gray-400 px-3 py-2">TBM 실시, 장비 점검, 안전장구 확인</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">2</td>
              <td className="border border-gray-400 px-3 py-2">본 작업</td>
              <td className="border border-gray-400 px-3 py-2">{document.tradeName} 시행</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 text-center">3</td>
              <td className="border border-gray-400 px-3 py-2">작업 후 정리</td>
              <td className="border border-gray-400 px-3 py-2">현장 정리, 장비 정돈, 안전점검</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 안전조치사항 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ③ 안전조치사항
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 px-3 py-2 w-12">No</th>
              <th className="border border-gray-400 px-3 py-2">위험요인</th>
              <th className="border border-gray-400 px-3 py-2">안전조치 내용</th>
            </tr>
          </thead>
          <tbody>
            {allRisks.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-gray-400 px-3 py-4 text-center text-gray-500">
                  등록된 위험요인이 없습니다
                </td>
              </tr>
            ) : (
              allRisks.map((risk, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-400 px-3 py-2">{risk.hazard}</td>
                  <td className="border border-gray-400 px-3 py-2">{risk.measure}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 개인보호구 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ④ 개인보호구
        </div>
        <div className="border border-gray-400 border-t-0 p-3">
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly className="w-3 h-3" />
              <span>안전모</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly className="w-3 h-3" />
              <span>안전화</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly className="w-3 h-3" />
              <span>안전대</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>안전장갑</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>보안경</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" readOnly className="w-3 h-3" />
              <span>방진마스크</span>
            </label>
          </div>
        </div>
      </div>

      {/* 비상연락망 */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
          ⑤ 비상연락망
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium w-24 text-center">
                소장
              </td>
              <td className="border border-gray-400 px-3 py-2 w-36">
                {/* 소장 연락처 */}
              </td>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium w-24 text-center">
                119
              </td>
              <td className="border border-gray-400 px-3 py-2 w-36">
                119
              </td>
              <td className="border border-gray-400 bg-gray-50 px-3 py-2 font-medium w-24 text-center">
                인근병원
              </td>
              <td className="border border-gray-400 px-3 py-2">
                {/* 병원 연락처 */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 작업자 명단 (있는 경우) */}
      {document.participants && document.participants.length > 0 && (
        <div className="mb-4">
          <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold">
            ⑥ 작업자 명단 ({document.participants.length}명)
          </div>
          <div className="border border-gray-400 border-t-0 p-3">
            <div className="flex flex-wrap gap-2">
              {document.participants.map((p, index) => (
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
          <span className="font-semibold">작성자:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {document.author}
          </span>
          <span>(인)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">승인자:</span>
          <span className="border-b border-gray-400 min-w-[100px] text-center">
            {/* 승인자 서명 */}
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
