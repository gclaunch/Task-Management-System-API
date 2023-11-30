const path = require("path")
const { readFile, writeFile } = require("fs")
const { promisify } = require("util")
const { v4: uuid } = require("uuid")
const bycrypt = require("bcryptjs")

const tasks = require("../db/tasks.json")

const usersPath = path.join(__dirname, "../db/users.json")

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

module.exports.getAllUsers = async () => {
  const users = await readFileAsync(usersPath, "utf8")
  const usersParsed = JSON.parse(users)

  const usersWithTasks = usersParsed.map((user) => {
    const userTasks = tasks.filter((task) => task.uid === user.id)
    user.tasks = userTasks
    return user
  })

  return usersParsed
}

module.exports.addUser = async (user) => {
  const users = await readFileAsync(usersPath, "utf8")
  const usersParsed = JSON.parse(users)
  user.password = await bycrypt.hash(user.password, 10)
  user.id = uuid()
  usersParsed.push(user)
  await writeFileAsync(usersPath, JSON.stringify(usersParsed))

  return user
}

module.exports.deleteUser = async (user, userId) => {
  const users = await readFileAsync(usersPath, "utf8")
  const usersParsed = JSON.parse(users)

  for (let [i, user] of usersParsed.entries()) {
    if (user.email === userId) {
      usersParsed.splice(i, 1);
    }
  }

  await writeFileAsync(usersPath, JSON.stringify(usersParsed))

  return user
}

module.exports.comparePassword = async (password, hashedPassword) => {
  return await bycrypt.compare(password, hashedPassword)
}
