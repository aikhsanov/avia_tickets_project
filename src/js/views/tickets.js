import currencyUI from "./currency";
import locations from "../store/locations";

class TicketsUI {
  constructor(currency) {
    this.container = document.querySelector(".tickets-sections .row");
    this.dropdownContent = document.querySelector(".dropdown-content");
    this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
  }

  renderTickets(tickets) {
    this.clearContainer();

    if (!tickets.length) {
      this.showEmptyMsg();
      return;
    }

    let fragment = "";
    const currency = this.getCurrencySymbol();
    tickets.forEach((ticket) => {
      const template = TicketsUI.ticketTemplate(ticket, currency);
      fragment += template;
    });
    this.container.insertAdjacentHTML("afterbegin", fragment);
    this.assignAddFavFavListener();
  }

  addToFavorites(button, lastSearch, favStore) {
    if (button.classList.contains("in-favorites")) {
      this.deleteFromFavorites(button, favStore);
      return;
    }

    button.classList.add("in-favorites");
    button.innerText = "In Favorites";
    favStore.push(
      lastSearch.find((ticket) => ticket.fav === +button.dataset.fav)
    );
    localStorage.setItem("favs", JSON.stringify(favStore));
    this.renderFavorites(favStore);
  }

  deleteFromFavorites(button, favStore) {
    if (document.querySelector(".ticket-card")) {
      const addToFavBtn = document.querySelector(
        `.add-to-favorites-btn[data-fav="${button.dataset.fav}"]`
      );
      if (addToFavBtn) {
        addToFavBtn.innerText = "Add to favorites";
        addToFavBtn.classList.remove("in-favorites");
      }
    }

    favStore = favStore.filter((ticket) => ticket.fav !== +button.dataset.fav);
    locations.favorites = favStore;
    localStorage.setItem("favs", JSON.stringify(favStore));
    if (locations.favorites.length > 0) {
      this.renderFavorites(favStore);
    } else {
      this.showEmptyFavsMsg();
    }
  }

  renderFavorites(favStore) {
    // if (!localStorage.getItem("favs")) return;
    let fragment = "";
    const currency = this.getCurrencySymbol();
    this.clearFavsContainer();
    favStore.forEach((ticket) => {
      const template = TicketsUI.favsTemplate(ticket, currency);
      fragment += template;
    });
    this.dropdownContent.insertAdjacentHTML("afterbegin", fragment);
    this.assignDelFavListener();
  }
  assignAddFavFavListener() {
    const favButton = document.querySelectorAll(".add-to-favorites a");
    favButton.forEach((button) => {
      button.addEventListener("click", () =>
        this.addToFavorites(button, locations.lastSearch, locations.favorites)
      );
    });
  }

  assignDelFavListener() {
    const delFromFavButton = document.querySelectorAll(".delete-favorite");
    delFromFavButton.forEach((button) => {
      button.addEventListener("click", (e) => {
        console.log("click");
        this.deleteFromFavorites(button, locations.favorites);
      });
    });
  }

  clearContainer() {
    this.container.innerHTML = "";
  }
  clearFavsContainer() {
    this.dropdownContent.innerHTML = "";
  }
  showEmptyMsg() {
    const template = TicketsUI.emptyMsgTemplate();
    this.container.insertAdjacentHTML("afterbegin", template);
  }
  showEmptyFavsMsg() {
    this.clearFavsContainer();
    const template = TicketsUI.emptyFavsTemplate();
    this.dropdownContent.insertAdjacentHTML("afterbegin", template);
  }

  static emptyMsgTemplate() {
    return ` <div class="tickets-empty-res-msg">
                По вашему запросу билетов не найдено.
            </div>`;
  }
  static emptyFavsTemplate() {
    return ` <div class="no-favorites-yet">
      You haven't added any favorite tickets yet
  </div>`;
  }
  static ticketTemplate(ticket, currency) {
    return `   <div class="col s12 m6">
                <div class="card ticket-card">
                    <div class="ticket-airline d-flex align-items-center">
                        <img
                                src="${ticket.airline_logo}"
                                class="ticket-airline-img"
                        />
                        <span class="ticket-airline-name"
                        >${ticket.airline_name}</span
                        >
                    </div>
                    <div class="ticket-destination d-flex align-items-center">
                        <div class="d-flex align-items-center mr-auto">
                            <span class="ticket-city">${ticket.origin_name} </span>
                            <i class="medium material-icons">flight_takeoff</i>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="medium material-icons">flight_land</i>
                            <span class="ticket-city">${ticket.destination_name}</span>
                        </div>
                    </div>
                    <div class="ticket-time-price d-flex align-items-center">
                        <span class="ticket-time-departure">${ticket.departure_at}</span>
                        <span class="ticket-price ml-auto">${currency} ${ticket.price}</span>
                    </div>
                    <div class="ticket-additional-info">
                        <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
                        <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
                    </div>
                    <div class="add-to-favorites">
                        <a class="waves-effect waves-light btn green accent-3 add-to-favorites-btn" data-fav="${ticket.fav}">Add to favorites</a>
                     </div>
                </div>
            </div>`;
  }
  static favsTemplate(ticket, currency) {
    return `<div class="favorite-item  d-flex align-items-start">
                <img
                  src="${ticket.airline_logo}"
                  class="favorite-item-airline-img"
                />
                <div class="favorite-item-info d-flex flex-column">
                  <div
                    class="favorite-item-destination d-flex align-items-center"
                  >
                    <div class="d-flex align-items-center mr-auto">
                      <span class="favorite-item-city">${ticket.origin_name}</span>
                      <i class="medium material-icons">flight_takeoff</i>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="medium material-icons">flight_land</i>
                      <span class="favorite-item-city">${ticket.destination_name}</span>
                    </div>
                  </div>
                  <div class="ticket-time-price d-flex align-items-center">
                    <span class="ticket-time-departure">${ticket.departure_at}</span>
                    <span class="ticket-price ml-auto">${currency} ${ticket.price}</span>
                  </div>
                  <div class="ticket-additional-info">
                    <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
                    <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
                  </div>
                  <a
                    class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto" data-fav="${ticket.fav}"
                    >Delete</a
                  >
                </div>
              </div>`;
  }
}
const ticketsUI = new TicketsUI(currencyUI);

export default ticketsUI;
