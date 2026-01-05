export type User = {
  id: number;
  email: string;
  role: string;
  created_at: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
