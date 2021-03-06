import api from "../services/apiService";
import { formatDate } from "../helpers/date";

export class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = {};
    this.lastSearch = {};
    this.airlines = {};
    this.favorites = [];
    this.formatDate = helpers.formatDate;
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);

    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    // console.log(this.cities, "cities");
    return response;
  }

  createShortCitiesList(cities) {
    // console.log(cities);
    return Object.entries(cities).reduce((acc, [, city]) => {
      // console.log(key);
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  serializeCountries(countries) {
    // { 'Country code': { ... } }
    if(!countries) return {}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      const full_name = `${
        city.name || city.name_translations.en
      },${country_name}`;
      acc[city.code] = { ...city, country_name, full_name };
      return acc;
    }, {});
  }
  serializeAirlines(airlines) {
    // { 'airline code': { ... } }

    return airlines.reduce((acc, item) => {
      const itemCopy = {...item}
      itemCopy.logo = `http://pics.avs.io/200/200/${itemCopy.code}.png`;
      itemCopy.name = itemCopy.name || itemCopy.name_translations.en;
      acc[itemCopy.code] = itemCopy;
      return acc;
    }, {});
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(
      (item) => item.full_name === key
    );
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].city;
  }

  getCountryNameByCode(code) {
    return this.countries[code].name;
  }

  getAirlineNameByCode(code) {
    return this.airlines[code]?.name || "";
  }
  getAirlineLogoByCode(code) {
    return this.airlines[code]?.logo || "";
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
    console.log(this.lastSearch);
  }

  serializeTickets(tickets) {
    // console.log(tickets);
    return Object.values(tickets).map((ticket) => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, "dd MMM yyyy hh:mm"),
        return_at: this.formatDate(ticket.return_at, "dd MMM yyyy hh:mm"),
        fav: Math.floor(Math.random() * 1100),
      };
    });
  }
}

const locations = new Locations(api, { formatDate });

export default locations;
