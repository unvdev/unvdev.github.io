window.onload = () => {
    fade();
}

function fade() {

    var fadeIn = document.querySelectorAll(".fade-in");

    for (var i = 0; i < fadeIn.length; i++) {

        var bottomOfObject = fadeIn[i].offsetTop + window.innerHeight / fadeIn[i].offsetTop;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight || document.documentElement.offsetHeight;
        var bottomOfWindow = scrollTop + windowHeight;

        if (bottomOfWindow > bottomOfObject) {

            fadeIn[i].style.opacity = "1.0";

        }

    };
};

window.addEventListener("scroll", fade);

var more = document.getElementById("more");
var log = document.getElementById("log");
let changeLogCount = 1;

function moreVersions() {
    if (changeLogCount == 1) {

        more.innerHTML = "Show Less"
        log.style.display = "block";

        setTimeout(function() {
            changeLogCount = 0;
        }, 100);

    } else {

        more.innerHTML = "Show More";
        log.style.display = "none";
        setTimeout(function() {
            changeLogCount = 1;
        }, 100);
    }
}

more.addEventListener("click", moreVersions);

var content = document.querySelector(".content");
var downloadButton = document.getElementById("downloadButton");
var qr = document.getElementById("QR");
var clickOff = document.getElementById("click-off");

function download() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = "https://www.icloud.com/shortcuts/7801406a0fb64f3190395b56eaa3e34e";
    } else {
        content.style.opacity = "0.10";
        qr.style.display = "block";
        setTimeout(function(){
            qr.style.opacity = "1.0";
        });
        clickOff.style.display = "block";

        clickOff.onclick = () => {
            content.style.opacity = "1.0";
            setTimeout(function(){
                qr.style.display = "none";
            }, 1500);
            qr.style.opacity = "0.0";
            clickOff.style.display = "none";
        }
    }
}

downloadButton.addEventListener("click", download);