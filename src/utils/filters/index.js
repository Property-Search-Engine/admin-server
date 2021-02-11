function buildPropertyBaseMatchingRules(filters) {
    return {
        sold: filters.sold,
        surface: { $gte: filters.surface || 0 },
        price: { $gte: filters.minPrice, $lte: filters.maxPrice },
        createdAt: filters.publicationDate && { $gte: filters.publicationDate } || { $exists: true },
        filters: filters.filters.length > 0 && { $in: filters.filters } || { $exists: true },
        "address.city": filters.city && { $regex: new RegExp(filters.city, "i") } || { $exists: true }
    }
}

function buildHomeMatchingRules(filters) {
    return {
        homeType: filters.homeType.length > 0 && { $in: filters.homeType } || { $exists: true },
        equipment: filters.equipment.length > 0 && { $in: filters.equipment } || { $exists: true },
        condition: filters.condition.length > 0 && { $in: filters.condition } || { $exists: true },
        bedRooms: filters.bedRooms.length > 0 ?
            !filters.bedRooms.includes("4p")
            && { $in: filters.bedRooms }
            || { $or: [{ $in: filters.bedRooms }, { $gte: 4 }] }
            : { $exists: true },
        bathRooms: filters.bathRooms.length > 0 ?
            !filters.bathRooms.includes("3p")
            && { $in: filters.bathRooms }
            || { $or: [{ $in: filters.bathRooms }, { $gte: 3 }] }
            : { $exists: true },
    }
}

function buildOfficeMatchingRules(filters) {
    return {
        buildingUse: filters.buildingUse.length > 0 && { $in: filters.buildingUse } || { $exists: true },
    }
}

async function searchFilteredProperties(filters, _employeeId) {
    const rules = {
      ...buildPropertyBaseMatchingRules(filters),
      ...(filters.kind == "Home" ?
        buildHomeMatchingRules(filters) :
        buildOfficeMatchingRules(filters)
      )
    }
    if (_employeeId) rules.employee_id = _employeeId;
  
    return await (filters.kind == "Home" ? db.Home.find(rules) : db.Office.find(rules))
      .sort({ created_at: -1 })
      .select("_id employee_id sold kind bedRooms bathRooms address price surface buildingUse images")
      .lean()
      .exec()
  }

module.exports = {
    buildPropertyBaseMatchingRules,
    buildHomeMatchingRules,
    buildOfficeMatchingRules,
    searchFilteredProperties
}
