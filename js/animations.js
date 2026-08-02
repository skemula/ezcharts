const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- scroll reveals ---------- */
const revealTargets = document.querySelectorAll(
    ".section, .card, .step, .market-grid div"
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
    if (!bootLog || !screenContent) return;

    if (reduceMotion) {
        bootLog.classList.add("is-done");
        screenContent.classList.add("is-on");
        return;
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

    setTimeout(() => {
        bootLog.classList.add("is-done");
        screenContent.classList.add("is-on");
    }, totalDelay * 1000);
}

runBootSequence();