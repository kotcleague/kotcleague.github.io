export class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.status = response.status;
  }
}

export function isRetryableFetchError(error) {
  return (
    error instanceof TypeError ||
    error?.name === "AbortError" ||
    (error instanceof HttpError &&
      (error.status === 408 || error.status === 429 || error.status >= 500))
  );
}
