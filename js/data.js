// Data structure for menu items
const menuData = {
    food: {
        appetizers: [],
        mainCourse: [],
        desserts: []
    },
    drinks: {
        softDrinks: [],
        juices: [],
        cocktails: []
    }
};


// Cart data management
class CartData {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.SERVICE_CHARGE_RATE = 0.05; // 5%
        this.VAT_RATE = 0.07; // 7%
    }

    // Get cart items
    getCart() {
        return this.cart;
    }

    // Add item to cart
    addItem(item) {
        this.cart.push(item);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            if (newQuantity < 1) {
                this.removeItem(itemId);
                return;
            }
            this.cart[itemIndex].quantity = newQuantity;
            this.saveCart();
        }
    }

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
    }

    // Update item note
    updateNote(itemId, note) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.cart[itemIndex].note = note;
            this.saveCart();
        }
    }

    // Calculate cart totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const serviceCharge = subtotal * this.SERVICE_CHARGE_RATE;
        const vat = (subtotal + serviceCharge) * this.VAT_RATE;
        const total = subtotal + serviceCharge + vat;

        return {
            subtotal,
            serviceCharge,
            vat,
            total
        };
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Export the CartData class
export default CartData;

// Theme management
const theme = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    },
    
    toggle() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
};

// Cocktail password management
const cocktailAccess = {
    password: 'cocktail2024', // This should be changed in production
    expiryTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    
    checkAccess() {
        const accessData = localStorage.getItem('cocktailAccess');
        if (!accessData) return false;
        
        const { timestamp } = JSON.parse(accessData);
        return Date.now() - timestamp < this.expiryTime;
    },
    
    grantAccess() {
        localStorage.setItem('cocktailAccess', JSON.stringify({
            timestamp: Date.now()
        }));
    },
    
    verifyPassword(inputPassword) {
        return inputPassword === this.password;
    }
};

// Initialize cart count immediately and after DOM loads
updateCartCount();
document.addEventListener('DOMContentLoaded', updateCartCount); 