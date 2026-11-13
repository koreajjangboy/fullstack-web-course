"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import MemberList from "./MemberList";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from "../lib/members-api";
import type { Member } from "../types/member";

export default function MemberWorkspace() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"남" | "녀">("남"); // 💡 성별 상태 추가
  const [editingId, setEditingId] = useState<number | null>(null);

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getMembers(controller.signal);
        if (!controller.signal.aborted) setMembers(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : "조회 오류가 발생했습니다.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [reloadKey]);

  const keyword = search.trim().toLowerCase();
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword),
  );

  const ageNumber = Number(age);
  const validAge =
    age.trim() !== "" &&
    Number.isInteger(ageNumber) &&
    ageNumber >= 0 &&
    ageNumber <= 150;
  const validForm = name.trim() !== "" && email.trim() !== "" && validAge && (gender === "남" || gender === "녀");

  function clearForm() {
    setEditingId(null);
    setName("");
    setEmail("");
    setAge("");
    setGender("남"); // 💡 초기화 시 성별도 기본값으로 복원
  }

  function startEdit(member: Member) {
    setEditingId(member.member_id);
    setName(member.name);
    setEmail(member.email);
    setAge(String(member.age));
    setGender(member.gender === "녀" ? "녀" : "남"); // 💡 수정 시 기존 회원의 성별 반영
    setActionError("");
    setNotice("");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validForm || busy || loading) return;

    setBusy(true);
    setActionError("");
    setNotice("");
    let changed = false;
    const action = editingId === null ? "등록" : "수정";

    try {
      const payload = { 
        name: name.trim(), 
        email: email.trim(), 
        age: ageNumber,
        gender: gender // 💡 API 페이로드에 성별 포함
      };
      if (editingId === null) {
        await createMember(payload);
      } else {
        await updateMember(editingId, payload);
      }
      changed = true;
      const latest = await getMembers();
      setMembers(latest);
      clearForm();
      setNotice("회원 " + action + " 후 목록을 다시 조회했습니다.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "알 수 없는 오류";
      setActionError(
        changed
          ? "서버 변경 요청은 성공했으나 목록 재조회에 실패했습니다: " + detail
          : "회원 " + action + " 요청 실패: " + detail,
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(member: Member) {
    if (busy || loading) return;
    if (!window.confirm(member.name + " 회원(ID " + member.member_id + ")을 삭제할까요?")) {
      return;
    }

    setBusy(true);
    setActionError("");
    setNotice("");
    let changed = false;

    try {
      await deleteMember(member.member_id);
      changed = true;
      const latest = await getMembers();
      setMembers(latest);
      if (editingId === member.member_id) clearForm();
      setNotice("회원 삭제 후 목록을 다시 조회했습니다.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "알 수 없는 오류";
      setActionError(
        changed
          ? "서버 삭제 요청은 성공했으나 목록 재조회에 실패했습니다: " + detail
          : "회원 삭제 요청 실패: " + detail,
      );
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #cbd5e1)",
    borderRadius: 8,
    color: "var(--foreground)",
    fontSize: "0.95rem",
    boxSizing: "border-box" as const,
    outline: "none",
  };

  const buttonStyle = {
    padding: "10px 16px",
    backgroundColor: "var(--border-color, #e2e8f0)",
    color: "var(--foreground)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  };

  return (
    <div style={{ color: "var(--foreground)", maxWidth: "800px", margin: "0 auto", paddingBottom: "60px", paddingLeft: "20px", paddingRight: "20px" }}>
      
      {/* 검색 및 제어 섹션 */}
      <section style={{ marginTop: 28, padding: 20, backgroundColor: "var(--card-bg, #ffffff)", borderRadius: 12, border: "1px solid var(--border-color, #cbd5e1)" }}>
        <label htmlFor="member-search" style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          회원 검색 (이름 또는 이메일)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="member-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="예: kim"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="button" onClick={() => setSearch("")} style={buttonStyle}>
            초기화
          </button>
          <button
            type="button"
            disabled={loading || busy}
            onClick={() => setReloadKey((value) => value + 1)}
            style={{ ...buttonStyle, opacity: loading || busy ? 0.6 : 1 }}
          >
            새로고침
          </button>
        </div>
      </section>

      {loading ? (
        <p role="status" style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
          회원 목록을 불러오는 중입니다...
        </p>
      ) : loadError ? (
        <p role="alert" style={{ color: "#ef4444", padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 8 }}>
          목록 조회 오류: {loadError}
        </p>
      ) : (
        <MemberList
          members={filteredMembers}
          onEdit={startEdit}
          onDelete={(member) => { void handleDelete(member); }}
          busy={busy}
        />
      )}

      {/* 등록 / 수정 폼 섹션 */}
      <section
        style={{
          marginTop: 36,
          padding: 24,
          backgroundColor: "var(--card-bg, #ffffff)",
          border: editingId !== null ? "2px solid #3b82f6" : "1px solid var(--border-color, #cbd5e1)",
          borderRadius: 12,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--foreground)" }}>
            {editingId === null ? "새 회원 등록" : `회원 정보 수정 (ID ${editingId})`}
          </h2>
          {editingId !== null && (
            <span style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 }}>
              수정 모드 중
            </span>
          )}
        </div>
        <p style={{ margin: "0 0 20px", opacity: 0.7, fontSize: "0.9rem" }}>
          {editingId === null ? "데이터베이스에 새로운 회원을 추가합니다." : "선택한 회원의 정보를 변경합니다."}
        </p>

        <form onSubmit={(event) => { void handleSubmit(event); }}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="member-name" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>이름</label>
            <input
              id="member-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="member-email" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>이메일</label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="member-age" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>나이</label>
            <input
              id="member-age"
              type="number"
              min={0}
              max={150}
              value={age}
              onChange={(event) => setAge(event.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* 💡 성별 선택 라디오 버튼 필드 추가 */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>성별</label>
            <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "8px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.95rem" }}>
                <input
                  type="radio"
                  name="gender"
                  value="남"
                  checked={gender === "남"}
                  onChange={() => setGender("남")}
                />
                남
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.95rem" }}>
                <input
                  type="radio"
                  name="gender"
                  value="녀"
                  checked={gender === "녀"}
                  onChange={() => setGender("녀")}
                />
                녀
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={!validForm || busy || loading}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                cursor: !validForm || busy || loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: !validForm || busy || loading ? 0.6 : 1,
              }}
            >
              {busy ? "처리 중..." : editingId === null ? "회원 등록하기" : "수정 내용 저장하기"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={clearForm}
              style={{
                padding: "12px 20px",
                backgroundColor: "var(--border-color, #cbd5e1)",
                color: "var(--foreground)",
                border: "none",
                borderRadius: 8,
                cursor: busy ? "not-allowed" : "pointer",
                fontWeight: 500,
              }}
            >
              취소 / 초기화
            </button>
          </div>
        </form>

        {notice && (
          <p role="status" style={{ marginTop: 16, padding: 12, backgroundColor: "rgba(52, 211, 153, 0.15)", color: "#10b981", borderRadius: 8, fontSize: "0.9rem" }}>
            {notice}
          </p>
        )}
        {actionError && (
          <p role="alert" style={{ marginTop: 16, padding: 12, backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", borderRadius: 8, fontSize: "0.9rem" }}>
            {actionError}
          </p>
        )}
      </section>
    </div>
  );
}