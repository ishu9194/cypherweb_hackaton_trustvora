import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.25 3.06-.99 1.03-2.19 1.63-3.5 1.52-.12-1.11.39-2.24 1.23-3.09.86-.87 2.31-1.52 3.5-1.49h.02ZM19.9 17.36c-.36.83-.79 1.6-1.29 2.32-.7 1.02-1.28 1.73-1.72 2.13-.68.66-1.41.99-2.19 1.01-.56.01-1.24-.16-2.02-.5-.79-.34-1.5-.5-2.16-.5-.68 0-1.42.16-2.22.5-.8.34-1.45.52-1.95.53-.75.04-1.5-.3-2.24-1-.48-.44-1.09-1.18-1.83-2.24-.79-1.13-1.44-2.44-1.94-3.94-.54-1.62-.81-3.18-.81-4.7 0-1.74.38-3.24 1.13-4.5.6-1.02 1.4-1.82 2.4-2.4a6.32 6.32 0 0 1 3.24-.98c.6 0 1.4.19 2.4.56.99.37 1.63.56 1.9.56.2 0 .9-.22 2.1-.65 1.13-.4 2.09-.57 2.87-.5 2.12.17 3.72.99 4.78 2.48-1.9 1.15-2.84 2.76-2.83 4.83.02 1.61.6 2.95 1.75 4.02.52.5 1.1.88 1.75 1.15-.14.4-.29.79-.46 1.16Z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

const PROVIDERS = [
  { name: "Google", icon: GoogleIcon },
  { name: "Apple", icon: AppleIcon },
  { name: "Microsoft", icon: MicrosoftIcon },
];

export function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {PROVIDERS.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          className="px-0"
          aria-label={`Continue with ${provider.name}`}
          onClick={() => toast(`${provider.name} sign-in is a UI preview in this demo`)}
        >
          <provider.icon />
        </Button>
      ))}
    </div>
  );
}
