    // ---- Stores step 1 data so it can be shown again in the result ----
var studentData = {};

// ---- Notification helper ----
function showNotification(message, type) {
    var note = document.getElementById("notification");
    note.textContent = message;
    note.className = "notification " + type;

    setTimeout(function () {
        note.className = "notification";
        note.textContent = "";
    }, 3000);
}

// ---- Step switcher ----
function showStep(stepId) {
    var steps = document.getElementsByClassName("step");
    for (var i = 0; i < steps.length; i++) {
        steps[i].classList.remove("active");
    }
    document.getElementById(stepId).classList.add("active");
}

// ---- Character checks (no regex) ----
function isUpperCase(char) {
    var code = char.charCodeAt(0);
    return code >= 65 && code <= 90;
}

function isDigit(char) {
    var code = char.charCodeAt(0);
    return code >= 48 && code <= 57;
}

function isSpecialChar(char) {
    var specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?`~\\";
    return specialChars.indexOf(char) !== -1;
}

function countUppercase(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (isUpperCase(str[i])) count++;
    }
    return count;
}

function countDigits(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (isDigit(str[i])) count++;
    }
    return count;
}

function countSpecial(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (isSpecialChar(str[i])) count++;
    }
    return count;
}

function setCheckStatus(id, isValid) {
    var el = document.getElementById(id);
    el.className = "check-item " + (isValid ? "valid" : "invalid");
}

// ---- Live password checklist ----
function updateChecklist() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    var lengthOk = password.length >= 8;
    var upperOk = countUppercase(password) >= 1;

    var digitCount = countDigits(password);
    var digitsOk = digitCount >= 2 && digitCount <= 3;

    var specialOk = countSpecial(password) >= 1;
    var matchOk = password !== "" && password === confirmPassword;

    setCheckStatus("check-length", lengthOk);
    setCheckStatus("check-upper", upperOk);
    setCheckStatus("check-digits", digitsOk);
    setCheckStatus("check-special", specialOk);
    setCheckStatus("check-match", matchOk);

    return lengthOk && upperOk && digitsOk && specialOk && matchOk;
}

// ---- STEP 1 -> STEP 2 ----
function goToMarks() {
    var name = document.getElementById("name").value.trim();
    var sem = document.getElementById("sem").value.trim();
    var prn = document.getElementById("prn").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (name === "" || sem === "" || prn === "") {
        showNotification("Please fill in all student details.", "error");
        return;
    }

    if (password === "" || confirmPassword === "") {
        showNotification("Please set and confirm your password.", "error");
        return;
    }

    var isValid = updateChecklist();

    if (!isValid) {
        showNotification("Password does not meet all requirements.", "error");
        return;
    }

    // Save step 1 data for use in the result screen
    studentData.name = name;
    studentData.sem = sem;
    studentData.prn = prn;

    showNotification("Details saved! Now enter your marks.", "success");
    showStep("step2");
}

// ---- Grade helpers ----
function getGrade(marks) {
    if (marks >= 91) {
        return "A+";
    } else if (marks >= 81) {
        return "A";
    } else if (marks >= 66) {
        return "B";
    } else if (marks >= 50) {
        return "C";
    } else {
        return "Fail";
    }
}

function getGradeClass(grade) {
    if (grade === "A+") {
        return "grade-Aplus";
    } else if (grade === "A") {
        return "grade-A";
    } else if (grade === "B") {
        return "grade-B";
    } else if (grade === "C") {
        return "grade-C";
    } else {
        return "grade-Fail";
    }
}

// ---- STEP 2 -> STEP 3 ----
function gradeSystem() {
    var subjects = [
        { name: document.getElementById("subject1").value.trim(), marks: document.getElementById("marks1").value.trim() },
        { name: document.getElementById("subject2").value.trim(), marks: document.getElementById("marks2").value.trim() },
        { name: document.getElementById("subject3").value.trim(), marks: document.getElementById("marks3").value.trim() },
        { name: document.getElementById("subject4").value.trim(), marks: document.getElementById("marks4").value.trim() }
    ];

    var total = 0;
    var subjectResults = [];

    for (var i = 0; i < subjects.length; i++) {
        var subj = subjects[i];

        if (subj.name === "" || subj.marks === "") {
            showNotification("Please fill in all subject names and marks.", "error");
            return;
        }

        var marksNum = Number(subj.marks);

        if (isNaN(marksNum)) {
            showNotification(subj.name + " marks must be a valid number.", "error");
            return;
        }

        if (marksNum < 0 || marksNum > 100) {
            showNotification(subj.name + " marks must be between 0 and 100.", "error");
            return;
        }

        total = total + marksNum;
        subjectResults.push({
            name: subj.name,
            marks: marksNum,
            grade: getGrade(marksNum)
        });
    }

    var percentage = total / subjects.length;
    var overallGrade = getGrade(percentage);
    var overallClass = getGradeClass(overallGrade);

    var html = "";
    html += "<strong>Name:</strong> " + studentData.name + "<br>";
    html += "<strong>Semester:</strong> " + studentData.sem + "<br>";
    html += "<strong>PRN:</strong> " + studentData.prn + "<br><br>";

    for (var j = 0; j < subjectResults.length; j++) {
        var s = subjectResults[j];
        var sClass = getGradeClass(s.grade);
        html += "<div class='subject-line'>" +
                    "<span>" + s.name + "</span>" +
                    "<span>" + s.marks + " / 100 &nbsp; <b class='" + sClass + "'>" + s.grade + "</b></span>" +
                "</div>";
    }

    html += "<br><strong>Total:</strong> " + total + " / " + (subjects.length * 100) + "<br>";
    html += "<strong>Percentage:</strong> " + percentage.toFixed(2) + "%";
    html += "<div class='overall-grade " + overallClass + "'>OVERALL GRADE: " + overallGrade + "</div>";

    document.getElementById("result").innerHTML = html;

    showNotification("Result calculated successfully!", "success");
    showStep("step3");
}

// ---- Reset everything back to step 1 ----
function startOver() {
    document.getElementById("name").value = "";
    document.getElementById("sem").value = "";
    document.getElementById("prn").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";

    document.getElementById("subject1").value = "";
    document.getElementById("marks1").value = "";
    document.getElementById("subject2").value = "";
    document.getElementById("marks2").value = "";
    document.getElementById("subject3").value = "";
    document.getElementById("marks3").value = "";
    document.getElementById("subject4").value = "";
    document.getElementById("marks4").value = "";

    var checks = document.getElementsByClassName("check-item");
    for (var i = 0; i < checks.length; i++) {
        checks[i].className = "check-item";
    }

    studentData = {};
    showStep("step1");
}