const STORE_KEY = "gestor-facil-v1";
const MODULES = {
  dashboard: { label: "Visão geral", icon: "⌂" },
  financeiro: { label: "Financeiro", icon: "↗" },
  clientes: { label: "Clientes", icon: "♧" },
  estoque: { label: "Estoque", icon: "▦" },
  servicos: { label: "Serviços e vendas", icon: "◈" },
  agendamentos: { label: "Agendamentos", icon: "▣" },
  caderneta: { label: "Caderneta digital", icon: "≡" },
  relatorios: { label: "Relatórios", icon: "▤" },
  configuracoes: { label: "Configurações", icon: "⚙" }
};

const FIELDS = {
  financeiro: [
    ["descricao", "Descrição", "text", true], ["tipo", "Tipo", "select", true, ["Receita", "Despesa"]],
    ["valor", "Valor (R$)", "number", true], ["categoria", "Categoria", "text", true],
    ["data", "Data", "date", true], ["status", "Status", "select", true, ["Pago", "Pendente"]]
  ],
  clientes: [
    ["nome", "Nome completo", "text", true], ["telefone", "Telefone", "tel", true],
    ["email", "E-mail", "email"], ["endereco", "Endereço", "text"], ["observacoes", "Observações", "textarea", false, null, true]
  ],
  estoque: [
    ["nome", "Produto ou material", "text", true], ["categoria", "Categoria", "text", true],
    ["quantidade", "Quantidade", "number", true], ["unidade", "Unidade", "text", true],
    ["custo", "Custo de compra (R$)", "number", true], ["minimo", "Estoque mínimo", "number", true],
    ["validade", "Data de validade", "date"]
  ],
  servicos: [
    ["cliente", "Cliente", "client", false], ["nome", "Serviço ou produto", "text", true],
    ["valor", "Valor (R$)", "number", true], ["data", "Data", "date", true],
    ["pagamento", "Forma de pagamento", "select", true, ["Pix", "Dinheiro", "Cartão de crédito", "Cartão de débito", "Transferência", "Outro"]],
    ["status", "Status", "select", true, ["Pago", "Pendente"]]
  ],
  agendamentos: [
    ["cliente", "Cliente", "client", false], ["servico", "Serviço", "text", true],
    ["data", "Data", "date", true], ["horario", "Horário", "time", true],
    ["status", "Status", "select", true, ["Agendado", "Confirmado", "Concluído", "Cancelado"]],
    ["observacoes", "Observações", "textarea", false, null, true]
  ],
  caderneta: [
    ["cliente", "Cliente", "client", false], ["descricao", "Descrição", "text", true],
    ["valor", "Valor total (R$)", "number", true], ["pago", "Valor já pago (R$)", "number", true],
    ["vencimento", "Vencimento", "date", true]
  ]
};

let state = readStore();
let activeView = "dashboard";
let editingId = null;
let toastTimer;

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { users: {}, current: null }; }
  catch { return { users: {}, current: null }; }
}

