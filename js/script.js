"use strict";

const backBtn = document.querySelector(".back");
const borderCountryBtn = document.querySelectorAll(".border-countries-btn");
const borderContainer = document.querySelector(".country-detailed__border");
const countriesContainer = document.querySelector(".countries-container");
const countryDetailed = document.querySelector(".country-detailed");
const searchbar = document.querySelector(".searchdropdown");
const searchInput = document.querySelector(".searchcountry");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const filterEurope = document.getElementById("europe");
const filterAsia = document.getElementById("asia");
const filterAmericas = document.getElementById("americas");
const filterAfrica = document.getElementById("africa");
const filterOceania = document.getElementById("oceania");
const filterArr = [
  filterAsia,
  filterAfrica,
  filterAmericas,
  filterEurope,
  filterOceania,
];
const darkModeSwitcher = document.querySelector(".navigation__darklight");

let countries;
let borders = [];
let allBorders;
let darkModeStatus = 0;

fetch("https://restcountries.eu/rest/v2/all")
  .then((res) => res.json())
  .then((data) => initialize(data))
  .catch((err) => console.log("Error:", err));

function generateMarkup(c) {
  let markup = `
  <div class="country-card">
        <div class="country-flag">
          <img
            src="${c.flag}"
            alt="flag"
            class="flag"
          />
        </div>
        <div class="country-info">
          <h3 class="country-info__name">${c.name}</h3>
          <p class="country-info__rest">
            <br /><span class="boldit">Population:</span> ${c.population.toLocaleString()}
          </p>
          <p class="country-info__rest">
            <span class="boldit">Region:</span> ${c.region}
          </p>
          <p class="country-info__rest">
            <span class="boldit">Capital:</span> ${c.capital}
          </p>
        </div>
      </div>
  `;
  return markup;
}

function generateDetailedCountryMarkup(c) {
  let languages = "";
  let currencies = "";
  countries.forEach((el) => {
    c.borders.forEach((country) => {
      if (country === el.alpha3Code) {
        borders.push(el.name);
      }
    });
  });
  c.languages.forEach((el) => {
    languages += el.name + " ";
  });
  c.currencies.forEach((el) => {
    currencies += el.name + " ";
  });
  let borderBtnMarkup = ``;
  borders.forEach((border) => {
    borderBtnMarkup += `<button class="border-countries-btn" id="border-countries-btn">${border}</button>`;
  });

  if (borderBtnMarkup === "") {
    borderBtnMarkup += `<p class="country-detailed__rest"> This country does not have any border countries :(</p>`;
  }

  let markup = `
  <div class="country-detailed">
  <div class="country-detailed-flag">
    <img
      src="${c.flag}"
      alt="flag"
      class="country-detailed__flagimg"
    />
  </div>
  <div class="country-detailed__info">
    <h1 class="country-detailed__name">${c.name}</h1>
    <div class="country-detailed__container">
      <div class="country-detailed__container1">
        <p class="country-detailed__rest">
          <span class="boldit">Native Name:</span> ${c.nativeName}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Population:</span> ${c.population.toLocaleString()}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Region:</span> ${c.region}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Sub Region:</span> ${c.subregion}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Capital:</span> ${c.capital}
        </p>
      </div>
      <div class="country-detailed__container2">
        <p class="country-detailed__rest">
          <span class="boldit">Top Level Domain:</span> ${c.topLevelDomain}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Currencies:</span> ${currencies}
        </p>
        <p class="country-detailed__rest">
          <span class="boldit">Languages:</span> ${languages}
        </p>
      </div>
    </div>
    <div class="country-detailed__border">
      <p class="country-detailed__rest">
        <span class="boldit">Border Countries:</span>
      </p>
      ${borderBtnMarkup}
    </div>
  </div>
</div>
  `;

  return markup;
}

