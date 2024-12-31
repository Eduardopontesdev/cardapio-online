const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkOutBtn = document.getElementById("checkout-btn");
const closeModelBtn = document.getElementById("close-model-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");
const horaAbertura = 8; //hora de abrir a empresa
const horaFechamento = 22; //hora de fechar a empresa
const foneCliente = "5588996328842";
const taxaEntrega = 3;

let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//fechar o modal ao clicar no botao fechar
closeModelBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  const isOpen = checkRestaurantOpen();
  if (isOpen) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
      const name = parentButton.getAttribute("data-name");
      const price = parseFloat(parentButton.getAttribute("data-price"));

      //adicinar no carrinho
      addToCart(name, price);
    }
    return;
  }

  //restaurant fechado
  alertaRestauranteFechado();
  return;
});

//funcao para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //se o item ja existir apenas aumenta a quantidade + 1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  alertaAddItem();
  updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    const cartItemTotal = item.price * item.quantity;
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium"> -- ${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$${item.price.toFixed(2)} x ${
      item.quantity
    } = ${cartItemTotal.toFixed(2)}</p>
                </div>
                <div>
                    <button class="hover:bg-red-500 hover:text-white rounded-md px-2 py-1 remove-from-cart-btn" data-name="${
                      item.name
                    }">
                        Remover
                    </button>
                </div>
            </div>
        `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});
function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      alertaRemoveItem();
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    alertaRemoveItem();
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue.value !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

//finalizar pedido
checkOutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();

  if (!isOpen) {
    alertaRestauranteFechado();
    return;
  }
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //enviar o pedido para a api do whatsapp
  const cartItems = cart
    .map((item) => {
      const totalPorItem = item.quantity * item.price;
      return `   ${item.name} 
      Quantidade: (${item.quantity}) 
      Preço: R$${item.price.toFixed(2)} x *${item.quantity}* = *R$${totalPorItem.toFixed(2)}* |

    `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const fone = foneCliente;
  const endereco = addressInput.value;
  const nomeCliente = "Cliente teste"

  window.open(
    `https://wa.me/${fone}?text=Pedido feito no site:${message} Cliente: ${nomeCliente} Taxa de Entrega:R$${taxaEntrega.toFixed(2)} Endereço:${endereco}`,
    "_blank"
  );

  cart = [];
  addressInput.value = "";
  updateCartModal();

  //fim do envio do pedido ao whatsapp
});

//verificar a hora e manipular o card de horario
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= horaAbertura && hora < horaFechamento; //retorna true se for dentro desse horaio
}

const isOpen = checkRestaurantOpen();
if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

function alertaAddItem() {
  Toastify({
    text: "Item adicionado ao carrinho!",
    duration: 1000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#008000",
      color: "#ffffff",
    },
  }).showToast();
}

function alertaRemoveItem() {
  Toastify({
    text: "Item removido ao carrinho!",
    duration: 1000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#ef4444",
      color: "#ffffff",
    },
  }).showToast();
}

function alertaRestauranteFechado() {
  Toastify({
    text: "Fechado no momento!",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#ef4444",
      color: "#ffffff",
    },
  }).showToast();
}
