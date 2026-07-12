function login() {
    const username = getElement("username").value.trim();
    const password = getElement("password").value.trim();

    if( username === "" || password === ""){
        alert("Please enter username and password.");
        return;
    }

    if(username === "admin" && password === "admin123"){
        hide("login-page");
        show("main-page");

        loadIssues();
    }else{
        alert("Invalid Username or Password!");
    }
}