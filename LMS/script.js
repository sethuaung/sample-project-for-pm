// Minimal working script to verify data renders
(function(){
  // small PRNG for deterministic demo
  let seed = 1;
  function rand(){ seed = (seed * 16807) % 2147483647; return (seed % 100) / 100; }
  function rnd(min,max){ return Math.floor(rand()*(max-min+1))+min; }
  function sample(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function daysAgo(n){ const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

  document.addEventListener('DOMContentLoaded', function(){
    // simple demo users (50 shown per page)
    const first = ["Alex","Jordan","Taylor","Morgan","Riley","Casey","Jamie","Avery","Parker","Sam"];
    const last = ["Cooper","Taylor","Morgan","Garcia","Lee","Patel","Nguyen","Kim","Brown","Clark"];
    const users = Array.from({length:200}, (_,i) => {
      const fn = sample(first), ln = sample(last);
      const type = rand() < 0.08 ? "Teacher" : rand() < 0.03 ? "Staff" : "Student";
      const grade = type === "Student" ? `Grade ${rnd(5,12)}` : type;
      return { id:i+1, name:`${fn} ${ln}`, email:`${fn.toLowerCase()}.${ln.toLowerCase()}${i}@felixent.edu`, type, grade };
    });

    // DOM refs
    const usersTbody = document.getElementById('usersTableBody');
    const usersShowing = document.getElementById('usersShowing');
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const PAGE_SIZE = 50;
    let currentPage = 1;

    function renderUsers(page=1){
      currentPage = Math.max(1, Math.min(page, Math.ceil(users.length / PAGE_SIZE)));
      usersTbody.innerHTML = '';
      const start = (currentPage-1)*PAGE_SIZE;
      users.slice(start, start+PAGE_SIZE).forEach(u=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.type}</td><td>${u.grade}</td>`;
        usersTbody.appendChild(tr);
      });
      usersShowing.textContent = `Showing ${start+1}-${Math.min(start+PAGE_SIZE, users.length)} of ${users.length}`;
      currentPageEl.textContent = currentPage;
      totalPagesEl.textContent = Math.ceil(users.length / PAGE_SIZE);
    }

    // charts
    const studentCounts = {};
    for(let g=5; g<=12; g++) studentCounts[`Grade ${g}`] = 0;
    users.forEach(u => { if(u.type === 'Student') studentCounts[u.grade]++; });
    const gradeLabels = Object.keys(studentCounts);
    const gradeCounts = gradeLabels.map(l => studentCounts[l]);

    // student grade bar
    const sg = document.getElementById('studentGradeChart').getContext('2d');
    new Chart(sg, { type:'bar', data:{ labels: gradeLabels, datasets:[{ data: gradeCounts, backgroundColor:'#60a5fa' }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } } });

    // activity line (dummy)
    const actLabels = Array.from({length:14}, (_,i)=> daysAgo(13-i));
    const actData = actLabels.map(()=> rnd(0,10));
    const ac = document.getElementById('activityChart').getContext('2d');
    new Chart(ac, { type:'line', data:{ labels: actLabels, datasets:[{ label:'Completions', data: actData, borderColor:'#0ea5a4', tension:0.3 }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } } });

    // pie
    const passed = Math.max(1, Math.round(users.length * 0.3));
    const failed = Math.round(users.length * 0.1);
    const inprog = Math.round(users.length * 0.05);
    const notatt = Math.max(0, users.length - (passed+failed+inprog));
    const up = document.getElementById('unitPie').getContext('2d');
    new Chart(up, { type:'doughnut', data:{ labels:['Passed','Failed','In progress','Not attempted'], datasets:[{ data:[passed,failed,inprog,notatt], backgroundColor:['#10b981','#ef4444','#f59e0b','#94a3b8'] }] }, options:{ cutout:'60%', plugins:{ legend:{ display:false } } });

    document.querySelectorAll('.page-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        document.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page-content').forEach(p=>p.classList.add('w3-hide'));
        const id = btn.dataset.page;
        document.getElementById(id).classList.remove('w3-hide');
        if(id === 'users') renderUsers(1);
      });
    });

    // initial
    renderUsers(1);
  });
})();
