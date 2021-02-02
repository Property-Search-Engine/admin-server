const db = require("../models");

async function searchProperty(req, res, next) {
    //TODO: Search property by filters
    const { uid, email } = req.user;
    const filters = getFilters(req);


}

function getPropertyById(req, res, next) {
    //TODO: Get property by id
}

function deleteProperty(req, res, next) {
    //TODO: Delete property by id
}

function editProperty(req, res, next) {
    //TODO: Edit property by id
}

function createProperty(req, res, next) {
    //TODO: Create property
}

function setPropertyAsSold(req, res, next) {
    //TODO: Patch property to be sold
}

function getFilters(req) {
    const {
        type = "Home",
        sold = false,
        surface,
        maxPrice,
        minPrice = 0,
        publicationDate,
        filters = [],
        // Home Filters
        homeType = "house",
        bedRooms,
        bathRooms,
        equipment,
        condition,
        // Office filters
        buildingUse
    } = req.query;

    const property = {
        type,
        sold,
        surface,
        maxPrice,
        minPrice,
        publicationDate,
        filters,
    };

    return type == "Home" ?
        // Home
        {
            ...property,
            homeType,
            bedRooms,
            bathRooms,
            equipment,
            condition
        } :
        // Office
        { ...property, buildingUse };
}

module.exports = {
    searchProperty,
    getPropertyById,
    editProperty,
    createProperty,
    deleteProperty,
    setPropertyAsSold,
    getFilters
};


