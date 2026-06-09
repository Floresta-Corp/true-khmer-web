import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigation, useSubmit } from "react-router";
import { GoogleButton } from "./google-button";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

type GoogleAuthButtonProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  redirectTo?: string;
  rememberMe?: boolean;
  onError?: (message: string) => void;
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Google sign-in.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Google sign-in."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export function GoogleAuthButton({
  children = "Continue with Google",
  className,
  disabled,
  redirectTo = "/",
  rememberMe = true,
  onError,
}: GoogleAuthButtonProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const isSubmitting = navigation.state === "submitting";
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const onErrorRef = useRef(onError);
  const callbackRef = useRef<
    ((response: GoogleCredentialResponse) => void) | null
  >(null);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  callbackRef.current = (response) => {
    const idToken = response.credential?.trim();
    if (!idToken) {
      onErrorRef.current?.("Google sign-in did not return a credential.");
      return;
    }

    const formData = new FormData();
    formData.set("intent", "google");
    formData.set("idToken", idToken);
    formData.set("redirectTo", redirectTo);
    formData.set("rememberMe", rememberMe ? "true" : "false");

    submit(formData, { method: "post" });
  };

  useEffect(() => {
    let cancelled = false;

    async function initializeGoogle() {
      if (!googleClientId?.trim()) {
        onErrorRef.current?.("Google sign-in is not configured.");
        return;
      }

      try {
        await loadGoogleIdentityScript();
        if (cancelled) return;

        window.google?.accounts?.id?.initialize({
          client_id: googleClientId,
          callback: (response) => callbackRef.current?.(response),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          googleButtonRef.current.replaceChildren();
          window.google?.accounts?.id?.renderButton(googleButtonRef.current, {
            shape: "rectangular",
            size: "large",
            text: "continue_with",
            theme: "outline",
            width: 420,
          });
        }

        setIsReady(true);
      } catch (error) {
        if (cancelled) return;
        onErrorRef.current?.(
          error instanceof Error
            ? error.message
            : "Unable to load Google sign-in.",
        );
      }
    }

    void initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full">
      <GoogleButton
        className={className}
        disabled={disabled || isSubmitting || !isReady}
        tabIndex={-1}
        aria-hidden="true"
      >
        {isSubmitting ? "Continuing..." : children}
      </GoogleButton>
      <div
        ref={googleButtonRef}
        aria-label="Continue with Google"
        className="absolute inset-0 overflow-hidden opacity-0"
        style={{
          pointerEvents: disabled || isSubmitting || !isReady ? "none" : "auto",
        }}
      />
    </div>
  );
}
