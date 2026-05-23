"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { trackReportInfoClicked } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";

type ReportIncorrectInfoProps = {
  shopName?: string;
  shopSlug?: string;
  neighborhood?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ReportIncorrectInfo({ shopName = "", shopSlug = "unknown", neighborhood = "" }: ReportIncorrectInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shopNameValue, setShopNameValue] = useState(shopName);
  const [incorrectInfo, setIncorrectInfo] = useState("");
  const [correctInfo, setCorrectInfo] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formId = shopSlug !== "unknown" ? `report-${shopSlug}` : "report-incorrect-info";
  const isSubmitting = submitState === "submitting";
  const hasReadOnlyShopName = Boolean(shopName);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedShopName = shopNameValue.trim();
    const trimmedIncorrectInfo = incorrectInfo.trim();
    const trimmedCorrectInfo = correctInfo.trim();
    const trimmedEmail = email.trim();

    if (!trimmedShopName || !trimmedIncorrectInfo || !trimmedCorrectInfo) {
      setSubmitState("error");
      setErrorMessage("Please complete the required fields before submitting.");
      return;
    }

    if (!supabase) {
      setSubmitState("error");
      setErrorMessage("The report form is temporarily unavailable. Please try again later.");
      return;
    }

    setSubmitState("submitting");

    const { error } = await supabase.from("shop_reports").insert({
      shop_name: trimmedShopName,
      shop_slug: shopSlug !== "unknown" ? shopSlug : null,
      incorrect_information: trimmedIncorrectInfo,
      correct_information: trimmedCorrectInfo,
      reporter_email: trimmedEmail || null,
      status: "pending"
    });

    if (error) {
      console.error("Supabase shop_reports insert failed.", error);
      setSubmitState("error");
      setErrorMessage("We could not submit your suggestion right now. Please try again later.");
      return;
    }

    setSubmitState("success");
    setIncorrectInfo("");
    setCorrectInfo("");
    setEmail("");
  };

  return (
    <div className="grid gap-3">
      <button
        type="button"
        aria-controls={formId}
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen) {
            trackReportInfoClicked(shopSlug, neighborhood);
          }
          setIsOpen((current) => !current);
        }}
        className="focus-ring inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
      >
        Report incorrect information
      </button>

      {isOpen ? (
        <div id={formId} className="rounded-lg border border-line bg-paper p-4">
          {submitState === "success" ? (
            <p className="text-sm font-medium leading-6 text-ink">
              Thank you. Your suggestion has been received and will be reviewed.
            </p>
          ) : (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <p className="text-sm leading-6 text-muted">
                Help us keep TobaccoNearby accurate. Use this form to suggest a correction. Submitted updates are
                reviewed before any changes are made.
              </p>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${formId}-shop-name`}>
                  Shop name
                </label>
                <input
                  className="focus-ring rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink read-only:bg-paper"
                  id={`${formId}-shop-name`}
                  name="shop_name"
                  onChange={(event) => setShopNameValue(event.target.value)}
                  readOnly={hasReadOnlyShopName}
                  required
                  type="text"
                  value={shopNameValue}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${formId}-incorrect`}>
                  What is incorrect?
                </label>
                <textarea
                  className="focus-ring min-h-24 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${formId}-incorrect`}
                  name="incorrect_information"
                  onChange={(event) => setIncorrectInfo(event.target.value)}
                  required
                  value={incorrectInfo}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${formId}-correct`}>
                  Correct information
                </label>
                <textarea
                  className="focus-ring min-h-24 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${formId}-correct`}
                  name="correct_information"
                  onChange={(event) => setCorrectInfo(event.target.value)}
                  required
                  value={correctInfo}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${formId}-email`}>
                  Your email, optional
                </label>
                <input
                  className="focus-ring rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${formId}-email`}
                  name="reporter_email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </div>

              {errorMessage ? <p className="text-sm leading-6 text-amber">{errorMessage}</p> : null}

              <button
                className="focus-ring rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit suggestion"}
              </button>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
