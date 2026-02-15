import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Grabs token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret_key"
    );
    req.user = decoded; // Adds {id, role, properties} to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
