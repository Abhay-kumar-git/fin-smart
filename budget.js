function setBudget() {
    const budget = document.getElementById("budget-amount").value;

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    localStorage.setItem("budget", budget);
    updateBudgetInfo();
}

function updateBudgetInfo() {
    const budget = localStorage.getItem("budget") || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    let statusText = `Budget: ₹${budget} | Spent: ₹${totalExpense}`;
    if (totalExpense > budget) {
        statusText += " ⚠️ Over Budget!";
        document.getElementById("budget-status").style.color = "red";
    } else {
        document.getElementById("budget-status").style.color = "green";
    }

    document.getElementById("budget-status").innerText = statusText;
    drawBudgetChart(budget, totalExpense);
}

function drawBudgetChart(budget, totalExpense) {
    const ctx = document.getElementById("budgetChart").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Remaining Budget", "Spent"],
            datasets: [{
                data: [budget - totalExpense, totalExpense],
                backgroundColor: ["#36a2eb", "#ff6384"],
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", updateBudgetInfo);