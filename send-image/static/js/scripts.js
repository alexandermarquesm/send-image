const enviar = document.querySelector('.lb-enviar');
const search = document.querySelector('.lb-search');

const form = document.querySelector('.form');
const file = document.querySelector('input[name="file"]');

const containerEmail = document.querySelector('.container-email');
const emailInput = document.querySelector('input[name="email-input"]');

const emailButton = document.querySelector('.email-button');
const boxExit = document.querySelector('.box-exit');

const aviso = document.querySelector('.aviso');
const avisoEmoji = document.querySelector('.aviso-emoji');
const avisoText = document.querySelector('.aviso-text');
const avisoFechar = document.querySelector('.aviso-fechar')

var email = '';

function emailValid(inputEmail) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputEmail.match(regex)) {
        return true;
    } else {
        return false;
    }
}

avisoFechar.addEventListener('click', function () {
    aviso.classList.remove('notification-anima');
})

// Eventos para interface
enviar.addEventListener('click', function (e) {
    if (file.files.length === 0) {
        search.classList.add('required');
        form.classList.add('required-form');

    } else if (!(file.files[0].type === 'image/png' || file.files[0].type === 'image/jpg' || file.files[0].type === 'image/jpeg')) {
        file.value = '';
        search.classList.add('required');
        form.classList.add('required-form');

    } else if (emailValid(email) === false) {
        search.classList.remove('required');
        form.classList.remove('required-form');
        containerEmail.classList.add('show');

        // Clicar no X para sair
        boxExit.addEventListener("click", function () {
            containerEmail.classList.remove('show');
        });

        // Clicar fora do modal para sair
        containerEmail.addEventListener("click", e => {
            if (e.target.classList[0] == "container-email") {
                containerEmail.classList.remove('show');
                emailInput.style.outline = "none";
            }
        });


        // Clicar no + para adicionar o numero
        emailButton.addEventListener("click", function () {
            if (emailValid(emailInput.value)) {
                emailInput.style.outline = "1px solid green";
                containerEmail.classList.remove('show');
                enviar.classList.add('lb-enviar--ready');
                email = emailInput.value;
            } else {
                emailInput.style.outline = "1px solid red";
            }
        });

    } else {
        makeRequest(emailInput.value, file.files[0]);
        email = '';
        file.value = "";
    }
})

function makeRequest(email, img) {
    const formData = new FormData();
    formData.append("file", img);

    const xml = new XMLHttpRequest()
    formData.append("email", email);

    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status == 200) {
            avisoText.innerHTML = 'Imagem Enviada!';
            avisoEmoji.innerHTML = '😎';

            form.classList.remove('required');
            enviar.classList.remove('lb-enviar--ready');
            toogleAnima();

        }

        if (xml.readyState == 4 && xml.status == 404) {
            avisoText.innerHTML = 'Envie uma imagem!';
            avisoEmoji.innerHTML = '😭';

            form.classList.remove('required');
            enviar.classList.remove('lb-enviar--ready');
            toogleAnima();
        }
    }

    xml.open("POST", '/uploader', true)
    xml.send(formData)
}

function toogleAnima() {
    aviso.classList.add('notification-anima');
    setTimeout(function () {
        aviso.classList.remove('notification-anima');
    }, 5000);
}
