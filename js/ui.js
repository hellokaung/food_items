// UI Management
class CartUI {
    constructor() {
        this.cartItems = document.getElementById('cartItems');
        this.subtotalElement = document.getElementById('subtotal');
        this.serviceChargeElement = document.getElementById('serviceCharge');
        this.vatElement = document.getElementById('vat');
        this.totalElement = document.getElementById('total');
        this.cartCountElement = document.getElementById('cartCount');
        this.emptyCartElement = document.getElementById('emptyCart');
    }

    // Update cart items display
    updateCartItems(cart) {
        if (cart.length === 0) {
            this.cartItems.innerHTML = '';
            this.emptyCartElement.classList.remove('hidden');
            return;
        }

        this.emptyCartElement.classList.add('hidden');
        this.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                    <div>
                        <h3 class="font-semibold">${item.name}</h3>
                        <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                        ${item.note ? `<p class="text-sm text-gray-500 mt-1"><i class="fas fa-sticky-note mr-1"></i>${item.note}</p>` : ''}
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button onclick="cartController.updateQuantity('${item.id}', ${(item.quantity || 1) - 1})" class="quantity-btn">-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="cartController.updateQuantity('${item.id}', ${(item.quantity || 1) + 1})" class="quantity-btn">+</button>
                    </div>
                    <button onclick="cartController.showNoteDialog('${item.id}')" class="text-gray-600 hover:text-indigo-600">
                        <i class="fas fa-sticky-note"></i>
                    </button>
                    <button onclick="cartController.showDeleteDialog('${item.id}')" class="text-red-600 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Update order summary
    updateOrderSummary(totals) {
        this.subtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`;
        this.serviceChargeElement.textContent = `$${totals.serviceCharge.toFixed(2)}`;
        this.vatElement.textContent = `$${totals.vat.toFixed(2)}`;
        this.totalElement.textContent = `$${totals.total.toFixed(2)}`;
    }

    // Update cart count
    updateCartCount(count) {
        this.cartCountElement.textContent = count;
    }

    // Show note dialog
    showNoteDialog(note = '') {
        const noteInput = document.getElementById('noteInput');
        noteInput.value = note;
        document.getElementById('noteDialog').classList.add('show');
    }

    // Hide note dialog
    hideNoteDialog() {
        document.getElementById('noteDialog').classList.remove('show');
    }

    // Show delete dialog
    showDeleteDialog() {
        document.getElementById('deleteDialog').classList.add('show');
    }

    // Hide delete dialog
    hideDeleteDialog() {
        document.getElementById('deleteDialog').classList.remove('show');
    }

    // Get note input value
    getNoteInput() {
        return document.getElementById('noteInput').value.trim();
    }

    // Clear note input
    clearNoteInput() {
        document.getElementById('noteInput').value = '';
    }
}

// Export the CartUI class
export default CartUI; 