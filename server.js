// Require Packages
const express = require("express")
const session = require("express-session")
require("dotenv").config()

// Require Routes
const routes = require("./controllers")

// Create Express App
const app = express()

// Set PORT from host or default to 3001
const PORT = process.env.PORT || 3001

// Configure Session
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
}

// Initialize Session
app.use(session(sess))

// Set up Express to handle data parsing
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)

// Listen for requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
