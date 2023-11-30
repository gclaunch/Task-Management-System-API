const router = require("express").Router()
const { paginate } = require("../../utils/helpers")

const { auth, admin } = require("../../utils/middleware")
const {
  getAllTasks,
  getTasksByUserId,
  addTask,
  updateTask,
  deleteTask,
} = require("../../utils/taskHelpers")

// Admin route for getting all tasks
router.get("/all", admin, async (req, res) => {
  try {
    let tasks = await getAllTasks()

    const queries = req.query

    if (Object.keys(queries).length && queries.limit) {
      tasks = paginate(tasks, queries.limit, queries.offset ?? 0)
    }

    res.status(200).json(tasks)
  } catch (err) {
    res.status(400).json(err)
  }
})

// Get tasks for current user
router.get("/", auth, async (req, res) => {
  try {
    let tasks = await getTasksByUserId(req.session.userId)

    const queries = req.query

    if (Object.keys(queries).length && queries.limit) {
      tasks = paginate(tasks, queries.limit, queries.offset ?? 0)
    }

    res.status(200).json(tasks)
  } catch (err) {
    res.status(400).json(err)
  }
})

// Create tasks and assign to current user
router.post("/create", auth, async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ message: "Missing title or description" })
    }

    const tasks = await addTask(req.body, req.session.userId)
    res.status(200)
      .json({
        message: "Task created.",
        tasks,
      })
  } catch (err) {
    res.status(400).json(err)
  }
})

// Find task by ID and update it
// Can update any number of fields
router.put("/update/:id", auth, async (req, res) => {
  const id = req.params.id
  const bodyKeys = Object.keys(req.body)

  try {
    if (bodyKeys.length === null) {
      return res.status(400).json({ message: "Missing task ID" })
    }

    let tasks = await getAllTasks()

    const index = tasks.findIndex((task) => task.id === id)

    if (index === -1) {
      return res.status(400).json({ message: "No task found" })
    }

    bodyKeys.forEach((key) => (tasks[index][key] = req.body[key]))

    await updateTask(tasks)

    res.status(200).json(tasks[index])
  } catch (err) {
    res.status(400).json({ err })
  }
})

// Delete task by ID
router.delete("/delete", auth, async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Missing task ID" })
    }

    const task = await deleteTask(req.body, req.body.id)
    res.status(200)
      .json({
        message: "Task deleted.",
      })
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
