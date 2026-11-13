import Link from "next/link";
import MemberWorkspace from "../../components/MemberWorkspace";

export default function MembersPage() {
  return (
    <main
      style={{
        maxWidth: 880,
        margin: "48px auto",
        padding: "0 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ color: "#2563eb", fontWeight: 700 }}>
        Phase 03 · 06강 회원 목록과 상세 이동
      </p>
      <h1 style={{ fontSize: 36, color: "var(--foreground)" }}>
        회원관리 시스템
      </h1>
      <p style={{ color: "var(--foreground)", opacity: 0.8, marginBottom: 16 }}>
        회원 카드의 상세 보기를 눌러 회원 상세 페이지로 이동합니다.
      </p>
      <p style={{ marginBottom: 24 }}>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
          기존 메인 화면으로
        </Link>
      </p>
      <MemberWorkspace />
    </main>
  );
}