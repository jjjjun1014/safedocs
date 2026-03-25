import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SafeDocs - 건설현장 안전서류 자동화',
  description: '감독관이 나왔을 때 30초 안에 3년치 서류 꺼내세요. TBM 일지, 위험성평가서, 안전교육일지를 3번 클릭으로 완성.',
  keywords: ['건설현장', '안전서류', 'TBM', '위험성평가', '안전교육', '자동화'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
