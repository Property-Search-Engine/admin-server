const db = require("../models");

function searchProperty(req, res, next) {
    //TODO: Search property by filters
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

module.exports = { searchProperty, getPropertyById, editProperty, createProperty, deleteProperty, setPropertyAsSold };


