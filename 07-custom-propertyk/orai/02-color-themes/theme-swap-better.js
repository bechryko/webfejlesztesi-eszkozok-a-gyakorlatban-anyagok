const themes = ["default-theme", "crimson-theme", "night-theme"];
let currentTheme = themes[0];

themes.forEach(theme => {
  const button = document.getElementById(theme);

  button.onclick = () => {
    document.body.classList.remove(currentTheme);
    document.body.classList.add(theme);
    currentTheme = theme;
  }
});
