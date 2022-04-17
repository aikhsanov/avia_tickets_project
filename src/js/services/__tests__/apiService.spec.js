import api, {Api} from "../apiService"
import config from "../../config/apiConfig";
import axios from "axios"

jest.mock('axios')

const cities = [{country_code:"RU", name: "Moscow", code:"MSC"}];

describe("Api tests", () => {
    it("check api cities return data", async () => {
         axios.get.mockImplementationOnce(() => Promise.resolve({data: cities}))
        await expect(api.cities()).resolves.toEqual(cities)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/cities`)
    })
})
