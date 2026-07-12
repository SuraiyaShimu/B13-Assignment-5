console.log("UI Loaded");
let issues = [];
let currentFilter = "all";
async function loadIssues() {
    show("spinner");
    try{
        const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await response.json();
        issues = data.data;
        renderIssues();
    } catch (error){
        console.log(error);
        alert("Failed to load issues.");
    }
    hide("spinner");
}

function renderIssues(){
    const container = getElement("issue-container");
    container.innerHTML = "";
    let filteredIssues = issues;
    if(currentFilter !== "all"){
        filteredIssues = issues.filter(issue =>
            issue.status.toLowerCase() === currentFilter
        );
    }
    updateText("issue-count", filteredIssues.length);
    filteredIssues.forEach(issue => {
            let borderColor = "border-green-500";
        if (issue.status === "closed"){
            borderColor = "border-purple-500";
        }
        const card = document.createElement("div");
        card.innerHTML = `
        <div onclick="showIssue(${issue.id})" class="bg-white rounded-xl shadow border-t-4 ${borderColor} p-5 cursor-pointer hover:shadow-lg transition">
        
        <div class="flex justify-between"><span class = "badge badge-outline"> ${issue.status}</span><span class="text-sm font-semibold"> ${issue.priority}</span></div>

        <h2 class="text-lg font-bold mt-3"> ${issue.title}</h2>
        <p class="text-gray-500 text-sm mt-2"> ${issue.description.substring(0,80)}...</p>

        <div class="mt-3 flex flex-wrap gap-2"> ${issue.labels.map(label => `<span class="badge badge-primary badge-outline"> ${label}</span>`).join("")}</div>

        <div class="mt-4 flex justify-between text-sm text-gray-500"><span>${issue.author}</span><span>${new Date(issue.createdAt).toLocaleDateString()}</span></div>
        </div>
        
        `;
        container.appendChild(card);
    });
}

function filterIssues(type){
    currentFilter=type;
    getElement("all-btn").classList.remove("tab-active");
    getElement("open-btn").classList.remove("tab-active");
    getElement("closed-btn").classList.remove("tab-active");
    getElement(type + "-btn").classList.add("tab-active");
    renderIssues();
}

async function searchIssues() {
    const text = getElement("search-input").value.trim();
    if(text===""){
        renderIssues();
        return;
    }
    show("spinner");

    try{
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const data = await response.json();
        issues = data.data;
        currentFilter="all";
        getElement("all-btn").classList.add("tab-active");
        getElement("open-btn").classList.remove("tab-active");
        getElement("closed-btn").classList.remove("tab-active");
        renderIssues();
    }catch(error){
        console.log(error);
        alert("Search Failed!");
    }
    hide("spinner");
}

async function showIssue(id) {
    show("spinner");
    try{
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await response.json();
        const issue = data.data;

        updateText("modal-title", issue.title);
        updateText("modal-status", issue.status);
        updateText("modal-author", issue.author);
        updateText("modal-date", new Date (issue.createdAt).toLocaleDateString());
        updateText("modal-description", issue.description);
        updateText("modal-priority", issue.priority);

        if(issue.assignee === ""){
            updateText("modal-assignee", "Not Assigned");
        } else {
            updateText("modal-assignee", issue.assignee);
        }
        const labelContainer = getElement("modal-labels");
        labelContainer.innerHTML="";
        issue.labels.forEach(label => {
            const span = document.createElement("span");
            span.className="badge badge-primary badge-outline";
            span.innerText=label;
            labelContainer.appendChild(span);
        });
        getElement("issue-modal").showModal();
    }catch(error){
        console.log(error);
        alert("Failed to load issue details.");
    }
    hide("spinner");
}