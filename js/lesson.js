/**
 * Lesson page renderer
 */

let currentLesson = null;

async function loadLesson() {
  const lessonId = TurtleAcademy.getLessonIdFromURL();
  if (!lessonId) {
    window.location.href = 'index.html';
    return;
  }

  await TurtleAcademy.initConfig();
  await renderSidebar('lesson', lessonId);

  try {
    const lesson = await TurtleAcademy.loadJSON(`data/lessons/${lessonId}.json`);
    currentLesson = lesson;
    renderLesson(lesson);
    document.title = `${lesson.title} - Học viện Turtle Python`;
  } catch (e) {
    document.getElementById('lesson-content').innerHTML = `
      <div class="card">
        <h2>😅 Bài học chưa có nội dung</h2>
        <p>Bài "<strong>${lessonId}</strong>" đang được soạn. Quay lại sau nhé!</p>
        <a href="index.html" class="btn btn-primary">← Về trang chủ</a>
      </div>
    `;
  }
}

function isGameLesson(lesson) {
  return lesson.codeLocked || lesson.chapter === 6 || lesson.architecture;
}

function renderLesson(lesson) {
  const content = document.getElementById('lesson-content');
  if (!content) return;

  const gameLesson = isGameLesson(lesson);

  content.innerHTML = `
    <div class="lesson-header">
      <div class="lesson-breadcrumb">
        Chương ${lesson.chapter} · ${lesson.chapterTitle}
      </div>
      <h2>${lesson.icon || '📖'} ${lesson.title}</h2>
      ${gameLesson ? '<span class="badge-game-mode">🎮 Chế độ học Game — Thuật toán trước, Code sau</span>' : ''}
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">📌</span> Mục tiêu</div>
      <p style="margin-bottom:0.75rem">Sau bài này em sẽ biết:</p>
      <ul class="objectives-list">
        ${lesson.objectives.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">📚</span> Giải thích</div>
      <div>${lesson.explanation}</div>
      ${!gameLesson && lesson.syntax ? `
        <div class="syntax-box">${lesson.syntax}</div>
        <div class="syntax-note">${lesson.syntaxNote || ''}</div>
      ` : ''}
    </div>

    ${lesson.architecture ? `
    <div class="card card-architecture">
      <div class="card-title"><span class="icon">🏗️</span> Kiến trúc game</div>
      <div id="architecture-area"></div>
    </div>
    ` : ''}

    ${lesson.variables?.length ? `
    <div class="card">
      <div class="card-title"><span class="icon">📊</span> Bảng biến (Variables)</div>
      <div id="variables-area"></div>
    </div>
    ` : ''}

    ${lesson.algorithm ? `
    <div class="card card-flowchart">
      <div class="card-title"><span class="icon">🔀</span> Biểu đồ thuật toán</div>
      <div id="algorithm-area"></div>
    </div>
    ` : ''}

    ${lesson.pseudocode ? `
    <div class="card">
      <div class="card-title"><span class="icon">📝</span> Giả mã (Pseudocode)</div>
      <div id="pseudocode-area"></div>
      ${lesson.syntax ? `
        <div class="syntax-box" style="margin-top:1rem">${lesson.syntax}</div>
        <div class="syntax-note">${lesson.syntaxNote || ''}</div>
      ` : ''}
    </div>
    ` : ''}

    ${lesson.codeGuide?.steps?.length ? `
    <div class="card card-code-guide">
      <div class="card-title"><span class="icon">🪜</span> Hướng dẫn code từng bước</div>
      <div id="code-guide-area"></div>
    </div>
    ` : ''}

    <div class="card">
      <div class="card-title"><span class="icon">🎬</span> Hình minh họa</div>
      <div class="turtle-demo" id="animation-demo"></div>
    </div>

    ${lesson.assetsGuide ? `
    <div class="card card-assets-guide">
      <div class="card-title"><span class="icon">🎨</span> Hình ảnh & âm thanh (mở rộng)</div>
      <div class="assets-guide-body">${lesson.assetsGuide}</div>
    </div>
    ` : ''}

    <div class="card" id="code-card">
      <div class="card-title"><span class="icon">💻</span> Code Python ${lesson.codeLocked ? '<span class="badge-locked">🔒 Chờ GV mở</span>' : ''}</div>
      <div id="code-editor-area"></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">▶</span> Kết quả mong đợi</div>
      <div class="result-preview" id="result-preview"></div>
      <p style="margin-top:0.75rem;color:#666">${lesson.resultDescription || ''}</p>
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">💡</span> Ghi nhớ</div>
      <div class="remember-grid">
        ${(lesson.remember || []).map(r => `
          <div class="remember-item">
            ${r.command ? `<code>${r.command}</code>` : ''}
            <span>${r.meaning || r.tip || ''}</span>
          </div>
        `).join('')}
      </div>
    </div>

    ${lesson.exercises?.length ? `
    <div class="card">
      <div class="card-title"><span class="icon">📝</span> Bài tập (tự gõ — không cần xem code)</div>
      ${lesson.exercises.map(ex => `
        <div class="exercise-item">
          <h4>Bài ${ex.number}: ${ex.title}</h4>
          <p>${ex.description}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${lesson.infographic ? `
    <div class="card">
      <div class="card-title"><span class="icon">🖼️</span> Infographic</div>
      <div class="infographic" id="infographic">
        <h3>${lesson.title}</h3>
        <div class="infographic-grid">
          <div class="infographic-item"><label>✔ Chức năng</label><span>${lesson.infographic.function}</span></div>
          <div class="infographic-item"><label>✔ Cú pháp</label><span>${lesson.infographic.syntax}</span></div>
          <div class="infographic-item"><label>✔ Ví dụ</label><span>${lesson.infographic.example}</span></div>
          <div class="infographic-item"><label>✔ Kết quả</label><span>${lesson.infographic.result}</span></div>
          <div class="infographic-item"><label>✔ Bài tập</label><span>${lesson.infographic.exercise}</span></div>
        </div>
      </div>
    </div>
    ` : ''}

    ${lesson.quiz ? `
    <div class="card">
      <div class="card-title"><span class="icon">❓</span> Kiểm tra nhanh</div>
      <div id="quiz-area"></div>
    </div>
    ` : ''}

    <div class="lesson-nav">
      ${lesson.prev
        ? `<a href="lesson.html?lesson=${lesson.prev}" class="btn btn-outline">← Bài trước</a>`
        : '<span></span>'}
      ${lesson.next
        ? `<a href="lesson.html?lesson=${lesson.next}" class="btn btn-primary">Bài tiếp →</a>`
        : `<a href="challenges.html" class="btn btn-orange">🏆 Thử thách →</a>`}
    </div>
  `;

  if (lesson.architecture) {
    GameDiagram.renderArchitecture(document.getElementById('architecture-area'), lesson.architecture);
  }
  if (lesson.variables?.length) {
    GameDiagram.renderVariables(document.getElementById('variables-area'), lesson.variables);
  }
  if (lesson.algorithm) {
    GameDiagram.renderFlowchart(document.getElementById('algorithm-area'), lesson.algorithm);
  }
  if (lesson.pseudocode) {
    GameDiagram.renderPseudocode(document.getElementById('pseudocode-area'), lesson.pseudocode);
  }
  if (lesson.codeGuide?.steps?.length) {
    CodeGuide.render(document.getElementById('code-guide-area'), lesson.codeGuide, lesson.id);
  }
  if (lesson.animation) {
    TurtleAnimation.render(document.getElementById('animation-demo'), lesson.animation);
  }

  renderLessonCode(lesson);

  const resultEl = document.getElementById('result-preview');
  if (resultEl) {
    resultEl.innerHTML = TurtleAnimation.renderResultSVG(lesson.id);
  }

  if (lesson.quiz) {
    Quiz.render(document.getElementById('quiz-area'), lesson.quiz, lesson.id);
  }
}

function renderLessonCode(lesson) {
  const unlocked = TurtleAcademy.isCodeUnlocked(lesson.id);
  const showCode = !lesson.codeLocked || unlocked;
  CodeEditor.render(
    document.getElementById('code-editor-area'),
    showCode ? lesson.code : '',
    `${lesson.id || 'turtle'}.py`,
    {
      locked: !!lesson.codeLocked,
      lessonId: lesson.id,
      runHint: lesson.pseudocode
        ? 'Gõ code theo giả mã và biểu đồ thuật toán phía trên'
        : 'Gõ lại code theo hướng dẫn trong bài'
    }
  );

  const badge = document.querySelector('#code-card .badge-locked');
  if (badge) {
    badge.style.display = unlocked ? 'none' : 'inline-block';
  }
}

function onCodeUnlockChange(e) {
  if (!currentLesson) return;
  const changedId = e.detail?.lessonId;
  if (!changedId || changedId === currentLesson.id) {
    renderLessonCode(currentLesson);
  }
}

window.addEventListener('code-unlocked', onCodeUnlockChange);
window.addEventListener('code-locked', onCodeUnlockChange);
window.addEventListener('code-lock-all', () => {
  if (currentLesson) renderLessonCode(currentLesson);
});

document.addEventListener('DOMContentLoaded', loadLesson);
