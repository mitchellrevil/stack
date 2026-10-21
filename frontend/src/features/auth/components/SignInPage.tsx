import { Button } from "@/components/ui/button";

export function SignInPage({
  onSignIn,
  error,
}: {
  onSignIn: () => void;
  error?: string;
}) {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <p className="eyebrow">STACK / SIGN IN</p>
      <h1 className="mt-4 text-3xl font-semibold">Your workspace is ready.</h1>
      <p className="my-6 text-muted-foreground">
        Sign in with your work account to continue.
      </p>
      {error && (
        <p role="alert" className="mb-6 text-destructive">
          {error}
        </p>
      )}
      <Button onClick={onSignIn}>Sign in with Microsoft</Button>
    </main>
  );
}
