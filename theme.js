// Theme management
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // Use saved theme if it exists
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", systemTheme);
    localStorage.setItem("theme", systemTheme);
    updateThemeIcon(systemTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  // Dispatch event for other components
  window.dispatchEvent(
    new CustomEvent("themeChanged", { detail: { theme: newTheme } })
  );
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggle i");
  if (icon) {
    if (theme === "dark") {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }
}

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      updateThemeIcon(newTheme);
    }
  });

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  // Theme toggle button
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});
