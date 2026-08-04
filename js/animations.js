const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- scroll reveals ---------- */
const revealTargets = document.querySelectorAll(
    ".section, .card, .step, .pill, .timeline-item, .faq-item, .founder-point"
);

if (reduceMotion) {
    revealTargets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
    });
} else {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealTargets.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(36px)";
        el.style.transition = "opacity .8s ease, transform .8s ease";
        observer.observe(el);
    });
}

/* ---------- ticker tape ---------- */
const tickerData = [
    { symbol: "BTC", price: "112,450", change: "+3.24%", dir: "up" },
    { symbol: "ETH", price: "4,182", change: "+1.87%", dir: "up" },
    { symbol: "SOL", price: "231.40", change: "-0.92%", dir: "down" },
    { symbol: "NVDA", price: "189.72", change: "+2.11%", dir: "up" },
    { symbol: "AAPL", price: "241.05", change: "+0.44%", dir: "up" },
    { symbol: "TSLA", price: "312.88", change: "-1.35%", dir: "down" },
    { symbol: "S&P 500", price: "6,318", change: "+0.62%", dir: "up" },
    { symbol: "NASDAQ", price: "21,904", change: "+0.81%", dir: "up" },
    { symbol: "GOLD", price: "2,614", change: "-0.18%", dir: "down" },
    { symbol: "OIL", price: "78.32", change: "+0.55%", dir: "up" },
];

const track = document.getElementById("tickerTrack");

if (track) {
    const renderItems = () =>
        tickerData
            .map(
                (item) =>
                    `<span class="ticker-item ${item.dir}">${item.symbol} <b>${item.price}</b> ${item.change}</span>`
            )
            .join("");

    track.innerHTML = renderItems() + renderItems();

    if (reduceMotion) {
        track.style.animation = "none";
    }
}

/* ---------- device boot sequence ---------- */
const bootLog = document.getElementById("bootLog");
const screenContent = document.getElementById("screenContent");

const bootLines = [
    { text: "&gt; checking wifi\u2026", muted: true },
    { text: "&gt; connected", muted: false },
    { text: "&gt; loading display 1/5", muted: true },
];

function runBootSequence() {
    if (!bootLog || !screenContent) return Promise.resolve();

    if (reduceMotion) {
        bootLog.classList.add("is-done");
        screenContent.classList.add("is-on");
        return Promise.resolve();
    }

    bootLog.innerHTML = "";

    bootLines.forEach((line, i) => {
        const el = document.createElement("div");
        el.className = "line" + (line.muted ? " muted" : "");
        el.innerHTML = line.text;
        el.style.animationDelay = `${i * 0.45 + 0.2}s`;
        bootLog.appendChild(el);
    });

    const totalDelay = bootLines.length * 0.45 + 0.6;

    return new Promise((resolve) => {
        setTimeout(() => {
            bootLog.classList.add("is-done");
            screenContent.classList.add("is-on");
            resolve();
        }, totalDelay * 1000);
    });
}

/* ---------- device display cycling: BTC -> ETH -> NVDA ---------- */
const deviceDisplays = [
    {
        symbol: "BTC-USD",
        price: "$112,450",
        change: "+3.24%",
        dir: "up",
        points: "0,96 30,84 60,90 90,54 120,66 150,36 180,48 210,24 240,42 270,12 300,18",
        dotIndex: 0,
    },
    {
        symbol: "ETH-USD",
        price: "$4,182",
        change: "+1.87%",
        dir: "up",
        points: "0,88 30,92 60,70 90,78 120,58 150,64 180,40 210,50 240,30 270,36 300,20",
        dotIndex: 1,
    },
    {
        symbol: "NVDA",
        price: "$189.72",
        change: "-0.85%",
        dir: "down",
        points: "0,20 30,34 60,26 90,46 120,40 150,58 180,50 210,66 240,60 270,80 300,74",
        dotIndex: 2,
    },
];

const screenSymbol = document.getElementById("screenSymbol");
const screenPrice = document.getElementById("screenPrice");
const screenChange = document.getElementById("screenChange");
const screenPolyline = document.getElementById("screenPolyline");
const screenDots = document.getElementById("screenDots");
const screenFlicker = document.querySelector(".screen-flicker");
const dots = screenDots ? Array.from(screenDots.querySelectorAll(".dot")) : [];

let cycleIndex = 0;

function flicker() {
    if (!screenFlicker || reduceMotion) return;
    screenFlicker.classList.remove("is-flickering");
    // force reflow so the animation can restart
    void screenFlicker.offsetWidth;
    screenFlicker.classList.add("is-flickering");
}

function setDisplay(display) {
    if (!screenSymbol || !screenPrice || !screenChange || !screenPolyline) return;

    screenSymbol.style.opacity = "0";
    screenPrice.style.opacity = "0";

    setTimeout(() => {
        screenSymbol.textContent = display.symbol;
        screenPrice.childNodes[0].nodeValue = `${display.price} `;
        screenChange.textContent = display.change;
        screenChange.classList.toggle("down", display.dir === "down");
        screenPolyline.classList.toggle("is-down", display.dir === "down");

        screenSymbol.style.opacity = "1";
        screenPrice.style.opacity = "1";

        // redraw the chart line
        screenPolyline.setAttribute("points", display.points);
        screenPolyline.classList.remove("is-redrawing");
        void screenPolyline.offsetWidth;
        screenPolyline.classList.add("is-redrawing");

        flicker();

        // move the active dot
        dots.forEach((dot, i) => dot.classList.toggle("active", i === display.dotIndex));
    }, reduceMotion ? 0 : 250);
}

function startDeviceCycle() {
    if (!screenSymbol) return;

    setDisplay(deviceDisplays[0]);

    if (reduceMotion) return;

    setInterval(() => {
        cycleIndex = (cycleIndex + 1) % deviceDisplays.length;
        setDisplay(deviceDisplays[cycleIndex]);
    }, 4500);
}

/* ---------- ambient screen flicker (independent of display changes) ---------- */
function startAmbientFlicker() {
    if (reduceMotion) return;
    setInterval(() => {
        // occasional, irregular flicker for a "live screen" feel
        if (Math.random() < 0.4) flicker();
    }, 3200);
}

runBootSequence().then(() => {
    startDeviceCycle();
    startAmbientFlicker();
});
