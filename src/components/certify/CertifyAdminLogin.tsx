"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function CertifyAdminLogin({ clientId }: { clientId: string }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!clientId || !scriptLoaded || !window.google || !buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential?: string }) => {
        setError(null);

        if (!response.credential) {
          setError("Google did not return a login credential.");
          return;
        }

        const result = await fetch("/api/admin/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: response.credential }),
        });

        if (!result.ok) {
          const payload = (await result.json().catch(() => ({}))) as { error?: string };
          setError(payload.error || "Unable to sign in.");
          return;
        }

        window.location.reload();
      },
    });

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 280,
    });
  }, [clientId, scriptLoaded]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="mx-auto max-w-lg rounded-[28px] border border-white/10 bg-white p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#014051]">
          Admin Review
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">
          Sign in with the approved SkillVita Google account
        </h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          Only <strong>hemanth@skillvita.in</strong> can access this review console.
        </p>
        <div className="mt-8 flex justify-center" ref={buttonRef} />
        {!clientId ? (
          <p className="mt-4 text-sm text-red-600">
            Missing <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>. Configure it to enable login.
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </>
  );
}
