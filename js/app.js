// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    theme.init();
    
    // Load cart
    cart.loadCart();
    
    // Fetch menu data
    try {
        const success = await fetchMenuData();
        if (success) {
            renderMenuItems();
        } else {
            showError('Failed to load menu items. Please try again later.');
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('An error occurred while loading the application.');
    }
    
    // Event Listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        theme.toggle();
    });
    
    // Language toggle
    document.getElementById('languageToggle').addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'my' : 'en';
        setLanguage(newLang);
        document.getElementById('languageToggle').textContent = newLang.toUpperCase();
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterItems(searchTerm);
        });
    }
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active', 'bg-blue-500', 'text-white'));
            btn.classList.add('active', 'bg-blue-500', 'text-white');
            filterByCategory(btn.textContent.trim());
        });
    });
    
    // Cart modal
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.toggle('hidden');
            }
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cartModal');
        const cocktailPasswordModal = document.getElementById('cocktailPasswordModal');
        
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
        if (e.target === cocktailPasswordModal) {
            cocktailPasswordModal.classList.add('hidden');
        }
    });
    
    // Cart quantity buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = e.target.dataset.id;
            const action = e.target.dataset.action;
            const item = cart.items.find(i => i.id === itemId);
            
            if (item) {
                const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                cart.updateQuantity(itemId, newQuantity);
            }
        }
        
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const itemId = e.target.dataset.id || e.target.closest('.remove-btn').dataset.id;
            cart.removeItem(itemId);
        }
    });
    
    // Cocktail password submission
    const submitPassword = document.getElementById('submitPassword');
    if (submitPassword) {
        submitPassword.addEventListener('click', () => {
            const password = document.getElementById('cocktailPassword').value;
            if (cocktailAccess.verifyPassword(password)) {
                cocktailAccess.grantAccess();
                document.getElementById('cocktailPasswordModal').classList.add('hidden');
                renderMenuItems(); // Refresh to show cocktails
            } else {
                showError('Invalid password');
            }
        });
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Render menu items
function renderMenuItems(items = null) {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;
    
    const itemsToRender = items || getAllItems();
    
    itemsGrid.innerHTML = itemsToRender.map(item => `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden card-hover">
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${item.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-1">${item.description}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-lg font-bold text-gray-800 dark:text-white">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 btn-hover-effect"
                            data-id="${item.id}">
                        ${getText('addToCart')}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.id;
            const item = itemsToRender.find(i => i.id === itemId);
            if (item) {
                cart.addItem(item);
            }
        });
    });
}

// Get all items
function getAllItems() {
    const items = [];
    
    // Add food items
    Object.values(menuData.food).forEach(category => {
        items.push(...category);
    });
    
    // Add drink items
    Object.entries(menuData.drinks).forEach(([category, categoryItems]) => {
        if (category === 'cocktails' && !cocktailAccess.checkAccess()) {
            return; // Skip cocktails if no access
        }
        items.push(...categoryItems);
    });
    
    return items;
}

// Filter items by search term
function filterItems(searchTerm) {
    const allItems = getAllItems();
    const filteredItems = allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    renderMenuItems(filteredItems);
}

// Filter items by category
function filterByCategory(category) {
    let items = [];
    
    switch (category) {
        case 'All':
            items = getAllItems();
            break;
        case 'Food':
            Object.values(menuData.food).forEach(cat => items.push(...cat));
            break;
        case 'Soft Drinks':
            items = menuData.drinks.softDrinks;
            break;
        case 'Juices':
            items = menuData.drinks.juices;
            break;
        case 'Cocktails':
            if (cocktailAccess.checkAccess()) {
                items = menuData.drinks.cocktails;
            } else {
                document.getElementById('cocktailPasswordModal').classList.remove('hidden');
                return;
            }
            break;
    }
    
    renderMenuItems(items);
} 