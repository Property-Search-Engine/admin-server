const {
  getDefaultHome,
  getDefaultOffice,
  getHome,
  getOffice,
} = require("../../../utils/mock/requests/properties");

const {
  validateSearchFilters,
  validatePropertyInputs,
} = require("../properties-validator");

describe("joi validates filtering", () => {
  it("can validate home filters", async () => {
    const req = {
      query: {
        kind: "Home",
      },
    };
    await validateSearchFilters(req, null, () => console.log("yeah!"));
    expect(req.query).toMatchObject(getDefaultHome());
  });

  it("can validate office filters", async () => {
    const req = {
      query: {
        kind: "Office",
      },
    };
    await validateSearchFilters(req, null, () => console.log("yeah!"));
    expect(req.query).toMatchObject(getDefaultOffice());
  });

  //   it("can validate Home property", async () => {
  //     const req = {
  //       query: {
  //         kind: "Home",
  //       },
  //     };
  //     await validatePropertyInputs(req, null, () => console.log("yeah! Home"));
  //     expect(req.query).toMatchObject(getHome());
  //   });

  //   it("can validate Office property", async () => {
  //     const req = {
  //       query: {
  //         kind: "Office",
  //       },
  //     };
  //     await validatePropertyInputs(req, null, () => console.log("yeah! Office"));
  //     expect(req.query).toMatchObject(getOffice());
  //   });
});