function initialize(countriesData) {
  countries = countriesData;
  countries.forEach((c) => {
    let markup = generateMarkup(c);
    countriesContainer.insertAdjacentHTML("beforeend", markup);
  });
  // console.log(
  //   countriesContainer.children[4].children[1].children[0].textContent
  // );
  if (darkModeStatus === 1) {
    let cards = Array.from(document.querySelectorAll(".country-card"));
    cards.forEach((card) => {
      card.style.backgroundColor = "hsl(207, 26%, 17%)";
      card.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    });
  }
  let allCountries = Array.from(countriesContainer.children);
  allCountries.forEach((el) => {
    el.addEventListener("click", function () {
      // console.log(el.children[1].children[0].textContent);
      searchbar.style.display = "none";
      countriesContainer.innerHTML = "";
      backBtn.style.display = "block";
      countries.forEach((c) => {
        if (c.name === el.children[1].children[0].textContent) {
          let markup = generateDetailedCountryMarkup(c);
          window.location.hash = `${c.name}`;
          countriesContainer.insertAdjacentHTML("beforeend", markup);
        }
      });
      let btns = Array.from(document.querySelectorAll(".border-countries-btn"));
      if (darkModeStatus === 1) {
        btns.forEach((btn) => {
          btn.style.backgroundColor = "hsl(207, 26%, 17%)";
          btn.style.color = "#fff";
          btn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
        });
      }
      changeCountry();
    });
  });
}

function changeCountry() {
  let allBorders = Array.from(
    countriesContainer.children[0].children[1].children[2].children
  );
  // console.log(allBorders);
  for (let i = 1; i < allBorders.length; i++) {
    allBorders[i].addEventListener("click", function () {
      countriesContainer.innerHTML = "";
      // console.log(allBorders[i].textContent);
      countries.forEach((c) => {
        if (allBorders[i].textContent === c.name) {
          borders = [];
          let markup = generateDetailedCountryMarkup(c);
          window.location.hash = `${c.name}`;
          countriesContainer.insertAdjacentHTML("beforeend", markup);
        }
      });
      let btns = Array.from(document.querySelectorAll(".border-countries-btn"));
      if (darkModeStatus === 1) {
        btns.forEach((btn) => {
          btn.style.backgroundColor = "hsl(207, 26%, 17%)";
          btn.style.color = "#fff";
          btn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
        });
      }
      changeCountry();
    });
  }
}

searchInput.addEventListener("input", function () {
  countriesContainer.innerHTML = "";
  countries.forEach((c) => {
    if (c.name.includes(searchInput.value)) {
      let markup = generateMarkup(c);
      countriesContainer.insertAdjacentHTML("beforeend", markup);
    }
  });
  let allCountries = Array.from(countriesContainer.children);
  allCountries.forEach((el) => {
    el.addEventListener("click", function () {
      // console.log(el.children[1].children[0].textContent);
      searchbar.style.display = "none";
      countriesContainer.innerHTML = "";
      backBtn.style.display = "block";
      countries.forEach((c) => {
        if (c.name === el.children[1].children[0].textContent) {
          let markup = generateDetailedCountryMarkup(c);
          countriesContainer.insertAdjacentHTML("beforeend", markup);
        }
      });
      let btns = Array.from(document.querySelectorAll(".border-countries-btn"));
      if (darkModeStatus === 1) {
        btns.forEach((btn) => {
          btn.style.backgroundColor = "hsl(207, 26%, 17%)";
          btn.style.color = "#fff";
          btn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
        });
      }
      changeCountry();
    });
  });
});

filterArr.forEach((el) => {
  el.addEventListener("click", function () {
    countriesContainer.innerHTML = "";
    countries.forEach((c) => {
      if (c.region === el.innerHTML) {
        let markup = generateMarkup(c);
        countriesContainer.insertAdjacentHTML("beforeend", markup);
      }
    });
    let allCountries = Array.from(countriesContainer.children);
    allCountries.forEach((el) => {
      el.addEventListener("click", function () {
        // console.log(el.children[1].children[0].textContent);
        searchbar.style.display = "none";
        countriesContainer.innerHTML = "";
        backBtn.style.display = "block";
        countries.forEach((c) => {
          if (c.name === el.children[1].children[0].textContent) {
            let markup = generateDetailedCountryMarkup(c);
            countriesContainer.insertAdjacentHTML("beforeend", markup);
          }
        });
        changeCountry();
      });
    });
  });
});

