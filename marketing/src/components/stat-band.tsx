import { Container } from "./Container";
import { Reveal } from "./Reveal";

type Stat = {
  value: string;
  label: string;
};

type StatBandProps = {
  stats: Stat[];
};

export function StatBand({ stats }: StatBandProps) {
  return (
    <section aria-label="Company metrics" className="border-y border-border bg-surface/50 py-12">
      <Container>
        {/* Reveal renders the grid item itself. It used to wrap a second <div>, which put two
            elements between the <dl> and its <dt>/<dd> pairs — axe walks up only one presentational
            <div>, so every term and definition read as orphaned and the list was not a list. */}
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <dt className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
