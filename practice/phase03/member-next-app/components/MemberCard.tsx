import Link from "next/link";
import type { Member } from "../types/member";

type MemberCardProps = {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  busy: boolean;
};

export default function MemberCard({
  member,
  onEdit,
  onDelete,
  busy,
}: MemberCardProps) {
  return (
    <li
      style={{
        listStyle: "none",
        padding: "20px 24px",
        backgroundColor: "var(--card-bg, #ffffff)",
        border: "1px solid var(--border-color, #cbd5e1)",
        borderRadius: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 6px", color: "var(--foreground)", fontSize: "1.1rem" }}>
          {member.name}
        </h3>
        <p style={{ margin: "0 0 4px", opacity: 0.8, fontSize: "0.95rem" }}>
          {member.email}
        </p>
        <p style={{ margin: 0, opacity: 0.6, fontSize: "0.85rem" }}>
          나이 {member.age}세 · 성별 {member.gender} · ID {member.member_id}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link
          href={"/members/" + member.member_id}
          style={{
            padding: "8px 12px",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: 6,
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          상세 보기
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => onEdit(member)}
          style={{
            padding: "8px 14px",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 500,
            fontSize: "0.9rem",
            opacity: busy ? 0.6 : 1,
          }}
        >
          수정
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(member)}
          style={{
            padding: "8px 14px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 500,
            fontSize: "0.9rem",
            opacity: busy ? 0.6 : 1,
          }}
        >
          삭제
        </button>
      </div>
    </li>
  );
}