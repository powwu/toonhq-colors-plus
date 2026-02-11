// ==UserScript==
// @name         ToonHQ Colors Plus
// @version      1.3
// @description  Recolor ToonHQ gag/suit bubbles to better represent toon status
// @match        https://toonhq.org/groups/*
// @grant        none
// @homepageURL  https://github.com/powwu/toonhq-colors-plus
// ==/UserScript==

(function () {
    "use strict";

    const PASS_CRITERIA = [
        "High Dive",
        "Railroad",
        "Presentation",
        "Opera Singer",
        "Wedding Cake",
        "Geyser",
        "Toontanic",
        "Mr. Hollywood",
        "Robber Baron",
        "Big Wig",
        "Big Cheese",
        "v2.0"
    ];

    function isLevel7GagOrHighSuit(text) {
        if (!text) return false;

        const lower = text.toLowerCase();

        // True if the gag name contains ANY passing keyword
        return PASS_CRITERIA.some(keyword =>
            lower.includes(keyword.toLowerCase())
        );
    }

    function isOrganic(text) {
        if (!text) return false;

        const lower = text.toLowerCase();

        if (lower.includes("organic")) {
            return true;
        }

        return false;
    }

    function applyHighlighting() {
        const gagDivs = document.querySelectorAll("div.toon__track");

        gagDivs.forEach(div => {
            const img = div.querySelector("img");
            if (!img) return;

            const gagText =
                  img.getAttribute("title") ||
                  img.getAttribute("data-original-title") ||
                  img.getAttribute("alt") ||
                  "";

            if (!isLevel7GagOrHighSuit(gagText)) {
                // Fail = Red
                div.style.background = "rgba(255, 67, 53, 1)";
            } else {
                // Pass = Green
                div.style.background = "rgba(52, 168, 83, 1)";
            }

            // Set shadow to match background if organic
            if (isOrganic(gagText)) {
                div.style.boxShadow = div.style.background + "0px 0px 5px 5px";
            }
        });
    }

    // Run once at page load
    applyHighlighting();

    // Re-run when ToonHQ dynamically updates page content
    const observer = new MutationObserver(applyHighlighting);
    observer.observe(document.body, { childList: true, subtree: true });
})();
