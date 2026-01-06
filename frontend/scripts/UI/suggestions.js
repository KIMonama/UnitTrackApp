const descriptionSuggestionsMap = {
  Plumbing: [
    "🚰 Leaking tap",
    "🚿 No water in shower",
    "🚽 Toilet not flushing",
    "💧 Pipe leaking",
    "🚱 No water at all",
  ],

  Electrical: [
    "💡 Lights not working",
    "🔌 Plug point broken",
    "⚡ Power keeps tripping",
    "🔥 Burning smell",
    "❌ No electricity",
  ],

  Doors: [
    "🚪 Door won’t close",
    "🔐 Lock broken",
    "🪟 Window cracked",
    "🚪 Door handle loose",
  ],

  Cleaning: [
    "🧹 Dirty common area",
    "🚮 Garbage not collected",
    "🦟 Pests or insects",
    "🚿 Bathroom not cleaned",
    "🧼 General cleaning needed",
  ],

  Noise: [
    "🔊 Loud noise at night",
    "🎵 Music too loud",
    "🐕 Dogs making noise",
    "👥 People making noise",
    "❗ Ongoing disturbance",
  ],

  Other: ["❓ Other issue", "📝 Something else to report"],
};

const showDescriptionSuggestions = (category) => {
  const container = document.getElementById("descriptionSuggestions");
  const descriptionInput = document.getElementById("description");

  // Clear old suggestions
  container.innerHTML = "";

  const suggestions = descriptionSuggestionsMap[category];
  if (!suggestions) return;

  suggestions.forEach((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary btn-sm";
    button.textContent = text;

    button.onclick = () => {
      descriptionInput.value = text;
    };

    container.appendChild(button);
  });
};
