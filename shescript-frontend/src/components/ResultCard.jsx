// ResultCard.jsx — Person 1
// Displays structured medicine result from Gemini API (Person 2's JSON output)
// Props: result (object from gemini.js)

export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    medicine_name,
    used_for,
    simple_explanation,
    side_effects = [],
    safe_dosage,
    food_interactions = [],
    eli5_explanation,
  } = result;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">

      {/* Medicine Name Header */}
      <div
        className="rounded-2xl px-6 py-4 text-white"
        style={{ backgroundColor: "#2E4057" }}
      >
        <h2 className="text-xl font-bold">{medicine_name}</h2>
        <p className="text-sm opacity-80 mt-1">{used_for}</p>
      </div>

      {/* Simple Explanation */}
      <Card icon="💬" title="What is this medicine?">
        <p className="text-gray-700 text-sm leading-relaxed">{simple_explanation}</p>
      </Card>

      {/* Explain Like I'm 10 */}
      {eli5_explanation && (
        <Card icon="🧒" title="Explain it simply (for elderly / low-literacy users)">
          <p className="text-gray-700 text-sm leading-relaxed italic">{eli5_explanation}</p>
        </Card>
      )}

      {/* Dosage */}
      <Card icon="⏰" title="How to take it">
        <p className="text-gray-700 text-sm leading-relaxed font-medium">{safe_dosage}</p>
      </Card>

      {/* Side Effects */}
      {side_effects.length > 0 && (
        <Card icon="⚠️" title="Possible side effects">
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {side_effects.map((effect, i) => (
              <li key={i}>{effect}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Food Interactions */}
      {food_interactions.length > 0 && (
        <Card icon="🍽️" title="Food & drink to avoid">
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {food_interactions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// Reusable inner card
function Card({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}