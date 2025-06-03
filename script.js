document.addEventListener('DOMContentLoaded', function() {
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const addBtn = document.getElementById('add-btn');
    const expensesList = document.getElementById('expenses');
    const totalAmountElement = document.getElementById('total-amount');
    const shareBtn = document.getElementById('share-btn');
    const shareGeneralBtn = document.getElementById('share-general-btn');
    
    let expenses = [];
    let total = 0;
    
    // Load expenses from localStorage if available
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
        updateUI();
    }
    
    addBtn.addEventListener('click', addExpense);
    
    // Allow adding expense by pressing Enter
    expenseAmountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addExpense();
        }
    });
    
    function addExpense() {
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);
        
        if (name === '' || isNaN(amount) || amount <= 0) {
            alert('Please enter valid expense name and amount');
            return;
        }
        
        const expense = {
            name,
            amount
        };
        
        expenses.push(expense);
        saveToLocalStorage();
        updateUI();
        
        // Clear inputs
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseNameInput.focus();
    }
    
    function updateUI() {
        // Clear the list
        expensesList.innerHTML = '';
        
        // Calculate total and update list
        total = 0;
        expenses.forEach((expense, index) => {
            total += expense.amount;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.name}</span>
                <span>RWF ${expense.amount.toLocaleString()}</span>
            `;
            expensesList.appendChild(li);
        });
        
        // Update total
        totalAmountElement.textContent = `RWF ${total.toLocaleString()}`;
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    function resetTracker() {
        expenses = [];
        total = 0;
        localStorage.removeItem('expenses');
        updateUI();
    }
    
    shareBtn.addEventListener('click', function() {
        shareToWhatsApp('+96878440900');
    });
    
    shareGeneralBtn.addEventListener('click', function() {
        shareToWhatsApp();
    });
    
    function shareToWhatsApp(specificNumber = '') {
        if (expenses.length === 0) {
            alert('No expenses to share');
            return;
        }
        
        let message = '📊 My Expenses (RWF):\n\n';
        
        expenses.forEach(expense => {
            message += `- ${expense.name}: RWF ${expense.amount.toLocaleString()}\n`;
        });
        
        message += `\n💰 Total: RWF ${total.toLocaleString()}`;
        
        const encodedMessage = encodeURIComponent(message);
        let whatsappUrl;
        
        if (specificNumber) {
            whatsappUrl = `https://wa.me/${specificNumber}?text=${encodedMessage}`;
        } else {
            whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        }
        
        // Reset after sharing
        setTimeout(resetTracker, 100);
        
        window.open(whatsappUrl, '_blank');
    }
});