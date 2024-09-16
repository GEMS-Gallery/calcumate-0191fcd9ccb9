import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '';
let operator = '';
let previousValue = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value >= '0' && value <= '9' || value === '.') {
            currentValue += value;
            display.value = currentValue;
        } else if (value === 'C') {
            clear();
        } else if (value === '=') {
            calculate();
        } else {
            if (currentValue !== '') {
                if (previousValue !== '') {
                    calculate();
                }
                operator = value;
                previousValue = currentValue;
                currentValue = '';
            }
        }
    });
});

function clear() {
    currentValue = '';
    operator = '';
    previousValue = '';
    display.value = '';
}

async function calculate() {
    if (previousValue !== '' && currentValue !== '' && operator !== '') {
        const x = parseFloat(previousValue);
        const y = parseFloat(currentValue);
        let result;

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    if (divisionResult === null) {
                        throw new Error('Division by zero');
                    }
                    result = divisionResult;
                    break;
            }

            display.value = result;
            previousValue = result.toString();
            currentValue = '';
        } catch (error) {
            display.value = 'Error';
            console.error('Calculation error:', error);
        }
    }
}
