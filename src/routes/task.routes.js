const express = require('express')
const CreateTaskController = require('../contoller/TaskController/CreateTask.controller')
const FetchTasksController = require('../contoller/TaskController/FetchTasks.controller')

const taskRoutes = express()

taskRoutes.post('/', CreateTaskController)
taskRoutes.get('/', FetchTasksController)

module.exports = taskRoutes
