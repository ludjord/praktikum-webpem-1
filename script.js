let cart = [];
const cartList = document.getElementById('cart-list');
const totalPriceElement = document.getElementById('total-price');
const confirmBtn = document.getElementById('confirm-btn');
const userInfo = document.getElementById('user-info');
const hiddenCartInput = document.getElementById('hidden-cart-input');
const hiddenTotalInput = document.getElementById('hidden-total-input');
const modal = document.getElementById('successModal');
const orderForm = document.getElementById('orderForm');

// Menambahkan Menu
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.parentElement;
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'));

        cart.push({ name, price });
        renderCart();
        // Scroll otomatis ke ringkasan pesanan agar user sadar item masuk
        if(cart.length === 1) document.getElementById('cart').scrollIntoView({behavior: "smooth"});
    });
});

// Menghapus Item dari Keranjang
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Tampilan Keranjang
function renderCart() {
    cartList.innerHTML = '';
    let total = 0;
    let orderDetailsText = "";

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-text">Belum ada kopi yang dipilih.</p>';
        confirmBtn.disabled = true;
        userInfo.style.display = "none";
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            orderDetailsText += `${item.name} (Rp ${item.price.toLocaleString()}), `;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <strong>Rp ${item.price.toLocaleString()}</strong>
                    <button type="button" onclick="removeItem(${index})" style="color:#e74c3c; border:none; background:none; margin-left:15px; cursor:pointer; font-weight:bold;">Hapus</button>
                </div>
            `;
            cartList.appendChild(div);
        });
        confirmBtn.disabled = false;
        userInfo.style.display = "flex";
    }

    totalPriceElement.innerText = `Rp ${total.toLocaleString()}`;
    hiddenCartInput.value = orderDetailsText;
    hiddenTotalInput.value = `Rp ${total.toLocaleString()}`;
}

// Pengiriman Form & Konfirmasi Berhasil
orderForm.onsubmit = async (e) => {
    e.preventDefault();
    
    // Loading pada tombol
    const originalText = confirmBtn.innerText;
    confirmBtn.innerText = "Memproses Pesanan...";
    confirmBtn.disabled = true;

    const data = new FormData(orderForm);
    
    try {
        const response = await fetch(orderForm.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // JIKA BERHASIL
            modal.style.display = "block";
            cart = [];
            renderCart();
            orderForm.reset();
        } else {
            alert("Terimakasih pesanan telah berhasil,silahkan ke kasir untuk pembayaran dan mengambil pesanan.");
        }
    } catch (error) {
        alert("Gagal mengirim pesanan. Periksa koneksi internet Anda.");
    } finally {
        confirmBtn.innerText = originalText;
    }
};

// Fungsi Tutup Modal
function closeModal() {
    modal.style.display = "none";
}

document.querySelector('.close-btn').onclick = closeModal;

window.onclick = (event) => {
    if (event.target == modal) closeModal();
};