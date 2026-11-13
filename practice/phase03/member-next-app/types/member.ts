export interface Member {
  member_id: number;
  name: string;
  email: string;
  age: number;
  gender: string; // 💡 성별 필드 추가 ('남' 또는 '녀')
}