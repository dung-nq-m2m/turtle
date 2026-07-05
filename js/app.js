/**
 * Shared utilities for Học viện Turtle Python
 */

const TurtleAcademy = {
  basePath: '',
  CODE_UNLOCK_KEY: 'turtle_gv_code_unlocked',
  teacherPin: 'dungnq',
  codeLockMessage: 'Code chỉ hiển thị khi giáo viên mở khóa.',

  async initConfig() {
    try {
      const cfg = await this.loadJSON('data/config.json');
      this.teacherPin = cfg.teacherPin || this.teacherPin;
      this.codeLockMessage = cfg.codeLockMessage || this.codeLockMessage;
    } catch (_) { /* dùng mặc định */ }
  },

  isCodeUnlocked() {
    return sessionStorage.getItem(this.CODE_UNLOCK_KEY) === '1';
  },

  unlockCode(pin) {
    if (String(pin).trim() === this.teacherPin) {
      sessionStorage.setItem(this.CODE_UNLOCK_KEY, '1');
      window.dispatchEvent(new Event('code-unlocked'));
      return true;
    }
    return false;
  },

  lockCode() {
    sessionStorage.removeItem(this.CODE_UNLOCK_KEY);
    window.dispatchEvent(new Event('code-locked'));
  },

  async loadJSON(path) {
    const res = await fetch(`${this.basePath}${path}`);
    if (!res.ok) throw new Error(`Không tải được: ${path}`);
    return res.json();
  },

  getLessonIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lesson') || params.get('id');
  },

  showToast(message, duration = 2500) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  },

  markLessonComplete(lessonId) {
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem('completedLessons', JSON.stringify(completed));
    }
  },

  isLessonComplete(lessonId) {
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    return completed.includes(lessonId);
  },

  getCompletedCount() {
    return JSON.parse(localStorage.getItem('completedLessons') || '[]').length;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

/**
 * Render sidebar navigation from chapters.json
 */
async function renderSidebar(activePage = '', activeLesson = '') {
  const sidebar = document.getElementById('sidebar-chapters');
  if (!sidebar) return;

  try {
    const data = await TurtleAcademy.loadJSON('data/chapters.json');
    sidebar.innerHTML = data.chapters.map(ch => `
      <li class="chapter-item ${activeLesson && ch.lessons.some(l => l.id === activeLesson) ? 'open' : ''}">
        <button class="chapter-toggle" aria-expanded="false">
          <span>${ch.icon}</span>
          <span>Chương ${ch.number}. ${ch.title}</span>
        </button>
        <ul class="lesson-list">
          ${ch.lessons.map(l => `
            <li>
              <a href="lesson.html?lesson=${l.id}" 
                 class="${l.id === activeLesson ? 'active' : ''}"
                 ${TurtleAcademy.isLessonComplete(l.id) ? 'title="Đã hoàn thành ✓"' : ''}>
                ${TurtleAcademy.isLessonComplete(l.id) ? '✓ ' : ''}${l.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </li>
    `).join('');

    sidebar.querySelectorAll('.chapter-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.chapter-item').classList.toggle('open');
      });
    });
  } catch (e) {
    sidebar.innerHTML = '<li>Không tải được danh sách bài học</li>';
  }
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

function initContentProtection() {
  const block = (e) => e.preventDefault();

  document.addEventListener('contextmenu', block);
  document.addEventListener('copy', block);
  document.addEventListener('cut', block);
  document.addEventListener('selectstart', block);
  document.addEventListener('dragstart', block);

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (['c', 'u', 's', 'a', 'p', 'x'].includes(key)) {
        e.preventDefault();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await TurtleAcademy.initConfig();
  initMobileMenu();
  initContentProtection();
});
