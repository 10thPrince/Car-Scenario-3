import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import RevokedToken from "../models/revokedTokenModel.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                token = req.headers.authorization.split(' ')[1];

                const revoked = await RevokedToken.findOne({ token });
                if (revoked) {
                    return res.status(401).json({ success: false, message: "Not Authorized. Token Revoked, Please Login Again!" })
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.userId).select("-password");

                next();
            } catch (err) {
                console.log(err);
                res.status(401).json({ success: false, message: "Not Authorized, Invalid Token/Token Failed" })
            }
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized , No Token" })
        }



    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}

