// --- Medicine Reminders ---
const medForm = document.getElementById('medicineForm');
const medTableBody = document.querySelector('#reminderTable tbody');

// Request Notification Permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Load Medicine Reminders
loadMedReminders();
checkMedReminders();

// Save Medicine Reminder
medForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const medName = document.getElementById('medName').value;
  const medTime = document.getElementById('medTime').value;
  const reminder = { medName, medTime };

  let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminders.push(reminder);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  medForm.reset();
  loadMedReminders();
});

function loadMedReminders() {
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  medTableBody.innerHTML = '';
  reminders.forEach((r, i) => {
    const row = `<tr>
      <td>${r.medName}</td>
      <td>${r.medTime}</td>
      <td><button onclick="deleteMedReminder(${i})">Delete</button></td>
    </tr>`;
    medTableBody.insertAdjacentHTML('beforeend', row);
  });
}

function deleteMedReminder(index) {
  let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminders.splice(index,1);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  loadMedReminders();
}

function checkMedReminders() {
  setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2,'0') + ":" +
                        now.getMinutes().toString().padStart(2,'0');
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.forEach(r => {
      if (currentTime === r.medTime) {
        if (Notification.permission === "granted") {
          new Notification(`Time to take ${r.medName}`);
        }
      }
    });
  }, 60000);
}

// --- Blood Pressure ---
const bpForm = document.getElementById('bpForm');
const bpTableBody = document.querySelector('#bpTable tbody');
const bpChartCtx = document.getElementById('bpChart').getContext('2d');
let bpChart;

loadBP();

bpForm.addEventListener('submit', function(e){
  e.preventDefault();
  const date = document.getElementById('bpDate').value;
  const systolic = document.getElementById('systolic').value;
  const diastolic = document.getElementById('diastolic').value;

  const entry = { date, systolic, diastolic };
  let bpData = JSON.parse(localStorage.getItem('bpData')) || [];
  bpData.push(entry);
  localStorage.setItem('bpData', JSON.stringify(bpData));
  bpForm.reset();
  loadBP();
});

function loadBP(){
  const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
  bpTableBody.innerHTML = '';
  const dates = [];
  const sys = [];
  const dia = [];

  bpData.forEach(entry => {
    dates.push(entry.date);
    sys.push(entry.systolic);
    dia.push(entry.diastolic);
    const row = `<tr><td>${entry.date}</td><td>${entry.systolic}</td><td>${entry.diastolic}</td></tr>`;
    bpTableBody.insertAdjacentHTML('beforeend', row);
  });

  if(bpChart) bpChart.destroy();
  bpChart = new Chart(bpChartCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {label: 'Systolic', data: sys, borderColor: 'red', fill: false},
        {label: 'Diastolic', data: dia, borderColor: 'blue', fill: false}
      ]
    },
    options: {responsive: true}
  });
}

// --- Oxygen Tracker ---
const o2Form = document.getElementById('o2Form');
const o2TableBody = document.querySelector('#o2Table tbody');
const o2ChartCtx = document.getElementById('o2Chart').getContext('2d');
let o2Chart;

loadO2();

o2Form.addEventListener('submit', function(e){
  e.preventDefault();
  const date = document.getElementById('o2Date').value;
  const value = document.getElementById('o2Value').value;

  const entry = { date, value };
  let o2Data = JSON.parse(localStorage.getItem('o2Data')) || [];
  o2Data.push(entry);
  localStorage.setItem('o2Data', JSON.stringify(o2Data));
  o2Form.reset();
  loadO2();
});

function loadO2(){
  const o2Data = JSON.parse(localStorage.getItem('o2Data')) || [];
  o2TableBody.innerHTML = '';
  const dates = [];
  const values = [];

  o2Data.forEach(entry => {
    dates.push(entry.date);
    values.push(entry.value);
    const row = `<tr><td>${entry.date}</td><td>${entry.value}</td></tr>`;
    o2TableBody.insertAdjacentHTML('beforeend', row);
  });

  if(o2Chart) o2Chart.destroy();
  o2Chart = new Chart(o2ChartCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {label: 'Oxygen %', data: values, borderColor: 'green', fill: false}
      ]
    },
    options: {responsive: true}
  });
}

