
// Pequena demonstração de autenticação do lado do cliente usando localStorage.
// NÃO use esta abordagem para autenticação de produção.

const tabs = { login: document.getElementById('tab-login'), register: document.getElementById('tab-register') };
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageArea = document.getElementById('messageArea');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

function showMessage(text, type = 'success') {
    messageArea.innerHTML = `<div class="message ${type === 'error' ? 'error' : 'success'}">${text}</div>`;
    setTimeout(() => { if (messageArea.firstChild) messageArea.firstChild.style.opacity = '0.9'; }, 10);
}

function showTab(name) {
    if (name === 'login') {
        tabs.login.classList.add('active'); tabs.register.classList.remove('active');
        loginForm.style.display = 'block'; registerForm.style.display = 'none';
    } else {
        tabs.login.classList.remove('active'); tabs.register.classList.add('active');
        loginForm.style.display = 'none'; registerForm.style.display = 'block';
    }
    messageArea.innerHTML = '';
}

tabs.login.addEventListener('click', () => showTab('login'));
tabs.register.addEventListener('click', () => showTab('register'));
toRegister.addEventListener('click', () => showTab('register'));
toLogin.addEventListener('click', () => showTab('login'));

// usuários armazenados como objeto no localStorage sob a chave 'demo_users'
function getUsers() {
    try { return JSON.parse(localStorage.getItem('demo_users') || '{}'); } catch (e) { return {} }
}
function saveUsers(u) { localStorage.setItem('demo_users', JSON.stringify(u)); }

function simpleHash(str) { // NÃO seguro — apenas ofuscação para demonstração
    let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0 } return h.toString(16);
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const pw = document.getElementById('regPassword').value;
    const pw2 = document.getElementById('regPassword2').value;

    if (!name || !email || !pw) return showMessage('Por favor preencha todos os campos.', 'error');
    if (pw.length < 6) return showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
    if (pw !== pw2) return showMessage('As senhas não correspondem.', 'error');
    const users = getUsers();
    if (users[email]) return showMessage('Já existe uma conta com esse e-mail.', 'error');

    users[email] = { name, email, pw: simpleHash(pw), createdAt: new Date().toISOString() };
    saveUsers(users);
    showMessage('Conta criada! Agora você pode fazer login.', 'success');
    registerForm.reset();
    showTab('login');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pw = document.getElementById('loginPassword').value;
    if (!email || !pw) return showMessage('Digite e-mail e senha.', 'error');
    const users = getUsers();
    const user = users[email];
    if (!user) return showMessage('Nenhuma conta encontrada para esse e-mail. Por favor, registre-se.', 'error');
    if (user.pw !== simpleHash(pw)) return showMessage('Senha Incorreta', 'error');

    showMessage('Login feito com sucesso!', 'success');
    // Exemplo de função de redirecionamento — substitua o destino pela sua página real.
    setTimeout(() => {
        redir();
    }, 700);
});

// função de redirecionamento padrão usada após login bem-sucedido
function redir() {
    // mudar para a página real de login, por exemplo, './dashboard.html'
    window.location.href = './index.html';
}

// pequenas melhorias de UX
document.getElementById('forgotLink').addEventListener('click', (e) => { e.preventDefault(); showMessage('Se você esqueceu sua senha, crie uma nova conta ou limpe o armazenamento para esta demonstração.', 'error'); });

// abrir registro se não houver usuários (amigável) — somente no primeiro carregamento
(function openIfNoUsers() { const u = getUsers(); if (Object.keys(u).length === 0) showTab('register'); })();