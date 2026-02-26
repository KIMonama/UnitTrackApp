import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("middlewarehit ");
  const token = req.headers.authorization?.split(" ")[1]; // Grabs token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret_key"
    );
    req.user = decoded; // Adds {id, adminCode to the request object}
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
