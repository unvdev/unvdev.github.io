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

////////Section1
var animationSection1 = document.querySelectorAll(".animation-section-1");

////////Section2
var animationSection2 = document.querySelectorAll(".animation-section-2");

////////Section3
var animationSection3 = document.querySelectorAll(".animation-section-3");

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
for (var i = 0; i < [animationSection2[1], animationSection2[2], animationSection2[3]].length; i++) {
    var animationSection2_customHeight1 = [animationSection2[1], animationSection2[2], animationSection2[3]][i].getBoundingClientRect().height;
};
gsap.from([animationSection2[1], animationSection2[2], animationSection2[3]], {
    scrollTrigger: {
        trigger: [animationSection2[1], animationSection2[2], animationSection2[3]],
        start: `top-=${animationSection2_customHeight1} center`,
        end: `bottom+=${animationSection2_customHeight1} center`,
        scrub: 1,
    },
    opacity: 0,
    x: -66,
    stagger: 0.25
})
    
gsap.from(animationSection2[4], {
    scrollTrigger: {
        trigger: animationSection2[4],
        start: "top center",
        end: "center center",
        scrub: 1,
    },
    opacity: 0,
    y: 66
})

gsap.from([animationSection2[5], animationSection2[6], animationSection2[7]], {
    scrollTrigger: {
        trigger: [animationSection2[5], animationSection2[6], animationSection2[7]],
        start: "top center",
        end: "center center",
        scrub: 1,
    },
    opacity: 0,
    y: 66,
    stagger: 0.25
})

gsap.from(animationSection2[8], {
    scrollTrigger: {
        trigger: animationSection2[8],
        start: "top-=200 center",
        end: "center center",
        scrub: 1,
    },
    opacity: 0,
    scale: 0
})

gsap.to(document.body, {
    scrollTrigger: {
        trigger: animationSection2[0],
        start: "bottom center",
        end: "bottom center",
        scrub: 1,
        markers: true,
    },
    // opacity: 0,
    backgroundColor: "#2E2E2E"
})
});

////Section3
media.add("(min-width: 760px)", () => {
for (var i = 0; i < [animationSection3[1], animationSection3[2], animationSection3[3]].length; i++) {
    var animationSection3_customHeight1 = [animationSection3[1], animationSection3[2], animationSection3[3]][i].getBoundingClientRect().height;
};
gsap.from([animationSection3[1], animationSection3[2], animationSection3[3]], {
    scrollTrigger: {
        trigger: [animationSection3[1], animationSection3[2], animationSection3[3]],
        start: `top-=${animationSection3_customHeight1} center`,
        end: `bottom+=${animationSection3_customHeight1} center`,
        scrub: 1,
    },
    opacity: 0,
    x: 66,
    stagger: 0.25
})
});
