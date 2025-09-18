const oneColumn = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-one">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const twoColumns = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-two">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const threeColumns = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-three">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const fourColumns = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-four">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const fiveColumns = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-five">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const sixColumns = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-six">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const asymmLeftColumn = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-asymm-left">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const asymmRightColumn = `
<div class="building-container building-block" data-name="Building Block: Building Container">
    <div class="building-column-span-asymm-right">
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
        <div class="building-column building-block building-column-content-center" data-name="Building Block: Building Column">
            <div class="placeholder-block"></div>
        </div>
    </div>
</div>
`;

const spacer = `
<div class="building-block spacer" style="padding-top: 10px; padding-bottom: 10px;" data-name="Building Block: Spacer"></div>
`;

const divider = `
<div class="building-block building-block-align-center divider" style="max-width: 75%; padding-top: 2px; padding-bottom: 2px;" data-name="Building Block: Divider"></div>
`;

const headingOne = `
<div class="text-element building-block" data-name="Building Block: Text">
    <h1>Lorem ipsum</h1>
</div>
`;

const headingTwo = `
<div class="text-element building-block" data-name="Building Block: Text">
    <h2>Lorem ipsum</h2>
</div>
`;

const headingThree = `
<div class="text-element building-block" data-name="Building Block: Text">
    <h3>Lorem ipsum</h3>
</div>
`;

const headingFour = `
<div class="text-element building-block" data-name="Building Block: Text">
    <h4>Lorem ipsum</h4>
</div>
`;

const headingFive = `
<div class="text-element building-block" data-name="Building Block: Text">
    <h5>Lorem ipsum</h5>
</div>
`;

const paragraph = `
<div class="text-element building-block" data-name="Building Block: Text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
`;

const unorderedList = `
<div class="text-element building-block" data-name="Building Block: Text">
    <ul>
        <li>Lorem ipsum</li>
        <li>Lorem ipsum</li>
        <li>Lorem ipsum</li>
    </ul>
</div>
`;

const orderedList = `
<div class="text-element building-block" data-name="Building Block: Text">
    <ol>
        <li>Lorem ipsum</li>
        <li>Lorem ipsum</li>
        <li>Lorem ipsum</li>
    </ol>
</div>
`;

const image = `
<div class="image-element building-block" data-name="Building Block: Image">
    <img class="default-image"></img>
</div>
`;

const accordion = `
<div class="accordion-container building-block" data-name="Building Block: Accordion Container">
    <span class="accordion-label text-element building-block" data-name="Building Block: Accordion Title">
        <p>Lorem ipsum</p>
    </span>
    <div class="accordion-content">
        <div class="text-element building-block" data-name="Building Block: Text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    </div>
</div>
`;

// const placeHolderInitial = `
// <div class="building-container building-block">
//     <div class="building-column-span-1">
//         <div class="building-column building-block building-column-content-center">
//             <div class="placeholder-block"></div>
//         </div>
//     </div>
// </div>
// `;

// const placeHolder = `
// <div class="placeholder-block"></div>
// `;