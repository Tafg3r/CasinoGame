Here is the code with English comments added for clarity:

document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const conditionType = document.getElementById("conditionType");
  const conditionInputs = document.getElementById("conditionInputs");
  const calculateBtn = document.getElementById("calculateBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const results = document.getElementById("results");
  const themeToggle = document.getElementById("themeToggle");

  // Function to dynamically show additional input fields based on selected condition
  const showAdditionalInput = () => {
    conditionInputs.innerHTML = "";
    if (conditionType.value === "1") {
      conditionInputs.innerHTML = '<input type="number" id="divisor" class="form-control mt-2" placeholder="Enter divisor" required min="1">';
    } else if (conditionType.value === "3") {
      conditionInputs.innerHTML = '<input type="number" id="winSlots" class="form-control mt-2" placeholder="Enter winning slots" required min="1">';
    } else if (conditionType.value === "5") {
      conditionInputs.innerHTML = `
        <input type="number" id="startRange" class="form-control mt-2" placeholder="Enter start of range" required min="1">
        <input type="number" id="endRange" class="form-control mt-2" placeholder="Enter end of range" required min="1">
      `;
    }
  };

  // Utility function to check if a number is prime
  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Main calculation function
  const calculate = () => {
    const totalSlotsInput = document.getElementById("totalSlots");
    const totalSlots = parseInt(totalSlotsInput.value, 10);
    const winAmount = parseFloat(document.getElementById("winAmount").value);
    const lossAmount = parseFloat(document.getElementById("lossAmount").value);

    // Clear previous results
    results.innerHTML = "";

    // Validate input values
    if (totalSlots <= 0 || winAmount < 0 || lossAmount < 0) {
      results.innerHTML += "<p>Please enter valid numbers.</p>";
      return;
    }

    let winningNumbersCount = 0;

    // Calculate winning numbers based on the selected condition
    switch (conditionType.value) {
      case "1": // Divisible by a specific number
        const divisor = parseInt(document.getElementById("divisor").value);
        winningNumbersCount = Array.from({ length: totalSlots }, (_, i) => i + 1).filter(n => n % divisor === 0).length;
        break;
      case "2": // Divisible by square root
        winningNumbersCount = Array.from({ length: totalSlots }, (_, i) => i + 1).filter(n => n % Math.floor(Math.sqrt(n)) === 0).length;
        break;
      case "3": // Fixed number of winning slots
        const winSlots = parseInt(document.getElementById("winSlots").value);
        winningNumbersCount = Math.min(winSlots, totalSlots);
        break;
      case "4": // Prime numbers
        winningNumbersCount = Array.from({ length: totalSlots }, (_, i) => i + 1).filter(isPrime).length;
        break;
      case "5": // Numbers within a range
        const startRange = parseInt(document.getElementById("startRange").value);
        const endRange = parseInt(document.getElementById("endRange").value);
        winningNumbersCount = Array.from({ length: totalSlots }, (_, i) => i + 1).filter(n => n >= startRange && n <= endRange).length;
        break;
    }

    // Calculate the number of losing numbers, total profit, and average profit
    const losingNumbersCount = totalSlots - winningNumbersCount;
    const totalProfit = winningNumbersCount * winAmount - losingNumbersCount * lossAmount;
    const averageProfit = totalProfit / totalSlots;

    // Display the results
    results.innerHTML = `
      <p>Winning Numbers: ${winningNumbersCount}</p>
      <p>Losing Numbers: ${losingNumbersCount}</p>
      <p>Total Profit: $${totalProfit.toFixed(2)}</p>
      <p>Average Profit per Slot: $${averageProfit.toFixed(2)}</p>
      <p>${averageProfit > 0 ? "Game is Profitable" : "Game is Not Profitable"}</p>
    `;
  };

  // Validation function for the total number of slots
  const validateTotalSlots = () => {
    const totalSlotsInput = document.getElementById("totalSlots");
    const totalSlots = parseInt(totalSlotsInput.value, 10);

    // Check slot limit and prevent duplicate messages
    if (totalSlots > 10000) {
      results.innerHTML = "<p>there are no such thing as so many slots)</p>";
      totalSlotsInput.setCustomValidity("Too many slots"); // Set custom error message
      return false;
    } else {
      totalSlotsInput.setCustomValidity(""); // Clear error if valid
      results.innerHTML = ""; // Remove previous error message
      return true;
    }
  };

  // Theme toggle functionality
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });

  // Event listener to show additional input fields based on selected condition
  conditionType.addEventListener("change", showAdditionalInput);

  // Event listener for the calculate button
  calculateBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll('input[required], select[required]');
    let valid = true;

    // Validate all required inputs
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        valid = false;
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (validateTotalSlots() && valid) {
      calculate();
    }
  });

  // Refresh the page on clicking the refresh button
  refreshBtn.addEventListener("click", () => location.reload());

  // Initialize the input fields on page load
  showAdditionalInput();
});
