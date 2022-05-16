export interface User {
  email: string;
}

export function isUser(obj: unknown): obj is User {
  return (obj as User).email !== undefined;
}
