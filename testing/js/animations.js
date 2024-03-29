//GSAP Elements
gsap.registerPlugin(ScrollTrigger);
let media = gsap.matchMedia();

//Document Elements
////Header
var headerNavigationDropdownIcon = document.querySelector(".header-navigation-dropdown-icon");
var navigation = document.querySelector(".header-navigation");
var headerNavigationLinks = document.querySelectorAll('.header-navigation-link');
var headerNavigationBackground = document.querySelector('.header-navigation-dropdown-background');
var headerLinkIcon = document.querySelectorAll('.header-link-icon');
var headerNavigationStatus = "closed";

////Home Page
////////Section1
var animationSection1 = document.querySelector("#animation-section-1");
var mainText = document.querySelector("#main-text");
var downArrow = document.querySelector("#down-arrow");

////////Section2
var animationSection2 = document.querySelector("#animation-section-2");
var section2SkillText = document.querySelectorAll(".section-2-skill-text");
var section2BottomText = document.querySelector("#section-2-bottom-text");

////Footer
var footer = document.querySelector('footer');
var footerContent = document.querySelector('.footer-content');

////Header Icons And Navigation Icon
media.add("(min-width: 760px)", () => {
const headerAnimation = gsap.timeline();
headerAnimation
    .from(headerLinkIcon, {
        opacity: 0,
        x: -33,
        stagger: 0.5
    })
    .from(headerNavigationDropdownIcon, {
        opacity: 0,
        x: 33
    }, '-=1')
});
////Header Navigation
const navigationAnimation = gsap.timeline();
navigationAnimation
    .from(headerNavigationBackground, {
        opacity: 0,
        duration: 0.5
    })
    .from(headerNavigationLinks, {
        opacity: 0,
        stagger: 0.1
    })
headerNavigationDropdownIcon.onclick = function() {
    if (headerNavigationStatus === "closed") {
        console.log("true");
        navigationAnimation.restart();
        setTimeout(function() {
            headerNavigationStatus = "open";
        }, 100);
    } else {
        console.log("false");
        navigationAnimation.reverse();
        setTimeout(function() {
            headerNavigationStatus = "closed";
        }, 100);
    };
};

////Section1
media.add("(min-width: 760px)", () => {
const section1Animations = gsap.timeline();
section1Animations
    .from(mainText, {
        opacity: 0,
        y: 100,
        duration: 1
    })

    .from(downArrow, {
        opacity: 0,
        y: 100,
        duration: 1
    })   

gsap.to(mainText, {
    scrollTrigger: {
        trigger: animationSection1,
        start: "center center",
        end: "bottom top",
        scrub: 1,
    },
    scale: 1.4,
    transformOrigin: "bottom"
});
}); 

////Section2
media.add("(min-width: 760px)", () => {
gsap.from(section2SkillText, {
    scrollTrigger: {
        trigger: animationSection2,
        start: "top center",
        end: "center center",
        scrub: 1,
    },
    opacity: 0,
    x: -33,
    stagger: 0.25
})
    
gsap.from(section2BottomText, {
    scrollTrigger: {
        trigger: animationSection2,
        start: "center center",
        end: "center center",
        scrub: 1,
    },
    opacity: 0,
    y: 33
    })
}); 

////Footer & helpful for bottom content
// gsap.from(footerContent, {
//     opacity: 0,
//     duration: 3,
//     scrollTrigger: {
//         trigger: footer,
//         start: "top bottom",
//         toggleActions: 'play none restart reset',
//     }
// })
