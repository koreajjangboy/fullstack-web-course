import type { Member } from "../types/member";
import MemberCard from "./MemberCard";

type MemberListProps = {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  busy: boolean;
};

export default function MemberList({
  members,
  onEdit,
  onDelete,
  busy,
}: MemberListProps) {
  return (
    <section aria-labelledby="member-list-title" style={{ marginTop: 32 }}>
      <h2 id="member-list-title" style={{ color: "#f8fafc", fontSize: "1.25rem", marginBottom: 16 }}>
        회원 목록 ({members.length}명)
      </h2>
      {members.length === 0 ? (
        <p style={{ color: "#94a3b8", padding: "20px", textAlign: "center", backgroundColor: "#1e293b", borderRadius: 12 }}>
          등록된 회원이 없습니다.
        </p>
      ) : (
        <ul style={{ display: "grid", gap: 12, padding: 0, margin: 0 }}>
          {members.map((member) => (
            <MemberCard
              key={member.member_id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
              busy={busy}
            />
          ))}
        </ul>
      )}
    </section>
  );
}