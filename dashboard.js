document.addEventListener("DOMContentLoaded", function() {
    loadExpenses();
});

function addExpense() {
    const name = document.getElementById("expense-name").value;
    const amount = document.getElementById("expense-amount").value;
    const category = document.getElementById("expense-category").value;

    if (!name || !amount) {
        alert("Please enter expense details.");
        return;
    }

    const expense = { name, amount, category };
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    loadExpenses();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const tableBody = document.getElementById("expense-table");
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = `
            <tr>
                <td>${expense.name}</td>
                <td>₹${expense.amount}</td>
                <td>${expense.category}</td>
                <td><button onclick="deleteExpense(${index})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updateChart(expenses);
}

function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

function updateChart(expenses) {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + parseFloat(expense.amount);
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses",
                data: data,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
            }]
        }
    });
}

function logout() {
    alert("Logged out successfully!");
    window.location.href = "index.html";
}
function exportToCSV() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (expenses.length === 0) {
        alert("No expenses to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Amount (₹),Date,Payment Method,Category,Notes\n";

    expenses.forEach(expense => {
        let row = `${expense.name},${expense.amount},${expense.date},${expense.paymentMethod},${expense.category},${expense.notes || ""}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
}
function filterExpenses() {
    const searchName = document.getElementById("search-name").value.toLowerCase();
    const filterCategory = document.getElementById("filter-category").value;
    const filterDate = document.getElementById("filter-date").value;
    const minAmount = document.getElementById("filter-min-amount").value;
    const maxAmount = document.getElementById("filter-max-amount").value;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const tableBody = document.getElementById("expense-table");
    tableBody.innerHTML = "";

    expenses
        .filter(expense => 
            (searchName === "" || expense.name.toLowerCase().includes(searchName)) &&
            (filterCategory === "" || expense.category === filterCategory) &&
            (filterDate === "" || expense.date === filterDate) &&
            (minAmount === "" || parseFloat(expense.amount) >= parseFloat(minAmount)) &&
            (maxAmount === "" || parseFloat(expense.amount) <= parseFloat(maxAmount))
        )
        .forEach((expense, index) => {
            const row = `
                <tr>
                    <td>${expense.name}</td>
                    <td>₹${expense.amount}</td>
                    <td>${expense.date}</td>
                    <td>${expense.paymentMethod}</td>
                    <td>${expense.category}</td>
                    <td>${expense.notes || "—"}</td>
                    <td><button onclick="deleteExpense(${index})">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
}
let editIndex = -1;

function editExpense(index) {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expense = expenses[index];

    document.getElementById("edit-name").value = expense.name;
    document.getElementById("edit-amount").value = expense.amount;
    document.getElementById("edit-date").value = expense.date;
    document.getElementById("edit-payment-method").value = expense.paymentMethod;
    document.getElementById("edit-category").value = expense.category;
    document.getElementById("edit-notes").value = expense.notes || "";

    editIndex = index;
    document.getElementById("edit-modal").style.display = "block";
}

function saveEditExpense() {
    if (editIndex === -1) return;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    expenses[editIndex] = {
        name: document.getElementById("edit-name").value,
        amount: document.getElementById("edit-amount").value,
        date: document.getElementById("edit-date").value,
        paymentMethod: document.getElementById("edit-payment-method").value,
        category: document.getElementById("edit-category").value,
        notes: document.getElementById("edit-notes").value
    };

    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    closeEditModal();
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const tableBody = document.getElementById("expense-table");
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = `
            <tr>
                <td>${expense.name}</td>
                <td>₹${expense.amount}</td>
                <td>${expense.date}</td>
                <td>${expense.paymentMethod}</td>
                <td>${expense.category}</td>
                <td>${expense.notes || "—"}</td>
                <td>
                    <button onclick="editExpense(${index})">Edit</button>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
function updateCategorySummary() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const categoryTotals = {};

    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += parseFloat(expense.amount);
        } else {
            categoryTotals[expense.category] = parseFloat(expense.amount);
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    drawCategoryChart(labels, data);
}

function drawCategoryChart(labels, data) {
    const ctx = document.getElementById("categoryChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", updateCategorySummary);

    document.addEventListener("DOMContentLoaded", function() {
        const loggedInUser = localStorage.getItem("loggedInUser");
    });
    function showNotification(message, type = "info") {
        const notificationBox = document.getElementById("notification-box");
        notificationBox.innerText = message;
        notificationBox.classList.remove("hidden", "info", "warning", "error");
        notificationBox.classList.add(type);
    
        setTimeout(() => {
            notificationBox.classList.add("hidden");
        }, 3000);
    }
    
    function addExpense() {
        const name = document.getElementById("expense-name").value;
        const amount = document.getElementById("expense-amount").value;
        const date = document.getElementById("expense-date").value;
        const paymentMethod = document.getElementById("expense-payment-method").value;
        const category = document.getElementById("expense-category").value;
        const notes = document.getElementById("expense-notes").value;
    
        if (!name || !amount || !date) {
            showNotification("Please enter all required details.", "error");
            return;
        }
    
        const expense = { name, amount, date, paymentMethod, category, notes };
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    
        showNotification("Expense added successfully!", "info");
        loadExpenses();
    }
    
    function updateBudgetInfo() {
        const budget = localStorage.getItem("budget") || 0;
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        
        let statusText = `Budget: ₹${budget} | Spent: ₹${totalExpense}`;
        if (totalExpense > budget) {
            statusText += " ⚠️ Over Budget!";
            document.getElementById("budget-status").style.color = "red";
            showNotification("⚠️ You have exceeded your budget!", "warning");
        } else {
            document.getElementById("budget-status").style.color = "green";
        }
    
        document.getElementById("budget-status").innerText = statusText;
        drawBudgetChart(budget, totalExpense);
    }
    document.addEventListener("DOMContentLoaded", function() {
        loadExpenses();
        loadRecurringExpenses();
        checkAndAddRecurringExpenses();
    });
    
    function addRecurringExpense() {
        const name = document.getElementById("recurring-name").value;
        const amount = document.getElementById("recurring-amount").value;
        const category = document.getElementById("recurring-category").value;
    
        if (!name || !amount) {
            showNotification("Please enter all details for the recurring expense.", "error");
            return;
        }
    
        const recurringExpense = { name, amount, category };
        let recurringExpenses = JSON.parse(localStorage.getItem("recurringExpenses")) || [];
        recurringExpenses.push(recurringExpense);
        localStorage.setItem("recurringExpenses", JSON.stringify(recurringExpenses));
    
        showNotification("Recurring expense added!", "info");
        loadRecurringExpenses();
    }
    
    function loadRecurringExpenses() {
        const recurringExpenses = JSON.parse(localStorage.getItem("recurringExpenses")) || [];
        const tableBody = document.getElementById("recurring-expense-table");
        tableBody.innerHTML = "";
    
        recurringExpenses.forEach((expense, index) => {
            const row = `
                <tr>
                    <td>${expense.name}</td>
                    <td>₹${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td><button onclick="deleteRecurringExpense(${index})">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
    
    function deleteRecurringExpense(index) {
        let recurringExpenses = JSON.parse(localStorage.getItem("recurringExpenses")) || [];
        recurringExpenses.splice(index, 1);
        localStorage.setItem("recurringExpenses", JSON.stringify(recurringExpenses));
        loadRecurringExpenses();
    }
    
    function checkAndAddRecurringExpenses() {
        const lastAddedMonth = localStorage.getItem("lastRecurringMonth");
        const currentMonth = new Date().getMonth();
    
        if (lastAddedMonth !== String(currentMonth)) {
            let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
            let recurringExpenses = JSON.parse(localStorage.getItem("recurringExpenses")) || [];
    
            recurringExpenses.forEach(expense => {
                expenses.push({ ...expense, date: new Date().toISOString().split("T")[0] });
            });
    
            localStorage.setItem("expenses", JSON.stringify(expenses));
            localStorage.setItem("lastRecurringMonth", currentMonth);
            loadExpenses();
            showNotification("Recurring expenses added for this month!", "info");
        }
    }
    function filterExpenses() {
        const category = document.getElementById("filter-category").value;
        loadExpenses(category);
    }
    
    function sortExpenses() {
        const sortBy = document.getElementById("sort-expense").value;
        loadExpenses(null, sortBy);
    }
    
    function loadExpenses(filterCategory = null, sortBy = "date-desc") {
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        
        // Filter expenses
        if (filterCategory && filterCategory !== "all") {
            expenses = expenses.filter(expense => expense.category === filterCategory);
        }
    
        // Sort expenses
        expenses.sort((a, b) => {
            if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
            if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
            if (sortBy === "amount-desc") return b.amount - a.amount;
            if (sortBy === "amount-asc") return a.amount - b.amount;
        });
    
        const tableBody = document.getElementById("expense-table");
        tableBody.innerHTML = "";
    
        expenses.forEach((expense, index) => {
            const row = `
                <tr>
                    <td>${expense.name}</td>
                    <td>₹${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td><button onclick="deleteExpense(${index})">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
    // Function to set & save budget
function setBudget() {
    const budget = document.getElementById("budget").value;
    localStorage.setItem("budget", budget);
    updateBudgetStatus();
}

// Function to update budget status
function updateBudgetStatus() {
    const budget = localStorage.getItem("budget") || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalSpent;
    
    const statusElement = document.getElementById("budget-status");
    statusElement.innerHTML = `Total Spent: ₹${totalSpent} | Remaining Budget: ₹${remaining}`;

    // Show alert if budget exceeded
    if (remaining < 0) {
        statusElement.style.color = "red";
        alert("⚠️ Budget exceeded! Control your spending.");
    } else {
        statusElement.style.color = "green";
    }
}

// Call update function on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("budget").value = localStorage.getItem("budget") || "";
    updateBudgetStatus();
});
function exportToCSV() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    if (expenses.length === 0) {
        alert("No expenses to download!");
        return;
    }

    // Prepare CSV content
    let csvContent = "Date,Category,Amount,Note\n";
    expenses.forEach(expense => {
        csvContent += `${expense.date},${expense.category},${expense.amount},${expense.note}\n`;
    });

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Expenses.csv";
    link.click();
}
function generateChart() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // if (expenses.length === 0) {
    //     alert("No expenses to visualize!");
    //     return;
    // }

    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += parseFloat(expense.amount);
        } else {
            categoryTotals[expense.category] = parseFloat(expense.amount);
        }
    });

    // Prepare data for the chart
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Destroy previous chart instance if exists
    if (window.myExpenseChart) {
        window.myExpenseChart.destroy();
    }

    // Create the chart
    const ctx = document.getElementById("expenseChart").getContext("2d");
    window.myExpenseChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
                borderColor: "#ddd",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call this function when the dashboard loads
generateChart();
function generateCharts() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // if (expenses.length === 0) {
    //     alert("No expenses to visualize!");
    //     return;
    // }

    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += parseFloat(expense.amount);
        } else {
            categoryTotals[expense.category] = parseFloat(expense.amount);
        }
    });

    // Prepare data
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

    // Destroy previous charts if exist
    if (window.myExpenseBarChart) window.myExpenseBarChart.destroy();
    if (window.myExpensePieChart) window.myExpensePieChart.destroy();

    // Bar Chart
    const barCtx = document.getElementById("expenseChart").getContext("2d");
    window.myExpenseBarChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: colors,
                borderColor: "#ddd",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Pie Chart
    const pieCtx = document.getElementById("expensePieChart").getContext("2d");
    window.myExpensePieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expense Breakdown",
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Call this function when the dashboard loads
generateCharts();
// Function to convert expenses to CSV format
function downloadCSV() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (expenses.length === 0) {
        alert("No data to export!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Category,Amount,Description\n"; // CSV headers

    expenses.forEach(expense => {
        csvContent += `${expense.date},${expense.category},${expense.amount},${expense.description}\n`;
    });

    // Create a downloadable CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach event listener
document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
   // Function to convert expenses to CSV format
function downloadCSV() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (expenses.length === 0) {
        alert("No data to export!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Category,Amount,Description\n"; // CSV headers

    expenses.forEach(expense => {
        csvContent += `${expense.date},${expense.category},${expense.amount},${expense.description}\n`;
    });

    // Create a downloadable CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach event listener
document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
function updateMonthlySummary() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const summary = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

        if (!summary[monthYear]) {
            summary[monthYear] = 0;
        }
        summary[monthYear] += parseFloat(expense.amount);
    });

    const tableBody = document.querySelector("#monthlySummaryTable tbody");
    tableBody.innerHTML = ""; // Clear previous data

    for (const [month, total] of Object.entries(summary)) {
        const row = `<tr><td>${month}</td><td>₹${total.toFixed(2)}</td></tr>`;
        tableBody.innerHTML += row;
    }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", updateMonthlySummary);
function updateCategorySummary() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const categorySummary = {};

    expenses.forEach(expense => {
        if (!categorySummary[expense.category]) {
            categorySummary[expense.category] = 0;
        }
        categorySummary[expense.category] += parseFloat(expense.amount);
    });

    const tableBody = document.querySelector("#categorySummaryTable tbody");
    tableBody.innerHTML = ""; // Clear previous data

    for (const [category, total] of Object.entries(categorySummary)) {
        const row = `<tr><td>${category}</td><td>₹${total.toFixed(2)}</td></tr>`;
        tableBody.innerHTML += row;
    }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", updateCategorySummary);

function renderExpenseChart() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const categorySummary = {};

    expenses.forEach(expense => {
        if (!categorySummary[expense.category]) {
            categorySummary[expense.category] = 0;
        }
        categorySummary[expense.category] += parseFloat(expense.amount);
    });

    const categories = Object.keys(categorySummary);
    const amounts = Object.values(categorySummary);

    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    if (window.expenseChart) {
        window.expenseChart.destroy(); // Destroy previous chart instance
    }

    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#E67E22'],
            }]
        }
    });
}

