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

export async function fetchHtml(url, context) {
  let lastError;
  let attemptsMade = 0;
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    attemptsMade = attempt;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new HttpError(response);
      const html = await response.text();
      if (!html.trim()) throw new Error("Received an empty response");
      return html;
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !isRetryableFetchError(error)) break;
      const delay = 1_000 * 2 ** (attempt - 1);
      console.warn(
        `  Fetch attempt ${attempt}/${attempts} for ${context} failed (${error.message}); retrying in ${delay}ms...`
      );
      await new Promise((resolveWait) => setTimeout(resolveWait, delay));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `Failed to fetch ${context} after ${attemptsMade} attempt${
      attemptsMade === 1 ? "" : "s"
    }: ${lastError?.message ?? "unknown error"}`,
    { cause: lastError }
  );
}
