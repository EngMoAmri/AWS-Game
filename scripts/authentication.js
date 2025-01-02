// require('dotenv').config();
// import 'dotenv/config';
export function getUser() {
    return sessionStorage.getItem("USER")!=null?JSON.parse(sessionStorage.getItem("USER")):null;
}
// signup function
export function signup() {
    var body = {
        "action": "signup",
        "name": `${document.getElementById("new-username").value}`,
        "password": `${document.getElementById("new-password").value}`,
        "passwordConfirm": `${document.getElementById("confirm-password").value}`
    }
    if(body.password!=body.passwordConfirm){
        alert("Passwords do not match");
        return;
    }
    // call signup api
    fetch(import.meta.env.VITE_AUTH_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.message == "Signup successful") {
            sessionStorage.setItem("USER", JSON.stringify({"username": data.username}));
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}
// login function
export function login() {
    // call login api
    fetch(import.meta.env.VITE_AUTH_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action":"login",
            "username": `${document.getElementById("username").value}`,
            "password": `${document.getElementById("password").value}`
        })
    }).then(res => res.json()).then(data => {
        if (data.message == "Login successful") {
            sessionStorage.setItem("USER", JSON.stringify({"username": data.username}));
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}

export function logout() {
    sessionStorage.removeItem("USER");
    window.location.href = "login.html";
}
