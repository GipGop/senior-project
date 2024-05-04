var m1 = []
var m2 = []
var m3 = []
var m4 = []
var dateTime = []
var datesArray = []
var moon1eq, moon2eq, moon3eq, moon4eq
var frameNum = 0
var hoursBetween = 473360
var hoursSince2k24 = 0
var timeAheadValue
var calcPressed = false
setInterval(repeat, 10);

function repeat() {
  if (calcPressed) {
    calculate();
  }
}

function selectMoon(moonNum) {
  if (moonNum == 1) {
    document.getElementById("moonSelector1").style.backgroundColor = "#ff0000";
    document.getElementById("moonSelector2").style.backgroundColor = "#004400";
    document.getElementById("moonSelector3").style.backgroundColor = "#444400";
    document.getElementById("moonSelector4").style.backgroundColor = "#000044";
    document.getElementById("slider1").style.zIndex = "1";
    document.getElementById("slider2").style.zIndex = "0";
    document.getElementById("slider3").style.zIndex = "0";
    document.getElementById("slider4").style.zIndex = "0";
  } else if (moonNum == 2) {
    document.getElementById("moonSelector1").style.backgroundColor = "#440000";
    document.getElementById("moonSelector2").style.backgroundColor = "#00ff00";
    document.getElementById("moonSelector3").style.backgroundColor = "#444400";
    document.getElementById("moonSelector4").style.backgroundColor = "#000044";
    document.getElementById("slider1").style.zIndex = "0";
    document.getElementById("slider2").style.zIndex = "1";
    document.getElementById("slider3").style.zIndex = "0";
    document.getElementById("slider4").style.zIndex = "0";
  } else if (moonNum == 3) {
    document.getElementById("moonSelector1").style.backgroundColor = "#440000";
    document.getElementById("moonSelector2").style.backgroundColor = "#004400";
    document.getElementById("moonSelector3").style.backgroundColor = "#ffff00";
    document.getElementById("moonSelector4").style.backgroundColor = "#000044";
    document.getElementById("slider1").style.zIndex = "0";
    document.getElementById("slider2").style.zIndex = "0";
    document.getElementById("slider3").style.zIndex = "1";
    document.getElementById("slider4").style.zIndex = "0";
  } else if (moonNum == 4) {
    document.getElementById("moonSelector1").style.backgroundColor = "#440000";
    document.getElementById("moonSelector2").style.backgroundColor = "#004400";
    document.getElementById("moonSelector3").style.backgroundColor = "#444400";
    document.getElementById("moonSelector4").style.backgroundColor = "#0000ff";
    document.getElementById("slider1").style.zIndex = "0";
    document.getElementById("slider2").style.zIndex = "0";
    document.getElementById("slider3").style.zIndex = "0";
    document.getElementById("slider4").style.zIndex = "1";
  }
}

function saveFrame() {
  timeSince2k24 = (Date.parse(document.getElementById("dateTimeInput").value) / 3600000) - hoursBetween
  if (isNaN(Date.parse(document.getElementById("dateTimeInput").value))) {
    alert("Invalid Time")
    return
  }
  m1.push(parseInt(document.getElementById("slider1").value));
  m2.push(parseInt(document.getElementById("slider2").value));
  m3.push(parseInt(document.getElementById("slider3").value));
  m4.push(parseInt(document.getElementById("slider4").value));
  dateTime.push(timeSince2k24);
  datesArray.push(m1, m2, m3, m4, dateTime);
  
  var span = document.createElement("span");
  span.id = "frameNum" + frameNum;
  framesList.innerHTML += '<br>';
  framesList.appendChild(span);
  framesList.appendChild
  span.innerHTML = m1[frameNum] + ", " + m2[frameNum] + ", " + m3[frameNum] + ", " + m4[frameNum] + ", " + (Math.round(dateTime[frameNum] * 100) / 100);
  frameNum++
}

function reset() {
  m1 = []
  m2 = []
  m3 = []
  m4 = []
  dateTime = []
  datesArray = []
  frameNum = 0
  framesList.innerHTML = "<h2 id='framesText'>Frames</h2>";
  calcPressed = false
}

// 42.456
// 85.224
// 171.72
// 400.536
freqio = (2 * Math.PI) / 42.456

