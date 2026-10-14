export default function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12" cy="16" r="9" fill="none" stroke="#2E9C9A" strokeWidth="1.6" />
      <circle cx="20" cy="16" r="9" fill="none" stroke="#E0B63E" strokeWidth="1.6" />
      <path d="M16 8.6a9 9 0 0 1 0 14.8a9 9 0 0 1 0-14.8z" fill="#E0B63E" opacity=".55" />
    </svg>
  );
}
