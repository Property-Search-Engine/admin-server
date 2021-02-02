const baseProperties = {
    sold: false,
    surface: 200,
    maxPrice: 100000,
    minPrice: 0,
    publicationDate: `${Date.now()}`,
    filters: ["terrace"],
}

const baseDefaultProperties = {
    sold: false,
    surface: undefined,
    maxPrice: undefined,
    minPrice: 0,
    publicationDate: undefined,
    filters: [],
}

const homeProperties = {
    type: "Home",
    homeType: "house",
    bedRooms: 3,
    bathRooms: 2,
    equipment: "none",
    condition: "newHome",
    ...baseProperties
}

const homeDefaultProperties = {
    ...baseDefaultProperties,
    type: "Home",
    homeType: "house",
    bedRooms: undefined,
    bathRooms: undefined,
    equipment: undefined,
    condition: undefined,
}

const officeProperties = {
    type: "Office",
    buildingUse: "private",
    ...baseProperties
}

const officeDefaultProperties = {
    ...baseDefaultProperties,
    type: "Office",
    buildingUse: undefined
}

const dirtyHome = {
    ...homeProperties,
    otherThing: "yay",
    nonImportant: "bleh",
    patata: "hi"
}

const dirtyOffice = {
    ...officeProperties,
    otherThing: "yay",
    nonImportant: "bleh",
    patata: "hi"
}

function getHome() {
    return homeProperties;
}

function getOffice() {
    return officeProperties;
}

function getDefaultHome() {
    return homeDefaultProperties;
}

function getDefaultOffice() {
    return officeDefaultProperties;
}

function getMockFiltersDirtyHomeQuery() {
    return {
        query: dirtyHome
    }
}

function getMockFiltersDirtyOfficeQuery() {
    return {
        query: dirtyOffice
    }
}

module.exports = { getMockFiltersDirtyHomeQuery, getMockFiltersDirtyOfficeQuery, getHome, getOffice, getDefaultOffice, getDefaultHome };