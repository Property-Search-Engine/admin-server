const { auth } = require("../../firebase/firebase");

async function getFbUserOrCreate(email, password) {
    try {
        return await auth.getUserByEmail(email);
    } catch (err) {
        if (err.code == 'auth/user-not-found') {
            return await auth.createUser({ email, password })
        }
        throw (err);
    }
}

module.exports = { getFbUserOrCreate };