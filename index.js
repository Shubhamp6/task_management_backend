const dotenv = require("dotenv");
const express = require("express");
const auth = require("./src/routes/auth.routes");
const users = require("./src/routes/user.routes");
const leave = require("./src/routes/leave.routes");
const salary = require("./src/routes/salary.routes")
const log = require("./src/routes/log.routes");
const visit = require("./src/routes/visit.routes");
const notification = require("./src/routes/notification.routes");
const middleware = require("./src/middleware/middleware");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./src/config/db.config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const tokenVerifier = require("./src/middleware/tokenVerifiers.middleware");
const reimbersementRoutes = require("./src/routes/reimbersement.route");
const holidayRoutes = require("./src/routes/holiday.routes");
const departmentRoutes = require("./src/routes/department.routes");
const fileAndImageRoutes = require("./src/routes/fileAndImage.routes");
const branchRoutes = require("./src/routes/branch.routes");
const employeeRoutes = require("./src/routes/emloyeeTyoe.routes");
const taskRoutes = require("./src/routes/task.routes");
const DailyUpdateRoutes = require("./src/routes/dailyupdates.routes");
dotenv.config();

const app = express()
app.use(express.json())
app.use(cookieparser())

process.on("uncaughtException", (error) =>
{
  console.log(error.message);
  console.log("Shutting Down the Server");
  process.exit(1);
});
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
)
app.use('/visitPhotos', express.static('visitPhotos'))

//CONNECT DATABASE

mongoose
  .connect(dbConfig.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
  {
    console.log("connected to DB");
  })
  .catch((err) =>
  {
    console.log(err);
  });

app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMT }))
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }))
app.use(middleware)
app.use('/api/auth', auth)
app.use('/api/user', tokenVerifier, users)
app.use('/api/leave', tokenVerifier, leave)

app.use('/api/holiday', tokenVerifier, holidayRoutes)
app.use('/api/task', tokenVerifier, taskRoutes)
app.use('/api/dailyUpdate', tokenVerifier, DailyUpdateRoutes)

app.use("/api/reimbersement", tokenVerifier, reimbersementRoutes);
app.use("/api/log", tokenVerifier, log);
app.use("/api/visit", tokenVerifier, visit);
app.use("/api/notification", tokenVerifier, notification);
app.use("/api/department",tokenVerifier, departmentRoutes);
app.use("/api/file-image", tokenVerifier, fileAndImageRoutes);
app.use("/api/branch",tokenVerifier, branchRoutes);
app.use("/api/employee-type",tokenVerifier, employeeRoutes);
app.use("/api/department", tokenVerifier, departmentRoutes);
app.use("/api/salary",  salary);

app.listen(process.env.PORT, () =>
{
  console.log("Started the server at " + process.env.PORT);
});
