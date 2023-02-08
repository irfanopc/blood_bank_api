// Middleware function to check if the user is authorized
const checkAuth = (req, res, next) => {
  const userType = req.headers.usertype;
  const userId = req.headers.userid;
  if (!userType || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Middleware function to check if the user is a hospital
const checkHospital = (req, res, next) => {
  const userType = req.headers.usertype;
  if (userType !== "hospital") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Middleware function to check if the user is a receiver
const checkReceiver = (req, res, next) => {
  const userType = req.headers.usertype;
  if (userType !== "receiver") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

module.exports = {
  checkAuth,
  checkHospital,
  checkReceiver,
};
