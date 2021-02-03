const db = require("../models");
const { buildFiltersFromQuery, matchProperties } = require("../utils/properties/filters");

async function searchProperty(req, res, next) {
    const { uid } = req.user;
    const filters = buildFiltersFromQuery(req);
    // const properties = await db.Employee.aggregate()
    //     .exec()
    //     .catch(next);

    // return properties;

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

module.exports = {
    searchProperty,
    getPropertyById,
    editProperty,
    createProperty,
    deleteProperty,
    setPropertyAsSold,
};


