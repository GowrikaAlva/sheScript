export function generateChecklist(dosageText) {
  // normalize to lowercase for matching
  const text = dosageText?.toLowerCase() || "";

  const checklist = {
    morning: false,
    afternoon: false,
    night: false,
    withFood: false,
    beforeFood: false,
    afterFood: false,
    duration: "",
    specialNote: "",
  };

  // timing detection
  if (
    text.includes("morning") ||
    text.includes("once daily") ||
    text.includes("od") ||
    text.includes("every day")
  ) {
    checklist.morning = true;
  }

  if (
    text.includes("afternoon") ||
    text.includes("noon") ||
    text.includes("twice") ||
    text.includes("bd") ||
    text.includes("two times")
  ) {
    checklist.morning = true;
    checklist.afternoon = true;
  }

  if (
    text.includes("night") ||
    text.includes("bedtime") ||
    text.includes("before sleep") ||
    text.includes("at night")
  ) {
    checklist.night = true;
  }

  // tds or three times a day
  if (
    text.includes("tds") ||
    text.includes("three times") ||
    text.includes("3 times")
  ) {
    checklist.morning = true;
    checklist.afternoon = true;
    checklist.night = true;
  }

  // food relation
  if (
    text.includes("after food") ||
    text.includes("after meal") ||
    text.includes("with food") ||
    text.includes("with meal")
  ) {
    checklist.withFood = true;
    checklist.afterFood = true;
  }

  if (
    text.includes("before food") ||
    text.includes("empty stomach") ||
    text.includes("before meal")
  ) {
    checklist.beforeFood = true;
  }

  // duration detection
  if (text.includes("3 days") || text.includes("three days")) {
    checklist.duration = "3 days";
  } else if (text.includes("5 days") || text.includes("five days")) {
    checklist.duration = "5 days";
  } else if (
    text.includes("7 days") ||
    text.includes("one week") ||
    text.includes("a week")
  ) {
    checklist.duration = "7 days";
  } else if (text.includes("10 days") || text.includes("ten days")) {
    checklist.duration = "10 days";
  } else if (text.includes("14 days") || text.includes("two weeks")) {
    checklist.duration = "14 days";
  } else if (text.includes("month") || text.includes("30 days")) {
    checklist.duration = "1 month";
  } else if (
    text.includes("ongoing") ||
    text.includes("continue") ||
    text.includes("lifelong")
  ) {
    checklist.duration = "Ongoing — do not stop without doctor advice";
  } else {
    checklist.duration = "As prescribed by doctor";
  }

  return checklist;
}