// Call function on page load
document.addEventListener("DOMContentLoaded", renderExpenseChart);


document.addEventListener("DOMContentLoaded", () => {
    loadBudget();
    updateBudgetStatus();
});

// Set Budget
function setBudget() {
    const budget = parseFloat(document.getElementById("budgetInput").value);
    if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }
    localStorage.setItem("monthlyBudget", budget);
    loadBudget();
    updateBudgetStatus();
}

// Load Budget and Expenses
function loadBudget() {
    const budget = localStorage.getItem("monthlyBudget") || 0;
    document.getElementById("budgetAmount").textContent = budget;
}

// Update Budget Status
function updateBudgetStatus() {
    const budget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    let totalSpent = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    let remaining = budget - totalSpent;
    
    document.getElementById("totalExpenses").textContent = totalSpent.toFixed(2);
    document.getElementById("remainingBudget").textContent = remaining.toFixed(2);

    let budgetStatus = document.getElementById("budgetStatus");
    if (remaining < 0) {
        budgetStatus.innerHTML = `<p style="color: red;">⚠ Over Budget! Reduce expenses.</p>`;
    } else if (remaining < budget * 0.2) {
        budgetStatus.innerHTML = `<p style="color: orange;">⚠ Close to budget limit!</p>`;
    } else {
        budgetStatus.innerHTML = `<p style="color: green;">✔ Budget is on track.</p>`;
    }
}

