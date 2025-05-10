const winningCombos = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["3", "6", "9"],
  ["1", "5", "9"],
  ["3", "5", "7"],
];

let turn = true;
let winner = false;

const selected = new Set();
const hearts = new Set();
const stars = new Set();

const boxes = document.querySelectorAll(".box");
const rain = document.getElementById("rain");

boxes.forEach((box) => {
  box.addEventListener("click", (event) => {
    if (winner) return;

    const id = event.target.id;
    if (selected.has(id)) return;

    if (turn) {
      box.classList.add("heart-bg");
      hearts.add(id);
      if (checkWin(hearts)) {
        launchParticles("heart");
        winner = true;
        setTimeout(reset, 2000);
        return;
      }
    } else {
      box.classList.add("star-bg");
      stars.add(id);
      if (checkWin(stars)) {
        launchParticles("star");
        winner = true;
        setTimeout(reset, 2000);
        return;
      }
    }

    selected.add(id);
    turn = !turn;

    if (selected.size === 9) {
      reset();
    }
  });
});

function checkWin(playerMoves) {
  return winningCombos.some((combo) =>
    combo.every((id) => playerMoves.has(id))
  );
}

function launchParticles(type) {
  rain.classList.add("active");

  const imageSrc =
    type === "heart" ? "./assets/heartfill.png" : "./assets/starfill.png";

  const oldCanvas = rain.querySelector("canvas");
  if (oldCanvas) oldCanvas.remove();

  requestAnimationFrame(() => {
    particlesJS("rain", {
      particles: {
        number: { value: 40 },
        shape: {
          type: "image",
          image: {
            src: imageSrc,
            width: 100,
            height: 100,
          },
        },
        size: { value: 60 },
        move: {
          direction: "bottom",
          out_mode: "out",
          speed: 2,
        },
        opacity: {
          value: 1,
          anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: false } },
      },
      retina_detect: true,
    });
  });
}

function reset() {
  turn = true;
  winner = false;

  boxes.forEach((box) => {
    box.classList.remove("heart-bg", "star-bg");
  });

  selected.clear();
  hearts.clear();
  stars.clear();

  rain.classList.remove("active");

  setTimeout(() => {
    const oldCanvas = rain.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();
  }, 500);
}
