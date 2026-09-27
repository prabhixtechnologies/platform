export async function register() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  const { assertPublicBffCredentialConfigured } = await import(
    "@/lib/bff/public-bff-credential"
  );
  assertPublicBffCredentialConfigured();
}