function saveStore() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function currentUser() { return state.users[state.current] || null; }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function monthStart() { return `${todayISO().slice(0, 7)}-01`; }
function records(key) { return currentUser()?.[key] || []; }
function money(value) { return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function shortDate(value) { return value ? new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR") : "—"; }
function safe(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function persistUser() {
  state.users[state.current] = currentUser();
  saveStore();
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.append(element);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.remove(), 2600);
}

function render() {
  if (!currentUser()) return renderAuth("login");
  const app = document.querySelector("#app");
  const view = MODULES[activeView] ? activeView : "dashboard";
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><div class="brand-mark">g.</div><div><div class="brand-name">gestor fácil</div><div class="brand-note">Sua profissão, seu negócio.</div></div></div>
        <div class="side-label">Seu espaço</div>
        <nav class="nav-list" aria-label="Navegação principal">
          ${Object.entries(MODULES).map(([key, item]) => `<button class="nav-item ${key === view ? "active" : ""}" data-view="${key}"><span class="nav-icon">${item.icon}</span>${item.label}</button>`).join("")}
        </nav>
        <div class="sidebar-bottom">
          <div class="side-tip"><strong>Um passo de cada vez.</strong><p>Registre as movimentações do dia para manter os números sempre atualizados.</p></div>
          <div class="user-card"><div class="avatar">${safe(currentUser().nome[0]?.toUpperCase() || "G")}</div><div class="user-meta"><strong>${safe(currentUser().nome)}</strong><span>${safe(currentUser().profissao || "Meu negócio")}</span></div><button class="icon-button" data-action="logout" aria-label="Sair da conta" title="Sair">↪</button></div>
        </div>
      </aside>
      <section class="main">
        <header class="topbar"><div style="display:flex;align-items:center;gap:12px"><button class="icon-button mobile-menu" data-action="menu" aria-label="Abrir menu">☰</button><div class="breadcrumbs">Meu negócio <span aria-hidden="true"> / </span> <strong>${MODULES[view].label}</strong></div></div><div class="top-actions"><span class="today">${new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}</span><button class="icon-button" data-view="configuracoes" title="Configurações" aria-label="Configurações">⚙</button></div></header>
        <main class="page" id="page-content">${renderView(view)}</main>
      </section>
    </div>`;
  bindAppEvents();
}

function pageHeading(kicker, title, description, actionLabel = "", action = "") {
  return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="subheading">${description}</p></div>${actionLabel ? `<button class="primary-button" data-action="${action}"><span>＋</span>${actionLabel}</button>` : ""}</div>`;
}

function renderView(view) {
  if (view === "dashboard") return renderDashboard();
  if (view === "financeiro") return renderTableModule("financeiro");
  if (view === "clientes") return renderTableModule("clientes");
  if (view === "estoque") return renderTableModule("estoque");
  if (view === "servicos") return renderTableModule("servicos");
  if (view === "agendamentos") return renderTableModule("agendamentos");
  if (view === "caderneta") return renderTableModule("caderneta");
  if (view === "relatorios") return renderReports();
  if (view === "configuracoes") return renderSettings();
  return renderDashboard();
}

function monthTransactions() {
  return records("financeiro").filter(item => item.data?.startsWith(todayISO().slice(0, 7)));
}

function financeTotals(items = records("financeiro")) {
  const paid = items.filter(item => item.status === "Pago");
  const income = paid.filter(item => item.tipo === "Receita").reduce((sum, item) => sum + Number(item.valor), 0);
  const expense = paid.filter(item => item.tipo === "Despesa").reduce((sum, item) => sum + Number(item.valor), 0);
  const pending = items.filter(item => item.status === "Pendente").reduce((sum, item) => sum + Number(item.valor), 0);
  return { income, expense, result: income - expense, pending };
}

function renderDashboard() {
  const monthItems = monthTransactions();
  const totals = financeTotals(monthItems);
  const lowStock = records("estoque").filter(item => Number(item.quantidade) <= Number(item.minimo)).length;
  const appointments = records("agendamentos").filter(item => item.data === todayISO() && item.status !== "Cancelado").sort((a, b) => a.horario.localeCompare(b.horario));
  const transactions = [...records("financeiro")].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 5);
  const metrics = [
    ["Receitas do mês", money(totals.income), "Entradas confirmadas", "↗"],
    ["Despesas do mês", money(totals.expense), "Saídas confirmadas", "↘"],
    ["Resultado", money(totals.result), "Receitas menos despesas", "＝"],
    ["A receber", money(totals.pending), `${records("caderneta").length} na caderneta`, "◷"]
  ];
  return `${pageHeading("Seu negócio em foco", `Bom dia, ${safe(currentUser().nome.split(" ")[0])}.`, "Aqui está o resumo do seu negócio neste mês.", "Novo registro", "quick-add")}
    <div class="metric-grid">${metrics.map(([label, amount, foot, icon]) => `<article class="metric"><div class="metric-top"><span>${label}</span><span class="metric-symbol">${icon}</span></div><div class="metric-value">${amount}</div><div class="metric-foot">${foot}</div></article>`).join("")}</div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">Movimentação financeira</h2><p class="panel-caption">Receitas e despesas dos últimos 6 meses</p></div><div class="legend"><span><i></i>Receitas</span><span><i></i>Despesas</span></div></div>${renderChart()}<div class="chart-labels">${monthLabels()}</div></section>
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">Agenda de hoje</h2><p class="panel-caption">${shortDate(todayISO())}</p></div><button class="text-button" data-view="agendamentos">Ver agenda →</button></div><div class="agenda-list">${appointments.length ? appointments.slice(0, 4).map(item => `<div class="agenda-row"><span class="agenda-time">${safe(item.horario)}</span><div class="agenda-content"><strong>${safe(item.cliente || "Sem cliente")}</strong><span>${safe(item.servico)}</span></div><span class="status ${statusClass(item.status)}">${safe(item.status)}</span></div>`).join("") : `<div class="empty-state"><strong>Agenda livre por aqui</strong>Nenhum compromisso registrado para hoje.</div>`}</div></section>
    </div>
    <div class="section-row"><h2>Últimas movimentações</h2><button class="text-button" data-view="financeiro">Ver financeiro →</button></div>
    <section class="panel">${transactions.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Status</th><th style="text-align:right">Valor</th></tr></thead><tbody>${transactions.map(item => `<tr><td><strong>${safe(item.descricao)}</strong></td><td class="muted">${safe(item.categoria)}</td><td>${shortDate(item.data)}</td><td><span class="status ${statusClass(item.status)}">${safe(item.status)}</span></td><td class="${item.tipo === "Receita" ? "positive" : "negative"}" style="text-align:right">${item.tipo === "Despesa" ? "−" : "+"} ${money(item.valor)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><strong>Seu resumo começa com um registro</strong>Adicione uma receita ou despesa para acompanhar o resultado do mês.<button class="text-button" data-action="quick-add"> Registrar agora →</button></div>`}</section>
    ${lowStock ? `<p class="subheading" style="margin-top:14px;color:#a45b2d">Atenção: ${lowStock} ${lowStock === 1 ? "item está" : "itens estão"} abaixo do estoque mínimo. <button class="text-button" data-view="estoque">Conferir estoque →</button></p>` : ""}`;
}

function lastSixMonths() {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    return date.toISOString().slice(0, 7);
  });
}