// Call update function after every expense update
document.addEventListener("expenseUpdated", updateBudgetStatus);
document.addEventListener("DOMContentLoaded", () => {
    loadSavingsGoal();
    updateSavingsStatus();
});

// Set Savings Goal
function setSavingsGoal() {
    const goal = parseFloat(document.getElementById("savingsGoalInput").value);
    if (isNaN(goal) || goal <= 0) {
        alert("Please enter a valid savings goal.");
        return;
    }
    localStorage.setItem("savingsGoal", goal);
    loadSavingsGoal();
    updateSavingsStatus();
}

// Load Savings Goal
function loadSavingsGoal() {
    const goal = localStorage.getItem("savingsGoal") || 0;
    document.getElementById("savingsGoal").textContent = goal;
}

// Update Savings Status
function updateSavingsStatus() {
    const goal = parseFloat(localStorage.getItem("savingsGoal")) || 0;
    const savings = parseFloat(localStorage.getItem("totalSavings")) || 0;
    let remaining = goal - savings;
    
    document.getElementById("totalSavings").textContent = savings.toFixed(2);
    document.getElementById("remainingSavings").textContent = remaining.toFixed(2);

    let savingsStatus = document.getElementById("savingsStatus");
    if (savings >= goal) {
        savingsStatus.innerHTML = `<p style="color: green;">🎉 Goal Achieved! Keep Saving! 🚀</p>`;
    } else if (remaining < goal * 0.2) {
        savingsStatus.innerHTML = `<p style="color: orange;">⚠ Almost there! Keep pushing!</p>`;
    } else {
        savingsStatus.innerHTML = `<p style="color: blue;">💰 Keep saving to reach your goal.</p>`;
    }
}

