export default function Field({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <div className="text-xs text-gray-400">{hint}</div>}
    </div>
  );
}
