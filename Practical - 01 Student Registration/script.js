function greet() {

    let name = document.getElementById("name").value;
    let prn = document.getElementById("prn").value;
    let department = document.getElementById("department").value;
    let email = document.getElementById("email").value;

    alert("🎉 Welcome to SIT Nagpur, " + name + "!\nRegistration Successful.");

    console.table([
        {
            Name: name,
            PRN: prn,
            Department: department,
            Email: email
        }
    ]);

    console.time("Registration Time");

    console.timeEnd("Registration Time");

}
