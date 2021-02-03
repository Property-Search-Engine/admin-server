const db = require("../models");

async function searchProperty(req, res, next) {
    //TODO: Search property by filters
    const { uid } = req.user;
    const filters = getFilters(req);
    const properties = await db.Employee.aggregate([
        { $match: { "_id": uid } },
        { $unwind: "$properties" },
        {
            $match: {
                "grades.grade": { $gte: 90 }
            }
        },
        { $replaceRoot: { newRoot: "$properties" } },
    ])
        .exec()
        .catch(next);

    return properties;
    
    // res.status(200).send({
    //     data: properties,
    //     error: null,
    // });
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


