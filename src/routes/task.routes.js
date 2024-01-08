const express = require('express')
const CreateTaskController = require('../contoller/TaskController/CreateTask.controller')
const FetchTasksController = require('../contoller/TaskController/FetchTasks.controller')
const FetchTaskDetailsController = require('../contoller/TaskController/FetchTaskDetails.controller')
const AcceptOrDeclineTaskController = require('../contoller/TaskController/AcceptOrDeclineTask.controller')

const taskRoutes = express()

taskRoutes.post('/', CreateTaskController)
taskRoutes.post('/accept-or-decline', AcceptOrDeclineTaskController)
taskRoutes.get('/list', FetchTasksController)
taskRoutes.get('/', FetchTaskDetailsController)

module.exports = taskRoutes
