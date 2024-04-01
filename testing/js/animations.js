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
var animationSection1 = document.querySelectorAll(".animation-section-1");

////////Section2
var animationSection2 = document.querySelectorAll(".animation-section-2");

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
const section1 = gsap.timeline();
section1
    .from(animationSection1[1], {
        opacity: 0,
        y: 100,
        duration: 1
    })

    .from(animationSection1[2], {
        opacity: 0,
        y: 100,
        duration: 1
    })   

gsap.to(animationSection1[1], {
    scrollTrigger: {
        trigger: animationSection1[0],
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
gsap.from([animationSection2[1], animationSection2[2], animationSection2[3]], {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "top center",
        end: "top",
        scrub: 1,
    },
    opacity: 0,
    x: -33,
    stagger: 0.25
})
    
gsap.from(animationSection2[4], {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "top+=400 center",
        end: "top",
        scrub: 1,
    },
    opacity: 0,
    y: 33
    })

gsap.from(animationSection2[5], {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "+=400px top",
        end: "+=200px",
        scrub: 1,
        markers: true,
    },
    opacity: 0,
    y: -600,
    duration: 0.25
    })

gsap.from(animationSection2[6], {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "+=1200px top",
        end: "+=200px",
        scrub: 1,
        markers: true,
    },
    opacity: 0,
    y: -600,
    duration: 0.25
    })

gsap.from(animationSection2[7], {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "+=2200px top",
        end: "+=200px",
        scrub: 1,
        markers: true,
    },
    opacity: 0,
    y: -600,
    duration: 0.25
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
