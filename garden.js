"use strict";
/* ══════════════ procedural botanicals — shared by every page ══════════════ */
var NS = "http://www.w3.org/2000/svg";
function E(n, a) {
  var e = document.createElementNS(NS, n);
  for (var k in a) e.setAttribute(k, a[k]);
  return e;
}
var GREENS = [
  "#6B7A35",
  "#7C8B41",
  "#8FA04E",
  "#A3B25C",
  "#B8C36E",
  "#57652B",
];
var BLOOMS = [
  "#FBF3DC",
  "#F3E3B8",
  "#E8C97E",
  "#E2A87E",
  "#D98E6B",
  "#C9973F",
];
function pick(a, r) {
  return a[Math.floor(r() * a.length)];
}
function rng(seed) {
  return function () {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

function leafD(len, wid) {
  return (
    "M0 0C" +
    wid +
    " " +
    -len * 0.3 +
    "," +
    wid * 0.75 +
    " " +
    -len * 0.72 +
    ",0 " +
    -len +
    "C" +
    -wid * 0.75 +
    " " +
    -len * 0.72 +
    "," +
    -wid +
    " " +
    -len * 0.3 +
    ",0 0Z"
  );
}

function fern(g, L, color, op, r) {
  var c1x = L * 0.16,
    c1y = -L * 0.5,
    ex = L * 0.06,
    ey = -L;
  g.appendChild(
    E("path", {
      d: "M0 0Q" + c1x + " " + c1y + " " + ex + " " + ey,
      stroke: color,
      fill: "none",
      "stroke-width": Math.max(1, L * 0.016),
      "stroke-linecap": "round",
      opacity: op,
    }),
  );
  var n = Math.round(9 + r() * 4),
    i;
  for (i = 1; i <= n; i++) {
    var t = i / (n + 1),
      mt = 1 - t;
    var x = 2 * mt * t * c1x + t * t * ex,
      y = 2 * mt * t * c1y + t * t * ey;
    var s = L * 0.3 * (1 - t * 0.7);
    [-1, 1].forEach(function (d) {
      g.appendChild(
        E("path", {
          d: leafD(s, s * 0.3),
          fill: color,
          opacity: op,
          transform:
            "translate(" +
            x.toFixed(1) +
            " " +
            y.toFixed(1) +
            ") rotate(" +
            (d * (58 + r() * 16)).toFixed(0) +
            ")",
        }),
      );
    });
  }
}
function vine(g, L, color, op, r) {
  var d =
    "M0 0C" +
    L * 0.4 +
    " " +
    -L * 0.18 +
    "," +
    L * 0.62 +
    " " +
    L * 0.2 +
    "," +
    L +
    " " +
    L * 0.04;
  g.appendChild(
    E("path", {
      d: d,
      stroke: color,
      fill: "none",
      "stroke-width": Math.max(1, L * 0.012),
      "stroke-linecap": "round",
      opacity: op,
    }),
  );
  var n = Math.round(7 + r() * 5),
    i;
  for (i = 1; i <= n; i++) {
    var t = i / (n + 1),
      mt = 1 - t;
    var x =
      3 * mt * mt * t * (L * 0.4) +
      3 * mt * t * t * (L * 0.62) +
      t * t * t * L;
    var y =
      3 * mt * mt * t * (-L * 0.18) +
      3 * mt * t * t * (L * 0.2) +
      t * t * t * (L * 0.04);
    var s = L * 0.12 * (0.6 + r() * 0.7);
    g.appendChild(
      E("path", {
        d: leafD(s, s * 0.42),
        fill: color,
        opacity: op,
        transform:
          "translate(" +
          x.toFixed(1) +
          " " +
          y.toFixed(1) +
          ") rotate(" +
          ((i % 2 ? -1 : 1) * (40 + r() * 60)).toFixed(0) +
          ")",
      }),
    );
  }
}
function bloom(g, R, petals, fill, heart, op) {
  var i;
  for (i = 0; i < petals; i++)
    g.appendChild(
      E("path", {
        d:
          "M0 0C" +
          -R * 0.44 +
          " " +
          -R * 0.34 +
          "," +
          -R * 0.34 +
          " " +
          -R * 0.88 +
          ",0 " +
          -R +
          "C" +
          R * 0.34 +
          " " +
          -R * 0.88 +
          "," +
          R * 0.44 +
          " " +
          -R * 0.34 +
          ",0 0Z",
        fill: fill,
        opacity: op,
        transform: "rotate(" + (i * 360) / petals + ")",
      }),
    );
  g.appendChild(
    E("circle", {
      r: R * 0.18,
      fill: heart,
      opacity: Math.min(1, op + 0.25),
    }),
  );
}
function stalk(g, x, y, h, color, op, r, withBloom) {
  var wrap = E("g", { transform: "translate(" + x + " " + y + ")" });
  g.appendChild(wrap);
  wrap.appendChild(
    E("path", {
      d:
        "M0 0Q" +
        (r() * 16 - 8) +
        " " +
        -h * 0.55 +
        " " +
        (r() * 20 - 10) +
        " " +
        -h,
      stroke: color,
      fill: "none",
      "stroke-width": 1.6,
      "stroke-linecap": "round",
      opacity: op,
    }),
  );
  if (withBloom) {
    var bg = E("g", {
      transform: "translate(" + (r() * 20 - 10) + " " + -h + ")",
    });
    bloom(
      bg,
      10 + r() * 10,
      5 + Math.round(r() * 2),
      pick(BLOOMS, r),
      "#E4C070",
      op,
    );
    wrap.appendChild(bg);
  }
}

/* garden compositions */
function growBorder(svg, W, H, seed, opts) {
  opts = opts || {};
  var r = rng(seed);
  svg.innerHTML = "";
  var base = opts.baseline === undefined ? H : opts.baseline;
  var dir = opts.up === false ? -1 : 1;
  var i,
    n = opts.count || 26;
  for (i = 0; i < n; i++) {
    var x = (i / (n - 1)) * W + (r() * 40 - 20);
    var L = (opts.min || 90) + r() * ((opts.max || 220) - (opts.min || 90));
    var g = E("g", {
      transform:
        "translate(" +
        x.toFixed(0) +
        " " +
        base +
        ") rotate(" +
        (r() * 30 - 15).toFixed(0) +
        ")" +
        (dir < 0 ? " scale(1,-1)" : ""),
    });
    svg.appendChild(g);
    var col = pick(GREENS, r),
      op = (opts.op || 0.9) * (0.55 + r() * 0.45);
    if (r() < 0.62) fern(g, L, col, op, r);
    else vine(g, L * 0.9, col, op, r);
    if (r() < 0.4)
      stalk(g, r() * 30 - 15, 0, L * (0.7 + r() * 0.5), col, op, r, true);
  }
  if (opts.wings !== false) {
    for (i = 0; i < (opts.wings || 3); i++) {
      var wx = r() * W,
        wy = base - (60 + r() * (H * 0.5));
      var u = E("use", {
        href: "#s-" + (r() < 0.6 ? "butterfly" : "bee"),
        x: -30,
        y: -24,
        width: 60,
        height: 48,
        fill: pick(BLOOMS, r),
        opacity: 0.85,
        transform:
          "translate(" +
          wx.toFixed(0) +
          " " +
          wy.toFixed(0) +
          ") scale(" +
          (0.7 + r() * 0.8).toFixed(2) +
          ") rotate(" +
          (r() * 50 - 25).toFixed(0) +
          ")",
      });
      svg.appendChild(u);
    }
  }
}
function growColumn(svg, W, H, seed) {
  var r = rng(seed);
  svg.innerHTML = "";
  var i;
  for (i = 0; i < 16; i++) {
    var y = (i / 15) * H + (r() * 50 - 25),
      x = -10 + r() * W * 0.55;
    var g = E("g", {
      transform:
        "translate(" +
        x.toFixed(0) +
        " " +
        y.toFixed(0) +
        ") rotate(" +
        (r() * 70 - 35).toFixed(0) +
        ")",
    });
    svg.appendChild(g);
    vine(g, 110 + r() * 150, pick(GREENS, r), 0.55 + r() * 0.4, r);
  }
  for (i = 0; i < 9; i++) {
    var bx = r() * W * 0.7,
      by = r() * H,
      bg = E("g", {
        transform: "translate(" + bx.toFixed(0) + " " + by.toFixed(0) + ")",
      });
    bloom(
      bg,
      12 + r() * 16,
      5 + Math.round(r() * 2),
      pick(BLOOMS, r),
      "#E4C070",
      0.7 + r() * 0.3,
    );
    svg.appendChild(bg);
  }
}
function growLineArt(svg, W, H, seed, stroke) {
  var r = rng(seed);
  svg.innerHTML = "";
  var i;
  for (i = 0; i < 9; i++) {
    var g = E("g", {
      transform:
        "translate(" +
        (r() * W).toFixed(0) +
        " " +
        (r() * H).toFixed(0) +
        ") rotate(" +
        (r() * 360).toFixed(0) +
        ")",
      fill: "none",
      stroke: stroke || "#8B9450",
      "stroke-width": 1.1,
    });
    var R = 26 + r() * 30,
      k,
      pt = 5 + Math.round(r() * 3);
    for (k = 0; k < pt; k++)
      g.appendChild(
        E("path", {
          d:
            "M0 0C" +
            -R * 0.44 +
            " " +
            -R * 0.34 +
            "," +
            -R * 0.34 +
            " " +
            -R * 0.88 +
            ",0 " +
            -R +
            "C" +
            R * 0.34 +
            " " +
            -R * 0.88 +
            "," +
            R * 0.44 +
            " " +
            -R * 0.34 +
            ",0 0Z",
          transform: "rotate(" + (k * 360) / pt + ")",
        }),
      );
    g.appendChild(E("circle", { r: R * 0.16 }));
    svg.appendChild(g);
  }
  for (i = 0; i < 6; i++) {
    var vg = E("g", {
      transform:
        "translate(" +
        (r() * W).toFixed(0) +
        " " +
        (r() * H).toFixed(0) +
        ") rotate(" +
        (r() * 360).toFixed(0) +
        ")",
      fill: "none",
      stroke: stroke || "#8B9450",
      "stroke-width": 1.1,
      opacity: 0.8,
    });
    vine(vg, 90 + r() * 90, "none", 1, r);
    vg.querySelectorAll("path").forEach(function (p) {
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", stroke || "#8B9450");
    });
    svg.appendChild(vg);
  }
}

/* ══════════════ helpers ══════════════ */
function $(s) {
  return document.querySelector(s);
}
function $$(s) {
  return Array.prototype.slice.call(document.querySelectorAll(s));
}

/* nav hide on scroll down */
(function () {
  var nav = $("#nav");
  if (!nav) return;
  var last = 0;
  addEventListener(
    "scroll",
    function () {
      var y = scrollY;
      nav.classList.toggle("up", y > last && y > 260);
      last = y;
    },
    { passive: true },
  );
})();

/* drifting petals — only on pages with a hero */
(function () {
  var box = $("#petals");
  if (!box) return;
  var r = rng(303),
    i;
  for (i = 0; i < 16; i++) {
    var s = document.createElement("span");
    s.className = "petal";
    var size = 10 + r() * 16;
    s.style.left = r() * 100 + "%";
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.animationDuration = 13 + r() * 16 + "s";
    s.style.animationDelay = -r() * 26 + "s";
    s.innerHTML =
      '<svg viewBox="-50 -50 100 100" width="' +
      size +
      '" height="' +
      size +
      '"><use href="#s-orchid" fill="' +
      BLOOMS[Math.floor(r() * BLOOMS.length)] +
      '" opacity=".85"/></svg>';
    box.appendChild(s);
  }
})();
