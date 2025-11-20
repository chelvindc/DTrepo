(function(){
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const list = document.getElementById('todoList');
  const empty = document.getElementById('empty');
  const count = document.getElementById('count');
  const STORAGE_KEY = 'dynamic_todo_tasks_v1';

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    render();
  }

  function createTaskElement(task){
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' completed' : '');
    li.dataset.id = task.id;

    const span = document.createElement('div');
    span.className = 'text';
    span.textContent = task.text;
    span.title = 'Click to toggle completed';
    span.tabIndex = 0;

    span.addEventListener('click', () => toggleDone(task.id));
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDone(task.id); }
    });

    const meta = document.createElement('div');
    meta.className = 'meta';

    const time = document.createElement('div');
    time.className = 'small';
    time.textContent = timeAgo(task.createdAt);
    time.title = new Date(task.createdAt).toLocaleString();

    const del = document.createElement('button');
    del.className = 'btn delete';
    del.setAttribute('aria-label', 'Delete task');
    del.textContent = 'Delete';
    del.addEventListener('click', () => removeTask(task.id));

    meta.appendChild(time);
    meta.appendChild(del);

    li.appendChild(span);
    li.appendChild(meta);

    return li;
  }

  function render(){
    list.innerHTML = '';
    if (tasks.length === 0){
      empty.hidden = false;
      count.textContent = 0;
      return;
    }
    empty.hidden = true;
    tasks.forEach(t => list.appendChild(createTaskElement(t)));
    count.textContent = tasks.length;
  }

  function addTask(text){
    const trimmed = text.trim();
    if (!trimmed) return;
    const task = { id: cryptoRandomId(), text: trimmed, done: false, createdAt: Date.now() };
    tasks.unshift(task);
    save();
  }

  function toggleDone(id){
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx].done = !tasks[idx].done;
    save();
  }

  function removeTask(id){
    tasks = tasks.filter(t => t.id !== id);
    save();
  }

  function timeAgo(ts){
    const d = Date.now() - ts;
    if (d < 60000) return 'just now';
    if (d < 3600000) return Math.floor(d/60000) + 'm ago';
    if (d < 86400000) return Math.floor(d/3600000) + 'h ago';
    const days = Math.floor(d/86400000);
    return days + 'd ago';
  }

  function cryptoRandomId(){
    return 't_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      addTask(input.value);
      input.value = '';
    }
  });

  render();
})();