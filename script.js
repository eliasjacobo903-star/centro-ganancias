const status = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const earnBtn = document.getElementById('earnBtn');
let balance = 200;

startBtn.addEventListener('click', () => {
  status.textContent = 'Actividad iniciada. En esta demo puedes conectar aquí tus tareas reales.';
  startBtn.textContent = 'Actividad iniciada ✓';
  startBtn.style.opacity = '.8';
});

earnBtn.addEventListener('click', () => {
  status.textContent = 'Panel de ganancias abierto (demo).';
  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
});

document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const labels = {
      complete: 'Sección de tareas abierta (demo).',
      withdraw: 'Sección de retiros abierta (demo).',
      message: 'Centro de mensajes abierto (demo).',
      invite: 'Sistema de invitaciones abierto (demo).'
    };
    status.textContent = labels[action];
  });
});

document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-nav]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    status.textContent = 'Sección "' + btn.querySelector('span').textContent + '" seleccionada (demo).';
  });
});
