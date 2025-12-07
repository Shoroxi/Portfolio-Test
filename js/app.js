document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initPortfolioFilters();
});

function initContactForm() {
  const sendBtn = document.getElementById("sendBtn");
  const form = document.querySelector(".contact-form");

  if (!sendBtn || !form) {
    return;
  }

  if (typeof emailjs === "undefined") {
    console.warn("EmailJS is not available on this page.");
    return;
  }

  emailjs.init("LpYfXstzwJbxsoJsg");

  sendBtn.addEventListener("click", async function (e) {
    e.preventDefault(); // ОТМЕНА обновления страницы

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showStatus("Please fill out all fields.", false);
      return;
    }

    sendBtn.disabled = true;
    showStatus("Sending message...", true);

    try {
      await emailjs.send("service_qj1i8j8", "template_thi3hnt", {
        name,
        email,
        message,
      });

      showStatus("Message sent successfully! ✅", true);
      form.reset();
    } catch (error) {
      console.error(error);
      showStatus("Error sending message. Please try again.", false);
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Функция отображения статуса
  function showStatus(text, success) {
    let oldMsg = document.querySelector(".form-status");
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement("div");
    msg.className = "form-status";
    msg.textContent = text;
    msg.style.marginTop = "16px";
    msg.style.textAlign = "center";
    msg.style.fontFamily = "Inter, sans-serif";
    msg.style.color = success ? "#00ff7f" : "#ff4c4c";

    form.appendChild(msg);
  }
}

function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const workCards = document.querySelectorAll("[data-tags]");

  if (!filterButtons.length || !workCards.length) {
    return;
  }

  const applyFilter = (filter) => {
    workCards.forEach((card) => {
      const tags = card.dataset.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      const shouldShow = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  };

  const setActiveButton = (activeButton) => {
    filterButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn === activeButton);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) {
        return;
      }

      setActiveButton(btn);
      applyFilter(btn.dataset.filter);
    });
  });

  const initialButton =
    document.querySelector(".filter-btn.is-active") || filterButtons[0];
  applyFilter(initialButton ? initialButton.dataset.filter : "all");
}
