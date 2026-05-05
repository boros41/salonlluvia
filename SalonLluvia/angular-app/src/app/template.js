(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        // Spinner
        setTimeout(function () {
            const spinner = document.querySelector("#spinner");

            if (spinner) {
                spinner.classList.remove("show");
            }
        }, 1);

        // Sticky Navbar
        window.addEventListener("scroll", function () {
            const stickyElements = document.querySelectorAll(".sticky-top");

            stickyElements.forEach(function (element) {
                if (window.scrollY > 300) {
                    element.classList.add("shadow-sm");
                    element.style.top = "0px";
                } else {
                    element.classList.remove("shadow-sm");
                    element.style.top = "-150px";
                }
            });
        });

        // Back to top button
        const backToTopButton = document.querySelector(".back-to-top");

        if (backToTopButton) {
            window.addEventListener("scroll", function () {
                if (window.scrollY > 100) {
                    fadeIn(backToTopButton);
                } else {
                    fadeOut(backToTopButton);
                }
            });

            backToTopButton.addEventListener("click", function (event) {
                event.preventDefault();
                animateScrollToTop(1500);
            });
        }

        

        // Bootstrap modal inert fix
        window.addEventListener("hide.bs.modal", function (event) {
            event.target.inert = true;
        });

        window.addEventListener("show.bs.modal", function (event) {
            event.target.inert = false;
        });
    });
})();

function fadeIn(element) {
    element.style.display = "block";
    element.style.opacity = 1;
}

function fadeOut(element) {
    element.style.opacity = 0;

    setTimeout(function () {
        if (element.style.opacity === "0") {
            element.style.display = "none";
        }
    }, 300);
}

function animateScrollToTop(duration) {
    const start = window.scrollY;
    const startTime = performance.now();

    function easeInOutExpo(time) {
        if (time === 0) {
            return 0;
        }

        if (time === 1) {
            return 1;
        }

        if (time < 0.5) {
            return Math.pow(2, 20 * time - 10) / 2;
        }

        return (2 - Math.pow(2, -20 * time + 10)) / 2;
    }

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutExpo(progress);

        window.scrollTo(0, start * (1 - easedProgress));

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}