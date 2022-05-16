export interface UserCredentials {
  email: string;
  password: string;
}

export function isUserCredentials(obj: unknown): obj is UserCredentials {
  return (obj as UserCredentials).email !== undefined && (obj as UserCredentials).password !== undefined;
}
