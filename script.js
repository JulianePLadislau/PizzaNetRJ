document.addEventListener('DOMContentLoaded', function () {

    // Cadastro de Usuário
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio do formulário até que a validação seja feita

            // Função para formatar o número de celular automaticamente
            function formatPhoneNumber(input) {
                let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número

                // Verifica se o número possui 11 dígitos
                if (value.length <= 2) {
                    value = value.replace(/^(\d{2})/, '($1)'); // Adiciona parênteses ao DDD
                } else if (value.length <= 6) {
                    value = value.replace(/^(\d{2})(\d{5})/, '($1) $2'); // Adiciona espaço entre DDD e número
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Adiciona o traço após o número
                }

                input.value = value; // Atualiza o campo de input com a formatação
            }

            // Função para validar o número de celular
            function validatePhoneNumber(phone) {
                const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; // Regex para o formato (XX) XXXXX-XXXX
                return phoneRegex.test(phone);
            }

            // Inicializa uma variável para controle de erros
            let formIsValid = true;

            // Validação de Nome Completo
            const name = document.getElementById('name');
            const nameError = document.getElementById('name-error');
            if (name.value.length < 15) {
                nameError.style.visibility = 'visible';
                formIsValid = false;
            } else {
                nameError.style.visibility = 'hidden';
            }

            // Validação de E-mail
            const email = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailRegex.test(email.value)) {
                emailError.style.visibility = 'visible';
                formIsValid = false;
            } else {
                emailError.style.visibility = 'hidden';
            }

            // Validação de Celular
            const phone = document.getElementById('phone');
            const phoneError = document.getElementById('phone-error');
            formatPhoneNumber(phone); // Formata o número de celular enquanto o usuário digita
            if (!validatePhoneNumber(phone.value)) {
                phoneError.style.visibility = 'visible';
                formIsValid = false;
            } else {
                phoneError.style.visibility = 'hidden';
            }

            // Validação de Senha e Confirmar Senha
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            const passwordError = document.getElementById('password-error');
            if (password.value !== confirmPassword.value) {
                passwordError.style.visibility = 'visible';
                formIsValid = false;
            } else {
                passwordError.style.visibility = 'hidden';
            }

            // Mensagem de erro global
            const formError = document.getElementById('form-error');
            if (formIsValid) {
                formError.style.visibility = 'hidden';

                // Salva os dados no localStorage
                localStorage.setItem('userName', name.value);
                localStorage.setItem('userEmail', email.value);
                localStorage.setItem('userPhone', phone.value);
                localStorage.setItem('userPassword', password.value);

                alert('Cadastro realizado com sucesso!');
                window.location.href = 'login.html'; // Redireciona para a página de login
            } else {
                formError.style.visibility = 'visible';
            }
        });
    }

    // Login de Usuário
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio do formulário até que a validação seja feita

            // Obtém os dados digitados pelo usuário no formulário de login
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Obtém os dados salvos no localStorage
            const storedEmail = localStorage.getItem('userEmail');
            const storedPassword = localStorage.getItem('userPassword');

            // Verifica se o e-mail e a senha correspondem aos armazenados no localStorage
            if (email === storedEmail && password === storedPassword) {
                // Se as credenciais estiverem corretas, redireciona para a página pizzaria.html
                alert('Login bem-sucedido!');
                window.location.href = 'index-chatbot.html'; // Altere 'pizzaria.html' para o caminho correto
            } else {
                // Se as credenciais estiverem incorretas, exibe a mensagem de erro
                const errorMessage = document.getElementById('error-message');
                errorMessage.style.display = 'block'; // Exibe a mensagem de erro
            }
        });
    }

  
    // Função para adicionar mensagens ao chatbot
    function addMessage(text, sender) {
        const messages = document.getElementById('chatbot-messages'); // Obtém o container de mensagens do chatbot
        const messageElement = document.createElement('div'); // Cria um novo elemento de mensagem
        messageElement.classList.add('message', sender); // Adiciona a classe 'message' e a classe de 'sender' (bot ou user)
        messageElement.textContent = text; // Define o texto da mensagem
        messages.appendChild(messageElement); // Adiciona a mensagem ao container
        messages.scrollTop = messages.scrollHeight; // Rola para a última mensagem
    }

    window.generateCoupon = function generateCoupon() {
        // Verificar se o usuário já gerou um cupom
        const userCoupon = localStorage.getItem('userCoupon');

        // Se o cupom já foi gerado, mostra uma mensagem e não gera outro
        if (userCoupon) {
            addMessage('Você já gerou um cupom anteriormente. Aproveite-o!', 'bot');
            return;
        }

        // Definindo os tipos de cupons
        const coupons = [
            { type: "Desconto", value: "10%" },
            { type: "Desconto", value: "20%" },
            { type: "Desconto", value: "30%" },
            { type: "Promoção", value: "Pague 1, leve 2" },
            { type: "Brotinho", value: "Grátis" },
            { type: "Refrigerante", value: "Grátis" }
        ];

        // Selecionando um cupom aleatório
        const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)];

        // Gerando o texto do cupom
        let couponText;
        if (randomCoupon.type === "Desconto") {
            couponText = `Cupom de ${randomCoupon.value} de Desconto!`;
        } else {
            couponText = `Cupom: ${randomCoupon.value} ${randomCoupon.type}!`;
        }

        // Exibindo a mensagem com o cupom gerado
        addMessage(`Seu cupom é: ${couponText}`, 'bot');

        // Salvando o cupom gerado no localStorage para o usuário
        localStorage.setItem('userCoupon', couponText);
    };

    function toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.toggle('hidden'); // Alterna a classe 'hidden', ocultando ou mostrando o chatbot
    }
    

    // Exemplo de como chamar a função toggleChatbot
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    if (chatbotToggleButton) {
        chatbotToggleButton.addEventListener('click', toggleChatbot);
    }

});