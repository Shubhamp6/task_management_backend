const express = require('express')
const CreateTaskController = require('../contoller/TaskController/CreateTask.controller')
const FetchTasksController = require('../contoller/TaskController/FetchTasks.controller')
const FetchTaskDetailsController = require('../contoller/TaskController/FetchTaskDetails.controller')
const AcceptOrDeclineTaskController = require('../contoller/TaskController/AcceptOrDeclineTask.controller')
const checkAcceptOrDeclinePremission = require('../middleware/checkAcceptOrDeclinePremission.middleware')
const checkAssingeesAddAuthority = require('../middleware/checkAssingeesAddAuthority.middleware')
const AddAssingeesController = require('../contoller/TaskController/AddAssingees.controller')
const checkTaskStatusUpdatePermission = require('../middleware/checkTaskStatusUpdatePermission.middleware')
const UpdateTaskStatusController = require('../contoller/TaskController/UpdateTaskStatus.controller')
const taskOwnerVerifier = require('../middleware/taskOwnerVerifier.middleware')
const UpdateTaskController = require('../contoller/TaskController/UpdateTask.controller')

const taskRoutes = express()

taskRoutes.post('/', CreateTaskController)
taskRoutes.post('/accept-or-decline',checkAcceptOrDeclinePremission, AcceptOrDeclineTaskController)
taskRoutes.post('/add-assignees',checkAssingeesAddAuthority, AddAssingeesController)
taskRoutes.patch('/update-status',checkTaskStatusUpdatePermission, UpdateTaskStatusController)
taskRoutes.patch('/', taskOwnerVerifier, UpdateTaskController)
taskRoutes.get('/list', FetchTasksController)
taskRoutes.get('/', FetchTaskDetailsController)

module.exports = taskRoutes
