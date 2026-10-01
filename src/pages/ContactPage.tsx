import { CheckCircle2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import type { ContactCategory } from "@/config/site";
import {
  actionClass,
  FIELD_CLASS,
  FIELD_LABEL,
  META_LABEL,
  PANEL_ACCENT,
  PANEL_SURFACE,
} from "@/lib/styles";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
  const [status, setStatus] = useState<SubmissionStatus>({ state: "idle" });
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? "";

  useEffect(() => {
    setCategory(initialCategory);
    setStatus({ state: "idle" });
  }, [initialCategory]);

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
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("access_key", accessKey);
    formData.set("subject", `KOTC League: ${CATEGORY_LABELS[category]}`);
    formData.set("from_name", "KOTC League website");
    formData.set("Request type", CATEGORY_LABELS[category]);

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
      setStatus({
        state: "success",
        message:
          category === "feedback"
            ? "Thanks for the feedback. It has been sent."
            : "Thanks for reaching out. Your message has been sent.",
      });
    } catch (error) {
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
        <section
          className={`max-w-3xl p-4 sm:p-6 ${PANEL_SURFACE} ${PANEL_ACCENT}`}
          aria-labelledby="contact-form-heading"
        >
          <SectionHeading eyebrow="Get in touch" id="contact-form-heading">
            Send a message
          </SectionHeading>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                <span className={FIELD_LABEL}>
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
                <span className={FIELD_LABEL}>
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
                <span className={FIELD_LABEL}>
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
              <span className={FIELD_LABEL}>
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
