(() => {
  if (document.getElementById('mainza-wrapper-root')) return;

  const MAINZA_URL = 'http://localhost';

  const root = document.createElement('div');
  root.id = 'mainza-wrapper-root';

  const launcher = document.createElement('button');
  launcher.id = 'mainza-launcher';
  launcher.textContent = 'Open Mainza 1:1';

  const panel = document.createElement('div');
  panel.id = 'mainza-panel';

  const header = document.createElement('div');
  header.id = 'mainza-panel-header';

  const title = document.createElement('div');
  title.textContent = 'Mainza Wrapper (1:1)';

  const controls = document.createElement('div');
  controls.className = 'controls';

  const reloadBtn = document.createElement('button');
  reloadBtn.textContent = 'Reload';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';

  const frame = document.createElement('iframe');
  frame.id = 'mainza-frame';
  frame.src = MAINZA_URL;
  frame.allow = 'microphone; camera; clipboard-read; clipboard-write';

  reloadBtn.addEventListener('click', () => {
    frame.src = frame.src;
  });

  const closePanel = () => {
    panel.classList.remove('open');
    launcher.textContent = 'Open Mainza 1:1';
  };

  const openPanel = () => {
    panel.classList.add('open');
    launcher.textContent = 'Hide Mainza 1:1';
  };

  closeBtn.addEventListener('click', closePanel);

  launcher.addEventListener('click', () => {
    if (panel.classList.contains('open')) {
      closePanel();
      return;
    }

    openPanel();
  });

  controls.appendChild(reloadBtn);
  controls.appendChild(closeBtn);

  header.appendChild(title);
  header.appendChild(controls);

  panel.appendChild(header);
  panel.appendChild(frame);

  root.appendChild(launcher);
  root.appendChild(panel);

  document.documentElement.appendChild(root);
})();
