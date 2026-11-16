// ---------- 1. Mobile hamburger menu ----------
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Link click hone par menu band ho jaye
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", false);
  });
});

// ---------- 2. FAQ accordion ----------
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // Pehle sab band karo (ek time par ek hi open)
    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-answer").style.maxHeight = null;
      other.querySelector(".faq-question").setAttribute("aria-expanded", false);
    });

    // Agar band tha to ab kholo
    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      question.setAttribute("aria-expanded", true);
    }
  });
});

// ---------- 3. Back to top button ----------
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 400);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- 4. Form validation ----------
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
};

// Har field ka validation rule: sahi ho to "" return, galat ho to error message
const validators = {
  name(value) {
    if (value.trim() === "") return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (value.trim() === "") return "Email is required";
    if (!emailRegex.test(value.trim())) return "Enter a valid email address";
    return "";
  },
  phone(value) {
    if (value.trim() === "") return "Phone number is required";
    if (!/^\d{10}$/.test(value.trim())) return "Phone must be exactly 10 digits";
    return "";
  },
  message(value) {
    if (value.trim() === "") return "Message is required";
    if (value.trim().length < 10) return "Message must be at least 10 characters";
    return "";
  },
};

function showFieldState(fieldName) {
  const input = fields[fieldName];
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".error-msg");
  const error = validators[fieldName](input.value);

  group.classList.remove("error", "success");

  if (error) {
    group.classList.add("error");
    errorEl.textContent = error;
    return false;
  }

  group.classList.add("success");
  errorEl.textContent = "";
  return true;
}

// Real-time validation: typing ke time check
Object.keys(fields).forEach((name) => {
  fields[name].addEventListener("input", () => showFieldState(name));
  fields[name].addEventListener("blur", () => showFieldState(name));
});

// Phone me sirf digits allow karo
fields.phone.addEventListener("input", () => {
  fields.phone.value = fields.phone.value.replace(/\D/g, "");
});

// ---------- 5. Form submit with fetch() ----------
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  // Saare fields validate karo
  const results = Object.keys(fields).map((name) => showFieldState(name));
  const isFormValid = results.every(Boolean);

  if (!isFormValid) {
    formStatus.textContent = "Please fix the errors above.";
    formStatus.classList.add("error");
    return;
  }

  const data = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    message: fields.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    // Demo API. Company me yahan unki real API URL aayegi.
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    formStatus.textContent = "Thank you! Your message has been sent.";
    formStatus.classList.add("success");
    form.reset();
    document
      .querySelectorAll(".form-group")
      .forEach((group) => group.classList.remove("success", "error"));
  } catch (error) {
    console.error(error);
    formStatus.textContent = "Something went wrong. Please try again.";
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});
