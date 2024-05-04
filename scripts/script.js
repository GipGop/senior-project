setInterval(repeat, 10);

function setup() {
  document.documentElement.style.animationPlayState = "paused";
}

function openSideNav() {
  document.getElementById("sideNav").style.width = "250px";
  document.getElementById("openSideNavButton").style.display = "none";
  document.getElementById("theSun").style.bottom = "-10%";
  document.getElementById("corona").style.bottom = "-10%";
  document.getElementById("theMoon").style.bottom = "90%";
  document.documentElement.style.backgroundColor = "#000000";
  document.documentElement.style.animationDirection = "normal";
  document.documentElement.style.animationPlayState = "running";
}

function closeSideNav() {
  document.getElementById("sideNav").style.width = "0px";
  document.getElementById("openSideNavButton").style.display = "inline";
  document.getElementById("theSun").style.bottom = "90%";
  document.getElementById("corona").style.bottom = "90%";
  document.getElementById("theMoon").style.bottom = "-10%";
  document.documentElement.style.backgroundColor = "#87CEEB";
  document.documentElement.style.animationDirection = "reverse";
  document.documentElement.style.animationPlayState = "running";

  document.documentElement.style.animationName = "none";
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.documentElement.style.animationName = ""
    }, 0);
  });
}

function repeat() {

}

function stopAnimation() {
  document.documentElement.style.animationPlayState = "paused";
}