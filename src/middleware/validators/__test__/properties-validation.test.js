const {
    getDefaultHome, getDefaultOffice
} = require("../../../utils/mock/requests/properties");

const { validateSearchFilters } = require("../properties-validator");

describe("joi validates filtering", () => {
    it("can validate home filters", async () => {
        const req = { query: {
            kind: "Home"
        } };
        await validateSearchFilters(req, null, () => console.log("yeah!"));
        expect(req.query).toMatchObject(getDefaultHome());
    });

    it("can validate office filters", async () => {
        const req = { query: {
            kind: "Office"
        } };
        await validateSearchFilters(req, null, () => console.log("yeah!"));
        expect(req.query).toMatchObject(getDefaultOffice());
    });
});
