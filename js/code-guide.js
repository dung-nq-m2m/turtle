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
      const completed = (Array.isArray(data.completed) ? data.completed : [])
        .map(n => Number(n))
        .filter(n => Number.isInteger(n) && n >= 0);
      let expanded = Number(data.expanded);
      if (!Number.isInteger(expanded) || expanded < 0) {
        expanded = Number(data.current);
      }
      if (!Number.isInteger(expanded) || expanded < 0) expanded = 0;
      return { completed, expanded };
    } catch {
      return { completed: [], expanded: 0 };
    }
  },

  saveProgress(lessonId, progress) {
    localStorage.setItem(this.storageKey(lessonId), JSON.stringify({
      completed: progress.completed,
      expanded: progress.expanded,
      current: progress.expanded
    }));
  },

  nextWorkingIndex(stepsLen, completed) {
    for (let i = 0; i < stepsLen; i++) {
      if (!completed.includes(i)) return i;
    }
    return Math.max(0, stepsLen - 1);
  },

  isUnlocked(index, completed) {
    return index === 0 || completed.includes(index - 1);
  },

  escape(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  gradeQuiz(root, step, stepIndex) {
    const questions = step.quiz || [];
    const quizEl = root.querySelector(`[data-guide-quiz="${stepIndex}"]`);
    const feedback = quizEl?.querySelector('[data-guide-feedback]');
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q, qi) => {
      const qEl = quizEl?.querySelector(`[data-guide-q="${qi}"]`);
      const selected = qEl?.querySelector(`input[name="guide-q-${stepIndex}-${qi}"]:checked`);
      qEl?.classList.remove('is-correct', 'is-wrong');

      if (!selected) {
        unanswered += 1;
        qEl?.classList.add('is-wrong');
        return;
      }

      if (Number(selected.value) === q.correct) {
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
      feedback.innerHTML =
        `Chưa đúng ${wrong} câu. Đọc lại giải thích / gợi ý code phía trên rồi thử lại.`
        + '<br><span class="code-guide-quiz-hint-text">Gợi ý: xem lại checklist và gợi ý code của bước này.</span>';
      return false;
    }

    feedback.className = 'code-guide-quiz-feedback is-ok';
    feedback.textContent = 'Chính xác! Em đã nắm bước này — mở khóa bước tiếp theo.';
    return true;
  },

  quizHtml(step, stepIndex, reviewMode) {
    if (reviewMode) {
      return `
        <div class="code-guide-quiz code-guide-quiz-review">
          <div class="code-guide-quiz-title">✅ Em đã vượt qua trắc nghiệm bước này</div>
          <p class="code-guide-quiz-note">Chế độ xem lại — em có thể đọc lại nội dung bên trên.</p>
        </div>`;
    }

    const questions = step.quiz || [];
    if (!questions.length) {
      return `
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary" data-guide-action="complete" data-step="${stepIndex}">
            ✅ Em đã hoàn thành bước này
          </button>
        </div>`;
    }

    return `
      <div class="code-guide-quiz" data-guide-quiz="${stepIndex}">
        <div class="code-guide-quiz-title">❓ Kiểm tra nhanh — trả lời đúng mới sang bước tiếp</div>
        <p class="code-guide-quiz-note">Em cần nắm chắc nội dung bước này trước khi mở khóa bước sau.</p>
        ${questions.map((q, qi) => `
          <div class="code-guide-q" data-guide-q="${qi}">
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
        <div class="code-guide-quiz-feedback" data-guide-feedback hidden></div>
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary" data-guide-action="submit-quiz" data-step="${stepIndex}">
            ✅ Nộp bài & mở bước tiếp
          </button>
        </div>
      </div>`;
  },

  bodyHtml(step, i, { reviewMode, workingIndex, stepsLen }) {
    return `
      <div class="code-guide-step-body">
        <div class="code-guide-explain">${step.explain || ''}</div>
        ${step.checklist?.length ? `
          <ul class="code-guide-checklist">
            ${step.checklist.map(item => `<li>${item}</li>`).join('')}
          </ul>
        ` : ''}
        ${step.hintCode ? `
          <details class="code-guide-hint" ${reviewMode ? 'open' : ''}>
            <summary>💡 Gợi ý code (xem khi cần)</summary>
            <pre class="code-guide-hint-code">${this.escape(step.hintCode)}</pre>
          </details>
        ` : ''}
        ${step.goal ? `<p class="code-guide-goal"><strong>Kiểm tra thực hành:</strong> ${step.goal}</p>` : ''}
        ${this.quizHtml(step, i, reviewMode)}
        ${reviewMode ? `
          <div class="code-guide-actions" style="margin-top:0.75rem">
            ${i + 1 < stepsLen ? `
              <button type="button" class="btn btn-outline" data-guide-action="open" data-step="${i + 1}">
                Bước tiếp →
              </button>
            ` : ''}
            ${workingIndex !== i ? `
              <button type="button" class="btn btn-primary" data-guide-action="open" data-step="${workingIndex}">
                ← Quay lại bước đang làm
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>`;
  },

  render(container, guide, lessonId) {
    if (!container || !guide?.steps?.length) return;

    const steps = guide.steps;
    const self = this;

    // Gắn listener 1 lần (delegation) — tránh mất sự kiện sau mỗi lần render
    if (container.dataset.guideBound !== '1') {
      container.dataset.guideBound = '1';
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-guide-action]');
        if (!btn || !container.contains(btn)) return;

        const action = btn.getAttribute('data-guide-action');
        const stepIndex = Number(btn.getAttribute('data-step'));
        const progress = self.loadProgress(lessonId);

        if (action === 'open') {
          if (!Number.isInteger(stepIndex)) return;
          if (!self.isUnlocked(stepIndex, progress.completed)
              && !progress.completed.includes(stepIndex)) {
            return;
          }
          progress.expanded = stepIndex;
          self.saveProgress(lessonId, progress);
          paint();
          container.querySelector(`[data-guide-step="${stepIndex}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }

        if (action === 'complete') {
          if (!progress.completed.includes(stepIndex)) {
            progress.completed.push(stepIndex);
          }
          progress.expanded = self.nextWorkingIndex(steps.length, progress.completed);
          self.saveProgress(lessonId, progress);
          paint();
          return;
        }

        if (action === 'submit-quiz') {
          const step = steps[stepIndex];
          if (!self.gradeQuiz(container, step, stepIndex)) return;
          btn.disabled = true;
          setTimeout(() => {
            const p = self.loadProgress(lessonId);
            if (!p.completed.includes(stepIndex)) p.completed.push(stepIndex);
            p.expanded = self.nextWorkingIndex(steps.length, p.completed);
            self.saveProgress(lessonId, p);
            paint();
            container.querySelector(`[data-guide-step="${p.expanded}"]`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 600);
          return;
        }

        if (action === 'reset') {
          if (!confirm('Xóa tiến độ hướng dẫn và làm lại từ bước 1?')) return;
          self.saveProgress(lessonId, { completed: [], expanded: 0 });
          paint();
        }
      });
    }

    const paint = () => {
      const progress = self.loadProgress(lessonId);
      const doneCount = progress.completed.length;
      const allDone = doneCount >= steps.length;
      const workingIndex = self.nextWorkingIndex(steps.length, progress.completed);

      let expanded = progress.expanded;
      if (!self.isUnlocked(expanded, progress.completed)
          && !progress.completed.includes(expanded)) {
        expanded = workingIndex;
      }

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
            const unlocked = self.isUnlocked(i, progress.completed);
            const isExpanded = unlocked && i === expanded;
            const reviewMode = isExpanded && isDone;
            const working = isExpanded && !isDone;

            let stateClass = 'locked';
            if (working) stateClass = 'current';
            else if (reviewMode) stateClass = 'review';
            else if (isDone) stateClass = 'done';
            else if (unlocked) stateClass = 'unlocked';

            let actions = '';
            if (!unlocked) {
              actions = `<p class="code-guide-locked-msg">Hoàn thành và trả lời đúng trắc nghiệm bước ${i} trước để mở khóa.</p>`;
            } else if (isExpanded) {
              actions = self.bodyHtml(step, i, {
                reviewMode,
                workingIndex,
                stepsLen: steps.length
              });
              // Ẩn nút "Bước tiếp" nếu bước sau chưa mở
              if (reviewMode && i + 1 < steps.length && !self.isUnlocked(i + 1, progress.completed)) {
                actions = actions.replace(
                  /<button type="button" class="btn btn-outline" data-guide-action="open" data-step="\d+">\s*Bước tiếp →\s*<\/button>/,
                  ''
                );
              }
            } else {
              actions = `
                <button type="button" class="btn btn-outline code-guide-reopen"
                        data-guide-action="open" data-step="${i}">
                  ${isDone ? '👁️ Xem lại' : '📂 Mở'} bước ${i + 1}
                </button>`;
            }

            return `
              <div class="code-guide-step ${stateClass}" data-guide-step="${i}">
                <div class="code-guide-step-header"
                     ${unlocked && !isExpanded ? `role="button" tabindex="0" data-guide-action="open" data-step="${i}" style="cursor:pointer"` : ''}>
                  <span class="code-guide-badge">${isDone ? '✓' : unlocked ? i + 1 : '🔒'}</span>
                  <div class="code-guide-step-meta">
                    <div class="code-guide-step-title">${step.title}</div>
                    ${step.flowLabel ? `<div class="code-guide-flow-ref">📍 Biểu đồ: ${step.flowLabel}</div>` : ''}
                    ${reviewMode ? '<div class="code-guide-flow-ref">👁️ Đang xem lại</div>' : ''}
                    ${unlocked && !isExpanded ? '<div class="code-guide-flow-ref">Nhấn để mở</div>' : ''}
                  </div>
                </div>
                ${actions}
              </div>`;
          }).join('')}
        </div>
        ${allDone ? `
          <div class="code-guide-finish">
            🏆 Em đã hoàn thành toàn bộ các bước và vượt qua trắc nghiệm! Ghép code lại và chạy file <code>ban-bong.py</code>.
            <div style="margin-top:0.75rem">
              <button type="button" class="btn btn-outline" data-guide-action="reset">🔄 Làm lại từ đầu</button>
            </div>
          </div>
        ` : ''}`;
    };

    paint();
  }
};
