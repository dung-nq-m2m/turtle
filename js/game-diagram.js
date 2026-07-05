/**
 * Kiến trúc game & biểu đồ thuật toán
 */

const GameDiagram = {
  renderArchitecture(container, data) {
    if (!container || !data) return;

    container.innerHTML = `
      <p style="margin-bottom:1rem">${data.intro || ''}</p>
      <div class="arch-layers">
        ${(data.layers || []).map((layer, i) => `
          <div class="arch-layer arch-layer-${i + 1}">
            <div class="arch-layer-title">${layer.title}</div>
            <ul class="arch-layer-items">
              ${(layer.items || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          ${i < data.layers.length - 1 ? '<div class="arch-arrow">→</div>' : ''}
        `).join('')}
      </div>
      ${data.note ? `<p class="arch-note">💡 ${data.note}</p>` : ''}
    `;
  },

  renderFlowchart(container, data) {
    if (!container || !data) return;

    const typeClass = {
      start: 'flow-start',
      end: 'flow-end',
      process: 'flow-process',
      decision: 'flow-decision',
      input: 'flow-input',
      output: 'flow-output'
    };

    container.innerHTML = `
      <h4 class="flowchart-title">${data.title || 'Biểu đồ thuật toán'}</h4>
      <div class="flowchart">
        ${(data.steps || []).map((step, i) => {
          const cls = typeClass[step.type] || 'flow-process';
          let inner = `<div class="flow-box ${cls}">${step.label}</div>`;
          if (step.type === 'decision' && (step.yes || step.no)) {
            inner = `
              <div class="flow-box ${cls}">${step.label}</div>
              <div class="flow-branches">
                <span class="flow-yes">Có → ${step.yes || '...'}</span>
                <span class="flow-no">Không → ${step.no || '...'}</span>
              </div>`;
          }
          const arrow = i < data.steps.length - 1
            ? '<div class="flow-arrow-down">↓</div>' : '';
          return `<div class="flow-step">${inner}${arrow}</div>`;
        }).join('')}
      </div>
    `;
  },

  renderPseudocode(container, data) {
    if (!container || !data) return;
    container.innerHTML = `
      <p style="margin-bottom:0.75rem;color:#666">${data.note || 'Giả mã — em tự gõ Python sau khi hiểu logic:'}</p>
      <pre class="pseudocode-display">${(data.lines || []).join('\n')}</pre>
    `;
  },

  renderVariables(container, data) {
    if (!container || !data?.length) return;
    container.innerHTML = `
      <table class="var-table">
        <thead><tr><th>Biến</th><th>Ý nghĩa</th><th>Giá trị ban đầu</th></tr></thead>
        <tbody>
          ${data.map(v => `
            <tr>
              <td><code>${v.name}</code></td>
              <td>${v.meaning}</td>
              <td>${v.initial}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
};