// Call update function when savings change
document.addEventListener("savingsUpdated", updateSavingsStatus);
function calculateInvestment() {
    let principal = parseFloat(document.getElementById("initialInvestment").value) || 0;
    let monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    let annualRate = parseFloat(document.getElementById("interestRate").value) / 100;
    let years = parseFloat(document.getElementById("investmentYears").value) || 1;
    let months = years * 12;
    let monthlyRate = annualRate / 12;

    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    for (let i = 1; i <= months; i++) {
        futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
    }

    let totalInvested = principal + (monthlyContribution * months);
    let totalInterest = futureValue - totalInvested;

    document.getElementById("futureValue").textContent = futureValue.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);

    drawInvestmentChart(months, futureValue, totalInvested);
}

// Chart for investment growth
function drawInvestmentChart(months, futureValue, totalInvested) {
    let ctx = document.getElementById("investmentChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: months }, (_, i) => i + 1),
            datasets: [
                { label: "Total Investment", data: Array(months).fill(totalInvested), borderColor: "blue", borderWidth: 2 },
                { label: "Future Value", data: Array(months).fill(futureValue), borderColor: "green", borderWidth: 2 }
            ]
        },
        options: { responsive: true }
    });
}
function calculateInvestment() {
    let principal = parseFloat(document.getElementById("initialInvestment").value) || 0;
    let monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    let annualRate = parseFloat(document.getElementById("interestRate").value) / 100;
    let years = parseFloat(document.getElementById("investmentYears").value) || 1;
    let months = years * 12;
    let monthlyRate = annualRate / 12;

    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    for (let i = 1; i <= months; i++) {
        futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
    }

    let totalInvested = principal + (monthlyContribution * months);
    let totalInterest = futureValue - totalInvested;

    document.getElementById("futureValue").textContent = futureValue.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);

    drawInvestmentChart(months, futureValue, totalInvested);
}

