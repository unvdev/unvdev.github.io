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

    let lastScroll = 0;
    document.onscroll = function() {
        var scrollvalue = window.scrollY;
        if (scrollvalue > lastScroll) {
            header.style.display = "none";
            navigationDropdownIcon.style.display = "none";
        } else if (scrollvalue < lastScroll) {
            header.style.display = "block";
            navigationDropdownIcon.style.display = "block";
        };
        //Mobile
        lastScroll = scrollvalue <= 0 ? 0 : scrollvalue;
    };

    var pages = document.querySelectorAll(".navigation-link > *");
    var currentPage = window.location.pathname.split('/');
    currentPage = currentPage.slice(-1).toString().toLowerCase().replace(/\W+.*/, '');
    for (var i = 0; i < pages.length; i++) {
        if (currentPage.includes(pages[i].innerText.toLowerCase())) {
            pages[i].classList.add("active");
        };
    };

    var accordion = document.querySelectorAll(".accordion");
    for (var i = 0; i < accordion.length; i++) {
        accordion[i].onclick = function() {
            console.log(this.nextElementSibling);
            if (this.nextElementSibling.getAttribute("class") == "accordion-content") {
                if (this.nextElementSibling.style.display != "block") {
                    this.nextElementSibling.style.display = "block";
                } else {
                    this.nextElementSibling.style.display = "none";
                };
            };
        };
    };


});
