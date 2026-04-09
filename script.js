```javascript
document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const operatorSelect = document.getElementById('operator');
    const num2Input = document.getElementById('num2');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSpan = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');

    // Define the FastAPI backend URL
    // IMPORTANT: Make sure this matches where your FastAPI app is running.
    // If running FastAPI on 8000, and Live Server on 5500, this is correct.
    const FASTAPI_URL = 'http://127.0.0.1:8000/calculate'; 

    calculateBtn.addEventListener('click', async () => {
        errorMessage.textContent = ''; // Clear previous errors
        resultSpan.textContent = '';   // Clear previous results

        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operator = operatorSelect.value;

        // Basic client-side validation
        if (isNaN(num1) || isNaN(num2)) {
            errorMessage.textContent = 'Please enter valid numbers for both fields.';
            return;
        }

        try {
            const response = await fetch(FASTAPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number1: num1,
                    number2: num2,
                    operator: operator
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // If FastAPI returns an error (e.g., 400 for division by zero)
                // The error message will be in data.detail
                errorMessage.textContent = data.detail || `Error: ${response.status} ${response.statusText}`;
            } else {
                // If calculation was successful
                if (data.result !== undefined) {
                    resultSpan.textContent = data.result;
                } else {
                    errorMessage.textContent = 'An unexpected response was received from the server.';
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            errorMessage.textContent = 'Could not connect to the backend server. Please ensure FastAPI is running.';
        }
    });
});
```