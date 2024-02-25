const dotenv = require("dotenv");
const express = require("express");
const auth = require("./src/routes/auth.routes");
const users = require("./src/routes/user.routes");
const middleware = require("./src/middleware/middleware");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./src/config/db.config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const tokenVerifier = require("./src/middleware/tokenVerifiers.middleware");
const task = require("./src/routes/task.routes");
const project = require("./src/routes/project.routes");
const notification = require("./src/routes/notification.routes");
const whiteboard = require("./src/routes/whiteboard.routes");
const FetchProjectsWithTasksController = require("./src/contoller/ProjectController/FetchProjectsWithTasks.controller");
const reminderService = require("./src/services/Reminder.service");
const mindMap = require("./src/routes/mindMap.routes");
mongoose.set("strictQuery", false);
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieparser());

process.on("uncaughtException", (error) => {
  console.log(error.message);
  console.log("Shutting Down the Server");
  process.exit(1);
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/Attachments", express.static("Attachments"));

//CONNECT DATABASE

mongoose
  .connect(dbConfig.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
    app.listen(process.env.PORT, () => {
      console.log("Started the server at " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// schedule envoke
reminderService;
app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMT }));
app.use(bodyParser.urlencoded({ extended: true, limit: "150mb" }));
app.use(middleware);

app.use("/task-management/v1/api/auth", auth);
app.use("/task-management/v1/api/user", tokenVerifier, users);
app.use("/task-management/v1/api/task", tokenVerifier, task);
app.use("/task-management/v1/api/project", tokenVerifier, project);
app.use("/task-management/v1/api/notification", tokenVerifier, notification);
app.use("/task-management/v1/api/whiteboard", tokenVerifier, whiteboard);
app.use("/task-management/v1/api/mindmap", tokenVerifier, mindMap);
app.get(
  "/task-management/v1/api/calendar",
  tokenVerifier,
  FetchProjectsWithTasksController
);
