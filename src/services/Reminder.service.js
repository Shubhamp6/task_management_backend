const cron = require("node-cron");
const ReminderModel = require("../model/Reminder.model");
const SendNotifcationService = require("./SendNotification.service");
const {
  NOTIFICATION_TITLE,
  NOTIFICATION_TYPE,
} = require("../utils/constants/common.constants");
const NotificationModel = require("../model/Notification.model");
const TaskModel = require("../model/Task.model");
const { default: mongoose } = require("mongoose");

const reminderService = cron.schedule("* * * * *", async () => {
  // Check for notifications that need to be sent
  const currentTime = new Date().toISOString();
  console.log(currentTime)
  const notificationsToSend = await ReminderModel.find({
    scheduled_time: { $lte: currentTime },
  });
  console.log("cron");
  // Send notifications
  notificationsToSend.forEach(async (notification) => {
    const task = await TaskModel.findById(
      mongoose.Types.ObjectId(notification.task)
    );
    const sendTo = assignees_working.map((assignee) => {
        return assignee.id;
    });

    await NotificationModel.create({
      title: NOTIFICATION_TITLE.reminder,
      body: notification.body,
      task: task._id,
      type: NOTIFICATION_TYPE.reminder,
      sentTo: sendTo,
    });
    await SendNotifcationService(
      { title: NOTIFICATION_TITLE.reminder, body: notification.body },
      sendTo
    );
  });

  // Remove sent notifications from the database
  await ReminderModel.deleteMany({ scheduled_time: { $lte: currentTime } });
});

module.exports = reminderService;
