document.getElementById("calcBtn").addEventListener("click", calculate);

function calculate() {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const operator = document.getElementById("operator").value;
  let result;

  try {
    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Please enter both numbers.");
    }

    if (operator == "+") {
      result = num1 + num2;
    } else if (operator == "-") {
      result = num1 - num2;
    } else if (operator == "*") {
      result = num1 * num2;
    } else if (operator == "/") {
      if (num2 === 0) throw new Error("Division by zero!");
      result = num1 / num2;
    } else {
      throw new Error("Invalid operator selected.");
    }

    document.getElementById("result").innerText = "Result: " + result;
  } catch (err) {
    document.getElementById("result").innerText = "Error: " + err.message;
  }
}