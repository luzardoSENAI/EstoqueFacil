item = document.querySelectorAll(".item")
function link() {
    item.forEach((secao) =>
        secao.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

item.forEach((secao) =>
    secao.addEventListener('click', link)
)

abrir = document.querySelector('#abrir')
menulado = document.querySelector('.menu')
abrir.addEventListener('click', function () {
    menulado.classList.toggle('expandir')
})