function buildPropertyBaseMatchingRules(filters) {
    return {
        sold: filters.sold,
        surface: { $gte: filters.surface || 0 },
        price: { $gte: filters.minPrice, $lte: filters.maxPrice },
        createdAt: filters.publicationDate && { $gte: filters.publicationDate } || { $exists: true },
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
    buildPropertyBaseMatchingRules,
    buildHomeMatchingRules,
    buildOfficeMatchingRules
}
