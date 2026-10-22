import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_MOCK_API_URL;

export async function getUsers(page: number, limit: number): Promise<User[]> {
  const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUsersCount(): Promise<number> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users count");
  }

  const users: User[] = await response.json();
  return users.length;
}