// Chart for investment growth
function drawInvestmentChart(months, futureValue, totalInvested) {
    let ctx = document.getElementById("investmentChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: months }, (_, i) => i + 1),
            datasets: [
                { label: "Total Investment", data: Array(months).fill(totalInvested), borderColor: "blue", borderWidth: 2 },
                { label: "Future Value", data: Array(months).fill(futureValue), borderColor: "green", borderWidth: 2 }
            ]
        },
        options: { responsive: true }
    });
}
function provideInvestmentAdvice(futureValue, years) {
    let advice = "Based on your investment, we recommend: <br>";

    if (futureValue < 50000) {
        advice += "📌 Consider investing in **Fixed Deposits (FD)** or **Recurring Deposits (RD)** for safer returns.";
    } else if (futureValue >= 50000 && futureValue < 500000) {
        advice += "📌 Look into **Mutual Funds (SIP)** for long-term growth with moderate risk.";
    } else if (futureValue >= 500000) {
        advice += "📌 You may explore **Stocks, Index Funds, or Real Estate** for high returns.";
    }

    if (years >= 10) {
        advice += "<br>💡 Since your investment horizon is **long-term**, consider **equity-based investments**.";
    } else if (years >= 5) {
        advice += "<br>💡 For a **mid-term goal**, look into **balanced mutual funds or bonds**.";
    } else {
        advice += "<br>💡 For a **short-term goal**, safer options like **FDs, Debt Funds, or Gold ETFs** are ideal.";
    }

    document.getElementById("investmentAdvice").innerHTML = advice;
}

