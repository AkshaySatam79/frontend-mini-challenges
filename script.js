const totalAmountShow = document.querySelector(".total-amount");
const totalIncomeShow = document.querySelector(".total-income");
const totalExpenseShow = document.querySelector(".total-expense");

const description = document.querySelector(".description");
const amount = document.querySelector(".amount");
const category = document.querySelector(".category-select");
const type = document.querySelector(".type");

const button = document.querySelector(".add-btn");
const transaction = document.querySelector(".transaction-list");
const date = new Date();
const form = document.querySelector(".form");

const formattedDate = date.toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function getCategoryIcon(category) {
  if (category === "Food & Dining") {
    return {
      icon: "fa-mug-hot",
      className: "coffee",
    };
  } else if (category === "Salary") {
    return {
      icon: "fa-suitcase",
      className: "salary",
    };
  } else if (category === "Entertainment") {
    return {
      icon: "fa-film",
      className: "netflix",
    };
  } else if (category === "Shopping") {
    return {
      icon: "fa-bag-shopping",
      className: "grocery",
    };
  } else if (category === "Freelance") {
    return {
      icon: "fa-laptop",
      className: "freelance",
    };
  } else if (category === "Healthcare") {
    return {
      icon: "fa-heart-pulse",
      className: "gym",
    };
  } else if (category === "Transport") {
    return {
      icon: "fa-car",
      className: "uber",
    };
  } else {
    return {
      icon: "fa-wallet",
      className: "default",
    };
  }
}

function formEmpty() {
  if (
    description.value.trim() === "" ||
    amount.value === "" ||
    Number(amount.value) <= 0
  ) {
    alert("Please fill in Description and Amount");
    return false;
  }

  return true;
}

// ADD BUTTON
button.addEventListener("click", (event) => {
  event.preventDefault();
  if (formEmpty() === false) {
    return;
  }

  const transactionItem = document.createElement("div");
  transactionItem.classList.add("transaction");

  // Get icon
  const categoryIcon = getCategoryIcon(category.value);

  // Get amount
  let finalAmount;
  let amountClass;

  if (type.value === "Income") {
    finalAmount = `+$${amount.value}`;
    amountClass = "income";
  } else {
    finalAmount = `-$${amount.value}`;
    amountClass = "expense";
  }

  transactionItem.innerHTML = `
    <div class="transaction-icon ${categoryIcon.className}">
      <i class="fa-solid ${categoryIcon.icon}"></i>
    </div>

    <div class="transaction-details">
      <h3>${description.value}</h3>
      <p>${category.value} · ${formattedDate}</p>
    </div>

    <strong class="amount ${amountClass}">
      ${finalAmount}
    </strong>

    <button class="delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  transaction.appendChild(transactionItem);

  //total
  // setTotalAmount(amount.value, type.value);
  // Delete
  const deleteButton = transactionItem.querySelector(".delete");

  deleteButton.addEventListener("click", () => {
    transactionItem.remove();
  });

  // Empty form
  form.reset();

  calculateTotals();
});

function calculateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;

  const transactions = document.querySelectorAll(".transaction");

  transactions.forEach((item) => {
    const amountElement = item.querySelector(".amount");

    // Remove $, +, -, and commas
    const amount = Number(
      amountElement.textContent.replace(/[$,+-]/g, "").trim(),
    );

    if (amountElement.classList.contains("income")) {
      totalIncome += amount;
    } else if (amountElement.classList.contains("expense")) {
      totalExpense += amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  totalIncomeShow.textContent = totalIncome;
  totalExpenseShow.textContent = totalExpense;
  totalAmountShow.innerHTML = totalBalance;
}
