
function buildFiltersFromQuery(req) {
    const property = {
        kind: req.query.kind || "Home",
        sold: req.query.sold || false,
        surface: req.query.surface,
        maxPrice: req.query.maxPrice || Infinity,
        minPrice: req.query.minPrice || 0,
        publicationDate: req.query.publicationDate || 0,
        filters: req.query.filters || [],
    };

    const home = {
        ...property,
        homeType: req.query.homeType || [],
        bedRooms: req.query.bedRooms || [],
        bathRooms: req.query.bathRooms || [],
        equipment: req.query.equipment || [],
        condition: req.query.condition || [],
    }

    const office = {
        ...property,
        buildingUse: req.query.buildingUse || []
    }

    return property.kind == "Home" ? home : office;
}

function buildPropertyBaseMatchingRules(filters) {
    return {
        sold: filters.sold || false,
        surface: { $gte: filters.surface || 0 },
        price: { $gte: filters.minPrice, $lte: filters.maxPrice },
        createdAt: { $gte: filters.publicationDate },
        filters: filters.filters.length > 0 && { $in: filters.filters } || { $exists: true },
    }
}

function buildHomeMatchingRules(filters) {
    return {
        homeType: filters.homeType.length > 0 && { $in: filters.homeType } || { $exists: true },
        equipment: filters.equipment.length > 0 && { $in: filters.equipment } || { $exists: true },
        condition: filters.condition.length > 0 && { $in: filters.condition } || { $exists: true },

        bedRooms: filters.bedRooms.length > 0 ?
            !filters.bedRooms.includes("4+")
            && { $in: filters.bedRooms }
            || {
                $or: [{ $in: filters.bedRooms }, { $gte: 4 }]
            }
            : { $exists: true },

        bathRooms: filters.bathRooms.length > 0 ?
            !filters.bathRooms.includes("3+")
            && { $in: filters.bathRooms }
            || {
                $or: [{ $in: filters.bathRooms }, { $gte: 3 }]
            }
            : { $exists: true },
    }
}

function buildOfficeMatchingRules(filters) {
    return {
        buildingUse: filters.buildingUse.length > 0 && { $in: filters.buildingUse } || { $exists: true },
    }
}


module.exports = {
    buildFiltersFromQuery,
    buildPropertyBaseMatchingRules,
    buildHomeMatchingRules,
    buildOfficeMatchingRules
}
