import type { User, UserFormData } from "../types/user";

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

export async function createUser(data: UserFormData): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    console.error("MockAPI error:", {
      status: response.status,
      message,
    });

    throw new Error(`Failed to create user: ${response.status}`);
  }

  return response.json();
}

export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}