backBtn.addEventListener("click", function () {
  countriesContainer.innerHTML = "";
  searchbar.style.display = "flex";
  window.location.hash = ``;
  borders = [];
  fetch("https://restcountries.eu/rest/v2/all")
    .then((res) => res.json())
    .then((data) => initialize(data))
    .catch((err) => console.log("Error:", err));
  backBtn.style.display = "none";
});

darkModeSwitcher.addEventListener("click", function () {
  if (darkModeStatus === 0) {
    document.getElementById("darkIkonica").classList.remove("fa-moon");
    document.getElementById("darkIkonica").classList.add("fa-sun");
    document.querySelector(".mode").textContent = "Light Mode";
    document.body.classList.add("dark-mode");
    let cards = Array.from(document.querySelectorAll(".country-card"));
    cards.forEach((card) => {
      card.style.backgroundColor = "hsl(207, 26%, 17%)";
      card.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    });
    document.querySelector(".navigation").style.backgroundColor =
      "hsl(207, 26%, 17%)";
    document.querySelector(".searchcountry").style.backgroundColor =
      "hsl(207, 26%, 17%)";
    document.querySelector(".searchcountry").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    document.querySelector(".searchcountry").style.color = "#fff";
    document.querySelector(".btn-secondary").style.backgroundColor =
      "hsl(207, 26%, 17%)";
    document.querySelector(".btn-secondary").style.color = "#fff";
    document.querySelector(".btn-secondary").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    document.querySelector(".dropdown-menu").style.backgroundColor =
      "hsl(207, 26%, 17%)";
    document.querySelector(".dropdown-menu").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    let regions = Array.from(document.querySelectorAll(".dropdown-item"));
    regions.forEach((region) => {
      region.classList.add("dark-mode");
    });
    let btns = Array.from(document.querySelectorAll(".border-countries-btn"));
    btns.forEach((btn) => {
      btn.style.backgroundColor = "hsl(207, 26%, 17%)";
      btn.style.color = "#fff";
      btn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    });
    backBtn.style.backgroundColor = "hsl(207, 26%, 17%)";
    backBtn.style.color = "#fff";
    backBtn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.35)";
    darkModeStatus = 1;
  } else {
    document.getElementById("darkIkonica").classList.add("fa-moon");
    document.getElementById("darkIkonica").classList.remove("fa-sun");
    document.querySelector(".mode").textContent = "Dark Mode";
    document.body.classList.remove("dark-mode");
    let cards = Array.from(document.querySelectorAll(".country-card"));
    cards.forEach((card) => {
      card.style.backgroundColor = "#fff";
      card.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.05)";
    });
    document.querySelector(".navigation").style.backgroundColor = "#fff";
    document.querySelector(".searchcountry").style.backgroundColor = "#fff";
    document.querySelector(".searchcountry").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.05)";
    document.querySelector(".searchcountry").style.color = "hsl(200, 15%, 8%)";
    document.querySelector(".btn-secondary").style.backgroundColor = "#fff";
    document.querySelector(".btn-secondary").style.color = "hsl(200, 15%, 8%)";
    document.querySelector(".btn-secondary").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.05)";
    document.querySelector(".dropdown-menu").style.backgroundColor = "#fff";
    document.querySelector(".dropdown-menu").style.boxShadow =
      "0px 0px 13px 4px rgba(0, 0, 0, 0.05)";
    let regions = Array.from(document.querySelectorAll(".dropdown-item"));
    regions.forEach((region) => {
      region.classList.remove("dark-mode");
    });
    let btns = Array.from(document.querySelectorAll(".border-countries-btn"));
    btns.forEach((btn) => {
      btn.style.backgroundColor = "#fff";
      btn.style.color = "hsl(200, 15%, 8%)";
      btn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.25)";
    });
    backBtn.style.backgroundColor = "#fff";
    backBtn.style.color = "hsl(200, 15%, 8%)";
    backBtn.style.boxShadow = "0px 0px 13px 4px rgba(0, 0, 0, 0.25)";
    darkModeStatus = 0;
  }
});
