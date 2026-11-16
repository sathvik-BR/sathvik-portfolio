import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { projects, profile } from "@/data/content";
import { asset } from "@/lib/assets";
import { PageFade } from "@/components/ui/PageFade";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Cursor } from "@/components/ui/Cursor";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${profile.name}`,
    description: project.summary,
  };
}

function getShots(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(`${slug}-`) && /\.(png|jpe?g|webp)$/i.test(f))
    .sort();
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <PageFade inView className="grid gap-4 border-t border-border py-10 md:grid-cols-[200px_1fr] md:gap-10">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">{label}</h2>
      <div>{children}</div>
    </PageFade>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const shots = getShots(slug);
  const num = String(index + 1).padStart(2, "0");

  return (
    <>
      <ScrollToTop />
      <Cursor />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/#projects"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
          >
            ← All projects
          </Link>
          <Link href="/" className="font-mono text-lg font-bold tracking-tight text-text">
            BRS<span className="text-accent">.</span>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
        <PageFade>
          <span className="inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            Case study {num}
          </span>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-text font-display">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{project.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              View code ↗
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent/60 hover:text-text"
              >
                Live demo ↗
              </a>
            )}
          </div>
        </PageFade>

        <PageFade delay={0.15} className="mt-12">
          {shots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {shots.map((file) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={file}
                  src={asset(`/images/projects/${file}`)}
                  alt={`${project.title} screenshot`}
                  className="w-full rounded-2xl border border-border"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(124,92,255,0.35),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_90%,rgba(61,224,255,0.22),transparent_55%)]" />
              <span className="absolute bottom-4 right-6 text-[clamp(4rem,12vw,9rem)] leading-none text-white/10 font-display">
                {num}
              </span>
            </div>
          )}
        </PageFade>

        <div className="mt-16">
          <Block label="Overview">
            <p className="max-w-3xl text-lg leading-relaxed text-text/90">{project.summary}</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">Role</dt>
                <dd className="mt-1 text-text">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">Type</dt>
                <dd className="mt-1 text-text">{project.type}</dd>
              </div>
            </dl>
          </Block>

          <Block label="The problem">
            <p className="max-w-3xl leading-relaxed text-muted">{project.problem}</p>
          </Block>

          <Block label="Approach">
            <ol className="max-w-3xl space-y-5">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </Block>

          <Block label="Results">
            <div className="grid gap-4 sm:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.label} className="rounded-xl border border-border bg-surface p-5">
                  <div className="text-2xl leading-tight text-text font-display md:text-3xl">{r.value}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted">{r.label}</div>
                </div>
              ))}
            </div>
          </Block>

          <Block label="Tech stack">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </Block>
        </div>

        <PageFade inView className="mt-8 border-t border-border pt-12">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Next project</span>
          <Link
            href={`/projects/${next.slug}`}
            className="mt-3 block text-[clamp(2rem,5vw,4rem)] leading-tight text-text transition-colors hover:text-accent font-display"
          >
            {next.title} →
          </Link>
        </PageFade>
      </main>
    </>
  );
}