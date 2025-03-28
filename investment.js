function calculateSIP() {
    const amount = document.getElementById("sip-amount").value;
    const duration = document.getElementById("sip-duration").value;
    const rate = document.getElementById("sip-rate").value;

    if (!amount || !duration || !rate) {
        alert("Please enter all investment details.");
        return;
    }

    const monthlyRate = rate / 12 / 100;
    const months = duration * 12;
    let futureValue = 0;

    for (let i = 0; i < months; i++) {
        futureValue = (futureValue + parseFloat(amount)) * (1 + monthlyRate);
    }

    document.getElementById("sip-result").innerHTML = `Total Returns: ₹${futureValue.toFixed(2)}`;

    drawChart(amount, duration, rate, futureValue);
}

function drawChart(amount, duration, rate, futureValue) {
    const ctx = document.getElementById("sipChart").getContext("2d");

    const investedAmount = amount * duration * 12;
    const returns = futureValue - investedAmount;

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Invested Amount", "Returns"],
            datasets: [{
                data: [investedAmount, returns],
                backgroundColor: ["#36a2eb", "#ff6384"],
            }]
        }
    });
}