const router = require("express").Router()
const { v4: uuid } = require("uuid")

const users = require("../../db/users.json")
const {
  addUser,
  deleteUser,
  getAllUsers,
  comparePassword,
} = require("../../utils/userHelpers")
const { auth, admin } = require("../../utils/middleware")

// Login
router.post("/login", async (req, res) => {
  try {
    // Find the user with the given email
    const userData = users.find((user) => user.email === req.body.email)

    if (!userData) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" })
    }

    if (comparePassword(req.body.password, userData.password)) {
      req.session.save(() => {
        req.session.userId = userData.id
        req.session.loggedIn = true

        if (userData.isAdmin) {
          req.session.isAdmin = true
        }

        // Remove the password from the userData before sending it back to the client
        const { password, ...userDataWithoutPassword } = userData

        res.status(200)
          .json({
            user: userDataWithoutPassword,
            message: "You are now logged in!",
          })
      })
    } else {
      return res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" })
    }
  } catch (err) {
    res.status(400).json(err)
  }
})

// Register a user
router.post("/register", async (req, res) => {
  try {
    if (users.find((user) => user.email === req.body.email)) {
      return res.status(400).json({ message: "User already exists" })
    }

    const newUser = addUser({
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    })

    req.session.save(() => {
      req.session.userId = newUser.id
      req.session.loggedIn = true
      res.status(200).json({ user: newUser, message: "You are now logged in!" })
    })
  } catch (err) {
    res.status(400).json(err)
  }
})

// Delete a user by email
router.delete("/delete", admin, async (req, res) => {
  try {
    const userData = users.find((user) => user.email === req.body.email)

    if (!userData) {
      return res
        .status(400)
        .json({ message: "User not found." })
    }

    const existingUser = await deleteUser(req.body, req.body.email)

    req.session.save(() => {
      req.session.userId = existingUser.id
      req.session.loggedIn = true
      res.status(200).json({ user: existingUser, message: "User deleted." })
    })
  } catch (err) {
    res.status(400).json(err)
  }
})

// Logout
router.post("/logout", async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end()
    })
  } else {
    res.status(404).end()
  }
})

// Get all users and see task assignments
router.get("/all", admin, async (req, res) => {
  try {
    const allUsers = await getAllUsers()
    const usersWithoutPasswords = allUsers.map(({ password, ...rest }) => rest)
    res.status(200).json(usersWithoutPasswords)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
