const LOG_TYPES = {
  checkInLog: 'checkInLog',
  checkOutLog: 'checkOutLog',
  breakInLog: 'breakInLog',
  breakOutLog: 'breakOutLog',
  periodicLog: 'periodicLog',
}

const USER_ROLES = {
  admin: 1,
  hr: 2,
  manager: 3,
  tl: 4,
  employee: 5,
  intern: 6,
};
const USER_DEPARTMENTS = [
  { name: "Marketing Team", value: 1 },
  { name: "Product Development Team", value: 2 },
  { name: "Admin & HR", value: 3 },
];

const USER_UPDATE_TYPE = {
  personalDetails: "presonalDetails",
  companyDetails: "companyDetails",
  bankDetails: "bankDetails",
  salaryDetails: "salaryDetails",
  taxesDetails: "taxesDetails",
  documents: "documents",
};
const DURATION_TYPES = {
  monthly: "monthly",
  daily: "daily",
};

const INQUIRY_STATUS = {
  purchase: 'purchased',
  interested: 'interested',
  notInterested: 'not interested',
  givenForDemo: 'given for demo',
}

const INQUIRY_TYPES = {
  directCustomer: 'directCustomer',
  storeCustomer: 'storeCustomer',
  storeReview: 'storeReview',
  storeManager: 'storeManager',
}

const VISIT_TYPES = {
  customer: 'customer',
  store: 'store',
}

const VISIT_STATUS = {
  started: 'started',
  ended: 'ended',
}

const VISIT_FETCH_TYPE = {
  byDate: 'byDate',
  byVisitType: 'byVisitType',
  fetchStatus: 'fetchStatus',
}

const PRODUCT_TYPE = {
  WeHearOX: 'WeHear OX',
  HearNU: 'HearNU',
  SAFE: 'SAFE',
  WeHear2: 'WeHear 2.0',
}

const REIMBURSEMENT_STATUS = {
  pending: "pending",
  rejected: "rejected",
  approved: "approved",
};

const REIMBURSEMENT_TYPE = {
  fuel: "fuel",
  food: "food",
  other: "other",
  travel: "travel",
};

const HALF_TYPE = {
  firstHalf: "first-half",
  secondHalf: "second-half",
  fullDay: "full-day",
};

const LEAVE_RESPONSE = {
  accepted: "Accepted",
  rejected: "Rejected",
  pending: "Under-Review",
};

const NOTIFICATION_TYPE = {
  general: "general",
  leave: "leave",
  reimbursement: "reimbursement",
  coff: "coff",
};

module.exports = {
  USER_DEPARTMENTS,
  LOG_TYPES,
  DURATION_TYPES,
  USER_ROLES,
  USER_UPDATE_TYPE,
  PRODUCT_TYPE,
  INQUIRY_TYPES,
  VISIT_TYPES,
  VISIT_STATUS,
  VISIT_FETCH_TYPE,
  HALF_TYPE,
  LEAVE_RESPONSE,
  NOTIFICATION_TYPE,
  REIMBURSEMENT_TYPE,
  REIMBURSEMENT_STATUS,
};