function monthLabels() {
  return lastSixMonths().map(key => `<span>${new Date(`${key}-01T12:00:00`).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>`).join("");
}

function renderChart() {
  const months = lastSixMonths();
  const values = months.map(month => {
    const totals = financeTotals(records("financeiro").filter(item => item.data?.startsWith(month)));
    return { income: totals.income, expense: totals.expense };
  });
  const max = Math.max(...values.flatMap(item => [item.income, item.expense]), 1);
  return `<div class="chart-area" role="img" aria-label="Gráfico de receitas e despesas dos últimos seis meses">${values.map(item => `<div class="chart-group"><div class="chart-column" title="Receitas: ${money(item.income)}" style="height:${Math.max(3, item.income / max * 100)}%"></div><div class="chart-column expense" title="Despesas: ${money(item.expense)}" style="height:${Math.max(3, item.expense / max * 100)}%"></div></div>`).join("")}</div>`;
}

function statusClass(status = "") { return status.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(" ", "-"); }

const TABLES = {
  financeiro: { kicker: "Entradas e saídas", title: "Financeiro", desc: "Acompanhe o que entrou, saiu e ainda está por receber.", action: "Nova movimentação", columns: [["descricao", "Descrição"], ["categoria", "Categoria"], ["data", "Data"], ["tipo", "Tipo"], ["status", "Status"], ["valor", "Valor"]] },
  clientes: { kicker: "Relacionamentos", title: "Clientes", desc: "Mantenha os contatos e o histórico do seu negócio organizados.", action: "Novo cliente", columns: [["nome", "Nome"], ["telefone", "Telefone"], ["email", "E-mail"], ["histórico", "Atendimentos"]] },
  estoque: { kicker: "Produtos e materiais", title: "Estoque", desc: "Saiba o que você tem disponível e o que precisa repor.", action: "Novo produto", columns: [["nome", "Produto"], ["categoria", "Categoria"], ["quantidade", "Quantidade"], ["custo", "Custo unitário"], ["situação", "Situação"]] },
  servicos: { kicker: "Atendimentos e vendas", title: "Serviços e vendas", desc: "Registre trabalhos realizados e produtos vendidos.", action: "Novo serviço ou venda", columns: [["nome", "Serviço ou produto"], ["cliente", "Cliente"], ["data", "Data"], ["pagamento", "Pagamento"], ["status", "Status"], ["valor", "Valor"]] },
  agendamentos: { kicker: "Sua rotina", title: "Agendamentos", desc: "Organize os próximos compromissos e horários.", action: "Novo agendamento", columns: [["data", "Data"], ["horario", "Horário"], ["cliente", "Cliente"], ["servico", "Serviço"], ["status", "Status"]] },
  caderneta: { kicker: "Contas a receber", title: "Caderneta digital", desc: "Acompanhe valores pendentes e pagamentos parciais.", action: "Nova pendência", columns: [["cliente", "Cliente"], ["descricao", "Descrição"], ["valor", "Valor original"], ["pago", "Já pago"], ["restante", "Restante"], ["vencimento", "Vencimento"], ["status", "Status"]] }
};

