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
        }, 1000);
    };
};

window.addEventListener("load", (event) => {

    document.querySelector(".header-image").onclick = () => {
        window.location.href = `${websiteURL}`;
    };

    document.querySelector(".footer-image").onclick = () => {
        window.location.href = `${websiteURL}`;
    };

    var header = document.querySelector("header");
    var navigation = document.querySelector(".navigation");
    var navigationDropdownIcon = document.querySelector(".navigation-dropdown-icon");
    var navigationDropdownList = document.querySelector(".navigation-dropdown-list");
    var navigationDropdownBackground = document.querySelector(".navigation-dropdown-background");

    //Navigation Behavior

    let navigationDropdownStatus = "closed";

    function dropdownToggle() {
        if (navigationDropdownStatus === "closed") {
            document.body.classList.add("scrolljack");
            navigation.style.zIndex = "999";
            navigationDropdownIcon.classList.add("fa-xmark-large");
            navigationDropdownList.style.display = "block";
            navigationDropdownBackground.style.display = "block";
            setTimeout(function() {
                navigationDropdownStatus = "open";
            }, 100);
        } else {
            navigation.style.zIndex = null;
            navigationDropdownIcon.classList.remove("fa-xmark-large");
            navigationDropdownList.style.display = "none";
            navigationDropdownBackground.style.display = "none";
            document.body.classList.remove("scrolljack");
            setTimeout(function() {
                navigationDropdownStatus = "closed";
            }, 100);
        };
    };
    navigationDropdownIcon.addEventListener('click', dropdownToggle);

    //Header Behavior

    let lastScroll = 0;
    document.onscroll = function() {
        var scrollvalue = window.scrollY;
        var headerValue = header.getBoundingClientRect();
        if (scrollvalue > lastScroll && scrollvalue > headerValue.height * 3) {
            header.style.display = "none";
            navigationDropdownIcon.style.display = "none";
        } else if (scrollvalue < lastScroll) {
            header.style.display = "block";
            navigationDropdownIcon.style.display = "block";
        };
        //Mobile
        lastScroll = scrollvalue <= 0 ? 0 : scrollvalue;
    };

    //Active Navigation Page

    var pages = document.querySelectorAll(".navigation-link > *");
    var currentPage = window.location.pathname.split('/');
    currentPage = currentPage.slice(-1).toString().toLowerCase().replace(/\W+.*/, '');
    for (var i = 0; i < pages.length; i++) {
        if (currentPage.includes(pages[i].innerText.toLowerCase())) {
            pages[i].classList.add("navigation-active");
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

    // Beta Parallax Movements

    // var mainImage = document.querySelector(".image-style-3");
    // document.onscroll = function() {
    //     let value = window.scrollY;
    //     mainImage.style.top = value / 3 + "px";
    // };

    //Fluid Animations

    (function () {
        let observer = new IntersectionObserver((entries) => {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add("animate");
                } else {
                    entries[i].target.classList.remove("animate");
                };
            };
        });
        var hiddenElements = document.querySelectorAll(".animate-top, .animate-bottom, .animate-left, .animate-right, .animate-fade");
        for (var i = 0; i < hiddenElements.length; i++) {
            observer.observe(hiddenElements[i]);
        };
    })();

    //Smooth Scrolling

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) != true ) {
    (function () {
        const body = document.body;
        const smoothScrollingContainer = document.querySelector('.smooth-scrolling');
        window.addEventListener("resize", function() {
            setTimeout(function() {
                body.style.height = smoothScrollingContainer.clientHeight + 'px';
            }, 1250);
        });
        body.style.height = smoothScrollingContainer.clientHeight + 'px';
        let sx = 0;
        let sy = 0;
        let dx = sx;
        let dy = sy;
        window.addEventListener("scroll", function() {
            sx = window.pageXOffset;
            sy = window.pageYOffset;
        });
        window.requestAnimationFrame(render);

        function render() {
            dx = lerp(dx, sx, 0.1);
            dy = lerp(dy, sy, 0.1);
            dx = Math.floor(dx * 100) / 100;
            dy = Math.floor(dy * 100) / 100;
            smoothScrollingContainer.style.transform = `translate(-${dx}px, -${dy}px)`;
            window.requestAnimationFrame(render);
        };

        function lerp(a, b, n) {
            return (1 - n) * a + n * b;
        };

        //Custom Smooth Scrolling Functions
        
        customFooterAccordion = document.querySelector("#custom-footer-accordion");
        customFooterAccordion.addEventListener("click", function() {
            body.style.height = smoothScrollingContainer.clientHeight + 'px';
        });
    })();

    } else {
        document.querySelector('.smooth-scrolling').classList.remove("smooth-scrolling");
    };
});
