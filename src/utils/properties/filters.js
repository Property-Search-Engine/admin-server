
function buildFiltersFromQuery(req) {
    const {
        kind = "Home",
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
        kind,
        sold,
        surface,
        maxPrice,
        minPrice,
        publicationDate,
        filters,
    };

    return kind == "Home" ?
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

function matchProperties(filters) {
    const obj = {
        "properties.kind": filters.kind || "Home",
        "properties.sold": filters.sold || false,
        "properties.surface": { $gte: filters.surface || 0 },
        "properties.price": { $gte: filters.minPrice, $lte: filters.maxPrice || Infinity },
        "properties.creation_date": { $gte: filters.publicationDate || 0 },
        //"properties.filters": filters.filters && { $in: filters.filters } || exists("properties.filters"),
        ...(filters.kind && filters.kind == "Home" ?
            matchHome(filters) :
            matchOffice(filters))
    };
    return obj;
}

function matchHome(filters) {
    return {};
}

function matchOffice(filters) {
    return {}
}


module.exports = {
    buildFiltersFromQuery,
    matchProperties
}