function renderTableModule(key) {
  const config = TABLES[key];
  const list = [...records(key)].sort((a, b) => String(b.data || b.vencimento || "").localeCompare(String(a.data || a.vencimento || "")));
  const filters = key === "financeiro" ? `<select class="select-compact" id="status-filter"><option value="">Todos os status</option><option>Pago</option><option>Pendente</option></select>` : "";
  const searchPlaceholder = key === "clientes" ? "Buscar cliente..." : key === "estoque" ? "Buscar produto..." : `Buscar ${config.title.toLowerCase()}...`;
  return `${pageHeading(config.kicker, config.title, config.desc, config.action, `add:${key}`)}
    <div class="toolbar"><input class="search-input" id="table-search" type="search" placeholder="⌕  ${searchPlaceholder}" aria-label="Buscar registros">${filters}<span class="toolbar-spacer"></span><span class="muted" style="font-size:10px">${list.length} registros</span></div>
    <section class="panel">${list.length ? `<div class="table-wrap"><table class="data-table" id="module-table"><thead><tr>${config.columns.map(([, title]) => `<th>${title}</th>`).join("")}<th></th></tr></thead><tbody>${list.map(item => renderTableRow(key, item, config.columns)).join("")}</tbody></table></div>` : `<div class="empty-state"><strong>Nenhum registro por enquanto</strong>Adicione informações para acompanhar esta área do seu negócio.<button class="text-button" data-action="add:${key}"> Criar primeiro registro →</button></div>`}</section>`;
}

function renderTableRow(key, item, columns) {
  const cells = columns.map(([field]) => `<td>${renderCell(key, field, item)}</td>`).join("");
  return `<tr data-search="${safe(Object.values(item).join(" ").toLowerCase())}">${cells}<td><div class="row-actions"><button class="tiny-button" data-action="edit:${key}:${item.id}">Editar</button><button class="tiny-button" data-action="delete:${key}:${item.id}" aria-label="Excluir registro">Excluir</button>${key === "caderneta" && Number(item.valor) > Number(item.pago) ? `<button class="tiny-button" data-action="pay:${item.id}">Receber</button>` : ""}</div></td></tr>`;
}

function renderCell(key, field, item) {
  if (field === "valor" || field === "custo" || field === "pago") return money(item[field]);
  if (field === "restante") return `<strong>${money(Math.max(0, Number(item.valor) - Number(item.pago)))}</strong>`;
  if (field === "quantidade") return `${safe(item.quantidade)} ${safe(item.unidade)}`;
  if (field === "situação") return Number(item.quantidade) <= Number(item.minimo) ? `<span class="status pendente">Estoque baixo</span>` : `<span class="status">Normal</span>`;
  if (field === "histórico") return `${records("servicos").filter(service => service.clienteId === item.id).length} atendimentos`;
  if (field === "data" || field === "vencimento") return shortDate(item[field]);
  if (field === "status") return `<span class="status ${statusClass(item[field])}">${safe(item[field])}</span>`;
  if (field === "tipo") return `<span class="${item.tipo === "Receita" ? "positive" : "negative"}">${safe(item.tipo)}</span>`;
  if (field === "descricao" || field === "nome" || field === "cliente") return `<strong>${safe(item[field] || "—")}</strong>`;
  return safe(item[field] || "—");
}

