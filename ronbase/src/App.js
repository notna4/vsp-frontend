import React, { useEffect, useState } from "react";
import "./App.css";
import rates from "./rates.json";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Line } from "react-chartjs-2";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const currencyArr = Object.keys(rates).map((currency) => ({
      currency,
      // rate: rates[currency].map((entry) => entry.rate),
      rate: rates[currency],

    }));
    setCurrencies(currencyArr);
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter((currencyObj) =>
        currencyObj.currency.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchValue, currencies]);

  useEffect(() => {
    const selectedData = selectedCurrencies.map((currency) => {
      const currencyData = currencies.find((obj) => obj.currency === currency);
      return {
        label: currencyData.currency,
        data: currencyData.rate,
      };
    });

    setChartData(selectedData);
  }, [selectedCurrencies, currencies]);

  let sign = "->";

  const openSearch = (input) => {
    setSearchValue(input.target.value);
  };

  const handleCurrencyClick = (currency) => {
    if (selectedCurrencies.includes(currency)) {
      setSelectedCurrencies(selectedCurrencies.filter((curr) => curr !== currency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  return (
    <div className="main">
      <div className="chart">
        <h2>Rate History</h2>
          {chartData && (
            <Line
              data={{
                // labels: rates.USD.map((entry) => entry.date), // Assuming USD is present in the rates.json file, you can change this to any currency
                datasets: chartData,
                labels: ["Ieri", "Azi", 'da', 'da', 'da'],
                fill: true,
                tension: 0.2
                // datasets: [{
                //   type: 'line',
                //   label: 'My First Dataset',
                //   data: [65, 59, 80, 81, 56, 55, 40],
                //   // data: [chartData],
                //   fill: false,
                //   borderColor: 'rgb(75, 192, 192)',
                //   tension: 0.1

                // }]
              }}
              options={{
                maintainAspectRatio: true,
                scales: {
                  x: {
                    type: 'category',
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10, // Adjust the maximum number of ticks to display
                    },
                  },
                },
                elements: {
                  line: {
                    lineColor: 'rgba(255, 255, 255, 1)', // Set the line color to white
                  },
                },
              }}
            />
          )}
      </div>
      
      <div className="search">
        <input
          type="text"
          placeholder="Cauta"
          autoComplete="false"
          autoCapitalize="false"
          value={searchValue}
          onChange={(e) => openSearch(e)}
        />
        <div className="modal-search" id="modal-search">
          <h2>Select currency</h2>
          {filteredCurrencies.map((currencyObj) => (
            <div
              key={currencyObj.currency}
              onClick={() => handleCurrencyClick(currencyObj.currency)}
              style={{
                border: selectedCurrencies.includes(currencyObj.currency) ? "2px solid black" : "none",
              }}
            >
              {currencyObj.currency}:{" "}
              <span
                style={{
                  color:
                    currencyObj.rate[1] < currencyObj.rate[currencyObj.rate.length - 2]
                      ? "yellow"
                      : currencyObj.rate[1] > currencyObj.rate[currencyObj.rate.length - 2]
                      ? "red"
                      : "inherit",
                }}
              >
                {currencyObj.rate[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

