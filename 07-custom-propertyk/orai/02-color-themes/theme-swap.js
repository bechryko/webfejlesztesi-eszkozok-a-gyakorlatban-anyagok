const defaultThemeButton = document.getElementById("default-theme");
const crimsonThemeButton = document.getElementById("crimson-theme");
const nightThemeButton = document.getElementById("night-theme");

defaultThemeButton.onclick = () => {
  document.body.classList.remove("crimson-theme", "night-theme");
}

crimsonThemeButton.onclick = () => {
  document.body.classList.remove("night-theme");
  document.body.classList.add("crimson-theme");
}

nightThemeButton.onclick = () => {
  document.body.classList.remove("crimson-theme");
  document.body.classList.add("night-theme");
}
