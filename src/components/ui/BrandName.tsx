export function BrandName({ suffix }: { suffix?: string }) {
  return (
    <>
      <span className="brand-word">
        <span className="brand-word-primary">Oral</span>
        <span className="brand-word-secondary">ingo</span>
      </span>
      {suffix ? <span className="brand-suffix">{suffix}</span> : null}
    </>
  );
}