// --- Sleep Tracker ---
const sleepForm = document.getElementById('sleepForm');
const sleepTableBody = document.querySelector('#sleepTable tbody');
const sleepChartCtx = document.getElementById('sleepChart').getContext('2d');
let sleepChart;

loadSleep();

sleepForm.addEventListener('submit', function(e){
  e.preventDefault();
  const date = document.getElementById('sleepDate').value;
  const start = document.getElementById('sleepStart').value;
  const end = document.getElementById('sleepEnd').value;

  const duration = calculateDuration(start, end);

  const entry = { date, start, end, duration };
  let sleepData = JSON.parse(localStorage.getItem('sleepData')) || [];
  sleepData.push(entry);
  localStorage.setItem('sleepData', JSON.stringify(sleepData));
  sleepForm.reset();
  loadSleep();
});

function calculateDuration(start, end){
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let duration = (eh + em/60) - (sh + sm/60);
  if(duration < 0) duration +=24;
  return duration.toFixed(2);
}

function loadSleep(){
  const sleepData = JSON.parse(localStorage.getItem('sleepData')) || [];
  sleepTableBody.innerHTML = '';
  const dates = [];
  const durations = [];

  sleepData.forEach(entry => {
    dates.push(entry.date);
    durations.push(entry.duration);
    const row = `<tr><td>${entry.date}</td><td>${entry.start}</td><td>${entry.end}</td><td>${entry.duration}</td></tr>`;
    sleepTableBody.insertAdjacentHTML('beforeend', row);
  });

  if(sleepChart) sleepChart.destroy();
  sleepChart = new Chart(sleepChartCtx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [
        {label: 'Sleep Duration (hrs)', data: durations, backgroundColor: 'purple'}
      ]
    },
    options: {responsive: true}
  });
}

// --- Export All Data ---
const exportBtn = document.getElementById('exportBtn');
exportBtn.addEventListener('click', exportData);

function exportData(){
  let csv = 'Category,Date,Data\n';

  // BP
  const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
  bpData.forEach(e => {
    csv += `Blood Pressure,${e.date},"Systolic: ${e.systolic}, Diastolic: ${e.diastolic}"\n`;
  });

  // O2
  const o2Data = JSON.parse(localStorage.getItem('o2Data')) || [];
  o2Data.forEach(e => {
    csv += `Oxygen,${e.date},"O2: ${e.value}%"\n`;
  });

  // Sleep
  const sleepData = JSON.parse(localStorage.getItem('sleepData')) || [];
  sleepData.forEach(e => {
    csv += `Sleep,${e.date},"Start: ${e.start}, End: ${e.end}, Duration: ${e.duration} hrs"\n`;
  });

  // Medicine
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminders.forEach(e => {
    csv += `Medicine Reminder,,"Medicine: ${e.medName}, Time: ${e.medTime}"\n`;
  });

  const blob = new Blob([csv], {type:'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'health_data.csv');
  a.click();
}
const deleteAllBtn = document.getElementById('deleteAllBtn');
deleteAllBtn.addEventListener('click', () => {
  const confirmDelete = confirm("Are you sure you want to delete ALL data? This cannot be undone.");
  if (confirmDelete) {
    // Clear localStorage
    localStorage.removeItem('reminders');
    localStorage.removeItem('bpData');
    localStorage.removeItem('o2Data');
    localStorage.removeItem('sleepData');

    // Reload all sections
    loadMedReminders();
    loadBP();
    loadO2();
    loadSleep();

    alert("All data deleted successfully.");
  }
});
// ?? Medicine Time Checker
function checkMedReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5); // HH:MM format
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

  reminders.forEach(r => {
    if (r.time === currentTime) {
      const audio = document.getElementById('alarmAudio');
      audio.play();
      alert(`? Time to take: ${r.name} at ${r.time}`);
    }
  });
}

// ?? Check every 60 seconds
setInterval(checkMedReminders, 60000);

// ?? Also check once on load (in case exact time matches immediately)
checkMedReminders();
