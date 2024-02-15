//Website URL
var websiteURL = "https://www.uv.vu/";
//
document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.body.classList.add("scrolljack");
        document.body.style.visibility = "hidden";
        document.querySelector(".loadscreen").style.visibility = "visible";
        var loader = document.querySelectorAll(".loading-circle");
        for (var i = 0; i < loader.length; i++) {
            function animateLoader() {
                setTimeout(function() {
                    loader[0].style.opacity = "1.0";
                }, 250);
                setTimeout(function() {
                    loader[1].style.opacity = "1.0";
                }, 500);
                setTimeout(function() {
                    loader[2].style.opacity = "1.0";
                }, 750);
                setTimeout(function() {
                    loader[0].style.opacity = null;
                    loader[1].style.opacity = null;
                    loader[2].style.opacity = null;
                    if (document.body.style.visibility != "visible") {
                        animateLoader();
                    };
                }, 1000);
            };
            animateLoader();
        };
    } else {
        setTimeout(function() {
            document.querySelector(".loadscreen").style.visibility = "hidden";
            document.body.style.visibility = "visible";
            document.body.classList.remove("scrolljack");
        }, 0);
    };
};

window.addEventListener("load", (event) => {

    document.querySelector(".header-image").onclick = () => {
        window.location.href = `${websiteURL}`;
    };

    document.querySelector(".footer-image").onclick = () => {
        window.location.href = `${websiteURL}`;
    };

    //Navigation Behavior

    var headerNavigation = document.querySelector(".header-navigation");
    var headerNavigationDropdownIcon = document.querySelector(".header-navigation-dropdown-icon");
    var headerNavigationDropdownList = document.querySelector(".header-navigation-dropdown-list");
    var headerNavigationDropdownBackground = document.querySelector(".header-navigation-dropdown-background");
    let headerNavigationDropdownStatus = "closed";
    function dropdownToggle() {
        if (headerNavigationDropdownStatus === "closed") {
            document.body.classList.add("scrolljack");
            headerNavigation.style.zIndex = "999";
            headerNavigation.style.display = "block";
            headerNavigationDropdownIcon.classList.add("fa-xmark-large");
            headerNavigationDropdownList.style.display = "block";
            headerNavigationDropdownBackground.style.display = "block";
            setTimeout(function() {
                headerNavigationDropdownStatus = "open";
            }, 100);
        } else {
            headerNavigation.style.zIndex = null;
            headerNavigation.style.display = "none";
            headerNavigationDropdownIcon.classList.remove("fa-xmark-large");
            headerNavigationDropdownList.style.display = "none";
            headerNavigationDropdownBackground.style.display = "none";
            document.body.classList.remove("scrolljack");
            setTimeout(function() {
                headerNavigationDropdownStatus = "closed";
            }, 100);
        };
    };
    headerNavigationDropdownIcon.addEventListener("click", dropdownToggle);

    //Header Behavior

    var header = document.querySelector("header");
    var headerNavigationDropdownIcon = document.querySelector(".header-navigation-dropdown-icon");
    let lastScroll = 0;
    document.onscroll = function() {
        var scrollvalue = window.scrollY;
        var headerValue = header.getBoundingClientRect();
        if (scrollvalue > lastScroll && scrollvalue > headerValue.height * 3) {
            header.style.visibility = "hidden";
            headerNavigationDropdownIcon.style.visibility = "hidden";
        } else if (scrollvalue < lastScroll) {
            header.style.visibility = "visible";
            headerNavigationDropdownIcon.style.visibility = "visible";
        };
        //Mobile
        lastScroll = scrollvalue <= 0 ? 0 : scrollvalue;
    };

    //Active Navigation Page

    var navigationLinks = document.querySelectorAll(".header-navigation-link > *, .footer-navigation-link > *");
    var currentPage = window.location.pathname.split("/");
    currentPage = currentPage.slice(-1).toString().toLowerCase().replace(/\.[A-Za-z0-9]+/, "");
    currentPage = currentPage.replace(/%[0-9A-Fa-f][0-9A-Fa-f]/, " ");
    currentPage = currentPage.replace(/[^A-Za-z0-9]/g, " ");
    for (var i = 0; i < navigationLinks.length; i++) {
        if (navigationLinks[i].innerHTML.toLowerCase().includes(currentPage)) {
            navigationLinks[i].classList.add("navigation-active");
        };
    };

    //Accordions

    var accordion = document.querySelectorAll(".accordion");
    for (var i = 0; i < accordion.length; i++) {
        accordion[i].onclick = function() {
            if (this.nextElementSibling.getAttribute("class") == "accordion-content") {
                if (this.nextElementSibling.style.display != "block") {
                    this.nextElementSibling.style.display = "block";
                    this.firstElementChild.classList.add("accordion-active");
                } else {
                    this.nextElementSibling.style.display = "none";
                    this.firstElementChild.classList.remove("accordion-active");
                };
            };
        };
    };

    //Animations
    let observer = new IntersectionObserver((entries) => {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting == true) {
                entries[i].target.classList.add("animate");
            };
            if (entries[i].isIntersecting == true &&
                entries[i].target.classList.contains("animate-typewriter") == true &&
                entries[i].target.classList.contains("stop-typewriter") != true) {
                var typewriterElement = entries[i].target;
                var typewriterText = entries[i].target.textContent;;
                var typewriterTextResult = "";
                for (let i = 0; i < typewriterText.length; i++) {
                    setTimeout(function () {
                        typewriterTextResult += typewriterText[i];
                        typewriterElement.innerHTML = typewriterTextResult;
                    }, 100 * i);
                };
                entries[i].target.classList.add("stop-typewriter");
            };
            if (entries[i].isIntersecting != true && entries[i].target.classList.contains("animate-loop") == true) {
                entries[i].target.classList.remove("animate");
            };
        };
    });
    var animations = document.querySelectorAll(".animate-top, .animate-bottom, .animate-left, .animate-right, .animate-fade, .animate-grow, .animate-rotate-left, .animate-rotate-right, .animate-tv, .animate-typewriter");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) != true) {
        for (var i = 0; i < animations.length; i++) {
            observer.observe(animations[i]);
        };
    } else {
        for (var i = 0; i < animations.length; i++) {
            animations[i].classList.add("animate");
        };
    };

    //Custom CSS Styles

    var contentSpacerViewport = document.querySelectorAll(".content-spacer-viewport");
    for (var i = 0; i < contentSpacerViewport.length; i++) {
        contentSpacerViewport[0].style.height = "calc(100vh - 82px)";

    };

    tsParticles.load("isotope-backgrond-1", { "fullScreen": false, "background": { "image": " linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)" }, "particles": { "number": { "value": 10, "density": { "enable": true, "value_area": 600 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } }, "opacity": { "value": 0.25, "random": true, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 9, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": false, "distance": 300, "color": "#ffffff", "opacity": 0, "width": 0 }, "move": { "enable": true, "speed": 1, "random": true, "direction": "top", "straight": true } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false, "mode": "repulse" }, "onClick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 800, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 790, "size": 79, "duration": 2, "opacity": 0.8, "speed": 3 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
});
