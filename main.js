// main.js: logique du panier
const itemsList = document.getElementById('items-list');
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const msgEl = document.getElementById('msg');

const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const addBtn = document.getElementById('add-btn');
const checkoutBtn = document.getElementById('checkout-btn');

const catalog = [];
const cart = [];

function format(price){
  return price.toFixed(2).replace('.',',') + ' €';
}

function renderCatalog(){
  itemsList.innerHTML = '';
  catalog.forEach((p, i)=>{
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<div>
        <div><strong>${escapeHtml(p.name)}</strong></div>
        <div class="small">${format(p.price)}</div>
      </div>
      <div>
        <button class="btn ghost" data-index="${i}">Ajouter au panier</button>
      </div>`;
    itemsList.appendChild(div);
  });
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]))}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((c, idx)=>{
    total += c.price * c.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `<div style="flex:1">
        <div><strong>${escapeHtml(c.name)}</strong></div>
        <div class="small">${format(c.price)}</div>
      </div>
      <div class="qty">
        <button class="icon-btn" data-action="decr" data-idx="${idx}">-</button>
        <div class="small">${c.qty}</div>
        <button class="icon-btn" data-action="incr" data-idx="${idx}">+</button>
        <button class="icon-btn" data-action="remove" data-idx="${idx}" title="Supprimer">✕</button>
      </div>`;
    cartItemsEl.appendChild(li);
  });
  totalEl.textContent = 'Total: ' + (total ? format(total) : '0,00 €');
}

function addToCart(name, price){
  const existing = cart.find(c=>c.name === name && c.price === price);
  if(existing) existing.qty++;
  else cart.push({name, price, qty:1});
  renderCart();
}

addBtn.addEventListener('click', ()=>{
  const name = nameInput.value && nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  msgEl.style.display = 'none';
  if(!name){ showMsg('Entrez un nom de produit valide.'); return }
  if(Number.isNaN(price) || price <= 0){ showMsg('Entrez un prix supérieur à 0.'); return }
  catalog.push({name, price});
  nameInput.value = '';
  priceInput.value = '';
  renderCatalog();
});

itemsList.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const idx = Number(btn.dataset.index);
  if(Number.isFinite(idx)) addToCart(catalog[idx].name, catalog[idx].price);
});

cartItemsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const action = btn.dataset.action; const idx = Number(btn.dataset.idx);
  if(!Number.isFinite(idx)) return;
  if(action === 'incr') cart[idx].qty++;
  else if(action === 'decr'){ cart[idx].qty = Math.max(1, cart[idx].qty-1); }
  else if(action === 'remove') cart.splice(idx,1);
  renderCart();
});

checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0){ showMsg('Votre panier est vide.'); return }
  // simple validation: all qty >=1
  const invalid = cart.some(c=>c.qty < 1);
  if(invalid){ showMsg('Quantités invalides dans le panier.'); return }
  // simulate validation success
  showMsg('Commande validée ✓', true);
  cart.length = 0; renderCart();
});

function showMsg(text, success=false){
  msgEl.style.display = 'block'; msgEl.style.color = success ? '#064e3b' : '#b91c1c'; msgEl.textContent = text;
  if(success) setTimeout(()=>{ msgEl.style.display='none' }, 3500);
}

// Initial render (no demo products)
renderCatalog(); renderCart();
