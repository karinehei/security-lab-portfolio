export type Role = "USER" | "ADMIN";

export type AuthenticatedUser = {
  id: number;
  email: string;
  role: Role;
};
