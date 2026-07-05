/**
 * Quiz component with instant feedback
 */

const Quiz = {
  render(container, quiz, lessonId) {
    if (!container || !quiz) return;

    container.innerHTML = `
      <p style="font-size:1.05rem;font-weight:600;margin-bottom:0.5rem">${quiz.question}</p>
      <div class="quiz-options" id="quiz-options">
        ${quiz.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" data-correct="${opt.correct}">
            ○ ${opt.text}
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
    `;

    const feedback = document.getElementById('quiz-feedback');
    let answered = false;

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        const isCorrect = btn.dataset.correct === 'true';
        btn.classList.add(isCorrect ? 'correct' : 'wrong');

        document.querySelectorAll('.quiz-option').forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });

        if (feedback) {
          feedback.className = `quiz-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
          feedback.innerHTML = isCorrect
            ? `🎉 <strong>Chính xác!</strong> ${quiz.explanation || ''}`
            : `😅 <strong>Chưa đúng!</strong> ${quiz.explanation || ''}`;
        }

        if (isCorrect && lessonId) {
          TurtleAcademy.markLessonComplete(lessonId);
          TurtleAcademy.showToast('🏅 Hoàn thành bài học!');
        }
      });
    });
  }
};
