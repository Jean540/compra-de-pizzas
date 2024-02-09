let cart = [];
let modalQnt = 1;
let modalkey = 0;

const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

//Listagem das Pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = qs(".models .pizza-item").cloneNode(true); // Clonando pizza item e tudo o que esta dentro dele
  //TODO: preencher as informações em pizzaItem

  pizzaItem.setAttribute("data-key", index);

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerText = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerText = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerText = item.description;
  pizzaItem.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault(); //Previnindo (desativando) a ação padão do click no <a/> que é de recarregar a pagina
    let key = event.target.closest(".pizza-item").getAttribute("data-key");
    modalQnt = 1;
    modalkey = key;

    qs(".pizzaWindowArea .pizzaBig img").src = pizzaJson[key].img;
    qs(".pizzaInfo h1").innerText = pizzaJson[key].name;
    qs(".pizzaWindowArea .pizzaInfo--desc").innerText =
      pizzaJson[key].description;
    qs(".pizzaInfo--actualPrice").innerText = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    qs(".pizzaInfo--size.selected").classList.remove("selected");
    qsa(".pizzaInfo--size").forEach((element, i) => {
      if (i == 2) {
        element.classList.add("selected");
      }
      element.querySelector("span").innerText = pizzaJson[key].sizes[i];
    });

    qs(".pizzaInfo--qt").innerText = modalQnt;
    qs(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      qs(".pizzaWindowArea").style.opacity = 1;
    }, 200);
    qs(".pizzaWindowArea").style.display = "flex";
  });

  qs(".pizza-area").append(pizzaItem);
});

//Eventos do Modal:
function closeModdal() {
  qs(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    qs(".pizzaWindowArea").style.display = "none";
  }, 500);
}

qsa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (btt) => {
    btt.addEventListener("click", () => {
      closeModdal();
    });
  }
);

qs(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQnt++;
  qs(".pizzaInfo--qt").innerText = modalQnt;
});

qs(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQnt > 1) {
    modalQnt--;
    qs(".pizzaInfo--qt").innerText = modalQnt;
  }
});

qsa(".pizzaInfo--size").forEach((bttTam) => {
  bttTam.addEventListener("click", () => {
    qs(".pizzaInfo--size.selected").classList.remove("selected");
    bttTam.classList.add("selected");
  });
});

qs(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(qs(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identifier = pizzaJson[modalkey].id + "@" + size;
  let key = cart.findIndex((element) => element.identifier == identifier);

  if (key > -1) cart[key].qnt += modalQnt;
  else {
    cart.push({
      identifier,
      id: pizzaJson[modalkey].id,
      size,
      qnt: modalQnt,
    });
  }
  updateCart();
  closeModdal();
});

qs(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    qs("aside").style.left = "0";
  }
});

qs(".menu-closer").addEventListener("click", () => {
  qs("aside").style.left = "100vw";
});

function updateCart() {
  qs(".menu-openner span").innerText = cart.length;

  if (cart.length > 0) {
    qs("aside").classList.add("show");
    qs(".cart").innerHTML = "";

    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      subTotal += pizzaItem.price * cart[i].qnt;

      let cartItem = document
        .querySelector(".models .cart--item")
        .cloneNode(true);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerText = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerText = cart[i].qnt;
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qnt++;
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qnt > 1) {
            cart[i].qnt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      qs(".cart").append(cartItem);
    }

    desconto = subTotal * 0.1;
    total = subTotal - desconto;

    qs(
      ".cart--totalitem.subtotal span:last-child"
    ).innerText = `R$ ${subTotal.toFixed(2)}`;

    qs(
      ".cart--totalitem.desconto span:last-child"
    ).innerText = `R$ ${desconto.toFixed(2)}`;

    qs(
      ".cart--totalitem.total.big span:last-child"
    ).innerText = `R$ ${total.toFixed(2)}`;
  } else {
    qs("aside").classList.remove("show");
    qs("aside").style.left = "100vw";
  }
}
