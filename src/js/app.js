import "../css/style.css";
import "./plugins";
import locations from "./store/locations";
import formUI from "./views/form";
import currencyUI from "./views/currency";
import ticketsUI from "./views/tickets";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  favBlockInit();
  const form = formUI.form;

  //Events
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onFormSubmit();
  });

  //Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  function favBlockInit() {
    if (JSON.parse(localStorage.getItem("favs")).length > 0) {
      locations.favorites = JSON.parse(localStorage.getItem("favs"));
      ticketsUI.renderFavorites(locations.favorites);
      ticketsUI.assignDelFavListener();
    }
  }
  async function onFormSubmit() {
    // собрать данные из инпутов

    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    // CODE, CODE, 2021-09, 2021-10

    console.log(origin, destination, depart_date, return_date);
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }
});
