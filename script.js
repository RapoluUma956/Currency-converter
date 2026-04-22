
const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

document.addEventListener("DOMContentLoaded", () => {
    updateExchangeRate();

    for (let select of dropdowns) {
        for (currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            if(select.name === "from" && currCode === "USD"){
                newOption.selected = "selected"
            }
            if(select.name === "to" && currCode === "INR"){
                newOption.selected = "selected"
            }
            select.append(newOption);
        }

        select.addEventListener("change", (evt)=>{
            updateFlag(evt.target);
        })
    }
});


const updateFlag = (ele)=>{
    let currCode = ele.value;
    let countryCode = countryList[currCode]
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = ele.parentElement.querySelector("img");
    img.src = newSrc;
};


btn.addEventListener("click", async (evt)=>{
    evt.preventDefault();
    updateExchangeRate();
});

async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    if(isNaN(amtVal) || amtVal < 1){
        amtVal = 1;
        amount.value = "1";
    }

    try {
        const URL = `${BASE_URL}${fromCurr.value}`;
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        let rate = data.rates[toCurr.value];
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Please try again.";
        console.error('Fetch error:', error);
    }
}