function calculate() {
  calcPressed = true
  // moon1eq = regression.sinusoidal(
  //   [ 0,  1,  2,  3],
  //   [+1, -1, +1, -1]
  // );
  moon1eq = regression.sinusoidal(
    datesArray[4],
    datesArray[0],
    freqio
  );
  moon2eq = regression.sinusoidal(
    datesArray[4],
    datesArray[1],
    85.224
  );
  moon3eq = regression.sinusoidal(
    datesArray[4],
    datesArray[2],
    171.72
  );
  moon4eq = regression.sinusoidal(
    datesArray[4],
    datesArray[3],
    400.536
  );

  //That is, the function returns the constant, amplitude, phase, and frequency of the model, respectively.
  timeAheadValue = parseInt(timeAhead.value) + timeSince2k24
  document.getElementById("slider1").value = moon1eq[0] + moon1eq[1] * Math.sin(timeAheadValue * moon1eq[3] + moon1eq[2])
  
  // document.getElementById("slider1").value = 1
}

//Dark Sky App Sinusoidal Regression Function
(function() {
  "use strict";
  var linear, sinusoidal, regression;

  linear = (function() {
    var solve;

    /* Solve Ax=B for x. A should be an NxN square matrix, B should be an Nx1
     * column vector. */
    /* FIXME: This is solved using Cramer's rule naively, which is (hideously)
     * inefficient and exhibits numerical stability issues. This solver should
     * be replaced with, for example, something like this:
     * http://web.eecs.utk.edu/~itamar/Papers/JDA2011.pdf */
    solve = (function() {
      var determinant;

      determinant = function(a, n) {
        var b, d, i, j, m, s, x, y;

        switch(n >>> 0) {
          case 0:
            return NaN;

          case 1:
            return 1.0 / a[0];

          case 2:
            return a[0] * a[3] - a[1] * a[2];

          default:
            d = 0.0;

            m = n - 1;
            b = new Array(m * m);
            s = 1.0;

            for(i = 0; i < n; i++) {
              j = 0;

              for(y = 1; y < n; y++) {
                for(x = 0; x < n; x++) {
                  if(x === i) {
                    continue;
                  }

                  b[j++] = a[x + y * n];
                }
              }

              d += s * a[i] * determinant(b, m);
              s = -s;
            }

            return d;
        }
      };

      return function(a, b) {
        var d, i, j, n, t, x;

        n = b.length;
        d = determinant(a, n);
        x = new Array(n);
        t = new Array(n);

        for(i = n; i--; ) {
          for(j = n; j--; ) {
            t[j] = a[i + j * n];
            a[i + j * n] = b[j];
          }

          x[i] = determinant(a, n) / d;

          for(j = n; j--; ) {
            a[i + j * n] = t[j];
          }
        }

        return x;
      };
    })();

    return function(x, y, m) {
      var a, b, c, i, j, k, n;

      n = y.length;

      i = m * m;
      a = new Array(i);
      while(i--) {
        a[i] = 0.0;
      }

      i = m;
      b = new Array(i);
      while(i--) {
        b[i] = 0.0;
      }

      for(i = n; i--; ) {
        for(j = m; j--; ) {
          for(k = m; k--; ) {
            a[k + j * m] += x[k + i * m] * x[j + i * m];
          }

          b[j] += x[j + i * m] * y[i];
        }
      }

      return solve(a, b);
    };
  })();

  sinusoidal = function(x, y, frequency, phase) {
    var a, b, i, fit, u;

    frequency = +frequency;
    phase     = +phase;

    if(isFinite(phase)) {
      u = new Array(x.length * 2);

      for(i = x.length; i--; ) {
        u[i * 2 + 0] = 1.0;
        u[i * 2 + 1] = Math.sin(x[i] * frequency + phase);
      }

      fit = linear(u, y, 2);
      fit.push(phase, frequency);
    }

    else {
      u = new Array(x.length * 3);

      for(i = x.length; i--; ) {
        u[i * 3 + 0] = 1.0;
        u[i * 3 + 1] = Math.sin(x[i] * frequency);
        u[i * 3 + 2] = Math.cos(x[i] * frequency);
      }

      fit = linear(u, y, 3);
      fit.push(frequency);

      a = fit[1];
      b = fit[2];
      fit[1] = Math.sqrt(a * a + b * b);
      fit[2] = Math.atan2(b, a);
    }

    return fit;
  };

  if(typeof exports !== "undefined") {
    regression = exports;
  }

  else {
    regression = {};
    window.regression = regression;
  }

  regression.linear     = linear;
  regression.sinusoidal = sinusoidal;
})();