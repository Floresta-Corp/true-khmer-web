/**
 * Fake in-memory user database for demo purposes.
 * Replace this with a real database (Prisma, Drizzle, etc.) in production.
 */

interface User {
  id: string;
  email: string;
  password: string; // In production, store hashed passwords!
}

// In-memory "database"
const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123", // demo only — hash in production!
  },
];

let nextId = 2;

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  return users.find((u) => u.email === email);
}

export async function createUser(
  email: string,
  password: string,
): Promise<User> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const user: User = {
    id: String(nextId++),
    email,
    password, // In production, hash with bcrypt!
  };

  users.push(user);
  return user;
}

export async function verifyLogin(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  // In production, compare hashed passwords
  if (user.password !== password) return null;

  return user;
}
