import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return status(403).send("Access Denied");

        if (token.startsWith("Beared")) {
            token = token.slice(7, token.length).trimleft();

        }

        const verified = jwt.verify(token, "mytest");
        req.user = verified;
        next();



    } catch (error) {

        res.status(500).json({ error: error.message });

    }
}