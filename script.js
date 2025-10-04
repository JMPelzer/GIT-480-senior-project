// ---- Events data (edit this) ----
const EVENTS = [
  { id: 'story-time',   title: 'Story Time for Kids',       date: '2025-10-12', time: '10:00 AM', href: 'events.html#story-time' },
  { id: 'author-talk',  title: 'Author Talk: Local History',date: '2025-10-15', time: '6:30 PM',  href: 'events.html#author-talk' },
  { id: 'coding-club',  title: 'Kids Coding Club',          date: '2025-10-22', time: '2:00 PM',   href: 'events.html#coding-club' },
];

// ---- Calendar rendering ----
(function(){
  const monthLabel = document.getElementById('monthLabel');
  const caption = document.querySelector('#cal-grid caption');
  const tbody = document.querySelector('#cal-grid tbody');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');
  const calSection = document.getElementById('calSection');
  const listSection = document.getElementById('listSection');
  const listUl = document.getElementById('eventsList');

  if (!monthLabel || !tbody) return; // not on events page

  let viewDate = new Date(); // today

  function ymd(d){ return d.toISOString().slice(0,10); }

  function renderMonth(){
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth(); // 0-11
    const first = new Date(y, m, 1);
    const firstWeekday = first.getDay(); 
    const daysInMonth = new Date(y, m+1, 0).getDate();

    const monthName = first.toLocaleString(undefined, { month: 'long' });
    monthLabel.textContent = `${monthName} ${y}`;
    caption.textContent = `Events for ${monthName} ${y}`;

    // start from the Sunday before (or on) the 1st
    const start = new Date(y, m, 1 - firstWeekday);

    // build 6 rows x 7 cells
    tbody.innerHTML = '';
    for (let row=0; row<6; row++){
      const tr = document.createElement('tr');
      for (let col=0; col<7; col++){
        const cellDate = new Date(start);
        cellDate.setDate(start.getDate() + row*7 + col);

        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.className = 'cal-day';
        const isOutside = cellDate.getMonth() !== m;
        if (isOutside) btn.classList.add('outside');

        const today = new Date();
        if (cellDate.toDateString() === today.toDateString()){
          btn.classList.add('today');
        }

        // date number
        const spanDate = document.createElement('span');
        spanDate.className = 'date-num';
        spanDate.textContent = cellDate.getDate();
        btn.appendChild(spanDate);

        // events in this cell
        const thisYMD = ymd(cellDate);
        const cellEvents = EVENTS.filter(e => e.date === thisYMD);
        if (cellEvents.length){
          // aria-label: include titles for SR users
          btn.setAttribute('aria-label', `${cellDate.toLocaleDateString()} – ${cellEvents.map(e=>e.title + ' at ' + e.time).join('; ')}`);

          cellEvents.forEach(e => {
            const pill = document.createElement('span');
            pill.className = 'cal-event';
            pill.textContent = e.title;
            pill.style.display = 'block';
            pill.style.marginTop = '.25rem';
            btn.appendChild(pill);

            // click the day to go to first event (simple behavior)
            btn.addEventListener('click', () => { window.location.href = e.href; }, { once:true });
          });
        } else {
          btn.setAttribute('aria-label', cellDate.toLocaleDateString());
        }

        td.appendChild(btn);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    renderList(y, m);
  }

  function renderList(year, monthIdx){
    const monthEvents = EVENTS
      .map(e => ({ ...e, d: new Date(e.date) }))
      .filter(e => e.d.getFullYear() === year && e.d.getMonth() === monthIdx)
      .sort((a,b) => a.d - b.d);

    listUl.innerHTML = '';
    if (!monthEvents.length){
      const li = document.createElement('li');
      li.textContent = 'No events this month.';
      listUl.appendChild(li);
      return;
    }

    monthEvents.forEach(e => {
      const li = document.createElement('li');
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${e.d.toLocaleDateString(undefined,{month:'short', day:'numeric'})} • ${e.time}`;
      const a = document.createElement('a');
      a.href = e.href;
      a.textContent = e.title;
      li.appendChild(meta);
      li.appendChild(a);
      listUl.appendChild(li);
    });
  }

  prevBtn.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()-1); renderMonth(); });
  nextBtn.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()+1); renderMonth(); });

  gridBtn.addEventListener('click', () => {
    calSection.hidden = false; listSection.hidden = true;
    gridBtn.setAttribute('aria-pressed','true'); listBtn.setAttribute('aria-pressed','false');
  });
  listBtn.addEventListener('click', () => {
    calSection.hidden = true; listSection.hidden = false;
    gridBtn.setAttribute('aria-pressed','false'); listBtn.setAttribute('aria-pressed','true');
  });

  renderMonth();
})();
