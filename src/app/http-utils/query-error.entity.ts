export interface ErrorResponse {
  message: string[];
  error: string;
  statusCode: number;
}

export function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return true &&
    (obj as ErrorResponse).message !== undefined &&
    (obj as ErrorResponse).error !== undefined &&
    (obj as ErrorResponse).statusCode !== undefined;
}
