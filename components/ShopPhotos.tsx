"use client";

import type { ShopPhoto } from "@/data/photos";
import { supabase } from "@/lib/supabase";
import { Camera, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ShopPhotosProps = {
  approvedPhotos: ShopPhoto[];
  shopId?: string;
  shopName: string;
  shopSlug: string;
};

type CameraState = "idle" | "starting" | "streaming" | "preview" | "uploading" | "success" | "error";

const bucketName = "shop-photos";
const maxLongEdge = 1800;
const jpegQuality = 0.82;

export default function ShopPhotos({ approvedPhotos, shopId, shopName, shopSlug }: ShopPhotosProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<ShopPhoto | null>(null);
  const hasApprovedPhotos = approvedPhotos.length > 0;
  const canSubmit = Boolean(capturedBlob && supabase && cameraState === "preview");

  useEffect(() => {
    return () => {
      stopCamera();
      revokePreview();
    };
  }, []);

  async function startCamera() {
    setErrorMessage("");
    revokePreview();
    setCapturedBlob(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      setErrorMessage("Camera access is required to submit a photo. Existing photos cannot be uploaded.");
      return;
    }

    try {
      setCameraState("starting");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("streaming");
    } catch (error) {
      console.error("Camera access failed.", error);
      stopCamera();
      setCameraState("error");
      setErrorMessage("Camera access is required to submit a photo. Existing photos cannot be uploaded.");
    }
  }

  async function capturePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraState("error");
      setErrorMessage("The camera preview is not ready yet. Please try again.");
      stopCamera();
      return;
    }

    try {
      const blob = await captureVideoFrame(video);
      stopCamera();
      revokePreview();
      setCapturedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setCameraState("preview");
    } catch (error) {
      console.error("Camera frame capture failed.", error);
      stopCamera();
      setCameraState("error");
      setErrorMessage("Your photo could not be captured. Please try again.");
    }
  }

  async function submitPhoto() {
    if (!capturedBlob || !supabase) {
      setCameraState("error");
      setErrorMessage("Photo submission is temporarily unavailable. Please try again later.");
      return;
    }

    setCameraState("uploading");
    setErrorMessage("");

    const photoId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : createFallbackId();
    const safeShopSlug = shopSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const storagePath = `submissions/${safeShopSlug}/${photoId}.jpg`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(storagePath, capturedBlob, {
      cacheControl: "3600",
      contentType: "image/jpeg",
      upsert: false
    });

    if (uploadError) {
      console.error("Supabase shop photo upload failed.", uploadError);
      setCameraState("preview");
      setErrorMessage("We could not upload your photo right now. Please try again.");
      return;
    }

    const { error: insertError } = await supabase.from("shop_photos").insert({
      shop_id: isUuid(shopId) ? shopId : null,
      shop_slug: shopSlug,
      shop_name: shopName,
      storage_path: storagePath,
      status: "pending"
    });

    if (insertError) {
      console.error("Supabase shop_photos insert failed.", insertError);
      setCameraState("preview");
      setErrorMessage("We could not submit your photo for review right now. Please try again.");
      return;
    }

    revokePreview();
    setCapturedBlob(null);
    setCameraState("success");
  }

  function cancelCapture() {
    stopCamera();
    revokePreview();
    setCapturedBlob(null);
    setErrorMessage("");
    setCameraState("idle");
  }

  function retakePhoto() {
    stopCamera();
    startCamera();
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function revokePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-line bg-white p-5 shadow-sm" aria-labelledby="shop-photos-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="shop-photos-heading" className="text-2xl font-bold text-ink">
            Photos
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Visitor-submitted photos are reviewed before publication and may no longer reflect the current location.
          </p>
        </div>
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
          disabled={cameraState === "starting" || cameraState === "uploading"}
          onClick={startCamera}
          type="button"
        >
          <Camera aria-hidden="true" size={16} />
          Take a photo
        </button>
      </div>

      <div className="mt-5">
        {hasApprovedPhotos ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {approvedPhotos.map((photo, index) => (
              <button
                key={photo.id}
                aria-label={`View submitted photo ${index + 1} for ${shopName}`}
                className={`focus-ring overflow-hidden rounded-lg border border-line bg-paper ${
                  index === 0 ? "col-span-2 aspect-[4/3] sm:row-span-2" : "aspect-square"
                }`}
                onClick={() => setSelectedPhoto(photo)}
                type="button"
              >
                <img
                  alt={`Visitor-submitted location photo for ${shopName}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  src={photo.signed_url}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted">
            No approved photos yet.
          </div>
        )}
      </div>

      {cameraState === "streaming" || cameraState === "starting" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-lg border border-line bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Take a photo</h3>
              <button
                aria-label="Cancel photo capture"
                className="focus-ring rounded-full border border-line p-2 text-ink hover:border-teal hover:text-teal"
                onClick={cancelCapture}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg bg-black">
              <video ref={videoRef} autoPlay className="max-h-[70vh] w-full object-contain" muted playsInline />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                className="focus-ring flex-1 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
                disabled={cameraState === "starting"}
                onClick={capturePhoto}
                type="button"
              >
                {cameraState === "starting" ? "Starting camera..." : "Capture photo"}
              </button>
              <button
                className="focus-ring rounded-lg border border-line px-4 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                onClick={cancelCapture}
                type="button"
              >
                Cancel
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Camera access is used only for this submission. Existing photos cannot be uploaded.
            </p>
          </div>
        </div>
      ) : null}

      {cameraState === "preview" || cameraState === "uploading" ? (
        <div className="mt-5 rounded-lg border border-line bg-paper p-4">
          <h3 className="text-lg font-bold text-ink">Photo preview</h3>
          {previewUrl ? (
            <img
              alt="Captured photo preview"
              className="mt-3 max-h-[420px] w-full rounded-lg border border-line object-contain"
              src={previewUrl}
            />
          ) : null}
          {errorMessage ? <p className="mt-3 text-sm leading-6 text-amber">{errorMessage}</p> : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              disabled={cameraState === "uploading"}
              onClick={retakePhoto}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Retake
            </button>
            <button
              className="focus-ring rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!canSubmit}
              onClick={submitPhoto}
              type="button"
            >
              {cameraState === "uploading" ? "Uploading..." : "Submit photo for review"}
            </button>
            <button
              className="focus-ring rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              disabled={cameraState === "uploading"}
              onClick={cancelCapture}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {cameraState === "success" ? (
        <p className="mt-5 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
          Thanks. Your photo has been submitted for review.
        </p>
      ) : null}

      {cameraState === "error" && errorMessage ? (
        <p className="mt-5 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted">
          {errorMessage}
        </p>
      ) : null}

      {selectedPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl">
            <div className="mb-3 flex justify-end">
              <button
                aria-label="Close photo"
                className="focus-ring rounded-full bg-white p-2 text-ink hover:text-teal"
                onClick={() => setSelectedPhoto(null)}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <img
              alt={`Visitor-submitted location photo for ${shopName}`}
              className="max-h-[82vh] w-full rounded-lg bg-white object-contain"
              src={selectedPhoto.signed_url}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

async function captureVideoFrame(video: HTMLVideoElement) {
  const { width, height } = getTargetSize(video.videoWidth, video.videoHeight);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  context.drawImage(video, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", jpegQuality);
  });

  if (!blob) {
    throw new Error("Photo compression failed.");
  }

  return blob;
}

function getTargetSize(sourceWidth: number, sourceHeight: number) {
  const longEdge = Math.max(sourceWidth, sourceHeight);

  if (longEdge <= maxLongEdge) {
    return {
      width: sourceWidth,
      height: sourceHeight
    };
  }

  const scale = maxLongEdge / longEdge;

  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}

function createFallbackId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function isUuid(value?: string) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}
