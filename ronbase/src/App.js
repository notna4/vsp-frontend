import React, {useEffect, useState} from 'react';

import './App.css';

import rates1 from './api/nbrfxrates.xml';

function App() {

  const [rates, setRates] = useState();

  function parseXml(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const date = xmlDoc.getElementsByTagName("PublishingDate")[0].textContent;

    const rates = {};
    const cube = xmlDoc.getElementsByTagName("Cube")[0];
    const rateNodes = cube.getElementsByTagName("Rate");
    for (let i = 0; i < rateNodes.length; i++) {
      const currency = rateNodes[i].getAttribute("currency");
      const rate = rateNodes[i].textContent;
      rates[currency] = rate;
    }

    // return { date, rates };

    setRates(rates);
  }

 useEffect(() => {
  fetch(rates1)
  .then(response => response.text())
  .then(xmlText => {
    // Store the XML text in local storage
    localStorage.setItem('rates', xmlText);
    // console.log(localStorage.getItem('rates'));
    parseXml(localStorage.getItem('rates'));
  });
  }, []);

  setTimeout(() => {
    console.log(rates);
  }, 1000);

  let sign = "->";

  const openSearch = (input) => {
    // console.log(input.target.value.length);
    if(input.target.value.length > 0) {
      document.getElementById("modal-search").style.visibility = "visible";
    }
    if(input.target.value.length === 0) {
      document.getElementById("modal-search").style.visibility = "hidden";
    }
  }

  return (
    <div className="main">
      <div className="search">
        <h2>RON {sign}</h2>
        <input type='text' placeholder='Cauta' autoComplete='false' autoCapitalize='false' onChange={(e) => openSearch(e)}/>
        <div className="modal-search" id="modal-search">
          <h2>Select currency</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
