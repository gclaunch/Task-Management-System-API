const path = require("path")
const { readFile, writeFile } = require("fs")
const { promisify } = require("util")
const { v4: uuid } = require("uuid")

const tasksPath = path.join(__dirname, "../db/tasks.json")

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

module.exports.getAllTasks = async () => {
  const tasks = await readFileAsync(tasksPath, "utf8")
  const tasksParsed = JSON.parse(tasks)

  return tasksParsed
}

module.exports.getTasksByUserId = async (userId) => {
  const tasks = await readFileAsync(tasksPath, "utf8")
  const tasksParsed = JSON.parse(tasks)
  const userTasks = tasksParsed.filter((task) => task.uid === userId)

  return userTasks
}

module.exports.addTask = async (task, userId) => {
  const tasks = await readFileAsync(tasksPath, "utf8")
  const tasksParsed = JSON.parse(tasks)
  task.id = uuid()
  task.uid = userId
  tasksParsed.push(task)
  await writeFileAsync(tasksPath, JSON.stringify(tasksParsed))

  return task
}

module.exports.updateTask = async (tasks) => {
  await writeFileAsync(tasksPath, JSON.stringify(tasks))
} 

module.exports.deleteTask = async (task, taskId) => {
  const tasks = await readFileAsync(tasksPath, "utf8")
  const tasksParsed = JSON.parse(tasks)

  for (let [i, task] of tasksParsed.entries()) {
    if (task.id === taskId) {
      tasksParsed.splice(i, 1);
    }
  }

  await writeFileAsync(tasksPath, JSON.stringify(tasksParsed))

  return task
}