document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const intervalSelect = document.getElementById('intervalSelect');
  const statusText = document.getElementById('statusText');

  // Load saved state
  chrome.storage.local.get(['isRunning', 'intervalMs', 'lastStatus'], (data) => {
    if (data.intervalMs) {
      intervalSelect.value = data.intervalMs;
    }
    if (data.isRunning) {
      setUIState(true);
      statusText.textContent = data.lastStatus || 'Đang chạy ngầm...';
    } else {
      setUIState(false);
      statusText.textContent = data.lastStatus || 'Đang chờ...';
    }
  });

  // Listen to status updates from content script
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'STATUS_UPDATE') {
      statusText.textContent = msg.text;
    } else if (msg.type === 'STOPPED') {
      setUIState(false);
      statusText.textContent = msg.text || 'Đã dừng.';
      chrome.storage.local.set({ isRunning: false, lastStatus: statusText.textContent });
    }
  });

  startBtn.addEventListener('click', async () => {
    const intervalMs = parseInt(intervalSelect.value);
    
    // Send start message to active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url.includes('fap.fpt.edu.vn')) {
      statusText.textContent = 'Lỗi: Hãy mở trang FAP để bắt đầu!';
      statusText.style.color = 'red';
      return;
    }

    setUIState(true);
    statusText.textContent = 'Đang gom dữ liệu Form...';
    statusText.style.color = 'var(--primary)';

    chrome.storage.local.set({ isRunning: true, intervalMs, lastStatus: 'Đang khởi động...' });

    chrome.tabs.sendMessage(tab.id, { 
      action: 'START_AUTO', 
      intervalMs: intervalMs 
    });
  });

  stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'STOP_AUTO' });
    }
    setUIState(false);
    statusText.textContent = 'Đã dừng thủ công.';
    chrome.storage.local.set({ isRunning: false, lastStatus: 'Đã dừng thủ công.' });
  });

  function setUIState(isRunning) {
    if (isRunning) {
      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
      intervalSelect.disabled = true;
    } else {
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
      intervalSelect.disabled = false;
    }
  }
});
