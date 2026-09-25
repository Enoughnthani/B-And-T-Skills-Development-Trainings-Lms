export const SCOPE_ENDPOINTS = {
  admin: '/api/admin/announcements',
  'program-manager': '/api/program-manager/announcements',
  facilitator: '/api/facilitator/announcements',
};

export const SCOPE_TITLES = {
  admin: 'Announcements',
  'program-manager': 'Announcements',
  facilitator: 'Class Announcements',
};

export const SCOPE_DESCRIPTIONS = {
  admin: 'Send notices to users across the platform.',
  'program-manager': 'Send notices to your programmes and cohorts.',
  facilitator: 'Send notices to your classes.',
};

export const AUDIENCE_OPTIONS = {
  admin: [
    { value: 'ALL', label: 'Everyone', description: 'All users on the platform' },
    { value: 'LEARNERS', label: 'All learners', description: 'Every enrolled learner' },
    { value: 'FACILITATORS', label: 'All facilitators', description: 'Every facilitator' },
    { value: 'STAFF', label: 'Programme staff', description: 'Facilitators, assessors, moderators and mentors' },
    { value: 'PROGRAM', label: 'Specific programme', description: 'Everyone on a chosen programme', requiresId: 'programme' },
    { value: 'COHORT', label: 'Specific cohort', description: 'Everyone in a chosen cohort', requiresId: 'cohort' },
  ],
  'program-manager': [
    { value: 'MY_LEARNERS', label: 'All my learners', description: 'Every learner on your programmes' },
    { value: 'PROGRAM', label: 'Specific programme', description: 'Learners on a chosen programme', requiresId: 'programme' },
    { value: 'COHORT', label: 'Specific cohort', description: 'Learners in a chosen cohort', requiresId: 'cohort' },
    { value: 'FACILITATORS', label: 'Facilitators on my programmes', description: 'Facilitators assigned to your programmes' },
    { value: 'STAFF', label: 'Staff on my programmes', description: 'All staff assigned to your programmes' },
  ],
  facilitator: [
    { value: 'MY_CLASSES', label: 'All my classes', description: 'Every learner in every class you teach' },
    { value: 'CLASS', label: 'Specific class', description: 'Learners in one class', requiresId: 'class' },
  ],
};