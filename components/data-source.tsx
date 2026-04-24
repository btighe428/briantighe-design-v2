type Props = {
  source: string;
  snapshotDate: string; // ISO
  commitSha?: string;
  methodologyHref: string;
};

export function DataSource({
  source,
  snapshotDate,
  commitSha,
  methodologyHref,
}: Props) {
  const date = new Date(snapshotDate);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <p
      className="data-source"
      style={{
        fontStyle: 'italic',
        color: 'var(--color-ink-muted)',
        fontSize: '0.85em',
        marginTop: '-0.5em',
        marginBottom: '2em',
        borderLeft: '2px solid var(--color-rule)',
        paddingLeft: '0.75em',
      }}
    >
      Data: {source}, snapshot {formatted}
      {commitSha ? ` (commit ${commitSha.slice(0, 7)})` : null}.{' '}
      <a href={methodologyHref}>Methodology →</a>
    </p>
  );
}
