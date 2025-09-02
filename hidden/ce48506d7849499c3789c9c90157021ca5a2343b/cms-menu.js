const cmsMenuTextBoxButton = document.getElementById("cms-menu-text-paragraph-button");

cmsMenuTextBoxButton.onclick = function() {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', paragraph);
        cms.classList.add('content-hide');
        deselectAll();
    }
};

function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
    }
}