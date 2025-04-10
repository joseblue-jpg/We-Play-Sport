import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenVerifyAdmin = (req, res, next) => {
    const tokenBearer = req.headers.authorization;

    if (!tokenBearer) {
        return res.status(401).json({ message: "-" });
    }

    
    const token = tokenBearer.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "-" });
    }
    
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "-" });
        }
        if (decoded.is_admin !== 1) {
            return res.status(401).json({ message: "-" });
        }
        req.user_id = decoded.id;
        next();
    });
};