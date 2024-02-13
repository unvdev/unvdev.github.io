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
            headerNavigationDropdownIcon.classList.add("fa-xmark-large");
            headerNavigationDropdownList.style.display = "block";
            headerNavigationDropdownBackground.style.display = "block";
            setTimeout(function() {
                headerNavigationDropdownStatus = "open";
            }, 100);
        } else {
            headerNavigation.style.zIndex = null;
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
            header.style.display = "none";
            headerNavigationDropdownIcon.style.display = "none";
        } else if (scrollvalue < lastScroll) {
            header.style.display = "block";
            headerNavigationDropdownIcon.style.display = "block";
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
            if (entries[i].isIntersecting == true && entries[i].target.classList.contains("animate-typewriter") == true && entries[i].target.classList.contains("stop-typewriter") != true) {
                console.log(entries[i].target);
                var test = entries[i].target;
                var text = entries[i].target.innerHTML;
                var result = "";
                setTimeout(function() {
                for (let i = 0; i < text.length; i++) {
                        setTimeout(function () {
                            result += text[i];
                            test.innerHTML = result;
                        }, 120 * i);
                    };
                }, 500);
                entries[i].target.classList.add("stop-typewriter");
            };
            if (entries[i].isIntersecting != true && entries[i].target.classList.contains("animate-loop") == true) {
                entries[i].target.classList.remove("animate");
            };
        };
    });
    var animations = document.querySelectorAll(".animate-top, .animate-bottom, .animate-left, .animate-right, .animate-fade, .animate-grow, .animate-rotate-left, .animate-rotate-right, .animate-tv, .animate-typewriter");
    for (var i = 0; i < animations.length; i++) {
        observer.observe(animations[i]);
    };
});