// Modify the `calculateInvestment` function to include advice
function calculateInvestment() {
    let principal = parseFloat(document.getElementById("initialInvestment").value) || 0;
    let monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    let annualRate = parseFloat(document.getElementById("interestRate").value) / 100;
    let years = parseFloat(document.getElementById("investmentYears").value) || 1;
    let months = years * 12;
    let monthlyRate = annualRate / 12;

    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    for (let i = 1; i <= months; i++) {
        futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
    }

    let totalInvested = principal + (monthlyContribution * months);
    let totalInterest = futureValue - totalInvested;

    document.getElementById("futureValue").textContent = futureValue.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);

    provideInvestmentAdvice(futureValue, years);
}
function calculateGoalPlan() {
    let goalAmount = parseFloat(document.getElementById("goalAmount").value) || 0;
    let goalYears = parseFloat(document.getElementById("goalDeadline").value) || 1;
    let currentSavings = parseFloat(document.getElementById("futureValue").textContent) || 0;
    
    let months = goalYears * 12;
    let monthlySavingsNeeded = (goalAmount - currentSavings) / months;
    
    let advice = "📊 **Goal Analysis:** <br>";
    
    if (currentSavings >= goalAmount) {
        advice += "✅ **Great job!** You have already reached your goal.";
    } else if (monthlySavingsNeeded <= 0) {
        advice += "🚀 You're on track to reach your goal **without additional savings**!";
    } else {
        advice += `💡 To reach **₹${goalAmount}** in **${goalYears} years**, you need to save **₹${monthlySavingsNeeded.toFixed(2)} per month**.`;
    }
    
    document.getElementById("goalAdvice").innerHTML = advice;
}
function calculateGoalPlan() {
    let goalAmount = parseFloat(document.getElementById("goalAmount").value) || 0;
    let goalYears = parseFloat(document.getElementById("goalDeadline").value) || 1;
    let currentSavings = parseFloat(document.getElementById("futureValue").textContent) || 0;
    
    let months = goalYears * 12;
    let monthlySavingsNeeded = (goalAmount - currentSavings) / months;
    
    let advice = "📊 **Goal Analysis:** <br>";
    
    if (currentSavings >= goalAmount) {
        advice += "✅ **Great job!** You have already reached your goal.";
    } else if (monthlySavingsNeeded <= 0) {
        advice += "🚀 You're on track to reach your goal **without additional savings**!";
    } else {
        advice += `💡 To reach **₹${goalAmount}** in **${goalYears} years**, you need to save **₹${monthlySavingsNeeded.toFixed(2)} per month**.`;
    }
    
    document.getElementById("goalAdvice").innerHTML = advice;

    // Update progress bar
    let progressPercentage = Math.min((currentSavings / goalAmount) * 100, 100);
    let progressBar = document.getElementById("progressBar");
    progressBar.style.width = progressPercentage + "%";
    progressBar.innerHTML = Math.round(progressPercentage) + "%";
}
