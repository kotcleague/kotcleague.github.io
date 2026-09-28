import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import type { ContactCategory } from "@/config/site";
import { actionClass, FOCUS_RING, META_LABEL } from "@/lib/styles";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const HCAPTCHA_ONLOAD_CALLBACK = "kotcHCaptchaOnLoad";
const HCAPTCHA_SCRIPT_URL = `https://js.hcaptcha.com/1/api.js?onload=${HCAPTCHA_ONLOAD_CALLBACK}&render=explicit`;
const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

const FIELD_CLASS = `w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-blue dark:border-slate-700 dark:bg-ink dark:text-white dark:placeholder:text-slate-500 ${FOCUS_RING}`;

const CATEGORY_OPTIONS = [
  {
    value: "join",
    label: "Join",
  },
  {
    value: "question",
    label: "Question",
  },
  {
    value: "feedback",
    label: "Feedback",
  },
] as const;

const CATEGORY_LABELS: Record<ContactCategory, string> = {
  join: "League invitation request",
  question: "League question",
  feedback: "Site or league feedback",
};

interface HCaptchaApi {
  remove(widgetId: string): void;
  render(
    container: HTMLElement,
    options: {
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      reCaptchaCompat: boolean;
      sitekey: string;
      theme: "dark" | "light";
    }
  ): string;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
    kotcHCaptchaOnLoad?: () => void;
  }
}

let hCaptchaScriptPromise: Promise<HCaptchaApi> | null = null;

function loadHCaptcha() {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha);
  if (hCaptchaScriptPromise) return hCaptchaScriptPromise;

  hCaptchaScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${HCAPTCHA_SCRIPT_URL}"]`
    );
    const script = existingScript ?? document.createElement("script");

    window.kotcHCaptchaOnLoad = () => {
      if (window.hcaptcha) {
        resolve(window.hcaptcha);
      } else {
        reject(new Error("hCaptcha loaded without exposing its client API."));
      }
    };
    const handleError = () => {
      hCaptchaScriptPromise = null;
      reject(
        new Error("The hCaptcha verification script could not be loaded.")
      );
    };

    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = HCAPTCHA_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return hCaptchaScriptPromise;
}

function responseMessage(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }
  return null;
}

