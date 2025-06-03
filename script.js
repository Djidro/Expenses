document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const dateInput = document.getElementById('expense-date');
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const addButton = document.getElementById('add-expense-btn');
    const saveButton = document.getElementById('save-expenses-btn');
    const clearButton = document.getElementById('clear-expenses-btn');
    const tempList = document.getElementById('temp-expenses-list');
    const tempTotalDisplay = document.getElementById('temp-total');
    const currentDateDisplay = document.getElementById('current-date-display');
    const summarySection = document.getElementById('expenses-summary');
    const grandTotalDisplay = document.getElementById('grand-total');
    const shareDateSelect = document.getElementById('share-date');
    const whatsappShareBtn = document.getElementById('whatsapp-share-btn');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    currentDateDisplay.textContent = formatDate(today);

    // Temporary expenses array for current session
    let tempExpenses = [];

    // Load saved expenses from localStorage
    let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    renderSummary();
    updateShareDateOptions();

    // Event listeners
    dateInput.addEventListener('change', function() {
        currentDateDisplay.textContent = formatDate(this.value);
    });

    addButton.addEventListener('click', addExpense);
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addExpense();
    });
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addExpense();
    });

    saveButton.addEventListener('click', saveExpenses);
    clearButton.addEventListener('click', clearTempExpenses);
    shareDateSelect.addEventListener('change', updateWhatsappButtonState);
    whatsappShareBtn.addEventListener('click', shareDateViaWhatsApp);

    // Functions (omitted for brevity)
});
