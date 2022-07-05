let quantidadePizzas = 1;
let idPizzas = 0
let carrinho = [];
let valorUnitario = []
const getDom = (elemento) => document.querySelector(elemento);
const getDoms = (elemento) => document.querySelectorAll(elemento);




// LISTAGEM DAS PIZZAS 
pizzaJson.forEach((item, index) => {
    let pizzaItem = getDom('.models .pizza-item').cloneNode(true);
    // Preencher as informações em pizza item

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (element) => {
        element.preventDefault();
        let key = element.target.closest('.pizza-item').getAttribute('data-key')

        quantidadePizzas = 1
        idPizzas = key

        getDom('.pizzaBig img').src = pizzaJson[key].img
        getDom('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        getDom('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        getDom('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`
        getDom('.pizzaInfo--size.selected').classList.remove('selected')
        getDoms('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 0) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]

        });

        getDom('.pizzaInfo--qt').innerHTML = quantidadePizzas;

        getDom('.pizzaWindowArea').style.opacity = 0;
        getDom('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            getDom('.pizzaWindowArea').style.opacity = 1;
        }, 200);


    });


    getDom('.pizza-area').append(pizzaItem)


});

// EVENTOS MODAL



getDoms('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', fecharModal)
})

// Usando para fechar o Modal da escolha das pizzas



function fecharModal() {
    getDom('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        getDom('.pizzaWindowArea').style.display = 'none';
    }, 500);

}
// botão fechar Modal


getDom('.pizzaInfo--qtmenos').addEventListener('click', (e) => {
    if (quantidadePizzas > 1) {
        quantidadePizzas--;
        getDom('.pizzaInfo--qt').innerHTML = quantidadePizzas;
    }
});
getDom('.pizzaInfo--qtmais').addEventListener('click', (e) => {
    quantidadePizzas++;
    getDom('.pizzaInfo--qt').innerHTML = quantidadePizzas;
});

// botões para adicionar e diminuir a quantidade

getDoms('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {

        switch (sizeIndex) {
            case 0:
                getDom('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[sizeIndex].price.toFixed(2)}`
                getDom('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
                break;
            case 1:
                getDom('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[sizeIndex].priceM.toFixed(2)}`
                getDom('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
                break
            default:
                getDom('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[sizeIndex].priceG.toFixed(2)}`
                getDom('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
        }

    });
});

// Modificar qual o  tamanho e o preço escolhido



getDom('.pizzaInfo--addButton').addEventListener('click', () => {


    let tamanho = Number(getDom('.pizzaInfo--size.selected').getAttribute('data-key'));


    let identificador = `${idPizzas} @ ${tamanho}`
    // foi criado um identificador para ficar mais facil somar as pizzas iguais

    let key = carrinho.findIndex((item) => item.identificador == identificador);

    if (key > -1) {
        carrinho[key].quantidade += quantidadePizzas
    } else {
        carrinho.push({
            identificador,
            id: idPizzas,
            tamanho: tamanho,
            quantidade: quantidadePizzas,
            valorUnidade: valorTamanho()

        });
    }

    function valorTamanho() {

        if (tamanho == 0) {
            valorUnitario = pizzaJson[idPizzas].price.toFixed(2);
            return valorUnitario
        } else if (tamanho == 1) {
            valorUnitario = pizzaJson[idPizzas].priceM.toFixed(2);
            return valorUnitario
        } else {
            valorUnitario = pizzaJson[idPizzas].priceG.toFixed(2);
            return valorUnitario
        }
    }
    atualizarCarrinho();
    fecharModal();



});

getDom('.menu-openner').addEventListener('click',()=>{
    if(carrinho.length > 0){
        getDom('aside').style.left = '0'
    }   
})

getDom('.menu-closer').addEventListener('click',()=>{
    if(carrinho.length)
    getDom('aside').style.left = '100vw'
})

function atualizarCarrinho() {
    let unidades = 0
    

    carrinho.forEach((total, index)=>{
        unidades += total.quantidade
    });

 getDom('.menu-openner span').innerHTML = ''
    getDom('.menu-openner span').innerHTML = unidades
    

    if (carrinho.length > 0) {
        getDom('aside').classList.add('show')
        getDom('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in carrinho) {
            let pizzaItem = pizzaJson.find((item) => item.id == carrinho[i].id);
            subtotal += carrinho[i].valorUnidade * carrinho[i].quantidade ;

            

            let carrinhoItem = getDom('.models .cart--item').cloneNode(true);

            switch (carrinho[i].tamanho) {
                case 0:
                    pizzaSizeName = 'P';
                  
                    break;
                case 1:
                    pizzaSizeName = 'M';
                 
                    break;
                case 2:
                    pizzaSizeName = 'G';
                  
                    break;

            }

            carrinhoItem.querySelector('.cart--item img').src = `${pizzaItem.img}`
            carrinhoItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`
            carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade

            carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (carrinho[i].quantidade > 1) {                    
                    carrinho[i].quantidade--;
                    atualizarCarrinho()
                } else{                    
                    carrinho.splice(i, 1)
                    atualizarCarrinho()
                }
                
            });
            carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].quantidade++;
                atualizarCarrinho()
            });



            getDom('.cart').append(carrinhoItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto

        getDom('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        getDom('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        getDom('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        



    } else {
        getDom('aside').classList.remove('show')
        getDom('aside').style.left = '100vw'
    }
}

