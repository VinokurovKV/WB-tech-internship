import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_MOCK_API_URL;

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