function renderReports() {
  const totals = financeTotals();
  const month = financeTotals(monthTransactions());
  const debtors = records("caderneta").filter(item => Number(item.valor) > Number(item.pago));
  const products = [...records("servicos")].reduce((map, item) => map.set(item.nome, (map.get(item.nome) || 0) + 1), new Map());
  const topServices = [...products.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return `${pageHeading("Números do negócio", "Relatórios", "Uma visão consolidada para apoiar suas decisões.")}
    <div class="report-grid"><section class="report-box"><h2>Resumo deste mês</h2>${reportLine("Receitas recebidas", money(month.income), "positive")}${reportLine("Despesas pagas", money(month.expense), "negative")}${reportLine("Resultado do período", money(month.result), month.result >= 0 ? "positive" : "negative")}${reportLine("A receber", money(month.pending))}</section>
    <section class="report-box"><h2>Acumulado registrado</h2>${reportLine("Total de receitas", money(totals.income), "positive")}${reportLine("Total de despesas", money(totals.expense), "negative")}${reportLine("Resultado acumulado", money(totals.result), totals.result >= 0 ? "positive" : "negative")}${reportLine("Clientes cadastrados", records("clientes").length)}</section>
    <section class="report-box"><h2>Serviços mais realizados</h2>${topServices.length ? topServices.map(([name, count]) => reportLine(safe(name), `${count} ${count === 1 ? "registro" : "registros"}`)).join("") : `<p class="muted" style="font-size:11px">Os serviços aparecerão aqui após os primeiros registros.</p>`}</section>
    <section class="report-box"><h2>Clientes com valores pendentes</h2>${debtors.length ? debtors.map(item => reportLine(safe(item.cliente || "Sem cliente"), money(Number(item.valor) - Number(item.pago)), "negative")).join("") : `<p class="muted" style="font-size:11px">Nenhum valor pendente na caderneta.</p>`}</section></div>`;
}

function reportLine(label, value, style = "") { return `<div class="report-line"><span>${label}</span><strong class="${style}">${value}</strong></div>`; }

function renderSettings() {
  const user = currentUser();
  return `${pageHeading("Preferências da conta", "Configurações", "Mantenha os dados do seu perfil atualizados.")}
    <div class="settings-layout"><section class="panel"><form class="settings-form" id="settings-form"><div class="form-grid">
      <div class="field full"><label for="settings-name">Nome completo</label><input id="settings-name" name="nome" value="${safe(user.nome)}" required></div>
      <div class="field"><label for="settings-email">E-mail</label><input id="settings-email" name="email" type="email" value="${safe(user.email)}" required></div>
      <div class="field"><label for="settings-profession">Profissão ou área</label><input id="settings-profession" name="profissao" value="${safe(user.profissao || "")}"></div>
      <div class="field"><label for="settings-password">Nova senha</label><input id="settings-password" name="senha" type="password" minlength="6" autocomplete="new-password" placeholder="Deixe em branco para manter"></div>
      <div class="field"><label for="settings-confirm-password">Confirmar nova senha</label><input id="settings-confirm-password" name="confirmacao" type="password" minlength="6" autocomplete="new-password" placeholder="Repita a nova senha"></div>
    </div><div class="dialog-actions"><button class="primary-button" type="submit">Salvar alterações</button></div></form></section>
    <aside class="note-box"><strong>Sobre seus dados</strong><p>Esta versão salva as informações neste navegador. Para acessar seus dados em outro dispositivo e proteger contas de verdade, é necessário conectar um servidor com banco de dados e autenticação segura.</p><button class="danger-button" data-action="clear-data" style="margin-top:13px">Apagar meus dados</button></aside></div>`;
}

function renderAuth(mode, error = "") {
  const signup = mode === "signup";
  document.querySelector("#app").innerHTML = `<div class="auth-screen"><section class="auth-story"><div class="brand"><div class="brand-mark">g.</div><div><div class="brand-name">gestor fácil</div><div class="brand-note">Sua profissão, seu negócio.</div></div></div><div class="story-copy"><span class="story-kicker">Gestão simples, vida mais leve</span><h1>Seu trabalho merece uma rotina organizada.</h1><p>Reúna clientes, movimentações e compromissos em um só lugar. Do seu jeito, no seu ritmo.</p><div class="story-stats"><div><strong>Mais clareza</strong><span>no dia a dia do negócio</span></div><div><strong>Menos correria</strong><span>para encontrar informação</span></div></div></div><div class="auth-foot">GESTOR FÁCIL · ${new Date().getFullYear()}</div></section><section class="auth-panel"><div class="auth-box"><p class="eyebrow">${signup ? "Comece por aqui" : "Que bom ter você de volta"}</p><h2>${signup ? "Crie seu espaço" : "Acesse sua conta"}</h2><p>${signup ? "Seus dados ficam organizados neste navegador." : "Entre para cuidar do seu negócio."}</p>${error ? `<div class="auth-error">${safe(error)}</div>` : ""}<form id="auth-form" data-mode="${mode}">${signup ? `<div class="field"><label for="auth-name">Nome completo</label><input id="auth-name" name="nome" autocomplete="name" required></div>` : ""}<div class="field"><label for="auth-email">E-mail</label><input id="auth-email" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="auth-password">Senha</label><input id="auth-password" name="senha" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required></div>${signup ? `<div class="field"><label for="auth-profession">Profissão ou área de atuação</label><input id="auth-profession" name="profissao" placeholder="Ex.: manicure, confeiteiro..." required></div>` : ""}<button class="primary-button" type="submit">${signup ? "Criar minha conta" : "Entrar"} <span>→</span></button></form><p class="auth-switch">${signup ? "Já tem uma conta?" : "Ainda não tem uma conta?"} <button data-action="auth-switch">${signup ? "Fazer login" : "Criar conta"}</button></p></div></section></div>`;
  document.querySelector("#auth-form").addEventListener("submit", handleAuth);
  if (signup) {
    const confirmationField = document.createElement("div");
    confirmationField.className = "field";
    confirmationField.innerHTML = '<label for="auth-confirm-password">Confirmar senha</label><input id="auth-confirm-password" name="confirmacao" type="password" autocomplete="new-password" minlength="6" required>';
    document.querySelector("#auth-password").closest(".field").after(confirmationField);
  }
  document.querySelector('[data-action="auth-switch"]').addEventListener("click", () => renderAuth(signup ? "login" : "signup"));
}

async function passwordDigest(password, salt) {
  const input = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function handleAuth(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email")).trim().toLowerCase();
  const password = String(form.get("senha"));
  const mode = event.currentTarget.dataset.mode;
  if (mode === "signup") {
    if (password !== form.get("confirmacao")) return renderAuth(mode, "As senhas não coincidem.");
    if (state.users[email]) return renderAuth(mode, "Já existe uma conta com este e-mail.");
    const salt = crypto.randomUUID();
    state.users[email] = { email, nome: String(form.get("nome")).trim(), profissao: String(form.get("profissao")).trim(), salt, passwordHash: await passwordDigest(password, salt), financeiro: [], clientes: [], estoque: [], servicos: [], agendamentos: [], caderneta: [] };
  } else {
    const user = state.users[email];
    if (!user || user.passwordHash !== await passwordDigest(password, user.salt)) return renderAuth(mode, "E-mail ou senha não conferem.");
  }
  state.current = email;
  saveStore();
  activeView = "dashboard";
  render();
}

function bindAppEvents() {
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    render();
  }));
  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => handleAction(button.dataset.action)));
  document.querySelector("#table-search")?.addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("#module-table tbody tr").forEach(row => row.hidden = !row.dataset.search.includes(query));
  });
  document.querySelector("#status-filter")?.addEventListener("change", event => {
    document.querySelectorAll("#module-table tbody tr").forEach(row => row.hidden = (document.querySelector("#table-search")?.value && !row.dataset.search.includes(document.querySelector("#table-search").value.toLowerCase())) || (event.target.value && !row.cells[4].textContent.includes(event.target.value)));
  });
  document.querySelector("#settings-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const oldEmail = state.current;
    const newEmail = String(form.get("email")).trim().toLowerCase();
    const newPassword = String(form.get("senha"));
    if (newEmail !== oldEmail && state.users[newEmail]) return toast("Já existe uma conta com este e-mail.");
    if (newPassword && newPassword !== form.get("confirmacao")) return toast("As senhas não coincidem.");
    currentUser().nome = String(form.get("nome")).trim();
    currentUser().profissao = String(form.get("profissao")).trim();
    currentUser().email = newEmail;
    if (newPassword) {
      currentUser().salt = crypto.randomUUID();
      currentUser().passwordHash = await passwordDigest(newPassword, currentUser().salt);
    }
    if (newEmail !== oldEmail) {
      state.users[newEmail] = currentUser();
      delete state.users[oldEmail];
      state.current = newEmail;
    }
    persistUser();
    toast("Perfil atualizado.");
    render();
  });
}

