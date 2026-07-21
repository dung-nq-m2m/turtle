/**
 * Hướng dẫn code từng bước (khóa tuần tự + trắc nghiệm)
 * - Sai quiz → chờ 1 phút (countdown)
 * - Phải xác nhận đã đọc + tự gõ thử rồi mới mở trắc nghiệm (chống chép máy móc)
 */

const CodeGuide = {
  COOLDOWN_MS: 60 * 1000,

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

      const cooldowns = {};
      if (data.cooldowns && typeof data.cooldowns === 'object') {
        Object.keys(data.cooldowns).forEach((k) => {
          const until = Number(data.cooldowns[k]);
          if (Number.isFinite(until) && until > Date.now()) {
            cooldowns[String(k)] = until;
          }
        });
      }

      const confirmed = {};
      if (data.confirmed && typeof data.confirmed === 'object') {
        Object.keys(data.confirmed).forEach((k) => {
          if (data.confirmed[k]) confirmed[String(k)] = true;
        });
      }

      return { completed, expanded, cooldowns, confirmed };
    } catch {
      return { completed: [], expanded: 0, cooldowns: {}, confirmed: {} };
    }
  },

  saveProgress(lessonId, progress) {
    localStorage.setItem(this.storageKey(lessonId), JSON.stringify({
      completed: progress.completed,
      expanded: progress.expanded,
      current: progress.expanded,
      cooldowns: progress.cooldowns || {},
      confirmed: progress.confirmed || {}
    }));
  },

  isStepConfirmed(progress, stepIndex) {
    return !!(progress?.confirmed?.[String(stepIndex)]);
  },

  setStepConfirmed(lessonId, stepIndex, value) {
    const progress = this.loadProgress(lessonId);
    if (!progress.confirmed) progress.confirmed = {};
    if (value) progress.confirmed[String(stepIndex)] = true;
    else delete progress.confirmed[String(stepIndex)];
    this.saveProgress(lessonId, progress);
    return progress;
  },

  cooldownUntil(progress, stepIndex) {
    return Number(progress?.cooldowns?.[String(stepIndex)]) || 0;
  },

  cooldownRemainingMs(progress, stepIndex) {
    return Math.max(0, this.cooldownUntil(progress, stepIndex) - Date.now());
  },

  formatCountdown(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  },

  startQuizCooldown(lessonId, stepIndex) {
    const progress = this.loadProgress(lessonId);
    if (!progress.cooldowns) progress.cooldowns = {};
    progress.cooldowns[String(stepIndex)] = Date.now() + this.COOLDOWN_MS;
    this.saveProgress(lessonId, progress);
    return progress;
  },

  clearStepCooldown(progress, stepIndex) {
    if (!progress.cooldowns) return progress;
    delete progress.cooldowns[String(stepIndex)];
    return progress;
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

  workflowBannerHtml() {
    return `
      <div class="code-guide-workflow" role="note">
        <div class="code-guide-workflow-title">📌 Cách làm đúng — đừng chép máy móc</div>
        <ol class="code-guide-workflow-list">
          <li><strong>Đọc</strong> giải thích + checklist của <em>bước đang mở</em>.</li>
          <li><strong>Tự gõ</strong> phần code của bước đó trên máy (Thonny / IDLE) và <strong>chạy thử</strong>.</li>
          <li>Tick xác nhận → làm <strong>trắc nghiệm</strong> mới mở bước sau.</li>
        </ol>
        <p class="code-guide-workflow-warn">
          ❌ Không chép nguyên file từ trên xuống dưới.<br>
          💡 Gợi ý code chỉ để đối chiếu khi bí — không thay cho việc đọc hiểu.
        </p>
      </div>`;
  },

  confirmHtml(stepIndex, confirmed) {
    return `
      <div class="code-guide-confirm" data-guide-confirm="${stepIndex}">
        <div class="code-guide-confirm-title">Trước khi làm trắc nghiệm</div>
        <label class="code-guide-confirm-item">
          <input type="checkbox" data-guide-confirm-read="${stepIndex}"${confirmed ? ' checked' : ''}>
          <span>Em đã <strong>đọc</strong> giải thích và checklist bước này.</span>
        </label>
        <label class="code-guide-confirm-item">
          <input type="checkbox" data-guide-confirm-typed="${stepIndex}"${confirmed ? ' checked' : ''}>
          <span>Em đã <strong>tự gõ / chạy thử</strong> trên máy (không chép nguyên file).</span>
        </label>
        <p class="code-guide-confirm-hint" data-guide-confirm-hint ${confirmed ? 'hidden' : ''}>
          Tick đủ 2 ô trên để mở trắc nghiệm.
        </p>
      </div>`;
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

    if (!feedback) return { ok: false, reason: 'missing' };
    feedback.hidden = false;

    if (unanswered > 0) {
      feedback.className = 'code-guide-quiz-feedback is-error';
      feedback.textContent = `Em còn ${unanswered} câu chưa chọn đáp án. Hãy trả lời đủ rồi nộp lại.`;
      return { ok: false, reason: 'unanswered' };
    }
    if (wrong > 0) {
      feedback.className = 'code-guide-quiz-feedback is-error';
      feedback.innerHTML =
        `Chưa đúng ${wrong} câu.`
        + '<br><span class="code-guide-quiz-hint-text">Em đọc lại giải thích / checklist / gợi ý code, rồi thử lại sau 1 phút.</span>';
      return { ok: false, reason: 'wrong', wrong };
    }

    feedback.className = 'code-guide-quiz-feedback is-ok';
    feedback.textContent = 'Chính xác! Em đã nắm bước này — mở khóa bước tiếp theo.';
    return { ok: true };
  },

  /** Quiz chỉ mở khi đã xác nhận và không đang cooldown */
  setQuizInteractive(quizEl, enabled) {
    if (!quizEl) return;
    quizEl.querySelectorAll('input[type="radio"]').forEach((el) => {
      el.disabled = !enabled;
    });
    const btn = quizEl.querySelector('[data-guide-action="submit-quiz"]');
    if (btn) btn.disabled = !enabled;
    quizEl.classList.toggle('is-locked', !enabled && !quizEl.classList.contains('is-cooling'));
  },

  applyQuizLockState(container, lessonId, stepIndex) {
    const progress = this.loadProgress(lessonId);
    const quizEl = container.querySelector(`[data-guide-quiz="${stepIndex}"]`);
    if (!quizEl) return;
    const cooling = this.cooldownRemainingMs(progress, stepIndex) > 0;
    const confirmed = this.isStepConfirmed(progress, stepIndex);
    const canUse = confirmed && !cooling;
    this.setQuizInteractive(quizEl, canUse);
    quizEl.classList.toggle('is-locked', !confirmed && !cooling);
    const hint = container.querySelector(`[data-guide-confirm="${stepIndex}"] [data-guide-confirm-hint]`);
    if (hint) hint.hidden = confirmed;
  },

  updateCooldownBanner(quizEl, remainingMs, lessonId, stepIndex) {
    if (!quizEl) return;
    let banner = quizEl.querySelector('[data-guide-cooldown]');
    if (remainingMs <= 0) {
      banner?.remove();
      quizEl.classList.remove('is-cooling');
      const progress = lessonId != null
        ? this.loadProgress(lessonId)
        : { confirmed: { [String(stepIndex)]: true } };
      const confirmed = this.isStepConfirmed(progress, stepIndex);
      this.setQuizInteractive(quizEl, confirmed);
      quizEl.classList.toggle('is-locked', !confirmed);
      const feedback = quizEl.querySelector('[data-guide-feedback]');
      if (feedback && feedback.classList.contains('is-error') && confirmed) {
        feedback.hidden = false;
        feedback.className = 'code-guide-quiz-feedback is-ok';
        feedback.textContent = 'Đã hết thời gian chờ — em có thể nộp bài lại.';
      }
      const waitRef = quizEl.closest('.code-guide-step')
        ?.querySelector('.code-guide-wait-ref');
      waitRef?.remove();
      return;
    }

    quizEl.classList.add('is-cooling');
    quizEl.classList.remove('is-locked');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'code-guide-quiz-cooldown';
      banner.setAttribute('data-guide-cooldown', '');
      const actions = quizEl.querySelector('.code-guide-actions');
      if (actions) quizEl.insertBefore(banner, actions);
      else quizEl.appendChild(banner);
    }

    banner.innerHTML = `
      <div class="code-guide-cooldown-title">⏳ Chờ 1 phút rồi thử lại</div>
      <p class="code-guide-cooldown-msg">
        Trắc nghiệm chưa đúng. Em đọc lại giải thích và gợi ý code của bước này,
        đừng đoán bừa nhé!
      </p>
      <div class="code-guide-countdown" aria-live="polite">
        Còn <strong data-guide-countdown-sec>${this.formatCountdown(remainingMs)}</strong> mới nộp được lại
      </div>
    `;
    this.setQuizInteractive(quizEl, false);

    const waitRef = quizEl.closest('.code-guide-step')
      ?.querySelector('.code-guide-wait-ref');
    if (waitRef) {
      waitRef.textContent = `⏳ Chờ ${this.formatCountdown(remainingMs)} để thử lại`;
    }
  },

  stopCooldownTicker() {
    if (this._cooldownTimer) {
      clearInterval(this._cooldownTimer);
      this._cooldownTimer = null;
    }
  },

  startCooldownTicker(container, lessonId, stepIndex) {
    this.stopCooldownTicker();
    const tick = () => {
      const progress = this.loadProgress(lessonId);
      const left = this.cooldownRemainingMs(progress, stepIndex);
      const quizEl = container.querySelector(`[data-guide-quiz="${stepIndex}"]`);
      this.updateCooldownBanner(quizEl, left, lessonId, stepIndex);
      if (left <= 0) {
        this.stopCooldownTicker();
        if (progress.cooldowns?.[String(stepIndex)]) {
          this.clearStepCooldown(progress, stepIndex);
          this.saveProgress(lessonId, progress);
        }
      }
    };
    tick();
    this._cooldownTimer = setInterval(tick, 250);
  },

  quizHtml(step, stepIndex, reviewMode, { cooldownMs = 0, confirmed = false } = {}) {
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
        ${this.confirmHtml(stepIndex, confirmed)}
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary" data-guide-action="complete" data-step="${stepIndex}"${!confirmed ? ' disabled' : ''}>
            ✅ Em đã hoàn thành bước này
          </button>
        </div>`;
    }

    const cooling = cooldownMs > 0;
    const quizLocked = !confirmed || cooling;
    const cooldownBlock = cooling ? `
      <div class="code-guide-quiz-cooldown" data-guide-cooldown>
        <div class="code-guide-cooldown-title">⏳ Chờ 1 phút rồi thử lại</div>
        <p class="code-guide-cooldown-msg">
          Trắc nghiệm chưa đúng. Em đọc lại giải thích và gợi ý code của bước này,
          đừng đoán bừa nhé!
        </p>
        <div class="code-guide-countdown" aria-live="polite">
          Còn <strong data-guide-countdown-sec>${this.formatCountdown(cooldownMs)}</strong> mới nộp được lại
        </div>
      </div>` : '';

    return `
      ${this.confirmHtml(stepIndex, confirmed)}
      <div class="code-guide-quiz ${cooling ? 'is-cooling' : ''} ${!confirmed ? 'is-locked' : ''}" data-guide-quiz="${stepIndex}">
        <div class="code-guide-quiz-title">❓ Kiểm tra nhanh — trả lời đúng mới sang bước tiếp</div>
        <p class="code-guide-quiz-note">
          ${confirmed
            ? 'Em cần nắm chắc nội dung bước này trước khi mở khóa bước sau.'
            : 'Trắc nghiệm đang khóa — tick đủ 2 ô xác nhận phía trên trước.'}
        </p>
        ${questions.map((q, qi) => `
          <div class="code-guide-q" data-guide-q="${qi}">
            <div class="code-guide-q-text"><strong>Câu ${qi + 1}.</strong> ${q.question}</div>
            <div class="code-guide-q-options">
              ${(q.options || []).map((opt, oi) => `
                <label class="code-guide-q-option">
                  <input type="radio" name="guide-q-${stepIndex}-${qi}" value="${oi}"${quizLocked ? ' disabled' : ''}>
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <div class="code-guide-quiz-feedback" data-guide-feedback hidden></div>
        ${cooldownBlock}
        <div class="code-guide-actions">
          <button type="button" class="btn btn-primary" data-guide-action="submit-quiz" data-step="${stepIndex}"${quizLocked ? ' disabled' : ''}>
            ✅ Nộp bài & mở bước tiếp
          </button>
        </div>
      </div>`;
  },

  bodyHtml(step, i, { reviewMode, workingIndex, stepsLen, cooldownMs, confirmed }) {
    const checklist = step.checklist?.length ? `
      <div class="code-guide-checklist-wrap">
        <div class="code-guide-checklist-label">Checklist — em tự đánh dấu khi đã làm:</div>
        <ul class="code-guide-checklist">
          ${step.checklist.map((item, ci) => `
            <li>
              <label class="code-guide-check-item">
                <input type="checkbox" data-guide-check="${i}-${ci}">
                <span>${item}</span>
              </label>
            </li>
          `).join('')}
        </ul>
      </div>` : '';

    // Gợi ý ở cuối; khi cooldown vẫn mở để đọc lại — còn lại đóng mặc định
    const hintOpen = reviewMode || (cooldownMs > 0 && !reviewMode);
    const hint = step.hintCode ? `
      <details class="code-guide-hint" ${hintOpen ? 'open' : ''}>
        <summary>💡 Gợi ý code — chỉ đoạn bước này (xem khi đã tự thử)</summary>
        <p class="code-guide-hint-warn">
          Đây không phải file hoàn chỉnh để chép từ đầu đến cuối.
          Em chỉ đối chiếu phần liên quan bước ${i + 1}.
        </p>
        <pre class="code-guide-hint-code">${this.escape(step.hintCode)}</pre>
      </details>` : '';

    return `
      <div class="code-guide-step-body">
        <div class="code-guide-explain">${step.explain || ''}</div>
        ${checklist}
        ${step.goal ? `
          <p class="code-guide-goal">
            <strong>🎯 Kiểm tra thực hành (chạy trên máy trước):</strong> ${step.goal}
          </p>` : ''}
        ${reviewMode ? '' : this.quizHtml(step, i, false, {
          cooldownMs: cooldownMs || 0,
          confirmed: !!confirmed
        })}
        ${hint}
        ${reviewMode ? `
          <div class="code-guide-quiz code-guide-quiz-review">
            <div class="code-guide-quiz-title">✅ Em đã vượt qua trắc nghiệm bước này</div>
            <p class="code-guide-quiz-note">Chế độ xem lại — đọc lại giải thích và gợi ý bên trên.</p>
          </div>
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

  syncConfirmFromDom(container, lessonId, stepIndex) {
    const read = container.querySelector(`[data-guide-confirm-read="${stepIndex}"]`);
    const typed = container.querySelector(`[data-guide-confirm-typed="${stepIndex}"]`);
    const both = !!(read?.checked && typed?.checked);
    this.setStepConfirmed(lessonId, stepIndex, both);
    this.applyQuizLockState(container, lessonId, stepIndex);
    const completeBtn = container.querySelector(
      `[data-guide-action="complete"][data-step="${stepIndex}"]`
    );
    if (completeBtn) completeBtn.disabled = !both;
  },

  render(container, guide, lessonId) {
    if (!container || !guide?.steps?.length) return;

    const steps = guide.steps;
    const self = this;

    if (container.dataset.guideBound !== '1') {
      container.dataset.guideBound = '1';

      container.addEventListener('change', (e) => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;
        if (t.matches('[data-guide-confirm-read], [data-guide-confirm-typed]')) {
          const stepIndex = Number(
            t.getAttribute('data-guide-confirm-read')
            || t.getAttribute('data-guide-confirm-typed')
          );
          if (!Number.isInteger(stepIndex)) return;
          self.syncConfirmFromDom(container, lessonId, stepIndex);
        }
      });

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
          if (!self.isStepConfirmed(progress, stepIndex)) {
            self.syncConfirmFromDom(container, lessonId, stepIndex);
            return;
          }
          if (!progress.completed.includes(stepIndex)) {
            progress.completed.push(stepIndex);
          }
          progress.expanded = self.nextWorkingIndex(steps.length, progress.completed);
          self.saveProgress(lessonId, progress);
          paint();
          return;
        }

        if (action === 'submit-quiz') {
          if (!self.isStepConfirmed(progress, stepIndex)) {
            const quizEl = container.querySelector(`[data-guide-quiz="${stepIndex}"]`);
            const feedback = quizEl?.querySelector('[data-guide-feedback]');
            if (feedback) {
              feedback.hidden = false;
              feedback.className = 'code-guide-quiz-feedback is-error';
              feedback.textContent =
                'Em chưa xác nhận đã đọc và tự gõ thử. Tick đủ 2 ô phía trên trước khi nộp.';
            }
            self.applyQuizLockState(container, lessonId, stepIndex);
            return;
          }

          if (self.cooldownRemainingMs(progress, stepIndex) > 0) {
            const quizEl = container.querySelector(`[data-guide-quiz="${stepIndex}"]`);
            self.updateCooldownBanner(
              quizEl,
              self.cooldownRemainingMs(progress, stepIndex),
              lessonId,
              stepIndex
            );
            return;
          }

          const step = steps[stepIndex];
          const result = self.gradeQuiz(container, step, stepIndex);
          if (!result.ok) {
            if (result.reason === 'wrong') {
              self.startQuizCooldown(lessonId, stepIndex);
              const hint = container.querySelector(`[data-guide-step="${stepIndex}"] .code-guide-hint`);
              if (hint && !hint.open) hint.open = true;
              self.startCooldownTicker(container, lessonId, stepIndex);
            }
            return;
          }

          btn.disabled = true;
          setTimeout(() => {
            const p = self.loadProgress(lessonId);
            if (!p.completed.includes(stepIndex)) p.completed.push(stepIndex);
            self.clearStepCooldown(p, stepIndex);
            p.expanded = self.nextWorkingIndex(steps.length, p.completed);
            self.saveProgress(lessonId, p);
            self.stopCooldownTicker();
            paint();
            container.querySelector(`[data-guide-step="${p.expanded}"]`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 600);
          return;
        }

        if (action === 'reset') {
          if (!confirm('Xóa tiến độ hướng dẫn và làm lại từ bước 1?')) return;
          self.stopCooldownTicker();
          self.saveProgress(lessonId, {
            completed: [],
            expanded: 0,
            cooldowns: {},
            confirmed: {}
          });
          paint();
        }
      });
    }

    const paint = () => {
      self.stopCooldownTicker();
      const progress = self.loadProgress(lessonId);
      const doneCount = progress.completed.length;
      const allDone = doneCount >= steps.length;
      const workingIndex = self.nextWorkingIndex(steps.length, progress.completed);

      let expanded = progress.expanded;
      if (!self.isUnlocked(expanded, progress.completed)
          && !progress.completed.includes(expanded)) {
        expanded = workingIndex;
      }

      const defaultIntro =
        'Mỗi bước: đọc giải thích → tự gõ thử trên máy → xác nhận → trắc nghiệm. '
        + 'Không chép nguyên file từ trên xuống dưới.';

      container.innerHTML = `
        <p class="code-guide-intro">${guide.intro || defaultIntro}</p>
        ${self.workflowBannerHtml()}
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
            const cooldownMs = working ? self.cooldownRemainingMs(progress, i) : 0;
            const confirmed = self.isStepConfirmed(progress, i);

            let stateClass = 'locked';
            if (working) stateClass = cooldownMs > 0 ? 'current cooling' : 'current';
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
                stepsLen: steps.length,
                cooldownMs,
                confirmed
              });
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
                    ${cooldownMs > 0 ? `<div class="code-guide-flow-ref code-guide-wait-ref">⏳ Chờ ${self.formatCountdown(cooldownMs)} để thử lại</div>` : ''}
                    ${unlocked && !isExpanded ? '<div class="code-guide-flow-ref">Nhấn để mở</div>' : ''}
                  </div>
                </div>
                ${actions}
              </div>`;
          }).join('')}
        </div>
        ${allDone ? `
          <div class="code-guide-finish">
            🏆 Em đã hoàn thành toàn bộ các bước và vượt qua trắc nghiệm! Ghép code lại và chạy file game.
            <div style="margin-top:0.75rem">
              <button type="button" class="btn btn-outline" data-guide-action="reset">🔄 Làm lại từ đầu</button>
            </div>
          </div>
        ` : ''}`;

      const coolLeft = self.cooldownRemainingMs(progress, expanded);
      if (coolLeft > 0 && !progress.completed.includes(expanded)) {
        self.startCooldownTicker(container, lessonId, expanded);
      }
    };

    paint();
  }
};
