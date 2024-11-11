import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Split to get the token part

  // If no token is found, respond with a 401 Unauthorized status
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({ message: error });
  }
};

export default authenticateToken;
