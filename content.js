let autoIntervalId = null;
let requestCount = 0;

// Lắng nghe lệnh từ Popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'START_AUTO') {
    startAutoClicker(msg.intervalMs);
  } else if (msg.action === 'STOP_AUTO') {
    stopAutoClicker("Đã dừng thủ công.");
  }
});

function showToast(message, type = 'info') {
  let toast = document.getElementById('fap-simple-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fap-simple-toast';
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 999999;
      background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px);
      border: 1px solid rgba(79, 70, 229, 0.8); border-radius: 8px;
      padding: 12px 20px; color: #fff; font-family: sans-serif;
      font-size: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  
  if (type === 'success') {
    toast.style.borderColor = 'rgba(16, 185, 129, 0.8)'; // Green
  } else if (type === 'error') {
    toast.style.borderColor = 'rgba(239, 68, 68, 0.8)'; // Red
  } else {
    toast.style.borderColor = 'rgba(79, 70, 229, 0.8)'; // Indigo
  }

  toast.innerHTML = message;
}

function updateStatus(text) {
  showToast(text);
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', text }).catch(() => {});
    }
  } catch (e) {
    if (e.message.includes('Extension context invalidated')) {
      showToast("⚠️ Extension vừa được cập nhật. Vui lòng ấn F5 tải lại trang web này!", 'error');
      if (autoIntervalId) clearInterval(autoIntervalId);
    }
  }
}

function serializeForm() {
  const form = document.querySelector('form');
  if (!form) return null;
  
  const formData = new URLSearchParams();
  
  // Gom tất cả input, select, textarea (Loại trừ các nút bấm để tránh dính nút Cancel)
  const elements = form.querySelectorAll('input, select, textarea');
  elements.forEach(el => {
    if (!el.name) return;
    
    // Bỏ qua các thể loại nút bấm (submit, button, reset) trong vòng lặp này
    if (['submit', 'button', 'reset'].includes(el.type)) return;
    
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) formData.append(el.name, el.value || 'on');
    } else {
      formData.append(el.name, el.value || '');
    }
  });

  // Tìm nút submit chính (nút Save/Move của FAP)
  const submitBtn = form.querySelector('input[type="submit"], button[type="submit"], #ctl00_mainContent_btnSave');
  if (submitBtn && submitBtn.name) {
    formData.append(submitBtn.name, submitBtn.value || submitBtn.textContent?.trim() || 'Save');
  }

  // Cố gắng tìm Tên Lớp Đích để báo cáo cho đẹp
  let targetClassName = 'Lớp đã chọn';
  const dropdown = document.querySelector('#ctl00_mainContent_dllCourse');
  if (dropdown && dropdown.options.length > 0 && dropdown.selectedIndex >= 0) {
    targetClassName = dropdown.options[dropdown.selectedIndex].text.trim();
  } else {
    const checkedRadio = form.querySelector('input[type="radio"]:checked');
    if (checkedRadio) {
      const tr = checkedRadio.closest('tr');
      if (tr) targetClassName = tr.innerText.trim().split('\n')[0].trim() || targetClassName;
    }
  }

  return {
    action: form.action || window.location.href,
    body: formData.toString(),
    targetClassName
  };
}

function startAutoClicker(intervalMs) {
  if (autoIntervalId) clearInterval(autoIntervalId);
  requestCount = 0;

  const formCapture = serializeForm();
  if (!formCapture) {
    updateStatus("Lỗi: Không tìm thấy Form trên trang này!");
    stopAutoClicker("Lỗi Form");
    return;
  }

  updateStatus(`🚀 Đã khóa mục tiêu: ${formCapture.targetClassName}. Chuẩn bị bắn mỗi ${intervalMs/1000}s...`);

  // Bắn phát đầu tiên luôn
  fireRequest(formCapture);

  autoIntervalId = setInterval(() => {
    fireRequest(formCapture);
  }, intervalMs);
}

function stopAutoClicker(reasonText = "Đã dừng.") {
  if (autoIntervalId) {
    clearInterval(autoIntervalId);
    autoIntervalId = null;
  }
  showToast(reasonText, reasonText.includes('Thành công') ? 'success' : 'info');
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'STOPPED', text: reasonText }).catch(() => {});
    }
  } catch (e) {}
}

async function fireRequest(formCapture) {
  requestCount++;
  updateStatus(`⚡ Đang bắn (Lần ${requestCount}) vào ${formCapture.targetClassName}...`);

  try {
    const res = await fetch(formCapture.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formCapture.body
    });

    if (res.ok) {
      const text = await res.text();
      
      // Parse lỗi từ script alert của FAP
      let fapAlertMsg = "";
      const match = text.match(/alert\(['"](.*?)['"]\)/);
      if (match && match[1]) {
        fapAlertMsg = match[1].replace(/<br\s*\/?>/gi, ' - ').replace(/\\n/g, ' ');
      }

      if (text.includes('Thành công') || text.includes('thành công') || text.includes('Successfully')) {
        updateStatus(`🎉 Thành công (${formCapture.targetClassName})! Trang sẽ tải lại...`);
        stopAutoClicker(`🎉 Thành công ở Lần ${requestCount}`);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const failReason = fapAlertMsg || "Trượt (chưa có slot)";
        updateStatus(`❌ Lần ${requestCount} [${formCapture.targetClassName}]: ${failReason}`);
      }
    } else {
      updateStatus(`⚠️ Lỗi mạng (Lần ${requestCount}): HTTP ${res.status}`);
    }
  } catch (e) {
    updateStatus(`⚠️ Lỗi kết nối (Lần ${requestCount}): ${e.message}`);
  }
}
