"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const submissionOptions = [
  {
    label: "Add a new shop",
    value: "Add a new shop",
    description: "Suggest a shop that is not listed yet."
  },
  {
    label: "Update an existing shop",
    value: "Update an existing shop",
    description: "Send corrected hours, contact details, address, or accessibility notes."
  },
  {
    label: "Request removal",
    value: "Request removal",
    description: "Flag outdated information or a listing that should be reviewed."
  }
] as const;

type SubmissionType = (typeof submissionOptions)[number]["value"] | "";
type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ShopSubmissionForm() {
  const [submissionType, setSubmissionType] = useState<SubmissionType>("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Amsterdam");
  const [neighborhood, setNeighborhood] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [requestedChange, setRequestedChange] = useState("");
  const [sourceOrReason, setSourceOrReason] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isRemoval = submissionType === "Request removal";
  const isSubmitting = submitState === "submitting";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedSubmissionType = submissionType;
    const trimmedShopName = shopName.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim() || "Amsterdam";
    const trimmedNeighborhood = neighborhood.trim();
    const trimmedOpeningHours = openingHours.trim();
    const trimmedPhone = phone.trim();
    const trimmedWebsite = website.trim();
    const trimmedGoogleMapsLink = googleMapsLink.trim();
    const trimmedRequestedChange = requestedChange.trim();
    const trimmedSourceOrReason = sourceOrReason.trim();
    const trimmedEmail = email.trim();

    if (!trimmedSubmissionType) {
      setSubmitState("error");
      setErrorMessage("Please choose a submission type.");
      return;
    }

    if (!trimmedShopName || (!isRemoval && !trimmedAddress) || !trimmedRequestedChange) {
      setSubmitState("error");
      setErrorMessage("Please complete the required fields before submitting.");
      return;
    }

    if (!supabase) {
      setSubmitState("error");
      setErrorMessage("The submission form is temporarily unavailable. Please try again later.");
      return;
    }

    setSubmitState("submitting");

    const { error } = await supabase.from("shop_submissions").insert({
      submission_type: trimmedSubmissionType,
      shop_name: trimmedShopName,
      address: trimmedAddress || null,
      city: trimmedCity,
      neighborhood: trimmedNeighborhood || null,
      opening_hours: trimmedOpeningHours || null,
      phone: trimmedPhone || null,
      website: trimmedWebsite || null,
      google_maps_url: trimmedGoogleMapsLink || null,
      requested_change: trimmedRequestedChange,
      source_or_reason: trimmedSourceOrReason || null,
      submitter_email: trimmedEmail || null,
      status: "pending"
    });

    if (error) {
      console.error("Supabase shop_submissions insert failed.", error);
      setSubmitState("error");
      setErrorMessage("We could not submit your information right now. Please try again later.");
      return;
    }

    setSubmitState("success");
    setSubmissionType("");
    setShopName("");
    setAddress("");
    setCity("Amsterdam");
    setNeighborhood("");
    setOpeningHours("");
    setPhone("");
    setWebsite("");
    setGoogleMapsLink("");
    setRequestedChange("");
    setSourceOrReason("");
    setEmail("");
  };

  if (submitState === "success") {
    return (
      <div className="mt-8 rounded-lg border border-line bg-paper p-5 text-sm font-medium leading-6 text-ink">
        Thank you. Your submission has been received and will be reviewed.
      </div>
    );
  }

  return (
    <form className="mt-8 grid gap-6" onSubmit={handleSubmit} aria-label="Shop submission form">
      <div>
        <p className="text-sm font-bold text-ink">Submission type</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3" role="group" aria-label="Submission type">
          {submissionOptions.map((option) => {
            const isSelected = submissionType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSubmissionType(option.value)}
                className={`focus-ring rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-white text-ink hover:border-teal hover:text-teal"
                }`}
              >
                <span className="block text-sm font-bold">{option.label}</span>
                <span className={`mt-2 block text-xs leading-5 ${isSelected ? "text-white/85" : "text-muted"}`}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
        <input name="submission_type" required type="hidden" value={submissionType} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Shop name" id="shop-name" onChange={setShopName} required value={shopName} />
        <TextField
          label={isRemoval ? "Address, optional for removal" : "Address"}
          id="address"
          onChange={setAddress}
          required={!isRemoval}
          value={address}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="City" id="city" onChange={setCity} required value={city} />
        <TextField label="Neighborhood, optional" id="neighborhood" onChange={setNeighborhood} value={neighborhood} />
      </div>

      <TextAreaField
        label="Opening hours, optional"
        id="opening-hours"
        onChange={setOpeningHours}
        placeholder="Example: Monday-Friday 09:00-18:00; Saturday 10:00-17:00"
        value={openingHours}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Phone number, optional" id="phone" onChange={setPhone} type="tel" value={phone} />
        <TextField label="Website, optional" id="website" onChange={setWebsite} type="url" value={website} />
      </div>

      <TextField
        label="Google Maps link, optional"
        id="google-maps-link"
        onChange={setGoogleMapsLink}
        type="url"
        value={googleMapsLink}
      />

      <TextAreaField
        label="What should be added, updated, or removed?"
        id="requested-change"
        onChange={setRequestedChange}
        required
        value={requestedChange}
      />

      <TextAreaField
        label="Source or reason, optional"
        id="source-or-reason"
        onChange={setSourceOrReason}
        placeholder="Shop website, owner confirmation, public listing, closure reason, or other source"
        value={sourceOrReason}
      />

      <TextField label="Your email, optional" id="submitter-email" onChange={setEmail} type="email" value={email} />

      {errorMessage ? <p className="text-sm leading-6 text-amber">{errorMessage}</p> : null}

      <button
        className="focus-ring w-fit rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}

function TextField({
  label,
  id,
  onChange,
  type = "text",
  value,
  required = false
}: {
  label: string;
  id: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        className="focus-ring rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}

function TextAreaField({
  label,
  id,
  onChange,
  placeholder,
  value,
  required = false
}: {
  label: string;
  id: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-ink" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="focus-ring min-h-28 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </div>
  );
}
