/**
 * Hướng dẫn code từng bước (khóa tuần tự + trắc nghiệm xác nhận)
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

  renderQuiz(step, stepIndex) {
    const questions = step.quiz || [];
    if (!questions.length) {
      return `
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary btn-complete-step" data-step="${stepIndex}">
            ✅ Em đã hoàn thành bước này
          </button>
        </div>
      `;
    }

    return `
      <div class="code-guide-quiz" data-step="${stepIndex}">
        <div class="code-guide-quiz-title">❓ Kiểm tra nhanh — trả lời đúng mới sang bước tiếp</div>
        <p class="code-guide-quiz-note">Em cần nắm chắc nội dung bước này trước khi mở khóa bước sau.</p>
        ${questions.map((q, qi) => `
          <div class="code-guide-q" data-q="${qi}">
            <div class="code-guide-q-text"><strong>Câu ${qi + 1}.</strong> ${q.question}</div>
            <div class="code-guide-q-options">
              ${(q.options || []).map((opt, oi) => `
                <label class="code-guide-q-option">
                  <input type="radio" name="guide-q-${stepIndex}-${qi}" value="${oi}">
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <div class="code-guide-quiz-feedback" hidden></div>
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary btn-submit-quiz" data-step="${stepIndex}">
            ✅ Nộp bài & mở bước tiếp
          </button>
        </div>
      </div>
    `;
  },

  gradeQuiz(container, step, stepIndex) {
    const questions = step.quiz || [];
    const feedback = container.querySelector(`.code-guide-quiz[data-step="${stepIndex}"] .code-guide-quiz-feedback`);
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q, qi) => {
      const qEl = container.querySelector(`.code-guide-quiz[data-step="${stepIndex}"] .code-guide-q[data-q="${qi}"]`);
      const selected = qEl?.querySelector(`input[name="guide-q-${stepIndex}-${qi}"]:checked`);
      qEl?.classList.remove('is-correct', 'is-wrong');

      if (!selected) {
        unanswered += 1;
        qEl?.classList.add('is-wrong');
        return;
      }

      const choice = Number(selected.value);
      if (choice === q.correct) {
        qEl?.classList.add('is-correct');
      } else {
        wrong += 1;
        qEl?.classList.add('is-wrong');
      }
    });

    if (!feedback) return false;

    feedback.hidden = false;
    if (unanswered > 0) {
      feedback.className = 'code-guide-quiz-feedback is-error';
      feedback.textContent = `Em còn ${unanswered} câu chưa chọn đáp án. Hãy trả lời đủ rồi nộp lại.`;
      return false;
    }
    if (wrong > 0) {
      feedback.className = 'code-guide-quiz-feedback is-error';
      feedback.innerHTML = `Chưa đúng ${wrong} câu. Đọc lại giải thích / gợi ý code phía trên rồi thử lại.`
        + (questions.some(q => q.explanation)
          ? `<br><span class="code-guide-quiz-hint-text">Gợi ý: xem lại checklist và gợi ý code của bước này.</span>`
          : '');
      return false;
    }

    feedback.className = 'code-guide-quiz-feedback is-ok';
    feedback.textContent = 'Chính xác! Em đã nắm bước này — mở khóa bước tiếp theo.';
    return true;
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
        <p class="code-guide-intro">${guide.intro || 'Làm theo từng bước — trả lời đúng trắc nghiệm mới mở bước sau.'}</p>
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
                  <p class="code-guide-locked-msg">Hoàn thành và trả lời đúng trắc nghiệm bước ${i} trước để mở khóa.</p>
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
                    ${step.goal ? `<p class="code-guide-goal"><strong>Kiểm tra thực hành:</strong> ${step.goal}</p>` : ''}
                    ${this.renderQuiz(step, i)}
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
            🏆 Em đã hoàn thành toàn bộ các bước và vượt qua trắc nghiệm! Ghép code lại và chạy file <code>ban-bong.py</code> — bắn hết 5 mục tiêu để thắng.
            <div style="margin-top:0.75rem">
              <button type="button" class="btn btn-outline" id="btn-reset-guide">🔄 Làm lại từ đầu</button>
            </div>
          </div>
        ` : ''}
      `;

      container.querySelectorAll('.btn-submit-quiz').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.step);
          const step = steps[i];
          const ok = this.gradeQuiz(container, step, i);
          if (!ok) return;

          btn.disabled = true;
          setTimeout(() => {
            if (!progress.completed.includes(i)) {
              progress.completed.push(i);
            }
            progress.current = Math.min(i + 1, steps.length - 1);
            this.saveProgress(lessonId, progress);
            render();
            const next = container.querySelector(`.code-guide-step[data-step="${progress.current}"]`);
            next?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 700);
        });
      });

      container.querySelectorAll('.btn-complete-step').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.step);
          if (!progress.completed.includes(i)) {
            progress.completed.push(i);
          }
          progress.current = Math.min(i + 1, steps.length - 1);
          this.saveProgress(lessonId, progress);
          render();
        });
      });

      container.querySelectorAll('.btn-goto-step').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = Number(btn.dataset.step);
          if (target > 0 && !progress.completed.includes(target - 1) && !progress.completed.includes(target)) {
            return;
          }
          progress.current = target;
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
