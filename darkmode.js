document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        toggleButton.textContent = "☀️ Light Mode";
    }

    toggleButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️ Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙 Dark Mode";
        }
    });
});
let savingsGoal = parseFloat(localStorage.getItem("savingsGoal")) || 0;
let totalSavings = savingsHistory.reduce((sum, entry) => sum + entry.amount, 0);

function setGoal() {
    let goalAmount = parseFloat(document.getElementById("goalAmount").value);
    
    if (!isNaN(goalAmount) && goalAmount > 0) {
        savingsGoal = goalAmount;
        localStorage.setItem("savingsGoal", savingsGoal);
        updateProgressBar();
        alert("🎯 Goal set successfully!");
    } else {
        alert("⚠ Please enter a valid goal amount.");
    }
}

function updateProgressBar() {
    totalSavings = savingsHistory.reduce((sum, entry) => sum + entry.amount, 0);
    let progress = (totalSavings / savingsGoal) * 100;
    progress = progress > 100 ? 100 : progress; // Cap at 100%

    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("progressText").innerText = `💰 ${totalSavings} / ${savingsGoal}`;
}

// Load progress bar when the page loads
window.onload = () => {
    updateSavingsChart();
    updateProgressBar();
};
let expenseHistory = JSON.parse(localStorage.getItem("expenseHistory")) || [];

function addExpense() {
    let category = document.getElementById("expenseCategory").value;
    let amount = parseFloat(document.getElementById("expenseAmount").value);

    if (!isNaN(amount) && amount > 0 && category) {
        let expense = { category, amount };
        expenseHistory.push(expense);
        localStorage.setItem("expenseHistory", JSON.stringify(expenseHistory));

        updateExpenseChart();
        updateExpenseList();
        document.getElementById("expenseAmount").value = ""; // Clear input
    } else {
        alert("⚠ Please enter a valid amount and category.");
    }
}

function updateExpenseList() {
    let expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    expenseHistory.forEach((exp, index) => {
        let li = document.createElement("li");
        li.textContent = `💸 ${exp.category}: ₹${exp.amount}`;
        expenseList.appendChild(li);
    });
}

function updateExpenseChart() {
    let categoryTotals = {};

    expenseHistory.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let categories = Object.keys(categoryTotals);
    let amounts = Object.values(categoryTotals);

    let ctx = document.getElementById("expenseChart").getContext("2d");
    if (window.expensePieChart) window.expensePieChart.destroy(); // Clear previous chart

    window.expensePieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: ["red", "blue", "green", "purple", "orange"],
            }]
        }
    });
}

// Load expenses when the page loads
window.onload = () => {
    updateExpenseList();
    updateExpenseChart();
};
