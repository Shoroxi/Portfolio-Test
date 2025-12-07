(() => {
  const tests = [
    {
      id: "3d-basics",
      title: "Основы 3D",
      difficulty: "Начинающий",
      duration: "8 вопросов · ~4 мин",
      tags: ["пайплайн", "софт"],
      description: "Разминка с основными концепциями 3D моделирования и рендеринга.",
      color: "#9b5bff",
      questions: [
        {
          title: "Какой DCC пакет наиболее известен своим workflow с модификаторами?",
          options: ["Maya", "Blender", "3ds Max", "Cinema 4D"],
          answer: 2,
          tip: "Подумайте о недеструктивном стеке операций.",
        },
        {
          title: "Для чего используется ambient occlusion?",
          options: [
            "Добавление motion blur к быстрым объектам",
            "Симуляция контактных теней в углублениях",
            "Увеличение отскоков глобального освещения",
            "Усиление normal maps",
          ],
          answer: 1,
          tip: "Часто запекается или умножается на диффузную карту.",
        },
        {
          title: "Какой формат файла наиболее распространен для обмена ригнутыми персонажами?",
          options: ["FBX", "PNG", "SVG", "HDRI"],
          answer: 0,
        },
        {
          title: "PBR workflow опирается на какую пару текстур?",
          options: [
            "Base color + metallic/roughness",
            "Displacement + specular color",
            "Height + emissive",
            "Normal + curvature",
          ],
          answer: 0,
        },
        {
          title: "Subdivision surfaces в основном помогают с…",
          options: [
            "Оптимизацией UV островов",
            "Сглаживанием low-poly контрольных мешей",
            "Добавлением объемного освещения",
            "Анимацией костей",
          ],
          answer: 1,
        },
        {
          title: "Какая единица измерения обычно используется для интенсивности света в физически корректных рендерах?",
          options: ["Кельвин", "Кандела", "Люкс", "Ниты"],
          answer: 2,
        },
        {
          title: "Tri-planar проекция полезна, потому что она…",
          options: [
            "Уменьшает количество полигонов",
            "Применяет текстуры без UV швов",
            "Улучшает гайды ретопологии",
            "Ускоряет GPU рендеринг",
          ],
          answer: 1,
        },
        {
          title: "Какой движок популяризировал технологии Lumen и Nanite в реальном времени?",
          options: ["Unity", "Unreal Engine 5", "Godot", "CryEngine"],
          answer: 1,
        },
      ],
    },
  ];

  const state = {
    currentTest: null,
    currentIndex: 0,
    selectedOption: null,
    answers: [],
  };

  const testListEl = document.getElementById("testList");
  const workspaceEl = document.getElementById("workspace");

  if (testListEl && workspaceEl) {
    if (!testListEl.childElementCount) {
      renderTestCards();
    } else {
      hydrateTestCards();
    }
    renderWorkspace();
    autoStartFromQuery();
  }

  function resetState() {
    state.currentTest = null;
    state.currentIndex = 0;
    state.selectedOption = null;
    state.answers = [];
  }

  function renderTestCards() {
    testListEl.innerHTML = "";

    tests.forEach((test) => {
      const card = document.createElement("article");
      card.className = "test-card";
      card.dataset.testCard = test.id;
      card.innerHTML = `
      <div class="test-card-header">
        <h3 class="test-card-title">${test.title}</h3>
        <span class="badge">${test.difficulty}</span>
      </div>
      <p class="test-card-desc">${test.description}</p>
      <div class="test-meta">
        <span>${test.duration}</span>
        <span>Вопросов: ${test.questions.length}</span>
      </div>
      <div class="results-actions">
        <button class="pill-btn" data-action="preview" type="button">Предпросмотр</button>
        <a class="primary-btn" data-action="start" href="?test=${test.id}">Начать</a>
      </div>
    `;
      attachCardHandlers(card, test);
      testListEl.appendChild(card);
    });
  }

  function hydrateTestCards() {
    const cards = testListEl.querySelectorAll("[data-test-card]");
    cards.forEach((card) => {
      const testId = card.dataset.testCard;
      const test = tests.find((t) => t.id === testId);
      if (!test) {
        return;
      }
      attachCardHandlers(card, test);
    });
  }

  function attachCardHandlers(card, test) {
    const startBtn = card.querySelector('[data-action="start"]');
    const previewBtn = card.querySelector('[data-action="preview"]');

    if (previewBtn) {
      previewBtn.addEventListener("click", () => previewTest(test));
    }

    if (startBtn) {
      startBtn.addEventListener("click", (event) => {
        event.preventDefault();
        startTest(test.id);
      });
    }
  }

  function previewTest(test) {
    showTestInfo(test);
  }

  function startTest(testId) {
    const test = tests.find((item) => item.id === testId);
    if (!test) return;

    state.currentTest = test;
    state.currentIndex = 0;
    state.selectedOption = null;
    state.answers = [];

    renderWorkspace();
  }

  function autoStartFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const requestedTest = params.get("test");
    if (!requestedTest) {
      return;
    }
    const exists = tests.some((test) => test.id === requestedTest);
    if (!exists) {
      return;
    }
    startTest(requestedTest);
    params.delete("test");
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function showTestInfo(test = tests[0]) {
    if (!workspaceEl || !test) return;
    workspaceEl.innerHTML = `
      <div class="workspace-active">
        <div class="workspace-header">
          <div>
            <p class="question-meta">Обзор теста</p>
            <h3 class="question-title">${test.title}</h3>
          </div>
        </div>
        <div class="question-card">
          <p class="test-card-desc">${test.description}</p>
          <div class="options-list">
            <div class="status-text">Сложность: ${test.difficulty}</div>
            <div class="status-text">Длительность: ${test.duration}</div>
            <div class="status-text">Вопросов: ${test.questions.length}</div>
            <div class="status-text">Темы: ${test.tags.join(", ")}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWorkspace() {
    if (!state.currentTest) {
      showTestInfo();
      return;
    }

    const { currentTest, currentIndex } = state;
    const question = currentTest.questions[currentIndex];
    const total = currentTest.questions.length;
    const progressPercent = Math.floor((currentIndex / total) * 100);

    const isFinished = state.answers.length === total;

    if (isFinished) {
      renderResults();
      return;
    }

    workspaceEl.innerHTML = `
    <div class="workspace-active">
      <div class="workspace-header">
        <div>
          <p class="question-meta">Вопрос ${currentIndex + 1} из ${total}</p>
          <h3 class="question-title">${question.title}</h3>
        </div>
        <button class="ghost-btn" type="button" id="exitTestBtn">Выход</button>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${progressPercent}%"></div>
      </div>

      <div class="question-card">
        <div class="options-list" id="optionsList"></div>
        ${
          question.tip
            ? `<p class="status-text">Подсказка: ${question.tip}</p>`
            : ""
        }
      </div>

      <div class="workspace-footer">
        <span class="status-text">Выберите ответ, чтобы продолжить.</span>
        <button class="primary-btn" type="button" id="nextBtn" disabled>
          ${currentIndex === total - 1 ? "Завершить тест" : "Следующий вопрос"}
        </button>
      </div>
    </div>
  `;

    const optionsList = document.getElementById("optionsList");
    question.options.forEach((option, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;
      btn.type = "button";
      btn.addEventListener("click", () => selectOption(idx));
      optionsList.appendChild(btn);
    });

    document.getElementById("nextBtn").addEventListener("click", handleNext);
    document.getElementById("exitTestBtn").addEventListener("click", () => {
      resetState();
      renderWorkspace();
    });
  }

  function selectOption(index) {
    state.selectedOption = index;
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((btn, idx) => {
      btn.classList.toggle("is-selected", idx === index);
    });

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  function handleNext() {
    const { currentTest, currentIndex, selectedOption } = state;
    if (selectedOption === null) return;

    const question = currentTest.questions[currentIndex];
    const isCorrect = question.answer === selectedOption;
    state.answers.push({
      question: question.title,
      selected: selectedOption,
      correct: question.answer,
      isCorrect,
    });

    state.currentIndex += 1;
    state.selectedOption = null;

    if (state.currentIndex >= currentTest.questions.length) {
      renderResults();
    } else {
      renderWorkspace();
    }
  }

  function renderResults() {
    const { currentTest, answers } = state;
    const total = currentTest.questions.length;
    const score = Math.round((answers.filter((item) => item.isCorrect).length / total) * 100);

    workspaceEl.innerHTML = `
    <div class="workspace-active">
      <div class="workspace-header">
        <div>
          <p class="question-meta">Результаты готовы</p>
          <h3 class="question-title">${currentTest.title}</h3>
        </div>
        <button class="ghost-btn" type="button" id="exitTestBtn">Выход</button>
      </div>

      <div class="results-card">
        <p class="results-score">${score}%</p>
        <p class="results-meta">
          ${answers.filter((item) => item.isCorrect).length} / ${total} правильных
        </p>
        <div class="progress-bar">
        <div class="progress-fill" style="width:${score}%"></div>
        </div>
        <div class="results-summary">
          <div>Время потрачено: <span>~${Math.max(2, total)} мин</span></div>
          <div>Сложность: <span>${currentTest.difficulty}</span></div>
          <div>Статус: <span>${score >= 70 ? "Готов к следующему уровню" : "Рекомендуется повторить"}</span></div>
        </div>
        <div class="results-actions">
          <button class="primary-btn" type="button" id="retakeBtn">Повторить</button>
          <button class="ghost-btn" type="button" id="reviewBtn">Просмотреть ответы</button>
        </div>
      </div>
    </div>
  `;

    document.getElementById("exitTestBtn").addEventListener("click", () => {
      resetState();
      renderWorkspace();
    });
    document.getElementById("retakeBtn").addEventListener("click", () => {
      startTest(currentTest.id);
    });
    document.getElementById("reviewBtn").addEventListener("click", () => {
      renderReview();
    });
  }

  function renderReview() {
    const { currentTest, answers } = state;

    workspaceEl.innerHTML = `
    <div class="workspace-active">
      <div class="workspace-header">
        <div>
          <p class="question-meta">Режим просмотра</p>
          <h3 class="question-title">${currentTest.title}</h3>
        </div>
        <button class="ghost-btn" type="button" id="exitTestBtn">Выход</button>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:100%"></div>
      </div>

      <div class="review-list">
        ${answers
          .map(
            (item, idx) => `
            <article class="question-card">
              <p class="question-meta">Вопрос ${idx + 1}</p>
              <h3 class="question-title">${item.question}</h3>
              <div class="options-list">
                ${currentTest.questions[idx].options
                  .map((opt, optIdx) => {
                    const classes = ["option-btn"];
                    if (optIdx === item.correct) classes.push("is-correct");
                    if (optIdx === item.selected && optIdx !== item.correct) {
                      classes.push("is-incorrect");
                    }
                    return `<button class="${classes.join(" ")}" type="button" disabled>${opt}</button>`;
                  })
                  .join("")}
              </div>
            </article>
          `
          )
          .join("")}
      </div>

      <div class="results-actions">
        <button class="primary-btn" type="button" id="retakeBtn">Повторить тест</button>
        <button class="ghost-btn" type="button" id="backToResultsBtn">Назад к результатам</button>
      </div>
    </div>
  `;

    document.getElementById("exitTestBtn").addEventListener("click", () => {
      resetState();
      renderWorkspace();
    });
    document.getElementById("retakeBtn").addEventListener("click", () => {
      startTest(currentTest.id);
    });
    document.getElementById("backToResultsBtn").addEventListener("click", () => {
      renderResults();
    });
  }
})();

