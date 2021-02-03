const db = require("../models");
const {
    buildPropertyBaseMatchingRules,
    buildHomeMatchingRules,
    buildOfficeMatchingRules
} = require("../utils/properties/filters");

async function searchProperty(req, res, next) {
    const { uid } = req.employee;
    const filters = req.query;
    const properties = await
        (filters.kind == "Home" ?
            db.Home.find({
                employee_id: uid,
                ...buildPropertyBaseMatchingRules(filters),
                ...buildHomeMatchingRules(filters)
            })
            : db.Office.find({
                employee_id: uid,
                ...buildPropertyBaseMatchingRules(filters),
                ...buildOfficeMatchingRules(filters)
            })
        )
            .sort({ created_at: -1 })
            .lean()
            .exec()
            .catch(next);

    res.status(200).send({
        data: properties,
        error: null,
    });
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


