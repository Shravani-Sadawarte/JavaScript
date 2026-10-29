$(document).ready(function () {
    const STORAGE_KEY = "spendsmart_transactions";
    const BUDGET_KEY = "spendsmart_budget";

    // Colour + icon for every category (icons are simple 24px line icons).
    const CATEGORY_STYLE = {
        Food:          { color: "#e0702b", icon: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3v11"/>' },
        Transport:     { color: "#3a6fe0", icon: '<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21v-4M16 21v-4"/>' },
        Shopping:      { color: "#c98a0f", icon: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' },
        Bills:         { color: "#7c4ddb", icon: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/>' },
        Education:     { color: "#0f9a8a", icon: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M19 19v2H6"/>' },
        Entertainment: { color: "#d6409a", icon: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>' },
        Health:        { color: "#d8445f", icon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>' },
        Salary:        { color: "#12a37f", icon: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>' },
        Other:         { color: "#6f748c", icon: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>' }
    };

    function categoryStyle(category) {
        return CATEGORY_STYLE[category] || CATEGORY_STYLE.Other;
    }

    function iconSvg(category) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
            'aria-hidden="true">' + categoryStyle(category).icon + "</svg>";
    }

    // Load saved data safely from localStorage.
    function loadTransactions() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    let transactions = loadTransactions();
    let monthlyBudget = Number(localStorage.getItem(BUDGET_KEY)) || 0;

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    $("#today").text(
        today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    );

    // Time-based greeting in the hero.
    const hour = today.getHours();
    $("#greeting").text(
        hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );

    $("#year").text(today.getFullYear());
    $("#date").val(todayString);

    // Format numbers as Indian Rupees.
    function money(amount) {
        return Number(amount).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // "2026-10-22" -> "22 Oct 2026" (parsed manually to avoid timezone shifts).
    function formatDate(dateString) {
        const parts = String(dateString).split("-").map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) {
            return dateString;
        }
        return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "short", year: "numeric" }
        );
    }

    // Small pop-up message (replaces the old inline text message).
    let toastTimer;
    function notify(message) {
        const $toast = $("#transactionMessage");
        $toast.text(message).addClass("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            $toast.removeClass("show");
        }, 2800);
    }

    function saveTransactions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }

    function isCurrentMonth(transaction) {
        return transaction.date &&
            transaction.date.slice(0, 7) === todayString.slice(0, 7);
    }

    function getTotals(items) {
        return items.reduce((totals, transaction) => {
            if (transaction.type === "income") {
                totals.income += transaction.amount;
            } else {
                totals.expenses += transaction.amount;
            }

            return totals;
        }, { income: 0, expenses: 0 });
    }

    // Update summary cards, budget and category tiles.
    function updateDashboard() {
        const totals = getTotals(transactions);
        const balance = totals.income - totals.expenses;

        $("#balance").text(money(balance));
        $("#income").text(money(totals.income));
        $("#expenses").text(money(totals.expenses));

        const monthlyExpenses = transactions
            .filter(transaction =>
                transaction.type === "expense" &&
                isCurrentMonth(transaction)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        $("#budgetSpent").text(money(monthlyExpenses));
        $("#budgetLimit").text(money(monthlyBudget));

        const percentage = monthlyBudget > 0
            ? (monthlyExpenses / monthlyBudget) * 100
            : 0;

        $("#budgetProgress")
            .css("width", Math.min(percentage, 100) + "%")
            .toggleClass("over-budget", percentage > 100);

        if (monthlyBudget <= 0) {
            $("#budgetMessage").text("Set a budget to begin tracking.");
        } else if (percentage > 100) {
            $("#budgetMessage").text(
                "Budget exceeded by " +
                money(monthlyExpenses - monthlyBudget) + "."
            );
        } else {
            $("#budgetMessage").text(
                Math.round(percentage) + "% used · " +
                money(monthlyBudget - monthlyExpenses) + " remaining."
            );
        }

        updateCategoryChart();
    }

    // Render colourful category tiles for current-month expenses.
    function updateCategoryChart() {
        const categories = {};

        transactions
            .filter(transaction =>
                transaction.type === "expense" &&
                isCurrentMonth(transaction)
            )
            .forEach(transaction => {
                categories[transaction.category] =
                    (categories[transaction.category] || 0) +
                    transaction.amount;
            });

        const entries = Object.entries(categories)
            .sort((a, b) => b[1] - a[1]);

        const $chart = $("#categoryChart").empty();

        if (entries.length === 0) {
            $chart.append(
                $("<p>")
                    .addClass("empty-state")
                    .text("No expenses recorded this month yet.")
            );
            return;
        }

        const total = entries.reduce((sum, entry) => sum + entry[1], 0);

        entries.forEach(([category, amount]) => {
            const percentage = total > 0 ? Math.round(amount / total * 100) : 0;

            const $tile = $("<div>")
                .addClass("tile")
                .css("--c", categoryStyle(category).color);

            const $icon = $("<span>")
                .addClass("tile-icon")
                .html(iconSvg(category));

            const $text = $("<div>").append(
                $("<span>").addClass("tile-name").text(category),
                $("<strong>").text(money(amount)),
                $("<span>").addClass("tile-share").text(percentage + "% of spending")
            );

            $tile.append($icon, $text);
            $chart.append($tile);
        });
    }

    // Apply search and filters, then render the transaction list.
    function renderTransactions() {
        const search = $("#search").val().trim().toLowerCase();
        const typeFilter = $("#filterType").val();
        const categoryFilter = $("#filterCategory").val();

        const filtered = transactions
            .filter(transaction => {
                const matchesSearch =
                    transaction.title.toLowerCase().includes(search) ||
                    transaction.category.toLowerCase().includes(search);

                const matchesType =
                    typeFilter === "all" ||
                    transaction.type === typeFilter;

                const matchesCategory =
                    categoryFilter === "all" ||
                    transaction.category === categoryFilter;

                return matchesSearch && matchesType && matchesCategory;
            })
            .sort((a, b) =>
                b.date.localeCompare(a.date) || b.id - a.id
            );

        const $list = $("#transactionList").empty();

        if (filtered.length === 0) {
            $list.append(
                $("<li>")
                    .addClass("tx-empty")
                    .text(
                        transactions.length === 0
                            ? "No transactions yet. Add one, or load the demo data."
                            : "No matching transactions found."
                    )
            );
            return;
        }

        filtered.forEach(transaction => {
            const $item = $("<li>")
                .addClass("tx-item")
                .css("--c", categoryStyle(transaction.category).color);

            const $icon = $("<span>")
                .addClass("tx-icon")
                .html(iconSvg(transaction.category));

            const $info = $("<div>").addClass("tx-info").append(
                $("<strong>").text(transaction.title),
                $("<span>").text(
                    transaction.category + " · " + formatDate(transaction.date)
                )
            );

            const prefix = transaction.type === "income" ? "+" : "−";

            const $amount = $("<span>")
                .addClass("tx-amount " + transaction.type)
                .text(prefix + money(transaction.amount));

            const $deleteButton = $("<button>")
                .addClass("delete-btn")
                .attr("type", "button")
                .attr("aria-label", "Delete " + transaction.title)
                .html(
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                    'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
                    '<path d="M6 6l12 12M18 6L6 18"/></svg>'
                )
                .data("id", transaction.id);

            $item.append($icon, $info, $amount, $deleteButton);
            $list.append($item);
        });
    }

    function refreshUI() {
        updateDashboard();
        renderTransactions();
    }

    // Expense / Income segmented toggle.
    function setType(type) {
        $("#type").val(type);
        $(".seg-btn").each(function () {
            const active = $(this).data("type") === type;
            $(this)
                .toggleClass("active", active)
                .attr("aria-pressed", active ? "true" : "false");
        });
    }

    $(".seg-btn").on("click", function () {
        setType($(this).data("type"));
    });

    // Add a transaction using a form submit event.
    $("#transactionForm").on("submit", function (event) {
        event.preventDefault();

        const title = $("#title").val().trim();
        const amount = Number($("#amount").val());
        const date = $("#date").val();

        if (!title || !Number.isFinite(amount) || amount <= 0 || !date) {
            notify("Please enter a valid description, amount and date.");
            return;
        }

        const transaction = {
            id: Date.now(),
            title: title,
            amount: Math.round(amount * 100) / 100,
            type: $("#type").val(),
            category: $("#category").val(),
            date: date
        };

        transactions.push(transaction);
        saveTransactions();

        this.reset();
        $("#date").val(todayString);
        $("#category").val("Food");
        setType("expense");

        notify("Transaction added successfully!");
        refreshUI();
    });

    // Delete using event delegation.
    $("#transactionList").on("click", ".delete-btn", function () {
        const id = Number($(this).data("id"));

        transactions = transactions.filter(
            transaction => transaction.id !== id
        );

        saveTransactions();
        notify("Transaction deleted.");
        refreshUI();
    });

    // Live search and filtering.
    $("#search, #filterType, #filterCategory").on(
        "input change",
        renderTransactions
    );

    // Save the monthly budget.
    $("#budgetForm").on("submit", function (event) {
        event.preventDefault();

        const amount = Number($("#budgetAmount").val());

        if (!Number.isFinite(amount) || amount <= 0) {
            return;
        }

        monthlyBudget = Math.round(amount * 100) / 100;
        localStorage.setItem(BUDGET_KEY, String(monthlyBudget));

        $("#budgetForm")[0].reset();
        notify("Monthly budget saved!");
        updateDashboard();
    });

    // Add example transactions for the first demonstration.
    $("#demoBtn").on("click", function () {
        const demo = [
            {
                title: "Monthly Allowance",
                amount: 12000,
                type: "income",
                category: "Salary",
                date: todayString
            },
            {
                title: "Lunch",
                amount: 180,
                type: "expense",
                category: "Food",
                date: todayString
            },
            {
                title: "Bus Pass",
                amount: 600,
                type: "expense",
                category: "Transport",
                date: todayString
            },
            {
                title: "Study Materials",
                amount: 450,
                type: "expense",
                category: "Education",
                date: todayString
            },
            {
                title: "Shopping",
                amount: 900,
                type: "expense",
                category: "Shopping",
                date: todayString
            }
        ];

        // Avoid duplicating the demo transactions on repeated clicks.
        const demoTitles = demo.map(item => item.title);
        transactions = transactions.filter(
            item => !demoTitles.includes(item.title)
        );

        demo.forEach((item, index) => {
            transactions.push({
                ...item,
                id: Date.now() + index
            });
        });

        saveTransactions();

        if (monthlyBudget <= 0) {
            monthlyBudget = 15000;
            localStorage.setItem(BUDGET_KEY, String(monthlyBudget));
        }

        $("#budgetAmount").val(monthlyBudget);
        notify("Demo transactions loaded!");
        refreshUI();
    });

    // AJAX: retrieve live reference exchange rates.
    function fetchExchangeRate() {
        $("#refreshRate").prop("disabled", true);
        $("#exchangeMessage").text("Fetching exchange rates...");

        $.ajax({
            url: "https://open.er-api.com/v6/latest/INR",
            method: "GET",
            dataType: "json",
            timeout: 10000,

            success: function (data) {
                const rate = data.rates && data.rates.USD;

                if (data.result === "success" && Number.isFinite(rate)) {
                    $("#usdRate").text(
                        rate.toFixed(5) + " USD"
                    );

                    const updated = data.time_last_update_utc
                        ? " Updated: " + data.time_last_update_utc + "."
                        : "";

                    $("#exchangeMessage").text(
                        "Latest available reference rate: 1 INR = " +
                        rate.toFixed(5) + " USD." + updated
                    );
                } else {
                    $("#usdRate").text("Unavailable");
                    $("#exchangeMessage").text(
                        "The exchange-rate service returned invalid data."
                    );
                }
            },

            error: function () {
                $("#usdRate").text("Unavailable");
                $("#exchangeMessage").text(
                    "Could not fetch rates. Check your internet connection and try again."
                );
            },

            complete: function () {
                $("#refreshRate").prop("disabled", false);
            }
        });
    }

    $("#refreshRate").on("click", fetchExchangeRate);

    // Highlight the selected nav item (click + while scrolling).
    function setActiveNav(id) {
        $(".nav-link").removeClass("active");
        $('.nav-link[href="#' + id + '"]').addClass("active");
    }

    $(".nav-link").on("click", function () {
        setActiveNav($(this).attr("href").slice(1));
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveNav(entry.target.id);
                }
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        ["overview", "budget", "transactions"].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
            }
        });
    }

    // Initial render and initial AJAX request.
    if (monthlyBudget > 0) {
        $("#budgetAmount").val(monthlyBudget);
    }

    refreshUI();
    fetchExchangeRate();
});