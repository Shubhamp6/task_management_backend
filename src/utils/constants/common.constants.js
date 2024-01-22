const PROJECT_TYPES = {
  software: "software",
  hardware: "hardware",
  other: "other",
};

const PRIORITIES = {
  high: "high",
  medium: "medium",
  low: "low",
};

const TASK_STATUS_TYPE = {
  inProgress: "inProgress",
  completed: "completed",
  rejected: "rejected",
  onHold: "onHold",
};

const TASK_FETCH_TYPE = {
  assingedTasks: "assingedTasks",
  myTasks: "myTasks",
};

const TASK_ACTION_TYPE = {
  accept: "accept",
  decline: "decline",
};

const NOTIFICATION_TYPE = {
  taskAssignedPrimary: "taskAssignedPrimary",
  taskAssignedSecondary: "taskAssignedSecondary",
  taskAccepted: "taskAccepted",
  taskDeclined: "taskDecline",
  taskStatusChanged: "taskStatusChanged",
  reminder: "reminder",
};

const NOTIFICATION_TITLE = {
  taskAssignedPrimary: "New Task Assigned",
  taskAssignedSecondary: "New Task Assigned",
  taskAccepted: "Task is Accepted",
  taskDeclined: "Task is Declined",
  taskStatusChanged: "Task Status is Changed",
  reminder: "Task Deadline Reminder",
};

const STICKY_NOTES_COLORS = {
  sage: "DCFFB7",
  peach: "FFB996",
  green: "DCFFB7",
  blue: "DCF2F1",
  pink: "FED9ED",
  F3B95F: "orange",
};

// const USER_ROLES = {
//   admin: 1,
//   hr: 2,
//   manager: 3,
//   tl: 4,
//   employee: 5,
//   intern: 6,
// };
// const USER_DEPARTMENTS = [
//   { name: "Marketing Team", value: 1 },
//   { name: "Product Development Team", value: 2 },
//   { name: "Admin & HR", value: 3 },
// ];

// const USER_UPDATE_TYPE = {
//   personalDetails: "presonalDetails",
//   companyDetails: "companyDetails",
//   bankDetails: "bankDetails",
//   salaryDetails: "salaryDetails",
//   taxesDetails: "taxesDetails",
//   documents: "documents",
// };
// const DURATION_TYPES = {
//   monthly: "monthly",
//   daily: "daily",
// };

// const INQUIRY_STATUS = {
//   purchase: 'purchased',
//   interested: 'interested',
//   notInterested: 'not interested',
//   givenForDemo: 'given for demo',
// }

// const INQUIRY_TYPES = {
//   directCustomer: 'directCustomer',
//   storeCustomer: 'storeCustomer',
//   storeReview: 'storeReview',
//   storeManager: 'storeManager',
// }

// const VISIT_TYPES = {
//   customer: 'customer',
//   store: 'store',
// }

// const VISIT_STATUS = {
//   started: 'started',
//   ended: 'ended',
// }

// const VISIT_FETCH_TYPE = {
//   byDate: 'byDate',
//   byVisitType: 'byVisitType',
//   fetchStatus: 'fetchStatus',
// }

// const PRODUCT_TYPE = {
//   WeHearOX: 'WeHear OX',
//   HearNU: 'HearNU',
//   SAFE: 'SAFE',
//   WeHear2: 'WeHear 2.0',
// }

// const REIMBURSEMENT_STATUS = {
//   pending: "pending",
//   rejected: "rejected",
//   approved: "approved",
// };

// const REIMBURSEMENT_TYPE = {
//   fuel: "fuel",
//   food: "food",
//   other: "other",
//   travel: "travel",
// };

// const HALF_TYPE = {
//   firstHalf: "first-half",
//   secondHalf: "second-half",
//   fullDay: "full-day",
// };

// const LEAVE_RESPONSE = {
//   accepted: "Accepted",
//   rejected: "Rejected",
//   pending: "Under-Review",
// };

// const NOTIFICATION_TYPE = {
//   general: "general",
//   leave: "leave",
//   reimbursement: "reimbursement",
//   coff: "coff",
// };

module.exports = {
  PROJECT_TYPES,
  PRIORITIES,
  TASK_STATUS_TYPE,
  TASK_FETCH_TYPE,
  TASK_ACTION_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_TITLE,
  STICKY_NOTES_COLORS,
  // USER_DEPARTMENTS,
  // LOG_TYPES,
  // DURATION_TYPES,
  // USER_ROLES,
  // USER_UPDATE_TYPE,
  // PRODUCT_TYPE,
  // INQUIRY_TYPES,
  // VISIT_TYPES,
  // VISIT_STATUS,
  // VISIT_FETCH_TYPE,
  // HALF_TYPE,
  // LEAVE_RESPONSE,
  // NOTIFICATION_TYPE,
  // REIMBURSEMENT_TYPE,
  // REIMBURSEMENT_STATUS,
};
