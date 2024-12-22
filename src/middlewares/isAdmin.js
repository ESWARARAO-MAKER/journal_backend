export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('role');
        const userRoles = await Role.find({ _id: { $in: user.role } });

        // Check if the user has admin role
        const isAdmin = userRoles.some((role) => role.role_name === "ADMIN");

        if (!isAdmin) {
            return res.status(403).send({ message: "Access denied. Admins only." });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error verifying admin status" });
    }
};
