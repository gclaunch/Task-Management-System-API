const router = require("express").Router()
const api = require("./api")

// split up route handling
router.use("/api", api)

module.exports = router
