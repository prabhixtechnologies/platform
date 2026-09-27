export const PUBLIC_BFF_HEADER = "X-Prabhix-Public-Bff";

export const PUBLIC_BFF_CREDENTIAL_ENV = "PRABHIX_PUBLIC_BFF_CREDENTIAL";

export class PublicBffCredentialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicBffCredentialError";
  }
}

export function isProductionRuntime(nodeEnv = process.env.NODE_ENV): boolean {
  return nodeEnv === "production";
}

export function readPublicBffCredentialFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const value = env[PUBLIC_BFF_CREDENTIAL_ENV]?.trim();
  return value || undefined;
}

export function assertPublicBffCredentialConfigured(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const credential = readPublicBffCredentialFromEnv(env);
  if (!credential) {
    throw new PublicBffCredentialError(
      `${PUBLIC_BFF_CREDENTIAL_ENV} must be set for production server-side public API access`,
    );
  }
  return credential;
}

export function publicBffCredentialForUpstream(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (isProductionRuntime(env.NODE_ENV)) {
    return assertPublicBffCredentialConfigured(env);
  }
  return readPublicBffCredentialFromEnv(env);
}
