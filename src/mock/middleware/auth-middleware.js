const mockAuth = (employee_id, mail) => {
    return jest.fn(() => {
        return (req, _, next) => {
            req.employee = {
                uid: employee_id,
                email: mail
            }
            next();
        }
    })
};

module.exports = mockAuth;