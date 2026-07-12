console.log("Machine Loaded");

function getElement(id){
    return document.getElementById(id);
}

function updateText(id, value){
    getElement(id).innerText = value;
}

function show(id){
    getElement(id).classList.remove("hidden");
}

function hide(id){
    getElement(id).classList.add("hidden");
}

function clearInput(id){
    getElement(id).value = "";
}

