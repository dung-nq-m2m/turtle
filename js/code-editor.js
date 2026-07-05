/**
 * Code display — khóa theo giáo viên (Chương 6 & Game)
 */

const CodeEditor = {
  render(container, code, filename = 'turtle.py', options = {}) {
    if (!container) return;

    const locked = options.locked && !TurtleAcademy.isCodeUnlocked();
    const runHint = options.runHint || 'Gõ lại code theo giả mã và thuật toán đã học';

    if (locked) {
      container.innerHTML = `
        <div class="code-locked-panel">
          <div class="code-locked-icon">🔒</div>
          <h4>Code được giáo viên mở</h4>
          <p>${TurtleAcademy.codeLockMessage || 'Em cần nắm kiến trúc và thuật toán trước. Giáo viên sẽ mở code khi sẵn sàng.'}</p>
          <p class="code-locked-hint">👨‍🏫 Giáo viên mở khóa tại trang <a href="teacher.html">Giáo viên</a></p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="code-unlocked-badge">✅ Giáo viên đã mở code</div>
      <div class="code-editor-wrap protected-content">
        <div class="code-editor-header">
          <span>💻 Code Python</span>
          <span>${filename}</span>
        </div>
        <pre class="code-display" id="lesson-code"></pre>
      </div>
      <div class="code-actions">
        <button class="btn btn-outline" id="btn-run-hint">▶ Cách chạy</button>
      </div>
      <div id="run-hint" style="display:none;margin-top:0.75rem;padding:1rem;background:#eef6ff;border-radius:12px;font-size:0.9rem">
        <strong>Cách chạy chương trình:</strong>
        <ol style="margin:0.5rem 0 0 1.25rem">
          <li>${runHint}</li>
          <li>Mở IDLE hoặc VS Code</li>
          <li>Nhấn <kbd>F5</kbd> (Run)</li>
          <li>Chạy thử và so sánh với thuật toán!</li>
        </ol>
      </div>
    `;

    const codeEl = document.getElementById('lesson-code');
    if (codeEl) codeEl.textContent = code;

    document.getElementById('btn-run-hint')?.addEventListener('click', () => {
      const hint = document.getElementById('run-hint');
      if (hint) hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    });
  }
};
