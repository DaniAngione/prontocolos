let protocolos = [];

async function loadProtocolList() {
  const res = await fetch("data/protocolos.json");
  protocolos = await res.json();
  renderProtocolList();
}

loadProtocolList();

let currentProtocol = null;
let currentNode = null;
let history = [];

const protocolList = document.getElementById("protocol-list");
const appDiv = document.getElementById("app");
const contentDiv = document.getElementById("content");
const optionsDiv = document.getElementById("options");
const protocolTitle = document.getElementById("protocol-title");

// --- Carregar lista de protocolos ---
function renderProtocolList() {
  protocolList.innerHTML = "";
  protocolos.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.title;
    li.style.cursor = "pointer";
    li.onclick = () => loadProtocol(p);
    protocolList.appendChild(li);
  });
}

renderProtocolList();

// --- Busca ---
document.getElementById("search").addEventListener("input", function() {
  const term = this.value.toLowerCase();
  Array.from(protocolList.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

// --- Carregar JSON de protocolos ---
async function loadProtocol(protocol) {
  const res = await fetch("data/" + protocol.file);
  currentProtocol = await res.json();
  protocolTitle.textContent = currentProtocol.title;
  history = [];
  goToNode(currentProtocol.start);
  document.querySelector("h1").style.display = "none";
  document.getElementById("search").style.display = "none";
  protocolList.style.display = "none";
  appDiv.style.display = "block";
}

// --- Navegar pelos nodos ---
function goToNode(nodeId) {
  const node = currentProtocol.nodes[nodeId];
  currentNode = node;
  history.push(nodeId);

  contentDiv.innerHTML = "";
  optionsDiv.innerHTML = "";

  if (node.question) {
    contentDiv.innerHTML = `<p><b>${node.question}</b></p>`;
    node.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.onclick = () => goToNode(opt.next);
      optionsDiv.appendChild(btn);
    });
  } else if (node.instruction) {
    contentDiv.innerHTML = `<p>${node.instruction}</p>`;
  }
}

// --- Botões ---
document.getElementById("restart-btn").onclick = () => {
  history = [];
  goToNode(currentProtocol.start);
};

document.getElementById("back-btn").onclick = () => {
  if (history.length > 1) {
    history.pop(); // Remover atual
    const prev = history.pop(); // Remover anterior, re-adicionar
    goToNode(prev);
  }
};

document.getElementById("home-btn").onclick = () => {
  appDiv.style.display = "none";
  document.querySelector("h1").style.display = "block";
  document.getElementById("search").style.display = "block";
  protocolList.style.display = "block";
  renderProtocolList();
};
