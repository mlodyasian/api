const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();
const port = 3000;

const currencyData = {
    USD: { currency: 'dolar amerykański', code: 'USD', mid: null, lastUpdated: null },
    EUR: { currency: 'euro', code: 'EUR', mid: null, lastUpdated: null },
    GBP: { currency: 'funt szterling', code: 'GBP', mid: null, lastUpdated: null }
};

async function fetchExchangeRates() {
    for (const currency of Object.values(currencyData)) {
        try {
            const response = await axios.get(`https://api.nbp.pl/api/exchangerates/rates/a/${currency.code}/?format=json`);
            const rate = response.data.rates[0].mid;
            currency.mid = rate;
            currency.lastUpdated = moment();
        } catch (error) {
            console.error(`Błąd podczas pobierania danych dla ${currency.currency}: ${error.message}`);
        }
    }
}

fetchExchangeRates();

setInterval(fetchExchangeRates, 5 * 60 * 1000);

app.get('/dolar', (req, res) => {
    const currency = currencyData.USD;
    if (currency && currency.mid !== null) {
        res.json(currency.mid);
    } else {
        res.status(500).send('Nie można pobrać kursu dolara');
    }
});

app.get('/funt', (req, res) => {
    const currency = currencyData.EUR;
    if (currency && currency.mid !== null) {
        res.json(currency.mid);
    } else {
        res.status(500).send('Nie można pobrać kursu euro');
    }
});

app.get('/euro', (req, res) => {
    const currency = currencyData.GBP;
    if (currency && currency.mid !== null) {
        res.json(currency.mid);
    } else {
        res.status(500).send('Nie można pobrać kursu funta szterlinga');
    }
});

app.listen(port, () => {
    console.log(`Serwer Express działa na porcie ${port}`);
});

