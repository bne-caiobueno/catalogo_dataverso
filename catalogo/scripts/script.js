conteudo = livros

espaco = document.querySelector("#itens");

let carrinho = localStorage.getItem('carrinho');

if (carrinho) {
    carrinho = JSON.parse(carrinho); 
} else {
    carrinho = []; 
}

function carregar_items(quantidade = 0){
    let ja_carregados = 0;
    if(espaco){
        conteudo.forEach((livro, index) => {
            if(ja_carregados < quantidade || quantidade == 0){
                itemBase = document.querySelector("#item").cloneNode(true)

                itemBase.id = "";
                itemBase.querySelector(".nome").textContent = livro.nome;
                itemBase.querySelector(".valor").textContent = "R$" + livro.valor.toFixed(2);
                itemBase.querySelector("img").src = livro.imagem;
                itemBase.querySelector("a").addEventListener('click',(event) =>{
                    event.stopPropagation();
                    abrir_modal(index)
                });

                itemBase.querySelector("button").addEventListener('click',(event) =>{
                    comprar(index)
                });

                descricao = itemBase.querySelector(".descricao");
                if(descricao){
                    descricao.textContent = livro.descricao;
                }

                espaco.appendChild(itemBase);
                
                ja_carregados++;
            }
        });
    }
}

function excluir_item_carrinho(id){
    carrinho.splice(id,1);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    carregar_carrinho();
}

function alterar_quantidade(id, quantidade){
    carrinho[id].quantidade = quantidade;

    console.log(quantidade)

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    carregar_carrinho();
}

function input_alterar_quantidade(valor, id){
    if(carrinho[id].quantidade <= 1 && valor > 0 || carrinho[id].quantidade > 1){
        carrinho[id].quantidade = parseInt(carrinho[id].quantidade) + valor
    }

    alterar_quantidade(id, carrinho[id].quantidade);
}

function carregar_carrinho(){
    const espaco = document.getElementById("compras")
    espaco.innerHTML = '';

    let valorTotal = 0.0;

    carrinho.forEach((item_carrinho, index) => {
        const livro = conteudo[item_carrinho.id]

        itemBase = document.querySelector("#compra").cloneNode(true)

        itemBase.id = "";
        itemBase.querySelector(".nome").textContent = livro.nome;
        itemBase.querySelector(".valor").textContent = "R$" + livro.valor.toFixed(2);
        itemBase.querySelector("img").src = livro.imagem;
        itemBase.querySelector(".quantidade").value = item_carrinho.quantidade;
        itemBase.querySelector("a").onclick = () => {excluir_item_carrinho(index)};

        itemBase.querySelector(".diminuir_quantidade").onclick = () => {input_alterar_quantidade(-1, index)}
        itemBase.querySelector(".aumentar_quantidade").onclick = () => {input_alterar_quantidade(1, index)}

        itemBase.querySelector(".quantidade").addEventListener('input', (event) => {
            const novaQuantidade = parseInt(event.target.value);

            alterar_quantidade(index, novaQuantidade)
        });

        itemBase.querySelector(".valor_total").textContent = "R$" + (item_carrinho.quantidade * livro.valor).toFixed(2);

        valorTotal += (item_carrinho.quantidade * livro.valor);

        espaco.appendChild(itemBase);
    
    });

    console.log(valorTotal)

    document.getElementById("valor_total").textContent = "R$" + valorTotal.toFixed(2);
}

function limpar(){
    carrinho = [];
    localStorage.clear();
    carregar_carrinho();
}

function fechar_modal(){
    const modal_base = document.querySelector("#modal");
    if(modal_base){
        modal_base.id = "modal_escondido";
    }
}

document.addEventListener('click', (event) => {
    const modal = document.querySelector("#modal");
    const modalConteudo = document.querySelector(".modal-conteudo");

    if (modal) {
        if (modalConteudo && !modalConteudo.contains(event.target)) {
            fechar_modal();
        }
    }
});

function abrir_modal(index){
    const modal_base = document.querySelector("#modal_escondido");

    if(modal_base){
        modal_base.id = "modal";

        const livro = conteudo[index];

        modal_base.querySelector(".nome").textContent = livro.nome;
        modal_base.querySelector(".valor").textContent = "R$" + livro.valor.toFixed(2);
        modal_base.querySelector("img").src = livro.imagem;
        modal_base.querySelector(".descricao").textContent = livro.descricao;

        modal_base.querySelector("button").addEventListener('click',(event) =>{
        comprar(index)
    });
    }
}

function comprar(index){
    const item = {"id":index,"quantidade":1};
    
    const item_encontrado = carrinho.find(objeto => objeto.id === item.id);

    if(item_encontrado){
        item_encontrado.quantidade++;
    }else{
        carrinho.push(item);
    }

    console.log(carrinho)

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}