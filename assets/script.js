document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convert-button');
    const convertFromSelect = document.getElementById('convert-from');
    const convertToSelect = document.getElementById('convert-to');
    const amountToConvertInput = document.getElementById('amount-to-convert');

    convertButton.addEventListener('click', async () => {
        const convertFrom = convertFromSelect.value;
        const convertTo = convertToSelect.value;
        const amountToConvert = parseFloat(amountToConvertInput.value);

        if (isNaN(amountToConvert) || amountToConvert <= 0) {
            alert('Please enter a valid amount to convert.');
            return;
        }

        try {
            const exchangeRates = await getExchangeRates('USD');
            const convertedAmount = convertCurrency(amountToConvert, convertFrom, convertTo, exchangeRates);
            
            alert(`Converted ${amountToConvert} ${convertFrom} to ${convertedAmount.toFixed(2)} ${convertTo}`);
        } catch (error) {
            console.error('Conversion error:', error.message);
            alert('Failed to convert currency. Please try again.');
        }
    });

    async function getExchangeRates(baseCurrency) {
        const apiKey = '09c3be0ed2759337a66d9309'; // API key valido por dos semanas
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            return data.conversion_rates;
        } else {
            throw new Error('Failed to fetch exchange rates');
        }
    }

    function convertCurrency(amount, fromCurrency, toCurrency, rates) {
        const rateFrom = rates[fromCurrency];
        const rateTo = rates[toCurrency];
        
        if (rateFrom && rateTo) {
            const convertedAmount = (amount / rateFrom) * rateTo;
            return convertedAmount;
        } else {
            throw new Error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`);
        }
    }
});