import medicines from "../data/medicines.json";

export function getWomenFlags(medicineName) {
  // normalize input to lowercase and trim spaces
  const key = medicineName.toLowerCase().trim();
  const medicine = medicines[key];

  // if medicine not found in our database return empty
  if (!medicine) return [];

  const flags = [];

  if (!medicine.pregnancy_safe) {
    flags.push({
      type: "danger",
      label: "Pregnancy Warning",
      message:
        medicine.warning ||
        "NOT safe during pregnancy. Consult your doctor immediately.",
    });
  }

  if (!medicine.breastfeeding_safe) {
    flags.push({
      type: "warning",
      label: "Breastfeeding Caution",
      message:
        "Not recommended during breastfeeding. Ask your doctor for alternatives.",
    });
  }

  if (medicine.hormonal_interaction) {
    flags.push({
      type: "warning",
      label: "Hormonal Effect",
      message: "This medicine may affect your hormones or menstrual cycle.",
    });
  }

  if (medicine.cycle_effects && medicine.cycle_effects !== "none") {
    flags.push({
      type: "info",
      label: "Cycle Effect",
      message: medicine.cycle_effects,
    });
  }

  if (medicine.pcos_note) {
    flags.push({
      type: "info",
      label: "PCOS Note",
      message: medicine.pcos_note,
    });
  }

  if (medicine.warning && medicine.pregnancy_safe) {
    // show warning even if pregnancy safe, if there is a general warning
    flags.push({
      type: "warning",
      label: "Important Warning",
      message: medicine.warning,
    });
  }

  return flags;
}
