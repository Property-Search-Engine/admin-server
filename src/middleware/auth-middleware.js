const { auth } = require("../firebase/firebase");

const authMiddleware = () => async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        const bearerToken = req.headers.authorization.substr(7);

        try {
            const userClaims = await auth.verifyIdToken(bearerToken);

            const { email, user_id } = userClaims;

            req.employee = {
                email: email,
                uid: user_id,
            };
            next();
        } catch (error) {
            next(error);
        }
    } else {
        return res.status(401).send({
            data: null,
            error: "Unauthorized",
        });
    }
}

module.exports = authMiddleware;