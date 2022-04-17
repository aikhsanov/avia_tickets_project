import locationsInstance, {Locations} from "../locations"
import {formatDate } from "../../helpers/date"
import api, {Api} from "../../services/apiService"

const countries = [{code: "RU", name: "Russia"}];
const cities = [{country_code:"RU", name: "Russia", city: "Moscow", code:"MSC", full_name: "Russia,Russia"}];
const airlines = [{country_code:"RU", name: "Airlines", code: "AVIA"}];

jest.mock("../../services/apiService",() => {
    const mockApi =
        {
            countries: jest.fn(() => Promise.resolve([{code: "RU", name: "Russia"}])),
            cities: jest.fn(() => Promise.resolve([{country_code: "RU", name: "Russia", city: "Moscow", code: "MSC"}])),
            airlines: jest.fn(() => Promise.resolve([{country_code: "RU", name: "Airlines", code: "AVIA"}]))
        }

    return {
        Api: jest.fn(() => mockApi)
    }
})

const apiService = new Api()

describe('Locations store tests', () => {
    beforeEach(() => {
        locationsInstance.countries = locationsInstance.serializeCountries(countries)
        locationsInstance.cities = locationsInstance.serializeCities(cities)
    })
    it("Check that locationInstance is instance of Locations class", () => {
        expect(locationsInstance).toBeInstanceOf(Locations)
    });
    it("Success Locations instance creation", () => {
        const instance = new Locations(api, {formatDate})
        expect(instance.countries).toBe(null);
        expect(instance.shortCitiesList).toEqual({})
        expect(instance.formatDate).toEqual(formatDate)
    });

    it("Check correct country serialize", () => {
        const res = locationsInstance.serializeCountries(countries);
        expect(res).toEqual({"RU":{code: "RU", name: "Russia"}})
    });

    it("Check correct cities serialize", () => {
        const res = locationsInstance.serializeCities(cities);
        expect(res).toEqual({MSC: {country_code:"RU", name: "Russia", city: "Moscow", code:"MSC", country_name: "Russia",
        full_name: "Russia,Russia",
        }})
    });
    it("Check correct airlines serialize", () => {
        const res = locationsInstance.serializeAirlines(airlines);
        expect(res).toEqual({"AVIA": {country_code:"RU", name: "Airlines", code: "AVIA", logo: "http://pics.avs.io/200/200/AVIA.png"}})
    });
    it("Check correct get city name by code", () => {
        const res = locationsInstance.getCityNameByCode("MSC");
        expect(res).toEqual("Moscow");
    });
    it("Check correct init method call", () => {
        const instance = new Locations(apiService, {formatDate})
        expect(instance.init()).resolves.toEqual([countries, cities, airlines])
    });

    it("Check correct short cities list", () => {
        const res = locationsInstance.createShortCitiesList(cities);
        expect(res).toEqual({"Russia,Russia": null})
    });

})