function handleAction(action) {
  const [verb, key, id] = action.split(":");
  if (action === "menu") { document.querySelector("#sidebar")?.classList.toggle("open"); return; }
  if (action === "logout") { state.current = null; saveStore(); renderAuth("login"); return; }
  if (action === "auth-switch") { renderAuth("signup"); return; }
  if (action === "quick-add") return showQuickAdd();
  if (action === "clear-data") {
    if (confirm("Isso apagará sua conta e todos os registros deste navegador. Continuar?")) {
      delete state.users[state.current]; state.current = null; saveStore(); renderAuth("signup");
    }
    return;
  }
  if (verb === "add") return openRecordDialog(key);
  if (verb === "edit") return openRecordDialog(key, id);
  if (verb === "delete") return deleteRecord(key, id);
  if (verb === "pay") return registerPayment(key);
}

function showQuickAdd() {
  const dialog = document.querySelector("#record-dialog");
  dialog.innerHTML = `<div class="dialog-head"><div><p class="eyebrow">Novo registro</p><h2>O que você quer adicionar?</h2><p>Escolha uma área para continuar.</p></div><button class="icon-button" data-close aria-label="Fechar">×</button></div><div class="dialog-form"><div class="report-grid">${["financeiro", "clientes", "estoque", "servicos", "agendamentos", "caderneta"].map(key => `<button class="secondary-button" style="justify-content:flex-start;min-height:48px" data-quick="${key}">${MODULES[key].icon} &nbsp; ${TABLES[key].action}</button>`).join("")}</div></div>`;
  dialog.showModal();
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => { dialog.close(); openRecordDialog(button.dataset.quick); }));
}

