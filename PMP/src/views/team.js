import { getUserName, getRoleName } from '../utils/helpers.js';

export function renderTeams(area, DEMO, state) {
  area.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'grid grid-cols-2 gap-4';
  DEMO.teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow';
    card.innerHTML = `<div class="font-semibold">${team.name}</div><div class="text-xs text-gray-500 mb-2">${team.members.length} members</div>`;
    team.members.forEach(uid => {
      const user = DEMO.users.find(u => u.id === uid);
      const staff = DEMO.staff.find(s => s.userId === uid);
      const role = staff ? getRoleName(DEMO, staff.roleId) : '';
      const memberRow = document.createElement('div');
      memberRow.className = 'flex items-center justify-between py-2 border-t';
      memberRow.innerHTML = `<div><div class="font-medium">${getUserName(DEMO, uid)}</div><div class="text-xs text-gray-500">${role}</div></div>
        <div class="text-xs text-gray-600">${user?.capacity || '-'}h</div>`;
      card.appendChild(memberRow);
    });
    wrapper.appendChild(card);
  });
  area.appendChild(wrapper);
}
