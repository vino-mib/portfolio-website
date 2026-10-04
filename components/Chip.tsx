export function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line px-[9px] py-[3px] text-xs text-muted">
      {label}
    </span>
  );
}

export function ChipList({ labels }: { labels: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Chip key={label} label={label} />
      ))}
    </div>
  );
}