function openRecordDialog(key, id = null) {
  const dialog = document.querySelector("#record-dialog");
  const existing = id ? records(key).find(record => record.id === id) : null;
  editingId = id;
  const fields = FIELDS[key].map(([name, label, type, required = false, options = [], full = false]) => renderField(name, label, type, required, options, full, existing?.[name] ?? defaultValue(name, type))).join("");
  dialog.innerHTML = `<div class="dialog-head"><div><p class="eyebrow">${TABLES[key].kicker}</p><h2>${existing ? "Editar registro" : TABLES[key].action}</h2><p>Os campos com * são obrigatórios.</p></div><button class="icon-button" data-close aria-label="Fechar">×</button></div><form class="dialog-form" id="record-form" data-key="${key}"><div class="form-grid">${fields}</div><div class="dialog-actions"><button class="secondary-button" type="button" data-close>Cancelar</button><button class="primary-button" type="submit">${existing ? "Salvar alterações" : "Salvar registro"}</button></div></form>`;
  dialog.showModal();
  dialog.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => dialog.close()));
  dialog.querySelector("#record-form").addEventListener("submit", saveRecord);
}

function defaultValue(name, type) {
  if (name === "data" || name === "vencimento") return todayISO();
  if (name === "horario") return "09:00";
  if (name === "pago" || name === "quantidade" || name === "custo" || name === "minimo" || name === "valor") return "0";
  if (name === "status") return "Pago";
  return "";
}

