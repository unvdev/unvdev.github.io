//Dynamic Variables
var siteURL = "https://www.uv.vu/";
var dropdownBackgroundColor = "#2D2D3A";
var stripeColor = "#555BBB";
var stripeBorder = "2px solid #4E4E65";
//
window.addEventListener("load", (event) => {

    document.querySelector(".headerIMG").onclick = () => {
        window.location.href = `${siteURL}`;
    };

    var dropdownContent = document.querySelector(".dropdownContent");
    var dropdownBackground = document.querySelector(".dropdownBackground");

    let dropdownStatus = "closed";

    function dropdownToggle() {
        if (dropdownStatus === "closed") {
            document.body.classList.add("sj");
            if (document.querySelector(".nvt")) {
                var navTop = document.querySelector(".nvt");
                var dropdown = document.querySelector(".nvtDropdown");
                navTop.style.zIndex = "999";
                dropdown.classList.add("fa-xmark-large");
            } else if (document.querySelector(".nvr")) {
                var navRight = document.querySelector(".nvr");
                var dropdown = document.querySelector(".nvrDropdown");
                navRight.style.zIndex = "999";
                dropdown.classList.add("fa-xmark-large");
            }
            if (document.querySelector(".stripe")) {
                var stripe = document.querySelector(".stripe");
                stripe.style.background = `${dropdownBackgroundColor}`;
                stripe.style.borderLeft = `${stripeBorder}`;
            }
            dropdownContent.style.display = "block";
            dropdownBackground.style.display = "block";
            setTimeout(function() {
                dropdownStatus = "open";
            }, 100);
        } else {
            if (document.querySelector(".nvt")) {
                var navTop = document.querySelector(".nvt");
                var dropdown = document.querySelector(".nvtDropdown");
                navTop.style.zIndex = null;
                dropdown.classList.remove("fa-xmark-large");
            } else if (document.querySelector(".nvr")) {
                var navRight = document.querySelector(".nvr");
                var dropdown = document.querySelector(".nvrDropdown");
                navRight.style.zIndex = null;
                dropdown.classList.remove("fa-xmark-large");
            }
            if (document.querySelector(".stripe")) {
                var stripe = document.querySelector(".stripe");
                stripe.style.background = null;
                stripe.style.borderLeft = null;
            }
            dropdownContent.style.display = "none";
            dropdownBackground.style.display = "none";
            document.body.classList.remove("sj");
            setTimeout(function() {
                dropdownStatus = "closed";
            }, 100);
        }
    }
    if (document.querySelector(".nvt")) {
        var dropdown = document.querySelector(".nvtDropdown");
        dropdown.addEventListener('click', dropdownToggle);
    } else if (document.querySelector(".nvr")) {
        var dropdown = document.querySelector(".nvrDropdown");
        dropdown.addEventListener('click', dropdownToggle);
    }
    if (document.querySelector(".stripe")) {
        var stripe = document.querySelector(".stripe");
        stripe.addEventListener('click', dropdownToggle);
    };

    if (document.querySelector(".stripe") && document.querySelector(".nvr")) {
        var stripe = document.querySelector(".stripe");
        var dropdown = document.querySelector(".nvrDropdown");
        var mouseEvents = [stripe, dropdown];

        function animateStripe() {
            if (window.innerWidth > 760) {
                for (var i = 0; i < mouseEvents.length; i++) {
                    mouseEvents[i].onmouseover = () => {
                        stripe.style.width = "64px";
                        stripe.style.boxShadow = "-5px 0px 10px 1px rgba(0, 0, 0, 0.25)";
                        dropdown.style.right = "15.5px";
                    }
                    mouseEvents[i].onmouseout = () => {
                        stripe.style.width = null;
                        stripe.style.boxShadow = null;
                        dropdown.style.right = null;
                    }
                }
            } else {
                for (var i = 0; i < mouseEvents.length; i++) {
                    mouseEvents[i].onmouseover = () => {
                        stripe.style.width = null;
                        stripe.style.boxShadow = null;
                        dropdown.style.right = null;
                    }
                    mouseEvents[i].onmouseout = () => {
                        stripe.style.width = null;
                        dropdown.style.right = null;
                    }
                }
            }
        };
        animateStripe();
        window.addEventListener("resize", animateStripe);
    };

});

document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.body.classList.add("sj");
        document.body.style.visibility = "hidden";
        document.querySelector(".loadscreen").style.visibility = "visible";
        var loader = document.querySelectorAll(".circle");
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
            }
            animateLoader();
        };
    } else {
        setTimeout(function() {
            document.querySelector(".loadscreen").style.display = "none";
            document.body.style.visibility = "visible";
            document.body.classList.remove("sj");
        }, 1000);
    }
};