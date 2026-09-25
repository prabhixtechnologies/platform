import { roles as fallbackRoles, type CareerRole } from "@/content/careers";
import { siteConfig } from "@/lib/site-config";

export type ApiJobRoleSummary = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  workMode: "ONSITE" | "HYBRID" | "REMOTE";
  experienceRange: string | null;
  salaryRange: string | null;
  summary: string;
  publishedAt: string;
};

export type ApiJobRoleDetail = ApiJobRoleSummary & {
  descriptionMd: string;
};

export type CareersFetchResult = {
  roles: CareerRole[];
  source: "api" | "fallback" | "empty";
};

const EMPLOYMENT_LABELS: Record<ApiJobRoleSummary["employmentType"], CareerRole["type"]> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Contract",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

function parseMarkdownSections(md: string): {
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
} {
  const responsibilities: string[] = [];
  const requirements: string[] = [];
  const niceToHave: string[] = [];
  let current: "responsibilities" | "requirements" | "niceToHave" | null = null;

  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("## responsibilities") || lower.startsWith("### responsibilities")) {
      current = "responsibilities";
      continue;
    }
    if (lower.startsWith("## requirements") || lower.startsWith("### required")) {
      current = "requirements";
      continue;
    }
    if (lower.startsWith("## nice to have") || lower.startsWith("### nice to have")) {
      current = "niceToHave";
      continue;
    }
    if (current && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
      const item = trimmed.slice(2);
      if (current === "responsibilities") responsibilities.push(item);
      else if (current === "requirements") requirements.push(item);
      else niceToHave.push(item);
    }
  }

  return { responsibilities, requirements, niceToHave };
}

function mapSummaryToCareerRole(role: ApiJobRoleSummary): CareerRole {
  return {
    slug: role.slug,
    title: role.title,
    department: role.department,
    location: role.location,
    type: EMPLOYMENT_LABELS[role.employmentType] ?? "Full-time",
    summary: role.summary,
    responsibilities: [],
    requirements: [],
    niceToHave: [],
  };
}

function mapDetailToCareerRole(role: ApiJobRoleDetail): CareerRole {
  const sections = parseMarkdownSections(role.descriptionMd ?? "");
  return {
    ...mapSummaryToCareerRole(role),
    responsibilities:
      sections.responsibilities.length > 0
        ? sections.responsibilities
        : [role.summary],
    requirements:
      sections.requirements.length > 0
        ? sections.requirements
        : ["See role description for full requirements."],
    niceToHave: sections.niceToHave,
  };
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${siteConfig.apiUrl}${path}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCareers(): Promise<CareersFetchResult> {
  const data = await fetchApi<ApiJobRoleSummary[]>("/api/v1/oneops/site/careers");

  if (data === null) {
    return { roles: fallbackRoles, source: "fallback" };
  }

  if (data.length === 0) {
    return { roles: [], source: "empty" };
  }

  return {
    roles: data.map(mapSummaryToCareerRole),
    source: "api",
  };
}

export async function getCareerBySlug(slug: string): Promise<{
  role: CareerRole | null;
  source: "api" | "fallback" | "empty";
}> {
  const detail = await fetchApi<ApiJobRoleDetail>(`/api/v1/oneops/site/careers?slug=${slug}`);

  if (detail) {
    return { role: mapDetailToCareerRole(detail), source: "api" };
  }

  const fallback = fallbackRoles.find((r) => r.slug === slug);
  if (fallback) {
    return { role: fallback, source: "fallback" };
  }

  return { role: null, source: "empty" };
}

export async function getCareerSlugs(): Promise<string[]> {
  const { roles } = await getCareers();
  return roles.map((r) => r.slug);
}