function RequiredMark() {
  return (
    <span className="text-red-600 dark:text-red-400" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

interface ContactPageProps {
  initialCategory: ContactCategory;
}

type SubmissionStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export default function ContactPage({ initialCategory }: ContactPageProps) {
  const [category, setCategory] = useState<ContactCategory>(initialCategory);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>({ state: "idle" });
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetRef = useRef<string | null>(null);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "";

  useEffect(() => {
    setCategory(initialCategory);
    setStatus({ state: "idle" });
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | null = null;

    void loadHCaptcha()
      .then((hcaptcha) => {
        if (cancelled || !captchaContainerRef.current) return;

        widgetId = hcaptcha.render(captchaContainerRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          reCaptchaCompat: false,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
          callback: (token) => {
            if (cancelled) return;
            setCaptchaToken(token);
            setCaptchaError("");
          },
          "expired-callback": () => {
            if (cancelled) return;
            setCaptchaToken("");
            setCaptchaError("Verification expired. Please try it again.");
          },
          "error-callback": () => {
            if (cancelled) return;
            setCaptchaToken("");
            setCaptchaError(
              "Verification could not be completed. Please try again."
            );
          },
        });
        captchaWidgetRef.current = widgetId;
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setCaptchaError(
          error instanceof Error
            ? error.message
            : "The verification control could not be loaded."
        );
      });

    return () => {
      cancelled = true;
      if (widgetId && window.hcaptcha) {
        window.hcaptcha.remove(widgetId);
      }
      captchaWidgetRef.current = null;
    };
  }, []);

  function resetCaptcha() {
    setCaptchaToken("");
    if (captchaWidgetRef.current && window.hcaptcha) {
      window.hcaptcha.reset(captchaWidgetRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessKey) {
      setStatus({
        state: "error",
        message:
          "This form is not configured yet. Please try again after the site owner adds the Web3Forms access key.",
      });
      return;
    }
    if (!captchaToken) {
      setCaptchaError("Please complete the verification before sending.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("access_key", accessKey);
    formData.set("subject", `KOTC League: ${CATEGORY_LABELS[category]}`);
    formData.set("from_name", "KOTC League website");
    formData.set("Request type", CATEGORY_LABELS[category]);
    formData.set("h-captcha-response", captchaToken);

    for (const optionalField of ["name", "email", "DUPR information"]) {
      if (formData.get(optionalField) === "") {
        formData.delete(optionalField);
      }
    }

    setStatus({ state: "submitting" });

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          responseMessage(payload) ??
            `The form service returned status ${response.status}.`
        );
      }
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("success" in payload) ||
        payload.success !== true
      ) {
        throw new Error(
          responseMessage(payload) ??
            "The form service did not confirm the submission."
        );
      }

      form.reset();
      resetCaptcha();
      setStatus({
        state: "success",
        message:
          category === "feedback"
            ? "Thanks for the feedback. It has been sent."
            : "Thanks for reaching out. Your message has been sent.",
      });
    } catch (error) {
      resetCaptcha();
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again.",
      });
    }
  }

  const requiresContact = category !== "feedback";
  const requiresMessage = category !== "join";

  return (
    <main>
      <PageHeader
        eyebrow="KOTC League"
        description="Request to join the league, ask a question, or share feedback."
      >
        Contact
      </PageHeader>

      <PageContent>
        <section className="max-w-3xl" aria-labelledby="contact-form-heading">
          <h2 className="sr-only" id="contact-form-heading">
            Send a message
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset>
              <legend
                className={`${META_LABEL} mb-3 text-slate-500 dark:text-slate-400`}
              >
                What can we help with?
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map(({ value, label }) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="contact-category"
                      value={value}
                      checked={category === value}
                      onChange={() => {
                        setCategory(value);
                        setStatus({ state: "idle" });
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={`${actionClass({
                        size: "sm",
                        variant: category === value ? "primary" : "secondary",
                      })} w-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue`}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span
                  className={`${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`}
                >
                  Name {requiresContact ? <RequiredMark /> : "(optional)"}
                </span>
                <input
                  className={FIELD_CLASS}
                  name="name"
                  autoComplete="name"
                  required={requiresContact}
                />
              </label>
              <label className="block">
                <span
                  className={`${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`}
                >
                  Reply email{" "}
                  {requiresContact ? <RequiredMark /> : "(optional)"}
                </span>
                <input
                  className={FIELD_CLASS}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required={requiresContact}
                />
              </label>
            </div>

            {category === "join" && (
              <label className="block">
                <span
                  className={`${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`}
                >
                  DUPR rating or profile URL (optional)
                </span>
                <input
                  className={FIELD_CLASS}
                  name="DUPR information"
                  placeholder="Rating or profile link"
                />
              </label>
            )}

            <label className="block">
              <span
                className={`${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`}
              >
                {category === "join"
                  ? "Message (optional)"
                  : category === "question"
                  ? "Question"
                  : "Feedback"}
                {requiresMessage && <RequiredMark />}
              </span>
              <textarea
                className={`${FIELD_CLASS} min-h-36 resize-y`}
                name="message"
                required={requiresMessage}
              />
            </label>

            <div>
              <div ref={captchaContainerRef} />
              {captchaError && (
                <p className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
                  {captchaError}
                </p>
              )}
            </div>

            {!accessKey && (
              <p
                className="border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                role="alert"
              >
                The contact form still needs its Web3Forms access key before it
                can send messages.
              </p>
            )}

            {status.state === "success" && (
              <p
                className="flex items-center gap-2 border border-emerald-300 bg-emerald-50 p-3 text-sm font-medium text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                role="status"
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                {status.message}
              </p>
            )}
            {status.state === "error" && (
              <p
                className="border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              className={actionClass()}
              disabled={!accessKey || status.state === "submitting"}
            >
              {status.state === "submitting" ? "Sending..." : "Send message"}
            </button>
          </form>
        </section>
      </PageContent>

      <Footer />
    </main>
  );
}
