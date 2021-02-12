const fetch = require("node-fetch");
const config = require("../../config");

async function patchAddress(propertyId, address) {
    const newAddress = {...address};
    delete newAddress.coordinates;
    const res = await fetch(`${config.client_facing_url}/bookings/${propertyId}/address`, {
        method: "PATCH",
        body: JSON.stringify(newAddress),
        headers: { "auth": config.jwt.token, "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
}

module.exports = { patchAddress };