function renderField(name, label, type, required, options, full, value) {
  const id = `field-${name}`;
  const req = required ? "required" : "";
  let control;
  if (type === "select") control = `<select id="${id}" name="${name}" ${req}>${options.map(option => `<option ${value === option ? "selected" : ""}>${safe(option)}</option>`).join("")}</select>`;
  else if (type === "client") control = `<select id="${id}" name="${name}"><option value="">Sem cliente vinculado</option>${records("clientes").map(client => `<option value="${safe(client.nome)}" data-client-id="${client.id}" ${value === client.nome ? "selected" : ""}>${safe(client.nome)}</option>`).join("")}</select>`;
  else if (type === "textarea") control = `<textarea id="${id}" name="${name}" ${req}>${safe(value)}</textarea>`;
  else control = `<input id="${id}" name="${name}" type="${type}" value="${safe(value)}" ${type === "number" ? `min="0" step="${name === "quantidade" || name === "minimo" ? "1" : "0.01"}"` : ""} ${req}>`;
  return `<div class="field ${full ? "full" : ""}"><label for="${id}">${label}${required ? " *" : ""}</label>${control}</div>`;
}

function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const key = form.dataset.key;
  const formData = new FormData(form);
  const record = Object.fromEntries(formData.entries());
  if (["valor", "pago", "quantidade", "custo", "minimo"].some(field => field in record)) {
    for (const field of ["valor", "pago", "quantidade", "custo", "minimo"]) if (field in record) record[field] = Number(record[field]);
  }
  const list = records(key);
  const existingIndex = editingId ? list.findIndex(item => item.id === editingId) : -1;
  record.id = existingIndex >= 0 ? list[existingIndex].id : crypto.randomUUID();
  if (key === "servicos") syncIncome(record, key);
  if (key === "servicos" && record.cliente) record.clienteId = records("clientes").find(client => client.nome === record.cliente)?.id || "";
  if (key === "caderneta" && record.pago >= record.valor) record.pago = record.valor;
  if (existingIndex >= 0) list[existingIndex] = { ...list[existingIndex], ...record };
  else list.push(record);
  persistUser();
  document.querySelector("#record-dialog").close();
  toast(editingId ? "Registro atualizado." : "Registro salvo.");
  editingId = null;
  render();
}

function syncIncome(record, source) {
  const description = source === "servicos" ? record.nome : record.descricao;
  const existing = records("financeiro").find(item => item.origem === record.id);
  if (existing) Object.assign(existing, { descricao: description, valor: Number(record.valor), data: record.data, status: record.status });
  else {
    const financeRecord = { descricao: description, valor: Number(record.valor), data: record.data, status: record.status, tipo: "Receita", categoria: source === "servicos" ? "Serviço ou venda" : record.categoria, origem: record.id || crypto.randomUUID(), id: crypto.randomUUID() };
    if (!record.id) record.id = crypto.randomUUID();
    financeRecord.origem = record.id;
    records("financeiro").push(financeRecord);
  }
}

function deleteRecord(key, id) {
  if (!confirm("Excluir este registro? Esta ação não pode ser desfeita.")) return;
  const user = currentUser();
  user[key] = records(key).filter(item => item.id !== id);
  if (key === "servicos") user.financeiro = records("financeiro").filter(item => item.origem !== id);
  persistUser();
  toast("Registro excluído.");
  render();
}

function registerPayment(id) {
  const item = records("caderneta").find(record => record.id === id);
  if (!item) return;
  const remaining = Math.max(0, Number(item.valor) - Number(item.pago));
  const amount = prompt(`Valor recebido (pendente: ${money(remaining)}):`, remaining.toFixed(2));
  if (amount === null) return;
  const payment = Number(amount.replace(",", "."));
  if (!Number.isFinite(payment) || payment <= 0 || payment > remaining) return toast("Informe um valor válido, até o total pendente.");
  item.pago = Number(item.pago) + payment;
  if (item.pago >= item.valor) {
    item.pago = Number(item.valor);
    const already = records("financeiro").some(entry => entry.origem === `caderneta:${id}`);
    if (!already) records("financeiro").push({ id: crypto.randomUUID(), origem: `caderneta:${id}`, descricao: item.descricao, valor: item.pago, categoria: "Pagamento de cliente", tipo: "Receita", status: "Pago", data: todayISO() });
  }
  persistUser();
  toast("Pagamento registrado.");
  render();
}

render();