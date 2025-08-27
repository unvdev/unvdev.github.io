document.addEventListener('DOMContentLoaded', () => {
    const loc = 'hidden';

    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const alertBox = document.querySelector('[data-id="alert"]');

    function login(secret) {
        const hash = sha1(secret);
        const url = `${loc}/${hash}/cms.html`;

        const request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                const nva = new Date().getTime() + 1000 * 60 * 60;
                window.location = `${url}?nva=${nva}`;
            } else {
                showError();
            }
        };

        request.onerror = function() {
            showError();
        };

        request.send();
    }

    function showError() {
        alertBox.style.display = 'block';
        passwordInput.value = '';
        passwordInput.setAttribute('placeholder', 'Incorrect password');
    }

    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        login(passwordInput.value);
    });
});