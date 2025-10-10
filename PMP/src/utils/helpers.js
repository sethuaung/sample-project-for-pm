export function getProjectName(DEMO, pid) {
  return DEMO.projects.find(p => p.id === pid)?.name || pid;
}
export function getProjectColor(DEMO, pid) {
  return DEMO.projects.find(p => p.id === pid)?.color || '#6B7280';
}
export function getUserName(DEMO, uid) {
  return DEMO.users.find(u => u.id === uid)?.name || uid;
}
export function getRoleName(DEMO, rid) {
  return DEMO.roles.find(r => r.id === rid)?.name || rid;
}
