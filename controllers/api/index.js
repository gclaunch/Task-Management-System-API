const router = require("express").Router()
const auth = require("./auth")
const tasks = require("./tasks")

// split up route handling
router.use("/auth", auth)
router.use("/tasks", tasks)

module.exports = router
