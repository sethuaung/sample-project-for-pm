export const DEMO = {
  projects: [
    { id: 'P1', name: 'Website Redesign', color: '#6366F1', budget: 12000, team: 'T1' },
    { id: 'P2', name: 'Mobile App', color: '#EF4444', budget: 30000, team: 'T2' },
    { id: 'P3', name: 'Payments API', color: '#10B981', budget: 50000, team: 'T1' }
  ],
  users: [
    { id: 'U1', name: 'Aung', capacity: 40 },
    { id: 'U2', name: 'Mya', capacity: 32 },
    { id: 'U3', name: 'Ko', capacity: 24 },
    { id: 'U4', name: 'Su', capacity: 36 }
  ],
  roles: [
    { id: 'R1', name: 'Product Manager' },
    { id: 'R2', name: 'Designer' },
    { id: 'R3', name: 'Frontend' },
    { id: 'R4', name: 'Backend' },
    { id: 'R5', name: 'QA' }
  ],
  teams: [
    { id: 'T1', name: 'Core Web Team', members: ['U1','U3','U4'] },
    { id: 'T2', name: 'Mobile Team', members: ['U2','U4'] }
  ],
  staff: [
    { userId: 'U1', roleId: 'R1' },
    { userId: 'U2', roleId: 'R2' },
    { userId: 'U3', roleId: 'R3' },
    { userId: 'U4', roleId: 'R4' }
  ],
  tasks: [
    { id: 'T1', title: 'Discovery', project: 'P1', assignee: 'U1', start: '2025-10-01', end: '2025-10-10', status: 'Done', hours: 40, billable: true, budgetUsed: 2000, release: 'v1.0' },
    { id: 'T2', title: 'Design', project: 'P1', assignee: 'U2', start: '2025-10-08', end: '2025-10-20', status: 'In Progress', hours: 60, billable: true, budgetUsed: 3500, release: 'v1.1' },
    { id: 'T3', title: 'Frontend', project: 'P1', assignee: 'U3', start: '2025-10-15', end: '2025-11-05', status: 'Todo', hours: 120, billable: true, budgetUsed: 6000, release: 'v1.1' },
    { id: 'T4', title: 'Backend API', project: 'P3', assignee: 'U1', start: '2025-10-05', end: '2025-10-25', status: 'In Progress', hours: 100, billable: true, budgetUsed: 8000, release: 'v2.0' },
    { id: 'T5', title: 'QA', project: 'P2', assignee: 'U2', start: '2025-10-20', end: '2025-11-10', status: 'Todo', hours: 80, billable: false, budgetUsed: 0, release: 'v1.0' }
  ],
  approvals: [ { id: 'A1', task: 'T2', approvers: ['U1'], status: 'Pending' } ],
  timeEntries: [ { id: 'TT1', task: 'T1', user: 'U1', date: '2025-10-02', hours: 8 }, { id: 'TT2', task: 'T2', user: 'U2', date: '2025-10-09', hours: 6 } ]
};
