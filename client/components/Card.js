export default function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
