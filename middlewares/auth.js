const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);

    if (process.env.NODE_ENV === "test") {
      req.user = { _id: decoded.userId, role: "admin" }; // valeurs fictives
      return next();
    }
        const user = await User.findById(decoded.userId).select("-password");
        
    if (!user) {
      throw "Utilisateur introuvable";
    }
    req.user = user;
    console.log(user);
    
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
