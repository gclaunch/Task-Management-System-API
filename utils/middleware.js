// Middleware function to check if user is logged in

module.exports.auth = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.status(401).json({ message: "Unauthorized. Login required." })
  }
}

module.exports.admin = (req, res, next) => {
  if (req.session.loggedIn && req.session.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: "Unauthorized. Admin access required." })
  }
}
