/**
 * Hướng dẫn code từng bước (khóa tuần tự theo biểu đồ thuật toán)
 */

const CodeGuide = {
  storageKey(lessonId) {
    return `turtle-code-guide-${lessonId}`;
  },

  loadProgress(lessonId) {
    try {
      const raw = localStorage.getItem(this.storageKey(lessonId));
      const data = raw ? JSON.parse(raw) : {};
      return {
        completed: Array.isArray(data.completed) ? data.completed : [],
        current: typeof data.current === 'number' ? data.current : 0
      };
    } catch {
      return { completed: [], current: 0 };
    }
  },

  saveProgress(lessonId, progress) {
    localStorage.setItem(this.storageKey(lessonId), JSON.stringify(progress));
  },

  render(container, guide, lessonId) {
    if (!container || !guide?.steps?.length) return;

    const steps = guide.steps;
    let progress = this.loadProgress(lessonId);

    const render = () => {
      progress = this.loadProgress(lessonId);
      const doneCount = progress.completed.length;
      const allDone = doneCount >= steps.length;
      const current = Math.min(progress.current, steps.length - 1);

      container.innerHTML = `
        <p class="code-guide-intro">${guide.intro || 'Làm theo từng bước — hoàn thành bước trước mới mở bước sau.'}</p>
        <div class="code-guide-progress">
          <div class="code-guide-progress-bar">
            <div class="code-guide-progress-fill" style="width:${(doneCount / steps.length) * 100}%"></div>
          </div>
          <span class="code-guide-progress-text">${doneCount}/${steps.length} bước</span>
        </div>
        <div class="code-guide-list">
          ${steps.map((step, i) => {
            const isDone = progress.completed.includes(i);
            const isUnlocked = i === 0 || progress.completed.includes(i - 1);
            const isCurrent = isUnlocked && !isDone && i === current;
            const isLocked = !isUnlocked;
            let stateClass = 'locked';
            if (isDone) stateClass = 'done';
            else if (isCurrent) stateClass = 'current';
            else if (isUnlocked) stateClass = 'unlocked';

            return `
              <div class="code-guide-step ${stateClass}" data-step="${i}">
                <div class="code-guide-step-header">
                  <span class="code-guide-badge">${isDone ? '✓' : isLocked ? '🔒' : i + 1}</span>
                  <div class="code-guide-step-meta">
                    <div class="code-guide-step-title">${step.title}</div>
                    ${step.flowLabel ? `<div class="code-guide-flow-ref">📍 Biểu đồ: ${step.flowLabel}</div>` : ''}
                  </div>
                </div>
                ${isLocked ? `
                  <p class="code-guide-locked-msg">Hoàn thành bước ${i} trước để mở khóa bước này.</p>
                ` : `
                  ${isCurrent ? `
                  <div class="code-guide-step-body">
                    <div class="code-guide-explain">${step.explain || ''}</div>
                    ${step.checklist?.length ? `
                      <ul class="code-guide-checklist">
                        ${step.checklist.map(item => `<li>${item}</li>`).join('')}
                      </ul>
                    ` : ''}
                    ${step.hintCode ? `
                      <details class="code-guide-hint">
                        <summary>💡 Gợi ý code (xem khi cần)</summary>
                        <pre class="code-guide-hint-code">${this.escape(step.hintCode)}</pre>
                      </details>
                    ` : ''}
                    ${step.goal ? `<p class="code-guide-goal"><strong>Kiểm tra:</strong> ${step.goal}</p>` : ''}
                    <div class="code-guide-actions">
                      ${!isDone ? `
                        <button type="button" class="btn btn-primary btn-complete-step" data-step="${i}">
                          ✅ Em đã hoàn thành bước này
                        </button>
                      ` : `
                        <span class="code-guide-done-label">Đã xong bước này</span>
                        ${i < steps.length - 1 ? `
                          <button type="button" class="btn btn-outline btn-goto-step" data-step="${i + 1}">
                            Bước tiếp →
                          </button>
                        ` : ''}
                        ${i > 0 ? `
                          <button type="button" class="btn btn-outline btn-goto-step" data-step="${i - 1}">
                            ← Xem lại
                          </button>
                        ` : ''}
                      `}
                    </div>
                  </div>
                  ` : `
                    <button type="button" class="btn btn-outline btn-goto-step code-guide-reopen" data-step="${i}">
                      ${isDone ? 'Xem lại' : 'Mở'} bước ${i + 1}
                    </button>
                  `}
                `}
              </div>
            `;
          }).join('')}
        </div>
        ${allDone ? `
          <div class="code-guide-finish">
            🏆 Em đã hoàn thành toàn bộ các bước! Ghép code lại và chạy file <code>ban-bong.py</code> — bắn hết 5 mục tiêu để thắng.
            <div style="margin-top:0.75rem">
              <button type="button" class="btn btn-outline" id="btn-reset-guide">🔄 Làm lại từ đầu</button>
            </div>
          </div>
        ` : ''}
      `;

      container.querySelectorAll('.btn-complete-step').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.step);
          if (!progress.completed.includes(i)) {
            progress.completed.push(i);
          }
          progress.current = Math.min(i + 1, steps.length - 1);
          this.saveProgress(lessonId, progress);
          render();
          const next = container.querySelector(`.code-guide-step[data-step="${progress.current}"]`);
          next?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });

      container.querySelectorAll('.btn-goto-step').forEach(btn => {
        btn.addEventListener('click', () => {
          progress.current = Number(btn.dataset.step);
          this.saveProgress(lessonId, progress);
          render();
        });
      });

      container.querySelector('#btn-reset-guide')?.addEventListener('click', () => {
        if (confirm('Xóa tiến độ hướng dẫn và làm lại từ bước 1?')) {
          progress = { completed: [], current: 0 };
          this.saveProgress(lessonId, progress);
          render();
        }
      });
    };

    render();
  },

  escape(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
};
