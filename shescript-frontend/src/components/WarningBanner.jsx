// WarningBanner.jsx — Person 1
// Displays warning flags from Person 3's getWomenFlags() output
// Props: flags — array of { type: "danger" | "warning" | "info", message: string }
// Also handles result.pregnancy_safe and result.hormonal_effects from Gemini

const CONFIG = {
  danger: {
    bg: "#FEE2E2",
    border: "#C94040",
    text: "#991B1B",
    icon: "🚨",
    label: "Important Warning",
  },
  warning: {
    bg: "#FEF9C3",
    border: "#D97706",
    text: "#92400E",
    icon: "⚠️",
    label: "Caution",
  },
  info: {
    bg: "#E0F2FE",
    border: "#0284C7",
    text: "#075985",
    icon: "ℹ️",
    label: "Note",
  },
};

// Single banner unit
function Banner({ type, message }) {
  const style = CONFIG[type] || CONFIG.info;
  return (
    <div
      className="rounded-2xl px-5 py-4 border-l-4"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      <p
        className="text-sm font-semibold mb-1"
        style={{ color: style.text }}
      >
        {style.icon} {style.label}
      </p>
      <p className="text-sm" style={{ color: style.text }}>
        {message}
      </p>
    </div>
  );
}

// Main export
export default function WarningBanner({ flags = [], result = {} }) {
  const allFlags = [...flags];

  // Auto-generate banners from Gemini result fields
  if (result.pregnancy_safe === false) {
    allFlags.unshift({
      type: "danger",
      message:
        result.pregnancy_note ||
        "This medicine is NOT safe during pregnancy. Consult your doctor immediately.",
    });
  }

  if (result.hormonal_effects) {
    allFlags.push({
      type: "warning",
      message: `Hormonal effect: ${result.hormonal_effects}`,
    });
  }

  if (result.warning_flags && Array.isArray(result.warning_flags)) {
    result.warning_flags.forEach((w) =>
      allFlags.push({ type: "warning", message: w })
    );
  }

  if (allFlags.length === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 rounded-2xl px-5 py-4">
        <p className="text-green-700 text-sm font-semibold">✅ No major warnings found for this medicine.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      {allFlags.map((flag, i) => (
        <Banner key={i} type={flag.type} message={flag.message} />
      ))}
    </div>
  );
}