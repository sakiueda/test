const categories = [
  { icon: '▣', name: 'スーパー・食費', amount: 38240, max: 60000, color: '#df8b63', bg: '#f7e7dd' },
  { icon: '♨', name: '外食', amount: 21800, max: 35000, color: '#d4a64e', bg: '#f8efd9' },
  { icon: 'a', name: 'Amazon', amount: 16480, max: 30000, color: '#6f91a1', bg: '#e3edf1' },
  { icon: '♧', name: '交際費', amount: 12800, max: 25000, color: '#8979a4', bg: '#ece8f2' },
  { icon: '↻', name: 'サブスク', amount: 7260, max: 10000, color: '#5b9985', bg: '#e1eee8' }
];

const weekData = [
  { label: '第1週', spent: 31000, limit: 42000 }, { label: '第2週', spent: 27000, limit: 42000 },
  { label: '第3週', spent: 38580, limit: 42000 }, { label: '第4週', spent: 0, limit: 42000 }
];

function renderCategories() {
  document.querySelector('#categoryList').innerHTML = categories.map(item => `
    <div class="category">
      <span class="category-icon" style="background:${item.bg};color:${item.color}">${item.icon}</span>
      <div class="category-info"><div class="category-title"><b>${item.name}</b><span>予算 ¥${item.max.toLocaleString()}</span></div>
      <div class="mini-progress"><i style="width:${item.amount / item.max * 100}%;background:${item.color}"></i></div></div>
      <strong>¥${item.amount.toLocaleString()}</strong>
    </div>`).join('');
}

function renderWeeks() {
  const max = 45000;
  document.querySelector('#weekChart').innerHTML = weekData.map((week, index) => `
    <div class="week"><span class="value">${week.spent ? `¥${Math.round(week.spent / 1000)}k` : ''}</span>
    <i class="bar spent" style="height:${week.spent / max * 100}%"></i>
    <i class="bar limit" style="height:${week.limit / max * 100}%"></i><label>${week.label}${index === 2 ? '<br><b>今週</b>' : ''}</label></div>`).join('');
}

function drawAnnualChart() {
  const canvas = document.querySelector('#annualChart');
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
  const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio);
  const income = [59, 59, 61, 61, 62, 62, 65, 62, 63, 63, 64, 65];
  const expense = [44, 47, 52, 45, 49, 48, 54, 44, 0, 0, 0, 0];
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const w = rect.width, h = rect.height, pad = {l:30,r:10,t:8,b:23}, chartH = h-pad.t-pad.b;
  ctx.font = '9px DM Sans'; ctx.fillStyle='#84918d'; ctx.textAlign='right';
  [0,20,40,60].forEach(v=>{const y=pad.t+chartH-(v/70*chartH);ctx.beginPath();ctx.strokeStyle='#ecece5';ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(v+'万',pad.l-6,y+3)});
  const groupW=(w-pad.l-pad.r)/12, barW=Math.min(11,groupW/3);
  months.forEach((m,i)=>{const x=pad.l+groupW*i+groupW/2;ctx.fillStyle='#84918d';ctx.textAlign='center';ctx.fillText(m,x,h-4);[[income[i],'#397567',-barW/2],[expense[i],'#df8b63',barW/2]].forEach(([v,c,off])=>{if(!v)return;const bh=v/70*chartH;ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x+off-barW/2,pad.t+chartH-bh,barW,bh,[3,3,0,0]);ctx.fill()})});
}

renderCategories(); renderWeeks(); drawAnnualChart();
window.addEventListener('resize', drawAnnualChart);

let selectedMonth = 7;
const monthLabel = document.querySelector('#monthLabel');
function updateMonth(delta) { selectedMonth = (selectedMonth + delta + 12) % 12; monthLabel.textContent = `2026年 ${selectedMonth + 1}月`; }
document.querySelector('#prevMonth').addEventListener('click', () => updateMonth(-1));
document.querySelector('#nextMonth').addEventListener('click', () => updateMonth(1));
document.querySelector('.month-row .outline-button').addEventListener('click', () => { selectedMonth = 7; updateMonth(0); });

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active')); button.classList.add('active');
  if (button.dataset.view !== 'dashboard') showToast('このデモではホーム画面をご覧いただけます');
}));

const dialog = document.querySelector('#transactionDialog');
document.querySelector('#openTransaction').addEventListener('click', () => dialog.showModal());
document.querySelector('#saveTransaction').addEventListener('click', event => {
  const form = document.querySelector('#transactionForm');
  if (!form.checkValidity()) return;
  event.preventDefault();
  const amount = Number(new FormData(form).get('amount'));
  const current = Number(document.querySelector('#remainingAmount').textContent.replace(',', ''));
  document.querySelector('#remainingAmount').textContent = Math.max(0, current - amount).toLocaleString();
  dialog.close(); form.reset(); showToast('✓ 支出を記録しました');
});
function showToast(message) { const toast=document.querySelector('#toast'); toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2600); }
