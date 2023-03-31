const canvas = document.querySelector("canvas"),
  header = document.querySelector("#header"),
  toolsBoard = document.querySelector(".tools-board"),
  ctx = canvas.getContext("2d"),
  fillColor = document.querySelector("#fill-color"),
  toolBtns = document.querySelectorAll(".tool"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorsNav = document.querySelector(".row.colors .options"),
  colorPicker = document.querySelector("#color-picker"),
  figureNavOpen = document.querySelector(".row.figures .options"),
  clearCanvas = document.querySelector("#clear-canvas"),
  saveImg = document.querySelector("#save-img"),
  sizeSlider = document.querySelector("#size-slider"),
  figureNav = document.querySelector(".row.figures"),
  navFigureIcon = document.querySelector("#figure-icon"),
  navFigureIconImg = document.querySelector("#figure-icon-img"),
  openColorBarBtn = document.querySelector("#picked-color");

let prevMouseX,
  prevMouseY,
  snapshot,
  selectedTool = "brush",
  isDrawing = false,
  brushWidth = 2,
  selectedColor = "#3d3d3d";

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;

  ctx.beginPath();

  ctx.lineCap = "round";
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    console.log("sel rect");
    drawRect(e);
  } else if (selectedTool === "circle") {
    console.log("sel tri");
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    document.querySelector("#figure-icon-img").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(btn.classList);

    if (btn.classList.contains("figure")) {
      changeFigure(btn.id);
      document.querySelector("#figure-icon-img").classList.add("active");
    }
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    openColorBarBtn.style.backgroundColor = selectedColor;
  });
});

colorPicker.addEventListener("input", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  isDrawing = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));

canvas.addEventListener(
  "touchstart",
  function (e) {
    mousePos = getTouchPos(canvas, e);
    if (e.target == canvas) {
      e.preventDefault();
    }
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchend",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchmove",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
}

const changeFigure = (iconName) => {
  navFigureIcon.innerHTML = `<img id='figure-icon-img' src='icons/${iconName}.svg' alt=''  />`;
};

const openNavFigures = (e) => {
  if (figureNavOpen.style.display === "block")
    figureNavOpen.style.display = "none";
  else {
    figureNavOpen.style.display = "block";
  }
};
navFigureIcon.addEventListener("click", openNavFigures);

const navigationShow = (e) => {
  if (window.innerWidth <= 850) {
    if (
      toolsBoard.style.display === "flex" ||
      toolsBoard.style.display === ""
    ) {
      toolsBoard.style.display = "none";
    } else {
      toolsBoard.style.display = "flex";
    }
  }
};
header.addEventListener("click", navigationShow);

const openColorBar = (e) => {
  console.log(colorBtns);
  if (window.innerWidth <= 850) {
    if (colorsNav.style.display === "flex" || colorsNav.style.display === "") {
      colorsNav.style.display = "none";
    } else {
      colorsNav.style.display = "flex";
    }
  }
};
openColorBarBtn.addEventListener("click", openColorBar);
