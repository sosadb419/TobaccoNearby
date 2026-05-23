"use client";

import { useEffect, useRef, useState } from "react";
import { trackAgeGateAccepted, trackAgeGateDeclined } from "@/lib/analytics";

const ageGateStorageKey = "tobacconearby_age_verified";

export default function AgeGate() {
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const hasVerifiedAge = window.localStorage.getItem(ageGateStorageKey) === "true";
      setIsVisible(!hasVerifiedAge);
    } catch {
      setIsVisible(true);
    } finally {
      setIsCheckingStorage(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  const confirmAge = () => {
    trackAgeGateAccepted();

    try {
      window.localStorage.setItem(ageGateStorageKey, "true");
    } catch {
      // Continue even if localStorage is blocked for this visitor.
    }

    setIsVisible(false);
  };

  const leaveWebsite = () => {
    trackAgeGateDeclined();
    window.location.assign("https://www.google.com");
  };

  if (isCheckingStorage || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-ink/70 px-4 py-8 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-description"
        tabIndex={-1}
        className="w-full max-w-md rounded-lg border border-line bg-white p-6 text-center shadow-soft outline-none sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Age notice</p>
        <h2 id="age-gate-title" className="mt-3 text-2xl font-bold leading-tight text-ink">
          This website is intended for adults aged 18+.
        </h2>
        <p id="age-gate-description" className="mt-4 text-base leading-7 text-muted">
          Are you 18 years or older?
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={confirmAge}
            className="focus-ring rounded-lg bg-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink"
          >
            Yes, I am 18+
          </button>
          <button
            type="button"
            onClick={leaveWebsite}
            className="focus-ring rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-paper"
          >
            No, leave website
          </button>
        </div>
      </div>
    </div>
  );
}
