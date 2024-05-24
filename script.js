setTimeout(function () {
  var canvas = document.getElementById("canvas");
  canvas.style.left = window.innerWidth / 2 - 300 + "px";
  canvas.style.top = window.innerHeight / 2 - 300 + "px";
  canvas.style.position = "absolute";
  var ctx = canvas.getContext("2d");

  var rect = canvas.getBoundingClientRect();

  var scoreElement = document.getElementById("score");
  var score = 0;

  var timerElement = document.getElementById("timer");

  var restartElement = document.getElementById("restart");

  var ballElement = document.getElementById("ball");

  var ball = false;

  var coord = [];

  var x0, y0, x1, y1; // main line
  var nx0, ny0, nx1, ny1; // next line

  function getRndInteger() {
    return Math.floor(Math.random() * (canvas.width - 100 - 100)) + 100;
  }

  function initialize() {
    drawLine();

    ctx.beginPath();
    ctx.fillStyle = "lightgreen";
    ctx.arc(x0, y0, 7, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "lightgreen";
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "#BEADFA";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(nx0, ny0);
    ctx.lineTo(nx1, ny1);
    ctx.stroke();
    ctx.closePath();
  }

  initialize();

  function drawLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    scoreElement.innerHTML = score;
    score++;

    x0 = nx0 || getRndInteger();
    y0 = ny0 || getRndInteger();

    if (nx1 != undefined && ny1 != undefined) {
      x1 = nx1;
      y1 = ny1;
    } else {
      x1 = getRndInteger();
      y1 = getRndInteger();
      goodDistanceCalc(x0, x1, y0, y1);
      x1 = goodDistance[0];
      y1 = goodDistance[1];
    }

    if (ball) {
      ctx.beginPath();
      ctx.strokeStyle = "lightgreen";
      ctx.arc(x0, y0, 7, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.strokeStyle = "lightgreen";
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    nx0 = x1;
    ny0 = y1;

    nx1 = getRndInteger();
    ny1 = getRndInteger();
    goodDistanceCalc(nx0, nx1, ny0, ny1);
    nx1 = goodDistance[0];
    ny1 = goodDistance[1];

    ctx.strokeStyle = "#BEADFA";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(nx0, ny0);
    ctx.lineTo(nx1, ny1);
    ctx.stroke();
    ctx.closePath();

    coord = [];

    for (var i = 0; i < 501; i++) {
      var x = x0 + (i / 500) * (x1 - x0);
      var y = y0 + (i / 500) * (y1 - y0);
      coord.push({ x, y });
    }
  }

  var goodDistance = [];
  function goodDistanceCalc(x0, y0, x1, y1) {
    var aC = x0 - x1;
    var bC = y0 - y1;
    var cC = Math.sqrt(aC * aC + bC * bC);

    while (cC < 70) {
      x1 = getRndInteger();
      y1 = getRndInteger();
      aC = x0 - x1;
      bC = y0 - y1;
      cC = Math.sqrt(aC * aC + bC * bC);
    }
    goodDistance = [x1, y1];
  }

  var infoElement = document.getElementById("info");
  infoElement.style.left = window.innerWidth / 2 - 300 + "px";
  infoElement.style.top = window.innerHeight / 2 - 300 + "px";
  infoElement.style.width = rect.width - 20 + "px"; // 20 is the padding

  var timerStart = null,
    timerLimit = 30,
    error = false;
  function Timer() {
    timerStart = setInterval(function () {
      timerLimit = Math.round((timerLimit - 0.1) * 100) / 100;
      timerElement.innerHTML = timerLimit;
      if (timerLimit <= 0) {
        clearInterval(timerStart);
        timerElement.innerHTML = "0";
        restartElement.innerHTML = "press r/click to restart";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px portcullion";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          score - 1,
          canvas.width / 2,
          canvas.height / 2
        );
      }
      if (error == true) {
        clearInterval(timerStart);
        restartElement.innerHTML = "press r/click to restart";
        timerLimit = 0;
      }
    }, 100);
  }

  var cx, cy;
  var a, b, c;
  var a1, b1, c1;
  var ac, bc, cc;
  var start = false;

  canvas.addEventListener("mousemove", (event) => {
    if (timerLimit > 0) {
      if (!start) {
        a1 = x0 - cx;
        b1 = y0 - cy;
        c1 = Math.sqrt(a1 * a1 + b1 * b1);
        if (c1 < 17) {
          Timer();
          start = true;
          scoreElement.innerHTML = "0";
        }
      } else {
        error = true;
        for (var i = 0; i < 501; i++) {
          ac = coord[i].x - cx;
          bc = coord[i].y - cy;
          cc = Math.sqrt(ac * ac + bc * bc);
          if (cc < 17) {
            error = false;
            break;
          }
        }
        if (error == true) {
          clearInterval(timerStart);
          restartElement.innerHTML = "press r/click to restart";
          timerLimit = 0;
          drawError(cx, cy);
        }
        if (c < 17) {
          drawLine();
        }
      }
      cx = event.x - rect.left;
      cy = event.y - rect.top;
      a = x1 - cx;
      b = y1 - cy;
      c = Math.sqrt(a * a + b * b);
    }
  });

  function drawError(x1, y1) {
    ctx.beginPath();
    ctx.arc(x1, y1, 15, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FE00FE";
    ctx.closePath();
    ctx.stroke();
  }
  function restart() {
    clearInterval(timerStart);
    x0 = y0 = x1 = y1 = nx0 = ny0 = nx1 = ny1 = undefined;
    timerLimit = 30;
    score = 0;
    coord = [];
    scoreElement.innerHTML = score;
    timerElement.innerHTML = timerLimit;
    restartElement.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    start = false;
    error = false;
    initialize();
  }
  document.addEventListener("keyup", (e) => {
    if (
      e.key === "r" ||
      e.code === "KeyR" ||
      e.which === "82"
    ) {
      restart();
    }
  });
  document.addEventListener("click", () => {
    restart();
  })

  var settingsElement = document.getElementById("settings");

  var cursorElement = document.getElementById("cursor");

  settingsElement.style.left = window.innerWidth / 2 - 300 + "px";
  settingsElement.style.top = window.innerHeight / 2 + 300 + "px";

  cursor = true;

  cursorElement.addEventListener("click", (e) => {
    if (cursor) {
      cursor = false;
      canvas.style.cursor = "initial";
    } else {
      cursor = true;
      canvas.style.cursor = "url(circle.png) 16 16, auto";
    }
  })

  ballElement.addEventListener("click", (e) => {
    if (ball) {
      ball = false;
    } else {
      ball = true;
    }
  })
}, 50);
