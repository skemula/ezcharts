const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const deviceDisplays = [
    {
        symbol: "BTC-USD",
        price: "$112,450",
        change: "+3.24%",
        dir: "up",
        points:
            "0,96 30,84 60,90 90,54 120,66 150,36 180,48 210,24 240,42 270,12 300,18",
        dotIndex: 0
    },

    {
        symbol: "ETH-USD",
        price: "$4,182",
        change: "+1.87%",
        dir: "up",
        points:
            "0,88 30,92 60,70 90,78 120,58 150,64 180,40 210,50 240,30 270,36 300,20",
        dotIndex: 1
    },

    {
        symbol: "NVDA",
        price: "$189.72",
        change: "-0.85%",
        dir: "down",
        points:
            "0,20 30,34 60,26 90,46 120,40 150,58 180,50 210,66 240,60 270,80 300,74",
        dotIndex: 2
    },

    {
        symbol: "AAPL",
        price: "$231.41",
        change: "+1.42%",
        dir: "up",
        points:
            "0,88 30,80 60,84 90,66 120,70 150,50 180,56 210,34 240,40 270,26 300,18",
        dotIndex: 3
    },

    {
        symbol: "SPX",
        price: "6,342",
        change: "+0.72%",
        dir: "up",
        points:
            "0,82 30,76 60,80 90,60 120,64 150,48 180,52 210,38 240,42 270,26 300,20",
        dotIndex: 4
    }
];


const screenSymbol =
    document.getElementById("screenSymbol");

const screenPrice =
    document.getElementById("screenPrice");

const screenChange =
    document.getElementById("screenChange");

const screenPolyline =
    document.getElementById("screenPolyline");

const screenDots =
    document.getElementById("screenDots");

const dots = screenDots
    ? Array.from(
        screenDots.querySelectorAll(".dot")
    )
    : [];


let cycleIndex = 0;


function setDisplay(display) {
    if (
        !screenSymbol ||
        !screenPrice ||
        !screenChange ||
        !screenPolyline
    ) {
        return;
    }

    screenSymbol.style.opacity = "0";
    screenPrice.style.opacity = "0";

    const delay = reduceMotion ? 0 : 180;

    setTimeout(() => {

        screenSymbol.textContent =
            display.symbol;

        screenPrice.childNodes[0].nodeValue =
            `${display.price} `;

        screenChange.textContent =
            display.change;

        screenChange.classList.toggle(
            "down",
            display.dir === "down"
        );

        screenPolyline.classList.toggle(
            "is-down",
            display.dir === "down"
        );

        screenPolyline.setAttribute(
            "points",
            display.points
        );

        screenSymbol.style.opacity = "1";
        screenPrice.style.opacity = "1";

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === display.dotIndex
            );

        });

    }, delay);
}


function startDeviceCycle() {
    if (!screenSymbol) {
        return;
    }

    setDisplay(deviceDisplays[0]);

    if (reduceMotion) {
        return;
    }

    setInterval(() => {
        cycleIndex =
            (cycleIndex + 1) %
            deviceDisplays.length;

        setDisplay(
            deviceDisplays[cycleIndex]
        );

    }, 4000);
}

startDeviceCycle();
