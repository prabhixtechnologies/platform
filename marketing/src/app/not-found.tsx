import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GradientMesh } from "@/components/gradient-mesh";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
      <GradientMesh />
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Link
            href="/contact"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Contact support
          </Link>
        </div>
      </Container>
    </div>
  );
}
