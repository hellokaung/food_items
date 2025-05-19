const translations = {
    en: {
        search: "Search...",
        cart: "Your Cart",
        total: "Total",
        checkout: "Checkout",
        all: "All",
        food: "Food",
        softDrinks: "Soft Drinks",
        juices: "Juices",
        cocktails: "Cocktails",
        addToCart: "Add to Cart",
        enterPassword: "Enter Password",
        submit: "Submit",
        price: "Price",
        quantity: "Quantity",
        remove: "Remove",
        categories: {
            appetizers: "Appetizers",
            mainCourse: "Main Course",
            desserts: "Desserts",
            beverages: "Beverages"
        }
    },
    my: {
        search: "ရှာဖွေရန်...",
        cart: "သင့်စျေးခြင်း",
        total: "စုစုပေါင်း",
        checkout: "ငွေရှင်းရန်",
        all: "အားလုံး",
        food: "အစားအစာ",
        softDrinks: "အအေးများ",
        juices: "ဖျော်ရည်များ",
        cocktails: "ကော့တေးများ",
        addToCart: "စျေးခြင်းထဲထည့်ရန်",
        enterPassword: "စကားဝှက်ထည့်ပါ",
        submit: "အတည်ပြုပါ",
        price: "စျေးနှုန်း",
        quantity: "အရေအတွက်",
        remove: "ဖယ်ရှားရန်",
        categories: {
            appetizers: "အစာစားရန်ပြင်ဆင်ချက်များ",
            mainCourse: "အဓိကဟင်းလျာများ",
            desserts: "အချိုပွဲများ",
            beverages: "သောက်စရာများ"
        }
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateUILanguage();
}

function getText(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        value = value[k];
        if (!value) return key;
    }
    
    return value;
}

function updateUILanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getText(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = getText(key);
    });
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    updateUILanguage();
}); 