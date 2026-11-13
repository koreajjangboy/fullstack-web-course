import { Suspense } from "react";
import MemberDetail from "../../../components/MemberDetail";

type PageProps = {
  params: Promise<{ memberId: string }>;
};

// 1. params를 비동기로 받아 처리하는 내부 컴포넌트
async function MemberDetailWrapper({ params }: { params: Promise<{ memberId: string }> }) {
  const resolvedParams = await params;
  return <MemberDetail memberIdText={resolvedParams.memberId} />;
}

// 2. 페이지 메인 컴포넌트에서 <Suspense>로 감싸기
export default function MemberDetailPage({ params }: PageProps) {
  return (
    <main
      style={{
        maxWidth: 880,
        margin: "48px auto",
        padding: "0 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Suspense
        fallback={
          <p style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
            회원 상세 페이지를 로딩 중입니다...
          </p>
        }
      >
        <MemberDetailWrapper params={params} />
      </Suspense>
    </main>
  );
}