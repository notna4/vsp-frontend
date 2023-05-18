import React, { useEffect, useState } from "react";
import "./App.css";
import rates from "./rates.json";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Line } from "react-chartjs-2";
import { Colors } from 'chart.js';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [chartData, setChartData] = useState(null);

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
    const storedCurrencies = localStorage.getItem("selectedCurrencies");
    if (storedCurrencies) {
      setSelectedCurrencies(JSON.parse(storedCurrencies));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCurrencies", JSON.stringify(selectedCurrencies));
    const selectedData = selectedCurrencies.map((currency) => {
      const currencyData = currencies.find((obj) => obj.currency === currency);
      return {
        label: currencyData.currency,
        data: currencyData.rate,
      };
    });
    setChartData(selectedData);
  }, [selectedCurrencies, currencies]);

  const openSearch = (input) => {
    setSearchValue(input.target.value);
  };

  const handleCurrencyClick = (currency) => {
    if (selectedCurrencies.includes(currency)) {
      setSelectedCurrencies(selectedCurrencies.filter((curr) => curr !== currency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }

    document.getElementById("alert").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("alert").style.visibility = "hidden";
    }, 2000)
  };

  return (
    <div className="main">
      <div className="alert" id="alert">
        <p>Saved to local storage</p>
      </div>
      <div className="chart">
        <div className="chart">
          <div className="chart-title">
            <h2>RONBASE</h2>
          </div>
          {/* <span className="blob">.</span> */}
          <div className="chart-real">
            {chartData && (
              <Line
                data={{
                  // labels: rates.USD.map((entry) => entry.date), // Assuming USD is present in the rates.json file, you can change this to any currency
                  datasets: chartData,
                  labels: ["15.05", "16.05", '17.05', '18.05'],
                }}
                options={{
                  // colors: {
                  //   // enabled: false
                  //   forceOverride: true
                  // },
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
                      tension: 0.1, // Adjust the tension of the line
                      borderWidth: 2, // Set the border width of the line
                      borderColor: [
    "#45AAB4", "#1DBF79", "#FFD700", "#FF5733",
    "#8A2BE2", "#FF1493", "#008000", "#FF4500", "#00FFFF",
    "#FFFF00", "#4169E1", "#7FFFD4", "#FF00FF", "#00FF00",
    "#FF0000", "#800000", "#008080", "#800080", "#000080"
  ], // Set the border color to white
                      // backgroundColor: getRandomColor, // Set the background color to transparent
                      // fill: getRandomColor
                    },
                  },
                }}
              />
            )}

          </div>

        </div>
      </div>
      
      <div className="search">
        <div className="search-real">
          <div className="input">
              <input
                type="text"
                placeholder="Cauta"
                autoComplete="false"
                autoCapitalize="false"
                value={searchValue}
                onClick={(e) => {e.target.value = ''; openSearch(e);}}
                onChange={(e) => openSearch(e)}
              />
          </div>
          <div className="currencies">
            <div className="modal-search" id="modal-search">
              {filteredCurrencies.map((currencyObj) => (
                <div className="currency"
                  key={currencyObj.currency}
                  onClick={() => handleCurrencyClick(currencyObj.currency)}
                  style={{
                    border: selectedCurrencies.includes(currencyObj.currency) ? "2px solid white" : "2px solid #2e3032",
                    backgroundColor: selectedCurrencies.includes(currencyObj.currency) ? "#353434" : "#1E1E1E",
                  }}
                >
                  {currencyObj.currency}:&nbsp;
                  <span
                    style={{
                      color:
                        currencyObj.rate[currencyObj.rate.length-1] < currencyObj.rate[currencyObj.rate.length - 2]
                          ? "gold"
                          : currencyObj.rate[currencyObj.rate.length-1] > currencyObj.rate[currencyObj.rate.length - 2]
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {currencyObj.rate[currencyObj.rate.length-1]}&nbsp;
                    {currencyObj.rate[currencyObj.rate.length - 1] > currencyObj.rate[currencyObj.rate.length - 2] ? (
                      <span>&#8593;</span>
                    ) : (
                      <span>&#8595;</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

