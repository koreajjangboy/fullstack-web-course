"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMember } from "../lib/members-api";
import type { Member } from "../types/member";

type MemberDetailProps = {
  memberIdText: string;
};

export default function MemberDetail({ memberIdText }: MemberDetailProps) {
  const memberId = Number(memberIdText);
  const validId =
    typeof memberIdText === "string" &&
    /^\d+$/.test(memberIdText) &&
    Number.isSafeInteger(memberId) &&
    memberId > 0;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!validId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      setMember(null);
      try {
        const data = await getMember(memberId, controller.signal);
        if (!controller.signal.aborted) setMember(data);
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(
            caught instanceof Error ? caught.message : "회원 상세 조회 오류",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [memberId, validId]);

  return (
    <section style={{ paddingBottom: "60px" }}>
      <header style={{ marginBottom: 24 }}>
        <p style={{ color: "#2563eb", fontWeight: 700, marginBottom: 8 }}>
          Phase 03 · 06강 회원 상세 조회
        </p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: 12 }}>
          회원 상세 정보
        </h1>
        <p style={{ margin: 0 }}>
          <Link href="/members" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 500 }}>
            ← 회원 목록으로 돌아가기
          </Link>
        </p>
      </header>

      {!validId ? (
        <p role="alert" style={{ color: "#ef4444", padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 8 }}>
          올바른 회원 ID를 입력해 주세요.
        </p>
      ) : loading ? (
        <p role="status" style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
          회원 정보를 불러오는 중입니다...
        </p>
      ) : error ? (
        <p role="alert" style={{ color: "#ef4444", padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 8 }}>
          조회 오류: {error}
        </p>
      ) : member ? (
        <div
          style={{
            backgroundColor: "var(--card-bg, #ffffff)",
            border: "1px solid var(--border-color, #cbd5e1)",
            borderRadius: 12,
            padding: 28,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--foreground)" }}>
              {member.name}
            </h2>
            <span style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 }}>
              ID: {member.member_id}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: 0.9, fontSize: "1rem" }}>
            <p><strong>이메일:</strong> {member.email}</p>
            <p><strong>나이:</strong> {member.age}세</p>
            <p><strong>성별:</strong> {member.gender}</p>
          </div>
        </div>
      ) : (
        <p role="alert" style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
          회원 정보를 찾을 수 없습니다.
        </p>
      )}
    </section>
  );
}