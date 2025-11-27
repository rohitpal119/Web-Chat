import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token; // Get token from frontend headers

        // ✅ Check if token exists
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }

        // ✅ Try verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Extract user and check if exists
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to route
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}
