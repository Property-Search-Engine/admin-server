const { getFilters } = require("../property-controller");
const { getMockFiltersDirtyHomeQuery,
    getMockFiltersDirtyOfficeQuery,
    getDefaultOffice,
    getDefaultHome,
    getOffice,
    getHome,
} = require("../../utils/mock/requests/properties");

describe("Unit test get filters", () => {
    it("can parse home filters", () => {
        const req = getMockFiltersDirtyHomeQuery();
        const filters = getFilters(req);
        expect(filters).toStrictEqual(getHome());
    });

    it("can parse default home filters", () => {
        const req = {
            query: { type: "Home" }
        };
        const filters = getFilters(req);
        expect(filters).toStrictEqual(getDefaultHome());
    })

    it("can parse office filters", () => {
        const req = getMockFiltersDirtyOfficeQuery();
        const filters = getFilters(req);
        expect(filters).toStrictEqual(getOffice());
    });

    it("can parse default home filters", () => {
        const req = {
            query: { type: "Office" }
        };
        const filters = getFilters(req);
        expect(filters).toStrictEqual(getDefaultOffice());
    })

});
