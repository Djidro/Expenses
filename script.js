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
    const whatsappBtn = document.getElementById('whatsapp-btn');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    currentDateDisplay.textContent = formatDate(today);
    
    // Temporary expenses array for current session
    let tempExpenses = [];
    
    // Load saved expenses from localStorage
    let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    renderSummary();
    
    // Event listeners
    dateInput.addEventListener('change', function() {
        currentDateDisplay.textContent = formatDate(this.value);
    });
    
    addButton.addEventListener('click', addExpense);
    saveButton.addEventListener('click', saveExpenses);
    clearButton.addEventListener('click', clearTempExpenses);
    whatsappBtn.addEventListener('click', shareAllViaWhatsApp);
    
    // Functions
    function addExpense() {
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;
        
        if (!name || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid name and amount');
            return;
        }
        
        const expense = {
            id: Date.now(),
            date,
            name,
            amount
        };
        
        tempExpenses.push(expense);
        renderTempExpenses();
        
        // Clear inputs
        nameInput.value = '';
        amountInput.value = '';
        nameInput.focus();
    }
    
    function renderTempExpenses() {
        tempList.innerHTML = '';
        let total = 0;
        
        tempExpenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.name}</span>
                <span>${expense.amount.toLocaleString()} RWF</span>
                <button class="temp-expense-delete" data-id="${expense.id}">Delete</button>
            `;
            tempList.appendChild(li);
            total += expense.amount;
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.temp-expense-delete').forEach(button => {
            button.addEventListener('click', function(e) {
                const id = parseInt(e.target.getAttribute('data-id'));
                tempExpenses = tempExpenses.filter(expense => expense.id !== id);
                renderTempExpenses();
            });
        });
        
        tempTotalDisplay.textContent = total.toLocaleString();
        saveButton.disabled = tempExpenses.length === 0;
    }
    
    function clearTempExpenses() {
        tempExpenses = [];
        renderTempExpenses();
    }
    
    function saveExpenses() {
        if (tempExpenses.length === 0) return;
        
        savedExpenses = [...savedExpenses, ...tempExpenses];
        localStorage.setItem('expenses', JSON.stringify(savedExpenses));
        
        // Reset temp expenses
        clearTempExpenses();
        renderSummary();
        alert('Expenses saved successfully!');
    }
    
    function renderSummary() {
        summarySection.innerHTML = '';
        
        if (savedExpenses.length === 0) {
            summarySection.innerHTML = '<p>No expenses recorded yet.</p>';
            grandTotalDisplay.textContent = '0';
            return;
        }
        
        // Group expenses by date
        const groupedExpenses = savedExpenses.reduce((acc, expense) => {
            if (!acc[expense.date]) {
                acc[expense.date] = [];
            }
            acc[expense.date].push(expense);
            return acc;
        }, {});
        
        let grandTotal = 0;
        
        // Sort dates in descending order (newest first)
        const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));
        
        sortedDates.forEach(date => {
            const dateExpenses = groupedExpenses[date];
            const dateTotal = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            grandTotal += dateTotal;
            
            const dateGroup = document.createElement('div');
            dateGroup.className = 'expense-date-group';
            
            const dateHeader = document.createElement('div');
            dateHeader.className = 'expense-date-header';
            dateHeader.innerHTML = `
                <span>${formatDate(date)}</span>
                <span class="expense-date-total">Total: ${dateTotal.toLocaleString()} RWF</span>
            `;
            
            dateGroup.appendChild(dateHeader);
            
            dateExpenses.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <div>
                        <span>${expense.name}</span>
                        <span>${expense.amount.toLocaleString()} RWF</span>
                    </div>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                `;
                dateGroup.appendChild(expenseItem);
            });
            
            summarySection.appendChild(dateGroup);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteExpense);
        });
        
        grandTotalDisplay.textContent = grandTotal.toLocaleString();
    }
    
    function deleteExpense(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        savedExpenses = savedExpenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(savedExpenses));
        renderSummary();
    }
    
    function shareAllViaWhatsApp() {
        if (savedExpenses.length === 0) return;
        
        let message = '📊 *All Expenses Summary*\n\n';
        let grandTotal = 0;
        
        // Group by date
        const groupedExpenses = savedExpenses.reduce((acc, expense) => {
            if (!acc[expense.date]) acc[expense.date] = [];
            acc[expense.date].push(expense);
            return acc;
        }, {});
        
        // Add expenses by date
        Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
            const dateExpenses = groupedExpenses[date];
            const dateTotal = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            grandTotal += dateTotal;
            
            message += `📅 *${formatDate(date)}*\n`;
            
            dateExpenses.forEach(expense => {
                message += `➡ ${expense.name}: ${expense.amount.toLocaleString()} RWF\n`;
            });
            
            message += `💰 *Total: ${dateTotal.toLocaleString()} RWF*\n\n`;
        });
        
        message += `🏦 *Grand Total: ${grandTotal.toLocaleString()} RWF*`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});
