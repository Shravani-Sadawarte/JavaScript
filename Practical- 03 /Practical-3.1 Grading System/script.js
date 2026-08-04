function showNotification(message, type) {
    var note = document.getElementById("notification");
    note.textContent = message;
    note.className = "notification " + type;

    setTimeout(function () {
        note.className = "notification";
        note.textContent = "";
    }, 3000);
}

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

function gradeSystem() {
    var name = document.getElementById("name").value.trim();
    var sem = document.getElementById("sem").value.trim();
    var prn = document.getElementById("prn").value.trim();

    var subjects = [
        { name: document.getElementById("subject1").value.trim(), marks: document.getElementById("marks1").value.trim() },
        { name: document.getElementById("subject2").value.trim(), marks: document.getElementById("marks2").value.trim() },
        { name: document.getElementById("subject3").value.trim(), marks: document.getElementById("marks3").value.trim() },
        { name: document.getElementById("subject4").value.trim(), marks: document.getElementById("marks4").value.trim() }
    ];

    if (name === "" || sem === "" || prn === "") {
        showNotification("Please fill in all student details.", "error");
        return;
    }

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
    html += "<strong>Name:</strong> " + name + "<br>";
    html += "<strong>Semester:</strong> " + sem + "<br>";
    html += "<strong>PRN:</strong> " + prn + "<br><br>";

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

    var resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerHTML = html;

    showNotification("Result calculated successfully!", "success");

    document.getElementById("gradeForm").reset();
}