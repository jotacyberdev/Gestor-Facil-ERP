const STORE_KEY = "gestor-facil-v1";

const MODULES = {
  dashboard: { label: "Visão geral", icon: "⌂" },
  financeiro: { label: "Financeiro", icon: "↗" },
  clientes: { label: "Clientes", icon: "♧" },
  estoque: { label: "Estoque", icon: "▦" },
  servicos: { label: "Serviços e vendas", icon: "◈" },
  agendamentos: { label: "Agendamentos", icon: "▣" },
  caderneta: { label: "Caderneta digital", icon: "≡" },
  notas: { label: "Notas Fiscais", icon: "⎙" },
  relatorios: { label: "Relatórios", icon: "▤" },
  configuracoes: { label: "Configurações", icon: "⚙" }
};

const UNIT_OPTIONS = [
  "unidades",
  "kg",
  "g",
  "litros",
  "ml",
  "caixas",
  "pacotes",
  "metros",
  "pares",
  "peças"
];

const DECIMAL_UNITS = new Set(["kg", "g", "litros", "ml", "metros"]);
const MAX_STOCK_QTY = 1000000;
const MAX_MONEY_VALUE = 999999999.99;

const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const FIELDS = {
  financeiro: [
    ["descricao", "Descrição", "text", true],
    ["tipo", "Tipo", "select", true, ["Receita", "Despesa"]],
    ["valor", "Valor (R$)", "money", true],
    ["categoria", "Categoria", "text", true],
    ["data", "Data", "date", true],
    ["status", "Status", "select", true, ["Pago", "Pendente"]]
  ],
  clientes: [
    ["nome", "Nome completo", "text", true],
    ["cpf", "CPF", "cpf", false],
    ["telefone", "Telefone / Celular", "phone", true],
    ["email", "E-mail", "email", false],
    ["cep", "CEP", "cep", false],
    ["estado", "Estado (UF)", "select", false, ["", ...UF_LIST]],
    ["cidade", "Cidade", "text", false],
    ["bairro", "Bairro", "text", false],
    ["rua", "Rua ou avenida", "text", false],
    ["numero", "Número do imóvel", "text", false],
    ["complemento", "Complemento", "text", false],
    ["observacoes", "Observações", "textarea", false, null, true]
  ],
  estoque: [
    ["nome", "Produto ou material", "text", true],
    ["categoria", "Categoria", "text", true],
    ["quantidade", "Quantidade", "qty", true],
    ["unidade", "Unidade de medida", "select", true, UNIT_OPTIONS],
    ["custo", "Custo de compra (R$)", "money", true],
    ["precoVenda", "Preço de venda (R$)", "money", false],
    ["minimo", "Estoque mínimo", "qty", true],
    ["validade", "Data de validade", "date", false]
  ],
  agendamentos: [
    ["cliente", "Cliente", "client", false],
    ["servico", "Serviço", "text", true],
    ["data", "Data", "date", true],
    ["horario", "Horário", "time", true],
    ["status", "Status", "select", true, ["Agendado", "Confirmado", "Concluído", "Cancelado"]],
    ["observacoes", "Observações", "textarea", false, null, true]
  ],
  caderneta: [
    ["cliente", "Cliente", "client", true],
    ["descricao", "Descrição", "text", true],
    ["valor", "Valor total (R$)", "money", true],
    ["pago", "Valor já pago (R$)", "money", true],
    ["vencimento", "Vencimento", "date", true]
  ]
};

const TABLES = {
  financeiro: {
    kicker: "Entradas e saídas",
    title: "Financeiro",
    desc: "Acompanhe o que entrou, saiu e ainda está por receber.",
    action: "Nova movimentação",
    columns: [
      ["descricao", "Descrição"],
      ["categoria", "Categoria"],
      ["data", "Data"],
      ["tipo", "Tipo"],
      ["status", "Status"],
      ["valor", "Valor"]
    ]
  },
  clientes: {
    kicker: "Relacionamentos",
    title: "Clientes",
    desc: "Mantenha os contatos, CPF, endereço completo e o histórico do seu negócio organizados.",
    action: "Novo cliente",
    columns: [
      ["nome", "Nome"],
      ["cpf", "CPF"],
      ["telefone", "Telefone"],
      ["enderecoResumo", "Endereço"],
      ["histórico", "Atendimentos"]
    ]
  },
  estoque: {
    kicker: "Produtos e materiais",
    title: "Estoque",
    desc: "Saiba o que você tem disponível, o valor unitário e o que precisa repor.",
    action: "Novo produto",
    columns: [
      ["nome", "Produto"],
      ["categoria", "Categoria"],
      ["quantidade", "Quantidade"],
      ["custo", "Custo unitário"],
      ["precoVenda", "Preço de venda"],
      ["situação", "Situação"]
    ]
  },
  servicos: {
    kicker: "Atendimentos e vendas",
    title: "Serviços e vendas",
    desc: "Registre trabalhos realizados e produtos vendidos com baixa automática no estoque e integração financeira.",
    action: "Nova venda ou serviço",
    columns: [
      ["data", "Data"],
      ["cliente", "Cliente"],
      ["itensResumo", "Produtos / Serviços"],
      ["qtdTotal", "Qtd."],
      ["valor", "Valor total"],
      ["pagamento", "Pagamento"],
      ["status", "Situação"],
      ["responsavel", "Responsável"]
    ]
  },
  agendamentos: {
    kicker: "Sua rotina",
    title: "Agendamentos",
    desc: "Organize os próximos compromissos e horários.",
    action: "Novo agendamento",
    columns: [
      ["data", "Data"],
      ["horario", "Horário"],
      ["cliente", "Cliente"],
      ["servico", "Serviço"],
      ["status", "Status"]
    ]
  },
  caderneta: {
    kicker: "Contas a receber",
    title: "Caderneta digital",
    desc: "Acompanhe valores pendentes, parcelas e quitações vinculadas aos clientes.",
    action: "Nova pendência",
    columns: [
      ["cliente", "Cliente"],
      ["descricao", "Descrição"],
      ["valor", "Valor original"],
      ["pago", "Já pago"],
      ["restante", "Restante"],
      ["vencimento", "Vencimento"],
      ["status", "Status"]
    ]
  }
};

let state = readStore();
let activeView = "dashboard";
let editingId = null;
let toastTimer = null;
let nfTab = "emitidas";
let stockTab = "produtos";

function brandLogoSVG() {
  return `<img src="logo.jpeg" alt="Logo Gestor Fácil">`;
}

function readStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!parsed || typeof parsed !== "object") return { users: {}, current: null };
    return { users: parsed.users || {}, current: parsed.current || null };
  } catch {
    return { users: {}, current: null };
  }
}

function saveStore() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function ensureUserSchema(user) {
  if (!user) return null;
  user.financeiro = Array.isArray(user.financeiro) ? user.financeiro : [];
  user.clientes = Array.isArray(user.clientes) ? user.clientes : [];
  user.estoque = Array.isArray(user.estoque) ? user.estoque : [];
  user.movimentacoesEstoque = Array.isArray(user.movimentacoesEstoque) ? user.movimentacoesEstoque : [];
  user.servicos = Array.isArray(user.servicos) ? user.servicos : [];
  user.agendamentos = Array.isArray(user.agendamentos) ? user.agendamentos : [];
  user.caderneta = Array.isArray(user.caderneta) ? user.caderneta : [];
  user.notasFiscais = Array.isArray(user.notasFiscais) ? user.notasFiscais : [];
  user.config = Object.assign({ permitirEstoqueNegativo: false }, user.config || {});
  user.fiscalConfig = Object.assign({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    ie: "",
    im: "",
    regimeTributario: "Simples Nacional",
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
    ambiente: "Homologação",
    provedor: "",
    certificadoStatus: "Não configurado",
    tokenIntegracao: ""
  }, user.fiscalConfig || {});
  return user;
}

function currentUser() {
  if (!state.current || !state.users[state.current]) return null;
  return ensureUserSchema(state.users[state.current]);
}

function persistUser() {
  const user = currentUser();
  if (!user) return;
  state.users[state.current] = user;
  saveStore();
}

function records(key) {
  const user = currentUser();
  if (!user) return [];
  if (!Array.isArray(user[key])) user[key] = [];
  return user[key];
}

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function currentMonthPrefix() {
  return todayISO().slice(0, 7);
}

function safe(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.append(element);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.remove(), 3000);
}

/* ===================== FORMATAÇÃO & VALIDAÇÕES ===================== */

function money(value) {
  const num = Number(value || 0);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatMoneyInputFromNumber(num) {
  const safeNum = Number.isFinite(Number(num)) ? Math.max(0, Number(num)) : 0;
  return safeNum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseMoneyInput(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) ? Math.round(raw * 100) / 100 : 0;
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return 0;
  const value = Number(digits) / 100;
  return Math.min(MAX_MONEY_VALUE, Math.round(value * 100) / 100);
}

function applyMoneyMask(input) {
  const parsed = parseMoneyInput(input.value);
  input.value = formatMoneyInputFromNumber(parsed);
}

function isValidDateISO(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1900 || year > 2999) return false;
  if (month < 1 || month > 12) return false;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month - 1];
}

function shortDate(value) {
  if (!value) return "—";
  if (!isValidDateISO(value)) return "Data inválida";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function onlyDigits(val) {
  return String(val || "").replace(/\D/g, "");
}

function formatPhone(val) {
  const digits = onlyDigits(val).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function isValidBrazilianPhone(val) {
  const digits = onlyDigits(val);
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  if (digits.length === 11 && digits[2] !== "9") return false;
  return true;
}

function formatCPF(val) {
  const d = onlyDigits(val).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function isValidCPF(val) {
  const cpf = onlyDigits(val);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === Number(cpf[10]);
}

function formatCNPJ(val) {
  const d = onlyDigits(val).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

function isValidCNPJ(val) {
  const cnpj = onlyDigits(val);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base, weights) => {
    let s = 0;
    for (let i = 0; i < weights.length; i++) s += Number(base[i]) * weights[i];
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}

function formatCEP(val) {
  const d = onlyDigits(val).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatQuantity(qty, unit) {
  const num = Number(qty || 0);
  const formatted = DECIMAL_UNITS.has(unit)
    ? num.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })
    : num.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  return `${formatted} ${safe(unit || "unidades")}`;
}

function formatClientAddress(client) {
  if (!client) return "—";
  if (client.rua || client.numero || client.bairro || client.cidade) {
    const line1 = [client.rua, client.numero ? `nº ${client.numero}` : ""].filter(Boolean).join(", ");
    const line2 = [client.bairro, client.cidade && client.estado ? `${client.cidade}/${client.estado}` : (client.cidade || client.estado)].filter(Boolean).join(" - ");
    return [line1, line2].filter(Boolean).join(" · ") || "—";
  }
  return client.endereco || "—";
}

function renderUserAvatar(user, large = false) {
  const cls = large ? "avatar-lg" : "avatar";
  if (user?.fotoPerfil) {
    return `<div class="${cls}"><img src="${safe(user.fotoPerfil)}" alt="Foto de perfil de ${safe(user.nome)}"></div>`;
  }
  const initial = safe(user?.nome?.[0]?.toUpperCase() || "G");
  return `<div class="${cls}">${initial}</div>`;
}

/* ===================== RENDERIZAÇÃO PRINCIPAL ===================== */

function render() {
  const user = currentUser();
  if (!user) return renderAuth("login");
  const app = document.querySelector("#app");
  const view = MODULES[activeView] ? activeView : "dashboard";
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand-mark">${brandLogoSVG()}</div>
          <div>
            <div class="brand-name">gestor fácil</div>
            <div class="brand-note">Sua profissão, seu negócio.</div>
          </div>
        </div>
        <div class="side-label">Seu espaço</div>
        <nav class="nav-list" aria-label="Navegação principal">
          ${Object.entries(MODULES).map(([key, item]) => `
            <button class="nav-item ${key === view ? "active" : ""}" data-view="${key}">
              <span class="nav-icon">${item.icon}</span>${item.label}
            </button>`).join("")}
        </nav>
        <div class="sidebar-bottom">
          <div class="side-tip">
            <strong>Um passo de cada vez.</strong>
            <p>Registre vendas, clientes e movimentações para manter seu caixa e estoque sincronizados.</p>
          </div>
          <div class="user-card">
            ${renderUserAvatar(user, false)}
            <div class="user-meta">
              <strong>${safe(user.nome)}</strong>
              <span>${safe(user.profissao || "Meu negócio")}</span>
            </div>
            <button class="icon-button" data-action="logout" aria-label="Sair da conta" title="Sair">↪</button>
          </div>
        </div>
      </aside>
      <section class="main">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:12px">
            <button class="icon-button mobile-menu" data-action="menu" aria-label="Abrir menu">☰</button>
            <div class="breadcrumbs">Meu negócio <span aria-hidden="true"> / </span> <strong>${MODULES[view].label}</strong></div>
          </div>
          <div class="top-actions">
            <span class="today">${new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}</span>
          </div>
        </header>
        <main class="page" id="page-content">${renderView(view)}</main>
      </section>
    </div>`;
  bindAppEvents();
}

function pageHeading(kicker, title, description, actionLabel = "", action = "") {
  return `<div class="page-heading">
    <div>
      <p class="eyebrow">${kicker}</p>
      <h1>${title}</h1>
      <p class="subheading">${description}</p>
    </div>
    ${actionLabel ? `<button class="primary-button" data-action="${action}"><span>＋</span>${actionLabel}</button>` : ""}
  </div>`;
}

function renderView(view) {
  if (view === "dashboard") return renderDashboard();
  if (view === "financeiro") return renderTableModule("financeiro");
  if (view === "clientes") return renderTableModule("clientes");
  if (view === "estoque") return renderStockModule();
  if (view === "servicos") return renderSalesModule();
  if (view === "agendamentos") return renderTableModule("agendamentos");
  if (view === "caderneta") return renderTableModule("caderneta");
  if (view === "notas") return renderFiscalModule();
  if (view === "relatorios") return renderReports();
  if (view === "configuracoes") return renderSettings();
  return renderDashboard();
}

/* ===================== DASHBOARD & MÉTRICAS ===================== */

function monthTransactions() {
  const prefix = currentMonthPrefix();
  return records("financeiro").filter(item => item.data?.startsWith(prefix));
}

function getCadernetaMetrics() {
  const today = todayISO();
  let totalReceivable = 0;
  let overdueReceivable = 0;
  let openCount = 0;
  records("caderneta").forEach(item => {
    const rest = Math.max(0, Number(item.valor || 0) - Number(item.pago || 0));
    if (rest > 0) {
      totalReceivable += rest;
      openCount++;
      if (item.vencimento && item.vencimento < today) {
        overdueReceivable += rest;
      }
    }
  });
  return { totalReceivable, overdueReceivable, openCount };
}

function financeTotals(items = records("financeiro")) {
  const paid = items.filter(item => item.status === "Pago");
  const income = paid.filter(item => item.tipo === "Receita").reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const expense = paid.filter(item => item.tipo === "Despesa").reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const pendingFinance = items
    .filter(item => item.tipo === "Receita" && item.status === "Pendente" && !String(item.origem || "").startsWith("venda:"))
    .reduce((sum, item) => sum + Number(item.valor || 0), 0);
  return { income, expense, result: income - expense, pendingFinance };
}

function renderDashboard() {
  const monthItems = monthTransactions();
  const totals = financeTotals(monthItems);
  const cad = getCadernetaMetrics();
  const totalAReceber = totals.pendingFinance + cad.totalReceivable;
  const lowStock = records("estoque").filter(item => Number(item.quantidade) <= Number(item.minimo)).length;
  const appointments = records("agendamentos")
    .filter(item => item.data === todayISO() && item.status !== "Cancelado")
    .sort((a, b) => a.horario.localeCompare(b.horario));
  const transactions = [...records("financeiro")].sort((a, b) => String(b.data).localeCompare(String(a.data))).slice(0, 5);

  const metrics = [
    ["Receitas do mês", money(totals.income), "Entradas confirmadas no caixa", "↗", "positive"],
    ["Despesas do mês", money(totals.expense), "Saídas confirmadas", "↘", "negative"],
    ["Resultado do mês", money(totals.result), "Receitas pagas menos despesas", "＝", totals.result >= 0 ? "positive" : "negative"],
    ["A receber", money(totalAReceber), `${cad.openCount} pendência(s) na caderneta`, "◷", "receivable"]
  ];

  return `${pageHeading("Seu negócio em foco", `Olá, ${safe(currentUser().nome.split(" ")[0])}.`, "Resumo real do seu caixa, vendas e compromissos.", "Novo registro", "quick-add")}
    <div class="metric-grid">
      ${metrics.map(([label, amount, foot, icon, valClass]) => `
        <article class="metric">
          <div class="metric-top"><span>${label}</span><span class="metric-symbol">${icon}</span></div>
          <div class="metric-value ${valClass}">${amount}</div>
          <div class="metric-foot">${foot}</div>
        </article>`).join("")}
    </div>
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Movimentação financeira</h2>
            <p class="panel-caption">Receitas pagas e despesas pagas dos últimos 6 meses</p>
          </div>
          <div class="legend"><span><i></i>Receitas</span><span><i></i>Despesas</span></div>
        </div>
        ${renderChart()}
        <div class="chart-labels">${monthLabels()}</div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Agenda de hoje</h2>
            <p class="panel-caption">${shortDate(todayISO())}</p>
          </div>
          <button class="text-button" data-view="agendamentos">Ver agenda →</button>
        </div>
        <div class="agenda-list">
          ${appointments.length ? appointments.slice(0, 4).map(item => `
            <div class="agenda-row">
              <span class="agenda-time">${safe(item.horario)}</span>
              <div class="agenda-content">
                <strong>${safe(item.cliente || "Sem cliente")}</strong>
                <span>${safe(item.servico)}</span>
              </div>
              <span class="status ${statusClass(item.status)}">${safe(item.status)}</span>
            </div>`).join("") : `<div class="empty-state"><strong>Agenda livre por aqui</strong>Nenhum compromisso registrado para hoje.</div>`}
        </div>
      </section>
    </div>
    <div class="section-row"><h2>Últimas movimentações financeiras</h2><button class="text-button" data-view="financeiro">Ver financeiro →</button></div>
    <section class="panel">
      ${transactions.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Status</th><th style="text-align:right">Valor</th></tr></thead><tbody>
        ${transactions.map(item => `<tr>
          <td><strong>${safe(item.descricao)}</strong></td>
          <td class="muted">${safe(item.categoria)}</td>
          <td>${shortDate(item.data)}</td>
          <td><span class="status ${statusClass(item.status)}">${safe(item.status)}</span></td>
          <td class="${item.tipo === "Receita" ? (item.status === "Pago" ? "positive" : "receivable") : "negative"}" style="text-align:right">${item.tipo === "Despesa" ? "−" : "+"} ${money(item.valor)}</td>
        </tr>`).join("")}
      </tbody></table></div>` : `<div class="empty-state"><strong>Seu resumo começa com um registro</strong>Adicione uma receita, despesa ou venda para acompanhar o resultado.<button class="text-button" data-action="quick-add"> Registrar agora →</button></div>`}
    </section>
    ${lowStock ? `<p class="subheading" style="margin-top:14px;color:#a45b2d">Atenção: ${lowStock} ${lowStock === 1 ? "item está" : "itens estão"} no limite ou abaixo do estoque mínimo. <button class="text-button" data-view="estoque">Conferir estoque →</button></p>` : ""}`;
}

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  });
}

function monthLabels() {
  return lastSixMonths().map(key => {
    const [y, m] = key.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return `<span>${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>`;
  }).join("");
}

function renderChart() {
  const months = lastSixMonths();
  const values = months.map(month => {
    const totals = financeTotals(records("financeiro").filter(item => item.data?.startsWith(month)));
    return { income: totals.income, expense: totals.expense };
  });
  const max = Math.max(...values.flatMap(item => [item.income, item.expense]), 1);
  return `<div class="chart-area" role="img" aria-label="Gráfico de receitas e despesas dos últimos seis meses">
    ${values.map(item => `
      <div class="chart-group">
        <div class="chart-column" title="Receitas pagas: ${money(item.income)}" style="height:${Math.max(3, item.income / max * 100)}%"></div>
        <div class="chart-column expense" title="Despesas pagas: ${money(item.expense)}" style="height:${Math.max(3, item.expense / max * 100)}%"></div>
      </div>`).join("")}
  </div>`;
}

function statusClass(status = "") {
  return String(status).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(" ", "-");
}

/* ===================== MÓDULOS DE TABELA GENÉRICOS ===================== */

function renderTableModule(key) {
  const config = TABLES[key];
  const list = [...records(key)].sort((a, b) => String(b.data || b.vencimento || b.nome || "").localeCompare(String(a.data || a.vencimento || a.nome || "")));
  const filters = key === "financeiro"
    ? `<select class="select-compact" id="status-filter"><option value="">Todos os status</option><option value="Pago">Pago</option><option value="Pendente">Pendente</option></select>`
    : "";
  const searchPlaceholder = key === "clientes" ? "Buscar por nome, CPF ou telefone..." : `Buscar ${config.title.toLowerCase()}...`;

  return `${pageHeading(config.kicker, config.title, config.desc, config.action, `add:${key}`)}
    <div class="toolbar">
      <input class="search-input" id="table-search" type="search" placeholder="⌕  ${searchPlaceholder}" aria-label="Buscar registros">
      ${filters}
      <span class="toolbar-spacer"></span>
      <span class="muted" style="font-size:10px" id="table-count">${list.length} registros</span>
    </div>
    <section class="panel">
      ${list.length ? `<div class="table-wrap"><table class="data-table" id="module-table">
        <thead><tr>${config.columns.map(([, title]) => `<th>${title}</th>`).join("")}<th></th></tr></thead>
        <tbody>${list.map(item => renderTableRow(key, item, config.columns)).join("")}</tbody>
      </table></div>` : `<div class="empty-state"><strong>Nenhum registro por enquanto</strong>Adicione informações para acompanhar esta área do seu negócio.<button class="text-button" data-action="add:${key}"> Criar primeiro registro →</button></div>`}
    </section>`;
}

function renderTableRow(key, item, columns) {
  const computedStatus = key === "caderneta" ? computeCadernetaStatus(item) : (item.status || "");
  const searchBlob = safe([
    ...Object.values(item),
    key === "clientes" ? formatClientAddress(item) : "",
    computedStatus
  ].join(" ").toLowerCase());

  const cells = columns.map(([field]) => `<td>${renderCell(key, field, item)}</td>`).join("");
  return `<tr data-search="${searchBlob}" data-status="${safe(computedStatus)}">
    ${cells}
    <td>
    <div class="row-actions">
        ${key === "caderneta" && Number(item.valor) > Number(item.pago) ? `<button class="tiny-button" data-action="whats:caderneta:${item.id}" title="Cobrar via WhatsApp">WhatsApp</button>` : ""}
        ${key === "agendamentos" && item.status !== "Cancelado" && item.status !== "Concluído" ? `<button class="tiny-button" data-action="whats:agendamentos:${item.id}" title="Lembrar via WhatsApp">WhatsApp</button>` : ""}
        ${key === "caderneta" && Number(item.valor) > Number(item.pago) ? `<button class="tiny-button" data-action="pay:${item.id}">Receber</button>` : ""}
        <button class="tiny-button" data-action="edit:${key}:${item.id}">Editar</button>
        <button class="tiny-button danger" data-action="delete:${key}:${item.id}">Excluir</button>
      </div>
    </td>
  </tr>`;
}

function computeCadernetaStatus(item) {
  const total = Number(item.valor || 0);
  const paid = Number(item.pago || 0);
  if (paid >= total && total > 0) return "Pago";
  if (item.vencimento && item.vencimento < todayISO()) return "Vencido";
  if (paid > 0) return "Parcial";
  return "Pendente";
}

function renderCell(key, field, item) {
  if (field === "valor" || field === "custo" || field === "pago" || field === "precoVenda") {
    return item[field] !== undefined && item[field] !== "" ? money(item[field]) : "—";
  }
  if (field === "restante") {
    const rest = Math.max(0, Number(item.valor || 0) - Number(item.pago || 0));
    return `<strong class="${rest > 0 ? "receivable" : "positive"}">${money(rest)}</strong>`;
  }
  if (field === "quantidade") return `<strong>${formatQuantity(item.quantidade, item.unidade)}</strong>`;
  if (field === "situação") {
    return Number(item.quantidade) <= Number(item.minimo)
      ? `<span class="status pendente">Estoque baixo</span>`
      : `<span class="status">Normal</span>`;
  }
  if (field === "enderecoResumo") return safe(formatClientAddress(item));
  if (field === "cpf") return safe(item.cpf || "—");
  if (field === "histórico") {
    const count = records("servicos").filter(s => s.clienteId === item.id || (item.cpf && s.clienteCpf === item.cpf)).length;
    return `${count} ${count === 1 ? "venda" : "vendas"}`;
  }
  if (field === "data" || field === "vencimento") return shortDate(item[field]);
  if (field === "status") {
    const st = key === "caderneta" ? computeCadernetaStatus(item) : item.status;
    return `<span class="status ${statusClass(st)}">${safe(st)}</span>`;
  }
  if (field === "tipo") return `<span class="${item.tipo === "Receita" ? "positive" : "negative"}">${safe(item.tipo)}</span>`;
  if (field === "descricao" || field === "nome" || field === "cliente") return `<strong>${safe(item[field] || "—")}</strong>`;
  return safe(item[field] || "—");
}

/* ===================== MÓDULO DE ESTOQUE & AUDITORIA ===================== */

function renderStockModule() {
  const user = currentUser();
  const products = [...records("estoque")].sort((a, b) => String(a.nome).localeCompare(String(b.nome)));
  const movements = [...records("movimentacoesEstoque")].sort((a, b) => String(b.dataHora || "").localeCompare(String(a.dataHora || "")));

  return `${pageHeading("Produtos e materiais", "Estoque", "Controle de quantidades, unidades de medida e histórico de movimentações.", "Novo produto", "add:estoque")}
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap">
      <div class="tabs-bar" style="margin-bottom:0">
        <button class="tab-btn ${stockTab === "produtos" ? "active" : ""}" data-stock-tab="produtos">Produtos (${products.length})</button>
        <button class="tab-btn ${stockTab === "historico" ? "active" : ""}" data-stock-tab="historico">Histórico de movimentações (${movements.length})</button>
      </div>
      <label style="display:inline-flex;align-items:center;gap:7px;font-size:11px;color:var(--muted);cursor:pointer">
        <input type="checkbox" id="toggle-negative-stock" ${user.config.permitirEstoqueNegativo ? "checked" : ""}>
        Permitir venda com estoque insuficiente
      </label>
    </div>
    ${stockTab === "produtos" ? `
      <div class="toolbar">
        <input class="search-input" id="table-search" type="search" placeholder="⌕  Buscar produto ou categoria...">
        <span class="toolbar-spacer"></span>
        <span class="muted" style="font-size:10px" id="table-count">${products.length} produtos</span>
      </div>
      <section class="panel">
        ${products.length ? `<div class="table-wrap"><table class="data-table" id="module-table">
          <thead><tr>${TABLES.estoque.columns.map(([, t]) => `<th>${t}</th>`).join("")}<th></th></tr></thead>
          <tbody>${products.map(item => renderTableRow("estoque", item, TABLES.estoque.columns)).join("")}</tbody>
        </table></div>` : `<div class="empty-state"><strong>Nenhum produto cadastrado</strong>Adicione produtos com quantidade e unidade de medida separadas.<button class="text-button" data-action="add:estoque"> Cadastrar primeiro produto →</button></div>`}
      </section>
    ` : `
      <section class="panel">
        ${movements.length ? `<div class="table-wrap"><table class="data-table">
          <thead><tr><th>Data / Hora</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Saldo anterior → atual</th><th>Origem</th><th>Responsável</th></tr></thead>
          <tbody>${movements.map(m => `<tr>
            <td>${safe(m.dataFormatada || shortDate(m.data))}</td>
            <td><strong>${safe(m.produtoNome)}</strong></td>
            <td><span class="status ${m.tipo === "Saída (Venda)" ? "pendente" : "confirmado"}">${safe(m.tipo)}</span></td>
            <td class="${m.delta < 0 ? "negative" : "positive"}">${m.delta > 0 ? "+" : ""}${formatQuantity(m.delta, m.unidade)}</td>
            <td class="muted">${formatQuantity(m.saldoAnterior, m.unidade)} → <strong>${formatQuantity(m.saldoAtual, m.unidade)}</strong></td>
            <td>${safe(m.origemDescricao || "—")}</td>
            <td class="muted">${safe(m.responsavel || "—")}</td>
          </tr>`).join("")}</tbody>
        </table></div>` : `<div class="empty-state"><strong>Nenhuma movimentação registrada</strong>As baixas e estornos de vendas aparecerão automaticamente aqui.</div>`}
      </section>
    `}`;
}

function logStockMovement({ produto, delta, tipo, origemId, origemDescricao }) {
  const prev = Number(produto.quantidade || 0);
  const next = Math.round((prev + delta) * 1000) / 1000;
  produto.quantidade = next;
  const now = new Date();
  records("movimentacoesEstoque").push({
    id: crypto.randomUUID(),
    produtoId: produto.id,
    produtoNome: produto.nome,
    unidade: produto.unidade || "unidades",
    delta,
    saldoAnterior: prev,
    saldoAtual: next,
    tipo,
    origemId,
    origemDescricao,
    responsavel: currentUser()?.nome || "Sistema",
    data: todayISO(),
    dataHora: now.toISOString(),
    dataFormatada: now.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
  });
}

/* ===================== MÓDULO DE VENDAS E SERVIÇOS INTEGRADO ===================== */

function normalizeSaleRecord(sale) {
  if (Array.isArray(sale.itens) && sale.itens.length > 0) return sale;
  return {
    ...sale,
    itens: [{
      tipo: "avulso",
      produtoId: "",
      nome: sale.nome || "Item registrado",
      quantidade: 1,
      unidade: "unidades",
      valorUnitario: Number(sale.valor || 0),
      subtotal: Number(sale.valor || 0)
    }],
    valorPago: sale.status === "Pago" ? Number(sale.valor || 0) : Number(sale.valorPago || 0),
    responsavel: sale.responsavel || currentUser()?.nome || "Usuário"
  };
}

function renderSalesModule() {
  const sales = [...records("servicos")].map(normalizeSaleRecord).sort((a, b) => {
    const cmp = String(b.data || "").localeCompare(String(a.data || ""));
    if (cmp !== 0) return cmp;
    return String(b.criadoEm || "").localeCompare(String(a.criadoEm || ""));
  });

  return `${pageHeading("Atendimentos e vendas", "Serviços e vendas", "Histórico completo de vendas, com baixa automática no estoque e integração com financeiro e caderneta.", "Nova venda ou serviço", "add:servicos")}
    <div class="toolbar">
      <input class="search-input" id="sales-search" type="search" placeholder="⌕  Buscar por cliente, CPF ou produto...">
      <input type="date" id="sales-date-from" title="Data inicial" aria-label="Data inicial">
      <input type="date" id="sales-date-to" title="Data final" aria-label="Data final">
      <select class="select-compact" id="sales-status-filter">
        <option value="">Todas as situações</option>
        <option value="Pago">Pago</option>
        <option value="Parcial">Parcial</option>
        <option value="Pendente">Pendente</option>
        <option value="Cancelado">Cancelado</option>
      </select>
      <span class="toolbar-spacer"></span>
      <span class="muted" style="font-size:10px" id="sales-count">${sales.length} registro(s)</span>
    </div>
    <section class="panel">
      ${sales.length ? `<div class="table-wrap"><table class="data-table" id="sales-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente / CPF</th>
            <th>Produtos ou Serviços</th>
            <th>Qtd. total</th>
            <th>Valor total</th>
            <th>Pagamento</th>
            <th>Situação</th>
            <th>Responsável</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${sales.map(sale => {
            const itensSummary = sale.itens.map(i => `${i.nome} (${formatQuantity(i.quantidade, i.unidade)})`).join(", ");
            const totalQty = sale.itens.reduce((s, i) => s + Number(i.quantidade || 0), 0);
            const searchBlob = safe([sale.cliente, sale.clienteCpf, itensSummary, sale.pagamento, sale.responsavel].join(" ").toLowerCase());
            return `<tr data-search="${searchBlob}" data-date="${safe(sale.data)}" data-status="${safe(sale.status)}">
              <td>${shortDate(sale.data)}</td>
              <td>
                <strong>${safe(sale.cliente || "Consumidor não identificado")}</strong>
                ${sale.clienteCpf ? `<div class="muted" style="font-size:10px">${safe(sale.clienteCpf)}</div>` : ""}
              </td>
              <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis" title="${safe(itensSummary)}">${safe(itensSummary)}</td>
              <td>${totalQty.toLocaleString("pt-BR", { maximumFractionDigits: 3 })}</td>
              <td><strong>${money(sale.valor)}</strong>${sale.status === "Parcial" ? `<div class="muted" style="font-size:10px">Pago: ${money(sale.valorPago)}</div>` : ""}</td>
              <td>${safe(sale.pagamento || "—")}</td>
              <td><span class="status ${statusClass(sale.status)}">${safe(sale.status)}</span></td>
              <td class="muted">${safe(sale.responsavel || "—")}</td>
              <td>
                <div class="row-actions">
                  ${sale.status !== "Cancelado" ? `<button class="tiny-button" data-action="nf-from-sale:${sale.id}" title="Preparar Nota Fiscal">NF</button>` : ""}
                  ${sale.status !== "Cancelado" ? `<button class="tiny-button danger" data-action="cancel-sale:${sale.id}">Cancelar</button>` : ""}
                  <button class="tiny-button danger" data-action="delete:servicos:${sale.id}">Excluir</button>
                </div>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>` : `<div class="empty-state"><strong>Nenhuma venda ou serviço registrado</strong>Registre sua primeira venda vinculando cliente, produtos e forma de pagamento.<button class="text-button" data-action="add:servicos"> Registrar venda agora →</button></div>`}
    </section>`;
}

function openSaleDialog() {
  const dialog = document.querySelector("#record-dialog");
  const clients = records("clientes");
  const stockProducts = records("estoque");

  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">Atendimentos e vendas</p>
        <h2>Registrar venda ou serviço</h2>
        <p>Responsável: <strong>${safe(currentUser().nome)}</strong> · Baixa automática de estoque e integração financeira.</p>
      </div>
      <button class="icon-button" data-close aria-label="Fechar">×</button>
    </div>
    <form class="dialog-form" id="sale-form" novalidate>
      <div class="form-grid">
        <div class="field full">
          <label for="sale-client-search">Pesquisar cliente (nome ou CPF)</label>
          <div class="inline-row">
            <input id="sale-client-search" type="text" placeholder="Digite nome ou CPF para localizar..." autocomplete="off">
            <button type="button" class="secondary-button" id="btn-quick-client">＋ Novo cliente</button>
          </div>
        </div>
        <div class="field full">
          <label for="sale-client-select">Cliente selecionado</label>
          <select id="sale-client-select" name="clienteId">
            <option value="">Consumidor sem cadastro (venda avulsa)</option>
            ${clients.map(c => `<option value="${c.id}" data-search="${safe((c.nome + " " + (c.cpf || "")).toLowerCase())}">${safe(c.nome)}${c.cpf ? ` — CPF: ${safe(c.cpf)}` : ""}</option>`).join("")}
          </select>
        </div>

        <div class="field full">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <label style="margin:0">Produtos ou serviços vendidos *</label>
            <button type="button" class="text-button" id="btn-add-sale-item">＋ Adicionar item</button>
          </div>
          <div class="sale-items-box" id="sale-items-container"></div>
          <div class="sale-summary">
            <span>Total da venda:</span>
            <strong id="sale-total-display">R$ 0,00</strong>
          </div>
        </div>

        <div class="field">
          <label for="sale-date">Data da venda *</label>
          <input id="sale-date" name="data" type="date" value="${todayISO()}" required>
        </div>
        <div class="field">
          <label for="sale-payment">Forma de pagamento *</label>
          <select id="sale-payment" name="pagamento" required>
            <option>Pix</option>
            <option>Dinheiro</option>
            <option>Cartão de crédito</option>
            <option>Cartão de débito</option>
            <option>Transferência</option>
            <option>Outro</option>
          </select>
        </div>
        <div class="field">
          <label for="sale-status">Situação do pagamento *</label>
          <select id="sale-status" name="status" required>
            <option value="Pago">Pago integralmente</option>
            <option value="Parcial">Parcialmente pago</option>
            <option value="Pendente">Pendente (a receber)</option>
          </select>
        </div>
        <div class="field" id="sale-paid-wrap" style="display:none">
          <label for="sale-paid-amount">Valor já pago (R$) *</label>
          <input id="sale-paid-amount" name="valorPago" type="text" inputmode="numeric" value="R$ 0,00">
        </div>
        <div class="field" id="sale-due-wrap" style="display:none">
          <label for="sale-due-date">Vencimento do saldo restante *</label>
          <input id="sale-due-date" name="vencimento" type="date" value="${todayISO()}">
        </div>
      </div>
      <div id="sale-form-error" class="field-error" style="margin-top:10px"></div>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-close>Cancelar</button>
        <button class="primary-button" type="submit">Confirmar venda</button>
      </div>
    </form>`;

  const container = dialog.querySelector("#sale-items-container");

  function addItemRow() {
    const row = document.createElement("div");
    row.className = "sale-item-row";
    row.innerHTML = `
      <div class="field">
        <label>Produto do estoque ou serviço</label>
        <select class="item-product-select">
          <option value="">-- Serviço / Item avulso --</option>
          ${stockProducts.map(p => `<option value="${p.id}" data-price="${Number(p.precoVenda || p.custo || 0)}" data-unit="${safe(p.unidade || "unidades")}" data-stock="${Number(p.quantidade || 0)}">${safe(p.nome)} (Disp.: ${formatQuantity(p.quantidade, p.unidade)})</option>`).join("")}
        </select>
        <input type="text" class="item-custom-name" placeholder="Nome do serviço ou produto..." style="margin-top:4px">
      </div>
      <div class="field">
        <label>Quantidade</label>
        <input type="number" class="item-qty" min="0.001" max="${MAX_STOCK_QTY}" step="any" value="1">
        <span class="field-hint item-unit-label">unidades</span>
      </div>
      <div class="field">
        <label>Valor unitário</label>
        <input type="text" class="item-price" inputmode="numeric" value="R$ 0,00">
      </div>
      <button type="button" class="tiny-button danger btn-remove-item" title="Remover item">×</button>
    `;
    container.append(row);

    const sel = row.querySelector(".item-product-select");
    const customName = row.querySelector(".item-custom-name");
    const qtyInput = row.querySelector(".item-qty");
    const priceInput = row.querySelector(".item-price");
    const unitLabel = row.querySelector(".item-unit-label");

    sel.addEventListener("change", () => {
      const opt = sel.selectedOptions[0];
      if (sel.value) {
        const prod = records("estoque").find(p => p.id === sel.value);
        customName.value = prod ? prod.nome : "";
        customName.readOnly = true;
        unitLabel.textContent = opt.dataset.unit || "unidades";
        priceInput.value = formatMoneyInputFromNumber(Number(opt.dataset.price || 0));
      } else {
        customName.value = "";
        customName.readOnly = false;
        unitLabel.textContent = "unidades";
        priceInput.value = "R$ 0,00";
      }
      recalcSaleTotal();
    });

    priceInput.addEventListener("input", () => {
      applyMoneyMask(priceInput);
      recalcSaleTotal();
    });
    qtyInput.addEventListener("input", recalcSaleTotal);
    row.querySelector(".btn-remove-item").addEventListener("click", () => {
      if (container.querySelectorAll(".sale-item-row").length > 1) {
        row.remove();
        recalcSaleTotal();
      }
    });
  }

  function recalcSaleTotal() {
    let total = 0;
    container.querySelectorAll(".sale-item-row").forEach(row => {
      const qty = Number(row.querySelector(".item-qty").value || 0);
      const unitPrice = parseMoneyInput(row.querySelector(".item-price").value);
      if (qty > 0 && unitPrice >= 0) total += qty * unitPrice;
    });
    total = Math.round(total * 100) / 100;
    dialog.querySelector("#sale-total-display").textContent = money(total);
    return total;
  }

  addItemRow();

  dialog.querySelector("#btn-add-sale-item").addEventListener("click", addItemRow);

  const paidInput = dialog.querySelector("#sale-paid-amount");
  paidInput.addEventListener("input", () => applyMoneyMask(paidInput));

  dialog.querySelector("#sale-status").addEventListener("change", e => {
    const val = e.target.value;
    dialog.querySelector("#sale-paid-wrap").style.display = val === "Parcial" ? "grid" : "none";
    dialog.querySelector("#sale-due-wrap").style.display = (val === "Parcial" || val === "Pendente") ? "grid" : "none";
  });

  dialog.querySelector("#sale-client-search").addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    const sel = dialog.querySelector("#sale-client-select");
    let firstMatch = "";
    Array.from(sel.options).forEach(opt => {
      if (!opt.value) return;
      const match = !q || opt.dataset.search.includes(q);
      opt.hidden = !match;
      if (match && !firstMatch) firstMatch = opt.value;
    });
    if (q && firstMatch) sel.value = firstMatch;
  });

  dialog.querySelector("#btn-quick-client").addEventListener("click", () => {
    openQuickClientSubDialog(newClient => {
      const sel = dialog.querySelector("#sale-client-select");
      const opt = document.createElement("option");
      opt.value = newClient.id;
      opt.dataset.search = `${newClient.nome} ${newClient.cpf || ""}`.toLowerCase();
      opt.textContent = `${newClient.nome}${newClient.cpf ? ` — CPF: ${newClient.cpf}` : ""}`;
      sel.append(opt);
      sel.value = newClient.id;
      toast(`Cliente ${newClient.nome} cadastrado e vinculado.`);
    });
  });

  dialog.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => dialog.close()));

  dialog.querySelector("#sale-form").addEventListener("submit", e => {
    e.preventDefault();
    const errorEl = dialog.querySelector("#sale-form-error");
    errorEl.textContent = "";

    const data = dialog.querySelector("#sale-date").value;
    if (!isValidDateISO(data)) {
      errorEl.textContent = "Informe uma data válida para a venda.";
      return;
    }

    const status = dialog.querySelector("#sale-status").value;
    const vencimento = dialog.querySelector("#sale-due-date").value;
    if ((status === "Parcial" || status === "Pendente") && !isValidDateISO(vencimento)) {
      errorEl.textContent = "Informe uma data de vencimento válida para o saldo a receber.";
      return;
    }

    const clientId = dialog.querySelector("#sale-client-select").value;
    const client = clients.find(c => c.id === clientId) || null;

    if ((status === "Parcial" || status === "Pendente") && !client) {
      errorEl.textContent = "Selecione ou cadastre um cliente para registrar vendas pendentes ou parcialmente pagas.";
      return;
    }

    const itens = [];
    const allowNeg = currentUser().config.permitirEstoqueNegativo;

    for (const row of container.querySelectorAll(".sale-item-row")) {
      const prodId = row.querySelector(".item-product-select").value;
      const nome = row.querySelector(".item-custom-name").value.trim();
      const qty = Number(row.querySelector(".item-qty").value);
      const unitPrice = parseMoneyInput(row.querySelector(".item-price").value);

      if (!nome) {
        errorEl.textContent = "Preencha o nome de todos os itens da venda.";
        return;
      }
      if (!Number.isFinite(qty) || qty <= 0 || qty > MAX_STOCK_QTY) {
        errorEl.textContent = `Quantidade inválida para "${nome}".`;
        return;
      }
      if (unitPrice <= 0) {
        errorEl.textContent = `O valor unitário de "${nome}" deve ser maior que R$ 0,00.`;
        return;
      }

      if (prodId) {
        const prod = records("estoque").find(p => p.id === prodId);
        if (!prod) {
          errorEl.textContent = `Produto "${nome}" não encontrado no estoque.`;
          return;
        }
        const alreadyRequested = itens.filter(i => i.produtoId === prodId).reduce((s, i) => s + i.quantidade, 0);
        if (!allowNeg && (alreadyRequested + qty) > Number(prod.quantidade || 0)) {
          errorEl.textContent = `Estoque insuficiente para "${prod.nome}". Disponível: ${formatQuantity(prod.quantidade, prod.unidade)}.`;
          return;
        }
        itens.push({
          tipo: "produto",
          produtoId: prod.id,
          nome: prod.nome,
          quantidade: qty,
          unidade: prod.unidade || "unidades",
          valorUnitario: unitPrice,
          subtotal: Math.round(qty * unitPrice * 100) / 100
        });
      } else {
        itens.push({
          tipo: "servico",
          produtoId: "",
          nome,
          quantidade: qty,
          unidade: "unidades",
          valorUnitario: unitPrice,
          subtotal: Math.round(qty * unitPrice * 100) / 100
        });
      }
    }

    const total = Math.round(itens.reduce((s, i) => s + i.subtotal, 0) * 100) / 100;
    let valorPago = total;
    if (status === "Pendente") valorPago = 0;
    if (status === "Parcial") {
      valorPago = parseMoneyInput(paidInput.value);
      if (valorPago <= 0 || valorPago >= total) {
        errorEl.textContent = "No pagamento parcial, o valor já pago deve ser maior que R$ 0,00 e menor que o total da venda.";
        return;
      }
    }

    const saleId = crypto.randomUUID();
    const saleRecord = {
      id: saleId,
      clienteId: client ? client.id : "",
      cliente: client ? client.nome : "Consumidor não identificado",
      clienteCpf: client ? (client.cpf || "") : "",
      nome: itens.map(i => i.nome).join(", "),
      itens,
      valor: total,
      valorPago,
      data,
      vencimento: status === "Pago" ? "" : vencimento,
      pagamento: dialog.querySelector("#sale-payment").value,
      status,
      responsavel: currentUser().nome,
      estoqueBaixado: false,
      criadoEm: new Date().toISOString()
    };

    // 1. Baixa de estoque sem duplicidade
    itens.forEach(item => {
      if (item.produtoId) {
        const prod = records("estoque").find(p => p.id === item.produtoId);
        if (prod) {
          logStockMovement({
            produto: prod,
            delta: -item.quantidade,
            tipo: "Saída (Venda)",
            origemId: saleId,
            origemDescricao: `Venda para ${saleRecord.cliente}`
          });
        }
      }
    });
    saleRecord.estoqueBaixado = true;

    // 2. Integração Financeira (apenas o que efetivamente entrou no caixa entra como Receita Paga)
    if (valorPago > 0) {
      records("financeiro").push({
        id: crypto.randomUUID(),
        origem: `venda:${saleId}`,
        descricao: `Venda: ${saleRecord.nome} (${saleRecord.cliente})`,
        valor: valorPago,
        categoria: "Serviço ou venda",
        tipo: "Receita",
        status: "Pago",
        data
      });
    }

    // 3. Integração com Caderneta Digital (Contas a Receber) se Pendente ou Parcial
    if (status === "Pendente" || status === "Parcial") {
      records("caderneta").push({
        id: crypto.randomUUID(),
        origemVendaId: saleId,
        clienteId: client.id,
        cliente: client.nome,
        clienteCpf: client.cpf || "",
        descricao: `Venda (${shortDate(data)}): ${saleRecord.nome}`,
        valor: total,
        pago: valorPago,
        dataVenda: data,
        vencimento
      });
    }

    records("servicos").push(saleRecord);
    persistUser();
    dialog.close();
    toast("Venda registrada com sucesso!");
    render();
  });

  dialog.showModal();
}

function cancelSale(saleId) {
  const sale = records("servicos").find(s => s.id === saleId);
  if (!sale || sale.status === "Cancelado") return;
  if (!confirm("Cancelar esta venda? O estoque será estornado e os lançamentos vinculados serão removidos.")) return;

  const normalized = normalizeSaleRecord(sale);
  if (normalized.estoqueBaixado) {
    normalized.itens.forEach(item => {
      if (item.produtoId) {
        const prod = records("estoque").find(p => p.id === item.produtoId);
        if (prod) {
          logStockMovement({
            produto: prod,
            delta: Number(item.quantidade || 0),
            tipo: "Estorno (Cancelamento)",
            origemId: sale.id,
            origemDescricao: `Cancelamento da venda de ${sale.cliente}`
          });
        }
      }
    });
    sale.estoqueBaixado = false;
  }

  const user = currentUser();
  user.financeiro = records("financeiro").filter(f => f.origem !== `venda:${sale.id}` && !String(f.origem || "").startsWith(`caderneta-venda:${sale.id}`));
  user.caderneta = records("caderneta").filter(c => c.origemVendaId !== sale.id);
  sale.status = "Cancelado";

  persistUser();
  toast("Venda cancelada e estoque estornado.");
  render();
}

function openQuickClientSubDialog(onCreated) {
  const sub = document.querySelector("#sub-dialog");
  sub.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">Cadastro rápido</p>
        <h2>Novo cliente</h2>
        <p>Cadastre o cliente sem sair da tela de venda.</p>
      </div>
      <button class="icon-button" data-sub-close aria-label="Fechar">×</button>
    </div>
    <form class="dialog-form" id="quick-client-form" novalidate>
      <div class="form-grid">
        <div class="field full">
          <label for="qc-nome">Nome completo *</label>
          <input id="qc-nome" name="nome" type="text" required>
        </div>
        <div class="field">
          <label for="qc-cpf">CPF</label>
          <input id="qc-cpf" name="cpf" type="text" inputmode="numeric" maxlength="14" placeholder="000.000.000-00">
        </div>
        <div class="field">
          <label for="qc-telefone">Telefone / Celular *</label>
          <input id="qc-telefone" name="telefone" type="tel" inputmode="numeric" maxlength="15" placeholder="(00) 00000-0000" required>
        </div>
        <div class="field">
          <label for="qc-cep">CEP</label>
          <input id="qc-cep" name="cep" type="text" inputmode="numeric" maxlength="9" placeholder="00000-000">
        </div>
        <div class="field">
          <label for="qc-estado">Estado (UF)</label>
          <select id="qc-estado" name="estado"><option value="">Selecione</option>${UF_LIST.map(uf => `<option value="${uf}">${uf}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="qc-cidade">Cidade</label>
          <input id="qc-cidade" name="cidade" type="text">
        </div>
        <div class="field">
          <label for="qc-bairro">Bairro</label>
          <input id="qc-bairro" name="bairro" type="text">
        </div>
        <div class="field">
          <label for="qc-rua">Rua ou avenida</label>
          <input id="qc-rua" name="rua" type="text">
        </div>
        <div class="field">
          <label for="qc-numero">Número</label>
          <input id="qc-numero" name="numero" type="text">
        </div>
      </div>
      <div id="qc-error" class="field-error" style="margin-top:8px"></div>
      <div class="dialog-actions">
        <button type="button" class="secondary-button" data-sub-close>Cancelar</button>
        <button type="submit" class="primary-button">Salvar e vincular</button>
      </div>
    </form>`;

  const cpfInput = sub.querySelector("#qc-cpf");
  const telInput = sub.querySelector("#qc-telefone");
  const cepInput = sub.querySelector("#qc-cep");
  cpfInput.addEventListener("input", () => { cpfInput.value = formatCPF(cpfInput.value); });
  telInput.addEventListener("input", () => { telInput.value = formatPhone(telInput.value); });
  cepInput.addEventListener("input", () => {
    cepInput.value = formatCEP(cepInput.value);
    if (onlyDigits(cepInput.value).length === 8) {
      buscarEnderecoPorCEP(cepInput.value, {
        estado: sub.querySelector("#qc-estado"),
        cidade: sub.querySelector("#qc-cidade"),
        bairro: sub.querySelector("#qc-bairro"),
        rua: sub.querySelector("#qc-rua"),
        numero: sub.querySelector("#qc-numero")
      });
    }
  });

  sub.querySelectorAll("[data-sub-close]").forEach(b => b.addEventListener("click", () => sub.close()));
  sub.querySelector("#quick-client-form").addEventListener("submit", e => {
    e.preventDefault();
    const errEl = sub.querySelector("#qc-error");
    errEl.textContent = "";
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    data.nome = String(data.nome || "").trim();
    data.cpf = formatCPF(data.cpf || "");
    data.telefone = formatPhone(data.telefone || "");
    data.cep = formatCEP(data.cep || "");

    if (!data.nome) { errEl.textContent = "Informe o nome completo do cliente."; return; }
    if (!isValidBrazilianPhone(data.telefone)) { errEl.textContent = "Informe um telefone brasileiro válido com DDD (10 ou 11 dígitos)."; return; }
    if (data.cpf) {
      if (!isValidCPF(data.cpf)) { errEl.textContent = "CPF inválido. Verifique os dígitos verificadores."; return; }
      const dup = records("clientes").some(c => onlyDigits(c.cpf) === onlyDigits(data.cpf));
      if (dup) { errEl.textContent = "Já existe um cliente cadastrado com este CPF."; return; }
    }

    const newClient = {
      id: crypto.randomUUID(),
      ...data,
      email: "",
      complemento: "",
      observacoes: ""
    };
    records("clientes").push(newClient);
    persistUser();
    sub.close();
    if (onCreated) onCreated(newClient);
  });

  sub.showModal();
}

/* ===================== CADERNETA DIGITAL (PAGAMENTOS PARCIAIS) ===================== */

function registerPayment(id) {
  const item = records("caderneta").find(record => record.id === id);
  if (!item) return;
  const remaining = Math.max(0, Math.round((Number(item.valor || 0) - Number(item.pago || 0)) * 100) / 100);
  if (remaining <= 0) return toast("Esta pendência já está quitada.");

  const sub = document.querySelector("#sub-dialog");
  sub.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">Contas a receber</p>
        <h2>Registrar pagamento</h2>
        <p>Cliente: <strong>${safe(item.cliente)}</strong> · Saldo devedor: <strong>${money(remaining)}</strong></p>
      </div>
      <button class="icon-button" data-sub-close aria-label="Fechar">×</button>
    </div>
    <form class="dialog-form" id="pay-debt-form" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="pay-amount">Valor recebido agora (R$) *</label>
          <input id="pay-amount" type="text" inputmode="numeric" value="${formatMoneyInputFromNumber(remaining)}" required>
        </div>
        <div class="field">
          <label for="pay-date">Data do recebimento *</label>
          <input id="pay-date" type="date" value="${todayISO()}" required>
        </div>
      </div>
      <div id="pay-error" class="field-error" style="margin-top:8px"></div>
      <div class="dialog-actions">
        <button type="button" class="secondary-button" data-sub-close>Cancelar</button>
        <button type="submit" class="primary-button">Confirmar recebimento</button>
      </div>
    </form>`;

  const amountInput = sub.querySelector("#pay-amount");
  amountInput.addEventListener("input", () => applyMoneyMask(amountInput));
  sub.querySelectorAll("[data-sub-close]").forEach(b => b.addEventListener("click", () => sub.close()));

  sub.querySelector("#pay-debt-form").addEventListener("submit", e => {
    e.preventDefault();
    const errEl = sub.querySelector("#pay-error");
    errEl.textContent = "";
    const payment = parseMoneyInput(amountInput.value);
    const payDate = sub.querySelector("#pay-date").value;

    if (!isValidDateISO(payDate)) { errEl.textContent = "Informe uma data válida."; return; }
    if (payment <= 0 || payment > remaining) {
      errEl.textContent = `O valor deve ser maior que R$ 0,00 e até ${money(remaining)}.`;
      return;
    }

    item.pago = Math.round((Number(item.pago || 0) + payment) * 100) / 100;
    const isPaidOff = item.pago >= Number(item.valor || 0);
    if (isPaidOff) item.pago = Number(item.valor || 0);

    // Sincroniza venda vinculada, se houver
    if (item.origemVendaId) {
      const sale = records("servicos").find(s => s.id === item.origemVendaId);
      if (sale) {
        sale.valorPago = item.pago;
        sale.status = isPaidOff ? "Pago" : "Parcial";
      }
    }

    // Registra exatamente o valor recebido hoje no caixa financeiro sem duplicar
    records("financeiro").push({
      id: crypto.randomUUID(),
      origem: item.origemVendaId ? `caderneta-venda:${item.origemVendaId}:${crypto.randomUUID()}` : `caderneta:${id}:${crypto.randomUUID()}`,
      descricao: `Recebimento (${item.cliente}): ${item.descricao}`,
      valor: payment,
      categoria: "Recebimento de cliente",
      tipo: "Receita",
      status: "Pago",
      data: payDate
    });

    persistUser();
    sub.close();
    toast(isPaidOff ? "Dívida quitada e atualizada no financeiro!" : "Pagamento parcial registrado!");
    render();
  });

  sub.showModal();
}

/* ===================== MÓDULO DE NOTAS FISCAIS (NF-e / NFC-e / NFS-e) ===================== */

function isFiscalReady(fc) {
  return Boolean(
    fc.razaoSocial &&
    isValidCNPJ(fc.cnpj) &&
    fc.regimeTributario &&
    fc.estado &&
    fc.cidade &&
    fc.rua &&
    fc.numero
  );
}

function renderFiscalModule() {
  const user = currentUser();
  const fc = user.fiscalConfig;
  const ready = isFiscalReady(fc);
  const hasProvider = Boolean(fc.provedor && fc.certificadoStatus === "Configurado" && fc.tokenIntegracao);
  const allDocs = [...records("notasFiscais")].sort((a, b) => String(b.criadoEm || "").localeCompare(String(a.criadoEm || "")));
  const emitidas = allDocs.filter(n => n.status !== "Cancelada");
  const canceladas = allDocs.filter(n => n.status === "Cancelada");

  return `${pageHeading("Documentos Fiscais Eletrônicos", "Notas Fiscais", "Estrutura para NF-e (Produtos), NFC-e (Consumidor) e NFS-e (Serviços) integrada às vendas.", "Nova pré-nota / documento", "new-nf")}
    <div class="fiscal-banner ${ready && hasProvider ? "ready" : ""}">
      <div>
        <strong>${ready && hasProvider ? "Ambiente fiscal configurado" : "Preparação fiscal e emissão oficial"}</strong>
        <p style="margin:6px 0 0;font-size:11px;line-height:1.55">
          ${!ready
            ? "Cadastre os dados fiscais completos do emitente (Razão Social, CNPJ válido, Regime Tributário e Endereço) na aba <strong>Dados Fiscais da Empresa</strong>."
            : !hasProvider
              ? "Dados do emitente preenchidos. Como não há certificado digital A1/A3 e provedor fiscal autorizado (SEFAZ/Prefeitura) conectados, os documentos gerados operam em <strong>modo de pré-visualização e rascunho interno sem validade fiscal</strong>."
              : "Emitente e credenciais do provedor configurados. Pronto para envio via API fiscal autorizada."}
        </p>
      </div>
      <button class="secondary-button" data-nf-tab="config">Configurar dados fiscais</button>
    </div>

    <div class="tabs-bar">
      <button class="tab-btn ${nfTab === "emitidas" ? "active" : ""}" data-nf-tab="emitidas">Documentos gerados (${emitidas.length})</button>
      <button class="tab-btn ${nfTab === "canceladas" ? "active" : ""}" data-nf-tab="canceladas">Cancelados (${canceladas.length})</button>
      <button class="tab-btn ${nfTab === "config" ? "active" : ""}" data-nf-tab="config">Dados Fiscais da Empresa</button>
    </div>

    ${nfTab === "config" ? renderFiscalConfigForm(fc) : renderFiscalList(nfTab === "canceladas" ? canceladas : emitidas)}`;
}

function renderFiscalList(list) {
  return `
    <div class="toolbar">
      <input class="search-input" id="nf-search" type="search" placeholder="⌕  Buscar por nº, cliente ou CPF/CNPJ...">
      <input type="date" id="nf-date-from" title="De">
      <input type="date" id="nf-date-to" title="Até">
      <span class="toolbar-spacer"></span>
      <span class="muted" style="font-size:10px" id="nf-count">${list.length} documento(s)</span>
    </div>
    <section class="panel">
      ${list.length ? `<div class="table-wrap"><table class="data-table" id="nf-table">
        <thead>
          <tr>
            <th>Nº Interno</th>
            <th>Modelo</th>
            <th>Data</th>
            <th>Destinatário / CPF-CNPJ</th>
            <th>Venda vinculada</th>
            <th>Valor total</th>
            <th>Status fiscal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(nf => {
            const blob = safe([nf.numeroInterno, nf.modelo, nf.destinatarioNome, nf.destinatarioDoc].join(" ").toLowerCase());
            return `<tr data-search="${blob}" data-date="${safe(nf.dataEmissao)}">
              <td><strong>#${safe(nf.numeroInterno)}</strong></td>
              <td><span class="status confirmado">${safe(nf.modelo)}</span></td>
              <td>${shortDate(nf.dataEmissao)}</td>
              <td>
                <strong>${safe(nf.destinatarioNome || "Consumidor Final")}</strong>
                ${nf.destinatarioDoc ? `<div class="muted" style="font-size:10px">${safe(nf.destinatarioDoc)}</div>` : ""}
              </td>
              <td class="muted">${nf.vendaId ? `Venda #${safe(nf.vendaId.slice(0, 8))}` : "Avulsa"}</td>
              <td><strong>${money(nf.valorTotal)}</strong></td>
              <td><span class="status ${nf.status === "Cancelada" ? "cancelado" : "rascunho"}">${safe(nf.status)}</span></td>
              <td>
                <div class="row-actions">
                  <button class="tiny-button" data-action="preview-nf:${nf.id}">Visualizar / Baixar</button>
                  ${nf.status !== "Cancelada" ? `<button class="tiny-button danger" data-action="cancel-nf:${nf.id}">Cancelar</button>` : ""}
                </div>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>` : `<div class="empty-state"><strong>Nenhum documento fiscal nesta lista</strong>Gere uma pré-nota a partir de uma venda registrada para conferir os dados e baixar a pré-visualização.</div>`}
    </section>`;
}

function renderFiscalConfigForm(fc) {
  return `
    <section class="panel" style="padding:20px">
      <form id="fiscal-config-form" novalidate>
        <h2 style="font:700 15px Manrope,sans-serif;margin-bottom:4px">Cadastro Fiscal do Emitente</h2>
        <p class="subheading" style="margin-bottom:16px">Dados obrigatórios para preparação de NF-e (SEFAZ), NFC-e (Varejo) e NFS-e (Prefeitura).</p>
        <div class="form-grid">
          <div class="field">
            <label for="fc-razao">Razão Social *</label>
            <input id="fc-razao" name="razaoSocial" value="${safe(fc.razaoSocial)}" required>
          </div>
          <div class="field">
            <label for="fc-fantasia">Nome Fantasia</label>
            <input id="fc-fantasia" name="nomeFantasia" value="${safe(fc.nomeFantasia)}">
          </div>
          <div class="field">
            <label for="fc-cnpj">CNPJ *</label>
            <input id="fc-cnpj" name="cnpj" inputmode="numeric" maxlength="18" value="${safe(fc.cnpj)}" placeholder="00.000.000/0000-00" required>
          </div>
          <div class="field">
            <label for="fc-regime">Regime Tributário *</label>
            <select id="fc-regime" name="regimeTributario">
              ${["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"].map(r => `<option ${fc.regimeTributario === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="fc-ie">Inscrição Estadual (IE — NF-e / NFC-e)</label>
            <input id="fc-ie" name="ie" value="${safe(fc.ie)}" placeholder="Isento ou número da IE">
          </div>
          <div class="field">
            <label for="fc-im">Inscrição Municipal (IM — NFS-e)</label>
            <input id="fc-im" name="im" value="${safe(fc.im)}" placeholder="Número da IM na prefeitura">
          </div>
          <div class="field">
            <label for="fc-cep">CEP *</label>
            <input id="fc-cep" name="cep" inputmode="numeric" maxlength="9" value="${safe(fc.cep)}" placeholder="00000-000">
          </div>
          <div class="field">
            <label for="fc-estado">Estado (UF) *</label>
            <select id="fc-estado" name="estado"><option value="">Selecione</option>${UF_LIST.map(uf => `<option value="${uf}" ${fc.estado === uf ? "selected" : ""}>${uf}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="fc-cidade">Cidade *</label>
            <input id="fc-cidade" name="cidade" value="${safe(fc.cidade)}">
          </div>
          <div class="field">
            <label for="fc-bairro">Bairro *</label>
            <input id="fc-bairro" name="bairro" value="${safe(fc.bairro)}">
          </div>
          <div class="field">
            <label for="fc-rua">Rua / Avenida *</label>
            <input id="fc-rua" name="rua" value="${safe(fc.rua)}">
          </div>
          <div class="field">
            <label for="fc-numero">Número *</label>
            <input id="fc-numero" name="numero" value="${safe(fc.numero)}">
          </div>
          <div class="field full">
            <label for="fc-complemento">Complemento</label>
            <input id="fc-complemento" name="complemento" value="${safe(fc.complemento)}">
          </div>

          <div class="field full" style="margin-top:8px;padding-top:12px;border-top:1px solid var(--line)">
            <strong style="font-size:12px">Integração com Provedor Fiscal Autorizado (SEFAZ / Prefeitura)</strong>
            <span class="field-hint">Para transmissão oficial com validade jurídica, conecte um provedor fiscal homologado (ex.: Focus NFe, eNotas, Nuvem Fiscal, Webmania) e certificado digital A1.</span>
          </div>
          <div class="field">
            <label for="fc-provedor">Provedor Fiscal</label>
            <select id="fc-provedor" name="provedor">
              <option value="">Nenhum provedor conectado (Somente rascunho)</option>
              ${["Focus NFe", "Nuvem Fiscal", "eNotas", "Webmania", "Outro Provedor REST"].map(p => `<option value="${p}" ${fc.provedor === p ? "selected" : ""}>${p}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="fc-cert">Certificado Digital A1</label>
            <select id="fc-cert" name="certificadoStatus">
              <option value="Não configurado" ${fc.certificadoStatus === "Não configurado" ? "selected" : ""}>Não configurado</option>
              <option value="Configurado" ${fc.certificadoStatus === "Configurado" ? "selected" : ""}>Configurado no provedor</option>
            </select>
          </div>
          <div class="field">
            <label for="fc-ambiente">Ambiente</label>
            <select id="fc-ambiente" name="ambiente">
              <option value="Homologação" ${fc.ambiente === "Homologação" ? "selected" : ""}>Homologação (Testes)</option>
              <option value="Produção" ${fc.ambiente === "Produção" ? "selected" : ""}>Produção (Validade Jurídica)</option>
            </select>
          </div>
          <div class="field">
            <label for="fc-token">Chave / Token API do Provedor</label>
            <input id="fc-token" name="tokenIntegracao" type="password" value="${safe(fc.tokenIntegracao)}" placeholder="Opcional até contratar provedor">
          </div>
        </div>
        <div id="fc-error" class="field-error" style="margin-top:10px"></div>
        <div class="dialog-actions">
          <button type="submit" class="primary-button">Salvar configurações fiscais</button>
        </div>
      </form>
    </section>`;
}

function openNewFiscalDialog(preselectedSaleId = "") {
  const dialog = document.querySelector("#record-dialog");
  const sales = records("servicos").filter(s => s.status !== "Cancelado").map(normalizeSaleRecord);

  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">Preparação de Documento Fiscal</p>
        <h2>Gerar pré-nota a partir de venda</h2>
        <p>Selecione o modelo fiscal adequado (NF-e, NFC-e ou NFS-e) e vincule a venda.</p>
      </div>
      <button class="icon-button" data-close aria-label="Fechar">×</button>
    </div>
    <form class="dialog-form" id="nf-create-form" novalidate>
      <div class="form-grid">
        <div class="field full">
          <label for="nf-sale-select">Venda vinculada *</label>
          <select id="nf-sale-select" name="vendaId" required>
            <option value="">Selecione uma venda registrada...</option>
            ${sales.map(s => `<option value="${s.id}" ${s.id === preselectedSaleId ? "selected" : ""}>${shortDate(s.data)} · ${safe(s.cliente)} · ${money(s.valor)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="nf-modelo">Modelo de Documento Fiscal *</label>
          <select id="nf-modelo" name="modelo" required>
            <option value="NFC-e (Modelo 65)">NFC-e (Modelo 65) — Venda ao consumidor final</option>
            <option value="NF-e (Modelo 55)">NF-e (Modelo 55) — Circulação de mercadorias / B2B</option>
            <option value="NFS-e (Serviços)">NFS-e — Prestação de serviços (Prefeitura)</option>
          </select>
        </div>
        <div class="field">
          <label for="nf-cfop">CFOP / Código de Serviço</label>
          <input id="nf-cfop" name="codigoFiscal" value="5102" placeholder="Ex.: 5102 (Venda) ou LC 116">
        </div>
        <div class="field">
          <label for="nf-desconto">Desconto (R$)</label>
          <input id="nf-desconto" name="desconto" type="text" inputmode="numeric" value="R$ 0,00">
        </div>
        <div class="field">
          <label for="nf-natureza">Natureza da operação *</label>
          <input id="nf-natureza" name="naturezaOperacao" value="Venda de mercadoria adquirida ou recebida de terceiros" required>
        </div>
        <div class="field full">
          <label for="nf-obs">Informações complementares</label>
          <textarea id="nf-obs" name="observacoes" placeholder="Observações adicionais do documento..."></textarea>
        </div>
      </div>
      <div id="nf-model-rules" class="note-box" style="margin-top:12px">
        <strong>Regras do modelo selecionado:</strong>
        <p id="nf-rule-text">NFC-e (Modelo 65): destinada ao consumidor final presencial ou entrega em domicílio. Dispensa endereço completo do destinatário se valor abaixo do limite estadual, mas exige CPF quando solicitado.</p>
      </div>
      <div id="nf-create-error" class="field-error" style="margin-top:8px"></div>
      <div class="dialog-actions">
        <button type="button" class="secondary-button" data-close>Cancelar</button>
        <button type="submit" class="primary-button">Gerar pré-visualização fiscal</button>
      </div>
    </form>`;

  const descInput = dialog.querySelector("#nf-desconto");
  descInput.addEventListener("input", () => applyMoneyMask(descInput));

  const modeloSel = dialog.querySelector("#nf-modelo");
  const ruleText = dialog.querySelector("#nf-rule-text");
  const cfopInput = dialog.querySelector("#nf-cfop");
  const natInput = dialog.querySelector("#nf-natureza");

  modeloSel.addEventListener("change", () => {
    const m = modeloSel.value;
    if (m.startsWith("NF-e")) {
      ruleText.textContent = "NF-e (Modelo 55): exige Inscrição Estadual do emitente, NCM dos produtos, CFOP e identificação completa do destinatário (CPF/CNPJ e endereço completo).";
      cfopInput.value = "5102";
      natInput.value = "Venda de mercadoria";
    } else if (m.startsWith("NFS-e")) {
      ruleText.textContent = "NFS-e: exige Inscrição Municipal (IM), Código de Tributação Nacional / Lista de Serviços (LC 116/2003) e alíquota de ISS conforme município.";
      cfopInput.value = "14.01";
      natInput.value = "Prestação de serviços";
    } else {
      ruleText.textContent = "NFC-e (Modelo 65): destinada ao consumidor final. Exige CSC (Código de Segurança do Contribuinte) na SEFAZ e NCM nos produtos.";
      cfopInput.value = "5102";
      natInput.value = "Venda ao consumidor final";
    }
  });

  dialog.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => dialog.close()));

  dialog.querySelector("#nf-create-form").addEventListener("submit", e => {
    e.preventDefault();
    const errEl = dialog.querySelector("#nf-create-error");
    errEl.textContent = "";

    const saleId = dialog.querySelector("#nf-sale-select").value;
    const saleRaw = records("servicos").find(s => s.id === saleId);
    if (!saleRaw) {
      errEl.textContent = "Selecione uma venda válida para vincular ao documento.";
      return;
    }
    const sale = normalizeSaleRecord(saleRaw);
    const modelo = modeloSel.value;
    const client = records("clientes").find(c => c.id === sale.clienteId) || null;

    if (modelo.startsWith("NF-e") && (!client || !client.cpf || !client.cidade || !client.estado)) {
      errEl.textContent = "Para NF-e (Modelo 55), o cliente vinculado deve possuir CPF e endereço (Cidade/UF) cadastrados.";
      return;
    }

    const desconto = parseMoneyInput(descInput.value);
    if (desconto >= sale.valor) {
      errEl.textContent = "O desconto não pode ser maior ou igual ao valor total da venda.";
      return;
    }

    const nextNumber = String(records("notasFiscais").length + 1).padStart(6, "0");
    const fc = currentUser().fiscalConfig;

    const nfDoc = {
      id: crypto.randomUUID(),
      numeroInterno: nextNumber,
      modelo,
      codigoFiscal: dialog.querySelector("#nf-cfop").value.trim(),
      naturezaOperacao: dialog.querySelector("#nf-natureza").value.trim(),
      observacoes: dialog.querySelector("#nf-obs").value.trim(),
      vendaId: sale.id,
      dataEmissao: todayISO(),
      criadoEm: new Date().toISOString(),
      emitente: { ...fc },
      destinatarioNome: client ? client.nome : sale.cliente,
      destinatarioDoc: client ? (client.cpf || "") : (sale.clienteCpf || ""),
      destinatarioEndereco: client ? formatClientAddress(client) : "Não informado",
      itens: sale.itens,
      valorProdutos: sale.valor,
      desconto,
      valorTotal: Math.round((sale.valor - desconto) * 100) / 100,
      pagamento: sale.pagamento,
      status: "Rascunho (Sem validade fiscal)",
      chaveAcesso: null,
      protocoloAutorizacao: null,
      historico: [
        { dataHora: new Date().toLocaleString("pt-BR"), evento: "Pré-nota gerada internamente sem transmissão SEFAZ/Prefeitura." }
      ]
    };

    records("notasFiscais").push(nfDoc);
    persistUser();
    dialog.close();
    toast("Pré-visualização fiscal gerada.");
    previewFiscalDoc(nfDoc.id);
  });

  dialog.showModal();
}

function previewFiscalDoc(nfId) {
  const nf = records("notasFiscais").find(n => n.id === nfId);
  if (!nf) return;
  const dialog = document.querySelector("#record-dialog");

  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">${safe(nf.modelo)}</p>
        <h2>Documento Interno #${safe(nf.numeroInterno)}</h2>
        <p>Status: <strong>${safe(nf.status)}</strong></p>
      </div>
      <button class="icon-button" data-close aria-label="Fechar">×</button>
    </div>
    <div class="dialog-form">
      <div class="danfe-preview" id="printable-danfe">
        <div class="danfe-watermark">
          DOCUMENTO AUXILIAR INTERNO — SEM VALIDADE FISCAL (NÃO TRANSMITIDO À SEFAZ / PREFEITURA)
        </div>
        <div class="danfe-grid">
          <div class="danfe-box">
            <h4>Emitente</h4>
            <strong>${safe(nf.emitente?.razaoSocial || currentUser().nome)}</strong><br>
            CNPJ: ${safe(nf.emitente?.cnpj || "Não cadastrado")}<br>
            IE: ${safe(nf.emitente?.ie || "—")} · IM: ${safe(nf.emitente?.im || "—")}<br>
            Regime: ${safe(nf.emitente?.regimeTributario || "—")}
          </div>
          <div class="danfe-box">
            <h4>Identificação do Documento</h4>
            Modelo: <strong>${safe(nf.modelo)}</strong><br>
            Número Interno: #${safe(nf.numeroInterno)} · Data: ${shortDate(nf.dataEmissao)}<br>
            Natureza: ${safe(nf.naturezaOperacao)}<br>
            Protocolo SEFAZ: <em>Aguardando integração com provedor fiscal</em>
          </div>
          <div class="danfe-box" style="grid-column:1/-1">
            <h4>Destinatário / Tomador</h4>
            <strong>${safe(nf.destinatarioNome || "Consumidor não identificado")}</strong> · CPF/CNPJ: ${safe(nf.destinatarioDoc || "Não informado")}<br>
            Endereço: ${safe(nf.destinatarioEndereco || "Não informado")}
          </div>
        </div>
        <table class="data-table" style="border:1px solid var(--line);margin-bottom:12px">
          <thead>
            <tr><th>Item / Descrição</th><th>CFOP/Cód.</th><th>Qtd.</th><th>Unitário</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${nf.itens.map(i => `<tr>
              <td>${safe(i.nome)}</td>
              <td>${safe(nf.codigoFiscal || "—")}</td>
              <td>${formatQuantity(i.quantidade, i.unidade)}</td>
              <td>${money(i.valorUnitario)}</td>
              <td><strong>${money(i.subtotal)}</strong></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:10px;background:#f6f7f2;border-radius:5px">
          <div>Forma de Pagamento: <strong>${safe(nf.pagamento)}</strong></div>
          <div>Produtos/Serviços: <strong>${money(nf.valorProdutos)}</strong> · Desconto: <strong>${money(nf.desconto)}</strong> · Total: <strong>${money(nf.valorTotal)}</strong></div>
        </div>
        <div style="margin-top:12px">
          <strong style="font-size:10px;text-transform:uppercase;color:var(--muted)">Histórico de operações</strong>
          ${(nf.historico || []).map(h => `<div style="font-size:10px;color:var(--muted);margin-top:4px">• ${safe(h.dataHora)} — ${safe(h.evento)}</div>`).join("")}
        </div>
      </div>
      <div class="dialog-actions">
        <button type="button" class="secondary-button" id="btn-download-nf-html">Baixar espelho (HTML)</button>
        <button type="button" class="primary-button" data-close>Fechar</button>
      </div>
    </div>`;

  dialog.querySelector("#btn-download-nf-html").addEventListener("click", () => {
    const content = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Pré-Nota #${nf.numeroInterno}</title><style>body{font-family:sans-serif;padding:24px;color:#1d2924}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #ccc;padding:8px;text-align:left}.warn{padding:10px;border:2px dashed #c65e54;background:#f9e9e6;color:#9e453d;font-weight:bold;text-align:center;margin-bottom:16px}</style></head><body>${dialog.querySelector("#printable-danfe").innerHTML}</body></html>`;
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pre-nota-${nf.numeroInterno}.html`;
    a.click();
    URL.revokeObjectURL(url);
  });

  dialog.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => dialog.close()));
  dialog.showModal();
}

function cancelFiscalDoc(nfId) {
  const nf = records("notasFiscais").find(n => n.id === nfId);
  if (!nf || nf.status === "Cancelada") return;
  if (!confirm("Cancelar este documento interno?")) return;
  nf.status = "Cancelada";
  nf.historico = nf.historico || [];
  nf.historico.push({ dataHora: new Date().toLocaleString("pt-BR"), evento: "Documento interno cancelado pelo usuário." });
  persistUser();
  toast("Documento cancelado.");
  render();
}

/* ===================== RELATÓRIOS FINANCEIROS ===================== */

function renderReports() {
  const allTotals = financeTotals();
  const monthTotals = financeTotals(monthTransactions());
  const cad = getCadernetaMetrics();
  const pendingFinanceAll = records("financeiro")
    .filter(i => i.tipo === "Receita" && i.status === "Pendente" && !String(i.origem || "").startsWith("venda:"))
    .reduce((s, i) => s + Number(i.valor || 0), 0);
  const totalAReceber = cad.totalReceivable + pendingFinanceAll;

  const debtors = records("caderneta").filter(item => Number(item.valor || 0) > Number(item.pago || 0));

  const itemCounts = new Map();
  records("servicos").filter(s => s.status !== "Cancelado").map(normalizeSaleRecord).forEach(sale => {
    sale.itens.forEach(item => {
      const prev = itemCounts.get(item.nome) || { count: 0, revenue: 0 };
      itemCounts.set(item.nome, {
        count: prev.count + Number(item.quantidade || 1),
        revenue: prev.revenue + Number(item.subtotal || 0)
      });
    });
  });
  const topServices = [...itemCounts.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);

  return `${pageHeading("Números do negócio", "Relatórios", "Visão real e separada entre valores já recebidos no caixa e valores a receber.")}
    <div class="report-grid">
      <section class="report-box">
        <h2>Resumo deste mês (Caixa Real)</h2>
        ${reportLine("Receitas recebidas (pagas)", money(monthTotals.income), "positive")}
        ${reportLine("Despesas pagas", money(monthTotals.expense), "negative")}
        ${reportLine("Resultado realizado no mês", money(monthTotals.result), monthTotals.result >= 0 ? "positive" : "negative")}
        ${reportLine("A receber (saldo pendente total)", money(totalAReceber), "receivable", "highlight-amber")}
        ${cad.overdueReceivable > 0 ? reportLine("Contas vencidas (inadimplência)", money(cad.overdueReceivable), "negative", "highlight-red") : ""}
      </section>

      <section class="report-box">
        <h2>Acumulado registrado</h2>
        ${reportLine("Total de receitas recebidas", money(allTotals.income), "positive")}
        ${reportLine("Total de despesas pagas", money(allTotals.expense), "negative")}
        ${reportLine("Resultado acumulado em caixa", money(allTotals.result), allTotals.result >= 0 ? "positive" : "negative")}
        ${reportLine("Total em aberto a receber", money(totalAReceber), "receivable", "highlight-amber")}
        ${reportLine("Clientes cadastrados", records("clientes").length)}
      </section>

      <section class="report-box">
        <h2>Produtos e serviços mais vendidos</h2>
        ${topServices.length ? topServices.map(([name, info]) => reportLine(
          `${safe(name)} (${info.count.toLocaleString("pt-BR")}x)`,
          money(info.revenue),
          "positive"
        )).join("") : `<p class="muted" style="font-size:11px">Os itens vendidos aparecerão aqui após as primeiras vendas.</p>`}
      </section>

      <section class="report-box">
        <h2>Clientes com valores pendentes</h2>
        ${debtors.length ? debtors.map(item => {
          const rest = Math.max(0, Number(item.valor || 0) - Number(item.pago || 0));
          const overdue = item.vencimento && item.vencimento < todayISO();
          return reportLine(
            `${safe(item.cliente || "Sem cliente")} ${overdue ? "(Vencido)" : ""}`,
            money(rest),
            overdue ? "negative" : "receivable",
            overdue ? "highlight-red" : "highlight-amber"
          );
        }).join("") : `<p class="muted" style="font-size:11px">Nenhum valor pendente na caderneta.</p>`}
      </section>
    </div>`;
}

function reportLine(label, value, style = "", rowClass = "") {
  return `<div class="report-line ${rowClass}"><span>${label}</span><strong class="${style}">${value}</strong></div>`;
}

/* ===================== CONFIGURAÇÕES & FOTO DE PERFIL ===================== */

function renderSettings() {
  const user = currentUser();
  return `${pageHeading("Preferências da conta", "Configurações", "Atualize sua foto de perfil, dados pessoais e credenciais de acesso.")}
    <div class="settings-layout">
      <section class="panel">
        <form class="settings-form" id="settings-form" novalidate>
          <div class="profile-photo-box">
            <div id="settings-avatar-preview">${renderUserAvatar(user, true)}</div>
            <div>
              <strong style="font-size:13px;display:block">Foto de perfil</strong>
              <span class="muted" style="font-size:11px;display:block;margin-top:2px">JPG, PNG ou WebP (redimensionada automaticamente).</span>
              <div class="photo-actions">
                <label class="secondary-button" style="cursor:pointer;min-height:32px;font-size:11px">
                  ${user.fotoPerfil ? "Alterar foto" : "Enviar foto"}
                  <input type="file" id="profile-photo-input" accept="image/*" hidden>
                </label>
                ${user.fotoPerfil ? `<button type="button" class="danger-button" id="btn-remove-photo" style="min-height:32px;font-size:11px">Remover foto</button>` : ""}
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="field full">
              <label for="settings-name">Nome completo *</label>
              <input id="settings-name" name="nome" value="${safe(user.nome)}" required>
            </div>
            <div class="field">
              <label for="settings-email">E-mail *</label>
              <input id="settings-email" name="email" type="email" value="${safe(user.email)}" required>
            </div>
            <div class="field">
              <label for="settings-profession">Profissão ou área</label>
              <input id="settings-profession" name="profissao" value="${safe(user.profissao || "")}">
            </div>
            <div class="field">
              <label for="settings-password">Nova senha</label>
              <input id="settings-password" name="senha" type="password" minlength="6" autocomplete="new-password" placeholder="Deixe em branco para manter">
            </div>
            <div class="field">
              <label for="settings-confirm-password">Confirmar nova senha</label>
              <input id="settings-confirm-password" name="confirmacao" type="password" minlength="6" autocomplete="new-password" placeholder="Repita a nova senha">
            </div>
          </div>
          <div class="dialog-actions">
            <button class="primary-button" type="submit">Salvar alterações</button>
          </div>
        </form>
      </section>
      <aside class="note-box">
        <strong>Sobre seus dados e armazenamento</strong>
        <p>Os dados e a foto de perfil ficam vinculados exclusivamente à sua conta neste navegador (LocalStorage). Para sincronização em nuvem entre vários dispositivos, é necessário conectar um servidor backend.</p>
        <button class="danger-button" data-action="clear-data" style="margin-top:13px">Apagar meus dados</button>
      </aside>
    </div>`;
}

function processProfileImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const size = 180;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ===================== AUTENTICAÇÃO ===================== */

function renderAuth(mode, error = "") {
  const signup = mode === "signup";
  document.querySelector("#app").innerHTML = `
    <div class="auth-screen">
      <section class="auth-story">
        <div class="brand">
          <div class="brand-mark">${brandLogoSVG()}</div>
          <div>
            <div class="brand-name">gestor fácil</div>
            <div class="brand-note">Sua profissão, seu negócio.</div>
          </div>
        </div>
        <div class="story-copy">
          <span class="story-kicker">Gestão simples, vida mais leve</span>
          <h1>Seu trabalho merece uma rotina organizada.</h1>
          <p>Reúna clientes, vendas, estoque, contas a receber e documentos em um só lugar. Do seu jeito, no seu ritmo.</p>
          <div class="story-stats">
            <div><strong>Mais clareza</strong><span>no dia a dia do negócio</span></div>
            <div><strong>Tudo integrado</strong><span>vendas, estoque e caixa</span></div>
          </div>
        </div>
        <div class="auth-foot">GESTOR FÁCIL · ${new Date().getFullYear()}</div>
      </section>
      <section class="auth-panel">
        <div class="auth-box">
          <p class="eyebrow">${signup ? "Comece por aqui" : "Que bom ter você de volta"}</p>
          <h2>${signup ? "Crie seu espaço" : "Acesse sua conta"}</h2>
          <p>${signup ? "Seus dados ficam organizados e separados por conta." : "Entre para cuidar do seu negócio."}</p>
          ${error ? `<div class="auth-error">${safe(error)}</div>` : ""}
          <form id="auth-form" data-mode="${mode}">
            ${signup ? `<div class="field"><label for="auth-name">Nome completo</label><input id="auth-name" name="nome" autocomplete="name" required></div>` : ""}
            <div class="field"><label for="auth-email">E-mail</label><input id="auth-email" name="email" type="email" autocomplete="email" required></div>
            <div class="field"><label for="auth-password">Senha</label><input id="auth-password" name="senha" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required></div>
            ${signup ? `<div class="field"><label for="auth-confirm-password">Confirmar senha</label><input id="auth-confirm-password" name="confirmacao" type="password" autocomplete="new-password" minlength="6" required></div>` : ""}
            ${signup ? `<div class="field"><label for="auth-profession">Profissão ou área de atuação</label><input id="auth-profession" name="profissao" placeholder="Ex.: manicure, confeiteiro, oficina..." required></div>` : ""}
            <button class="primary-button" type="submit">${signup ? "Criar minha conta" : "Entrar"} <span>→</span></button>
          </form>
          <p class="auth-switch">${signup ? "Já tem uma conta?" : "Ainda não tem uma conta?"} <button type="button" data-action="auth-switch">${signup ? "Fazer login" : "Criar conta"}</button></p>
        </div>
      </section>
    </div>`;
  document.querySelector("#auth-form").addEventListener("submit", handleAuth);
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
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("senha") || "");
  const mode = event.currentTarget.dataset.mode;
  if (mode === "signup") {
    if (password !== form.get("confirmacao")) return renderAuth(mode, "As senhas não coincidem.");
    if (state.users[email]) return renderAuth(mode, "Já existe uma conta com este e-mail.");
    const salt = crypto.randomUUID();
    state.users[email] = ensureUserSchema({
      email,
      nome: String(form.get("nome") || "").trim(),
      profissao: String(form.get("profissao") || "").trim(),
      fotoPerfil: "",
      salt,
      passwordHash: await passwordDigest(password, salt)
    });
  } else {
    const user = state.users[email];
    if (!user || user.passwordHash !== await passwordDigest(password, user.salt)) {
      return renderAuth(mode, "E-mail ou senha não conferem.");
    }
  }
  state.current = email;
  saveStore();
  activeView = "dashboard";
  render();
}

/* ===================== FORMULÁRIOS MODAIS GENÉRICOS & VALIDAÇÕES ===================== */

function openRecordDialog(key, id = null) {
  if (key === "servicos") return openSaleDialog();

  const dialog = document.querySelector("#record-dialog");
  const existing = id ? records(key).find(record => record.id === id) : null;
  editingId = id;
  const fields = FIELDS[key].map(([name, label, type, required = false, options = [], full = false]) =>
    renderField(name, label, type, required, options, full, existing?.[name] ?? defaultValue(name, type))
  ).join("");

  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">${TABLES[key].kicker}</p>
        <h2>${existing ? "Editar registro" : TABLES[key].action}</h2>
        <p>Os campos com * são obrigatórios.</p>
      </div>
      <button class="icon-button" data-close aria-label="Fechar">×</button>
    </div>
    <form class="dialog-form" id="record-form" data-key="${key}" novalidate>
      <div class="form-grid">${fields}</div>
      <div id="record-form-error" class="field-error" style="margin-top:10px"></div>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-close>Cancelar</button>
        <button class="primary-button" type="submit">${existing ? "Salvar alterações" : "Salvar registro"}</button>
      </div>
    </form>`;

  dialog.querySelectorAll('input[data-mask="money"]').forEach(inp => {
    inp.addEventListener("input", () => applyMoneyMask(inp));
  });
  dialog.querySelectorAll('input[data-mask="phone"]').forEach(inp => {
    inp.addEventListener("input", () => { inp.value = formatPhone(inp.value); });
  });
  dialog.querySelectorAll('input[data-mask="cpf"]').forEach(inp => {
    inp.addEventListener("input", () => { inp.value = formatCPF(inp.value); });
  });
  dialog.querySelectorAll('input[data-mask="cep"]').forEach(inp => {
    inp.addEventListener("input", () => {
      inp.value = formatCEP(inp.value);
      if (key === "clientes" && onlyDigits(inp.value).length === 8) {
        buscarEnderecoPorCEP(inp.value, {
          estado: dialog.querySelector("#field-estado"),
          cidade: dialog.querySelector("#field-cidade"),
          bairro: dialog.querySelector("#field-bairro"),
          rua: dialog.querySelector("#field-rua"),
          numero: dialog.querySelector("#field-numero")
        });
      }
    });
  });

  if (key === "estoque") {
    const unitSel = dialog.querySelector("#field-unidade");
    const qtyInp = dialog.querySelector("#field-quantidade");
    const minInp = dialog.querySelector("#field-minimo");
    const syncStep = () => {
      const isDec = DECIMAL_UNITS.has(unitSel.value);
      qtyInp.step = isDec ? "0.001" : "1";
      minInp.step = isDec ? "0.001" : "1";
    };
    unitSel.addEventListener("change", syncStep);
    syncStep();
  }

  dialog.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => dialog.close()));
  dialog.querySelector("#record-form").addEventListener("submit", saveRecord);
  dialog.showModal();
}

function defaultValue(name, type) {
  if (name === "data" || name === "vencimento") return todayISO();
  if (name === "horario") return "09:00";
  if (type === "money") return "R$ 0,00";
  if (type === "qty") return "0";
  if (name === "unidade") return "unidades";
  if (name === "status") return "Pago";
  return "";
}

function renderField(name, label, type, required, options, full, value) {
  const id = `field-${name}`;
  const req = required ? "required" : "";
  let control;

  if (type === "select") {
    control = `<select id="${id}" name="${name}" ${req}>${options.map(option => `<option value="${safe(option)}" ${value === option ? "selected" : ""}>${safe(option || "Selecione...")}</option>`).join("")}</select>`;
  } else if (type === "client") {
    control = `<select id="${id}" name="${name}" ${req}><option value="">Selecione um cliente...</option>${records("clientes").map(client => `<option value="${safe(client.nome)}" data-client-id="${client.id}" ${value === client.nome ? "selected" : ""}>${safe(client.nome)}${client.cpf ? ` (${safe(client.cpf)})` : ""}</option>`).join("")}</select>`;
  } else if (type === "textarea") {
    control = `<textarea id="${id}" name="${name}" ${req}>${safe(value)}</textarea>`;
  } else if (type === "money") {
    control = `<input id="${id}" name="${name}" type="text" inputmode="numeric" data-mask="money" value="${formatMoneyInputFromNumber(value)}" ${req}>`;
  } else if (type === "phone") {
    control = `<input id="${id}" name="${name}" type="tel" inputmode="numeric" data-mask="phone" maxlength="15" placeholder="(00) 00000-0000" value="${safe(formatPhone(value))}" ${req}>`;
  } else if (type === "cpf") {
    control = `<input id="${id}" name="${name}" type="text" inputmode="numeric" data-mask="cpf" maxlength="14" placeholder="000.000.000-00" value="${safe(formatCPF(value))}" ${req}>`;
  } else if (type === "cep") {
    control = `<input id="${id}" name="${name}" type="text" inputmode="numeric" data-mask="cep" maxlength="9" placeholder="00000-000" value="${safe(formatCEP(value))}" ${req}>`;
  } else if (type === "qty") {
    control = `<input id="${id}" name="${name}" type="number" min="0" max="${MAX_STOCK_QTY}" step="any" value="${safe(value)}" ${req}>`;
  } else {
    control = `<input id="${id}" name="${name}" type="${type}" value="${safe(value)}" ${req}>`;
  }

  return `<div class="field ${full ? "full" : ""}"><label for="${id}">${label}${required ? " *" : ""}</label>${control}</div>`;
}

function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const key = form.dataset.key;
  const errEl = form.querySelector("#record-form-error");
  errEl.textContent = "";

  const formData = new FormData(form);
  const record = Object.fromEntries(formData.entries());

  // Validação de campos obrigatórios de texto
  for (const [name, label, , required] of FIELDS[key]) {
    if (required && !String(record[name] ?? "").trim()) {
      errEl.textContent = `O campo "${label}" é obrigatório.`;
      return;
    }
  }

  // Validação de datas
  for (const [name, label, type, required] of FIELDS[key]) {
    if (type === "date") {
      const val = String(record[name] || "").trim();
      if (!val && !required) continue;
      if (!isValidDateISO(val)) {
        errEl.textContent = `Data inválida no campo "${label}". Verifique dia, mês e ano.`;
        return;
      }
    }
  }

  // Conversão de campos monetários
  for (const [name, label, type, required] of FIELDS[key]) {
    if (type === "money") {
      const val = parseMoneyInput(record[name]);
      if (required && val <= 0 && key !== "caderneta" && key !== "estoque") {
        errEl.textContent = `O campo "${label}" deve ser maior que R$ 0,00.`;
        return;
      }
      record[name] = val;
    }
  }

  // Validações específicas por módulo
  if (key === "clientes") {
    record.nome = record.nome.trim();
    record.telefone = formatPhone(record.telefone);
    if (!isValidBrazilianPhone(record.telefone)) {
      errEl.textContent = "Telefone inválido. Informe DDD + 8 ou 9 dígitos (ex.: (11) 98765-4321).";
      return;
    }
    record.cpf = formatCPF(record.cpf || "");
    if (record.cpf) {
      if (!isValidCPF(record.cpf)) {
        errEl.textContent = "CPF inválido. Verifique os dígitos verificadores.";
        return;
      }
      const duplicate = records("clientes").some(c => c.id !== editingId && onlyDigits(c.cpf) === onlyDigits(record.cpf));
      if (duplicate) {
        errEl.textContent = "Já existe outro cliente cadastrado com este CPF.";
        return;
      }
    }
    record.cep = formatCEP(record.cep || "");
    if (record.cep && onlyDigits(record.cep).length !== 8) {
      errEl.textContent = "CEP incompleto. Deve conter 8 dígitos.";
      return;
    }
  }

  if (key === "estoque") {
    const qty = Number(record.quantidade);
    const min = Number(record.minimo);
    const isDec = DECIMAL_UNITS.has(record.unidade);
    if (!Number.isFinite(qty) || qty < 0 || qty > MAX_STOCK_QTY) {
      errEl.textContent = `Quantidade inválida. Informe entre 0 e ${MAX_STOCK_QTY.toLocaleString("pt-BR")}.`;
      return;
    }
    if (!isDec && !Number.isInteger(qty)) {
      errEl.textContent = `A unidade "${record.unidade}" exige quantidade inteira.`;
      return;
    }
    if (!Number.isFinite(min) || min < 0 || min > MAX_STOCK_QTY) {
      errEl.textContent = "Estoque mínimo inválido.";
      return;
    }
    record.quantidade = qty;
    record.minimo = min;
  }

  if (key === "caderneta") {
    if (record.valor <= 0) {
      errEl.textContent = "O valor total da pendência deve ser maior que R$ 0,00.";
      return;
    }
    if (record.pago >= record.valor) record.pago = record.valor;
    const cli = records("clientes").find(c => c.nome === record.cliente);
    record.clienteId = cli ? cli.id : "";
    record.clienteCpf = cli ? (cli.cpf || "") : "";
  }

  const list = records(key);
  const existingIndex = editingId ? list.findIndex(item => item.id === editingId) : -1;
  record.id = existingIndex >= 0 ? list[existingIndex].id : crypto.randomUUID();

  if (existingIndex >= 0) list[existingIndex] = { ...list[existingIndex], ...record };
  else list.push(record);

  persistUser();
  document.querySelector("#record-dialog").close();
  toast(editingId ? "Registro atualizado." : "Registro salvo.");
  editingId = null;
  render();
}

function deleteRecord(key, id) {
  if (!confirm("Excluir este registro? Esta ação não pode ser desfeita.")) return;
  const user = currentUser();
  if (key === "servicos") {
    const sale = records("servicos").find(s => s.id === id);
    if (sale && sale.status !== "Cancelado" && sale.estoqueBaixado) {
      normalizeSaleRecord(sale).itens.forEach(item => {
        if (item.produtoId) {
          const prod = records("estoque").find(p => p.id === item.produtoId);
          if (prod) {
            logStockMovement({
              produto: prod,
              delta: Number(item.quantidade || 0),
              tipo: "Estorno (Exclusão)",
              origemId: sale.id,
              origemDescricao: `Exclusão de venda (${sale.cliente})`
            });
          }
        }
      });
    }
    user.financeiro = records("financeiro").filter(item => item.origem !== `venda:${id}` && !String(item.origem || "").startsWith(`caderneta-venda:${id}`));
    user.caderneta = records("caderneta").filter(item => item.origemVendaId !== id);
  }
  user[key] = records(key).filter(item => item.id !== id);
  persistUser();
  toast("Registro excluído.");
  render();
}

/* ===================== EVENTOS GLOBAIS & FILTROS ===================== */
function enviarWhatsApp(tipo, id) {
  const item = records(tipo).find(r => r.id === id);
  if (!item) return;

  const client = records("clientes").find(c =>
    (item.clienteId && c.id === item.clienteId) ||
    (item.cliente && c.nome.trim().toLowerCase() === item.cliente.trim().toLowerCase())
  );

  const phoneDigits = onlyDigits(client?.telefone || "");
  if (phoneDigits.length < 10) {
    toast("Telefone do cliente não encontrado ou inválido. Confira o cadastro em Clientes.");
    return;
  }

  const empresa = currentUser()?.fiscalConfig?.nomeFantasia || currentUser()?.nome || "nosso negócio";
  const nomeCliente = client?.nome || item.cliente || "Cliente";
  let mensagem = "";

  if (tipo === "caderneta") {
    const restante = Math.max(0, Number(item.valor || 0) - Number(item.pago || 0));
    mensagem = `Olá, ${nomeCliente}! Tudo bem? Passando para lembrar da pendência referente a "${item.descricao}" (${empresa}), no valor restante de ${money(restante)}, com vencimento em ${shortDate(item.vencimento)}.`;
  } else if (tipo === "agendamentos") {
    mensagem = `Olá, ${nomeCliente}! Passando para confirmar seu agendamento de "${item.servico}" (${empresa}) no dia ${shortDate(item.data)} às ${item.horario}. Podemos confirmar?`;
  }

  const url = `https://wa.me/55${phoneDigits}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function bindAppEvents() {
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    render();
  }));

  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => handleAction(button.dataset.action)));

  // Filtro genérico de tabelas
  const applyGenericFilter = () => {
    const q = (document.querySelector("#table-search")?.value || "").trim().toLowerCase();
    const statusVal = document.querySelector("#status-filter")?.value || "";
    let visible = 0;
    document.querySelectorAll("#module-table tbody tr").forEach(row => {
      const matchText = !q || row.dataset.search.includes(q);
      const matchStatus = !statusVal || row.dataset.status === statusVal;
      const show = matchText && matchStatus;
      row.hidden = !show;
      if (show) visible++;
    });
    const counter = document.querySelector("#table-count");
    if (counter) counter.textContent = `${visible} registro(s)`;
  };
  document.querySelector("#table-search")?.addEventListener("input", applyGenericFilter);
  document.querySelector("#status-filter")?.addEventListener("change", applyGenericFilter);

  // Filtro do histórico de vendas
  const applySalesFilter = () => {
    const q = (document.querySelector("#sales-search")?.value || "").trim().toLowerCase();
    const from = document.querySelector("#sales-date-from")?.value || "";
    const to = document.querySelector("#sales-date-to")?.value || "";
    const st = document.querySelector("#sales-status-filter")?.value || "";
    let visible = 0;
    document.querySelectorAll("#sales-table tbody tr").forEach(row => {
      const d = row.dataset.date || "";
      const show = (!q || row.dataset.search.includes(q))
        && (!from || d >= from)
        && (!to || d <= to)
        && (!st || row.dataset.status === st);
      row.hidden = !show;
      if (show) visible++;
    });
    const counter = document.querySelector("#sales-count");
    if (counter) counter.textContent = `${visible} registro(s)`;
  };
  document.querySelector("#sales-search")?.addEventListener("input", applySalesFilter);
  document.querySelector("#sales-date-from")?.addEventListener("change", applySalesFilter);
  document.querySelector("#sales-date-to")?.addEventListener("change", applySalesFilter);
  document.querySelector("#sales-status-filter")?.addEventListener("change", applySalesFilter);

  // Abas de estoque e configuração de estoque negativo
  document.querySelectorAll("[data-stock-tab]").forEach(btn => btn.addEventListener("click", () => {
    stockTab = btn.dataset.stockTab;
    render();
  }));
  document.querySelector("#toggle-negative-stock")?.addEventListener("change", e => {
    currentUser().config.permitirEstoqueNegativo = e.target.checked;
    persistUser();
    toast(e.target.checked ? "Venda com estoque insuficiente permitida." : "Bloqueio de estoque insuficiente ativado.");
  });

  // Abas e filtros de Notas Fiscais
  document.querySelectorAll("[data-nf-tab]").forEach(btn => btn.addEventListener("click", () => {
    nfTab = btn.dataset.nfTab;
    render();
  }));

  const applyNfFilter = () => {
    const q = (document.querySelector("#nf-search")?.value || "").trim().toLowerCase();
    const from = document.querySelector("#nf-date-from")?.value || "";
    const to = document.querySelector("#nf-date-to")?.value || "";
    let visible = 0;
    document.querySelectorAll("#nf-table tbody tr").forEach(row => {
      const d = row.dataset.date || "";
      const show = (!q || row.dataset.search.includes(q)) && (!from || d >= from) && (!to || d <= to);
      row.hidden = !show;
      if (show) visible++;
    });
    const counter = document.querySelector("#nf-count");
    if (counter) counter.textContent = `${visible} documento(s)`;
  };
  document.querySelector("#nf-search")?.addEventListener("input", applyNfFilter);
  document.querySelector("#nf-date-from")?.addEventListener("change", applyNfFilter);
  document.querySelector("#nf-date-to")?.addEventListener("change", applyNfFilter);

  // Formulário de Configurações Fiscais
 // Formulário de Configurações Fiscais
  const fcCnpj = document.querySelector("#fc-cnpj");
  const fcCep = document.querySelector("#fc-cep");
  const fcForm = document.querySelector("#fiscal-config-form");

  fcCnpj?.addEventListener("input", () => {
    fcCnpj.value = formatCNPJ(fcCnpj.value);
    if (onlyDigits(fcCnpj.value).length === 14) {
      buscarDadosPorCNPJ(fcCnpj.value, fcForm);
    }
  });

  fcCep?.addEventListener("input", () => {
    fcCep.value = formatCEP(fcCep.value);
    if (onlyDigits(fcCep.value).length === 8) {
      buscarEnderecoPorCEP(fcCep.value, {
        estado: fcForm.querySelector("#fc-estado"),
        cidade: fcForm.querySelector("#fc-cidade"),
        bairro: fcForm.querySelector("#fc-bairro"),
        rua: fcForm.querySelector("#fc-rua"),
        numero: fcForm.querySelector("#fc-numero")
      });
    }
  });
  document.querySelector("#fiscal-config-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const errEl = document.querySelector("#fc-error");
    errEl.textContent = "";
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    data.cnpj = formatCNPJ(data.cnpj || "");
    data.cep = formatCEP(data.cep || "");

    if (!String(data.razaoSocial || "").trim()) {
      errEl.textContent = "Informe a Razão Social da empresa.";
      return;
    }
    if (!isValidCNPJ(data.cnpj)) {
      errEl.textContent = "CNPJ inválido. Verifique os dígitos verificadores.";
      return;
    }
    currentUser().fiscalConfig = { ...currentUser().fiscalConfig, ...data };
    persistUser();
    toast("Configurações fiscais salvas.");
    render();
  });

  // Foto de perfil em Configurações
  document.querySelector("#profile-photo-input")?.addEventListener("change", async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Selecione um arquivo de imagem válido.");
    try {
      const dataUrl = await processProfileImage(file);
      currentUser().fotoPerfil = dataUrl;
      persistUser();
      toast("Foto de perfil atualizada.");
      render();
    } catch {
      toast("Não foi possível processar a imagem.");
    }
  });

  document.querySelector("#btn-remove-photo")?.addEventListener("click", () => {
    currentUser().fotoPerfil = "";
    persistUser();
    toast("Foto de perfil removida.");
    render();
  });

  // Formulário de Configurações do Perfil
  document.querySelector("#settings-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const oldEmail = state.current;
    const newEmail = String(form.get("email") || "").trim().toLowerCase();
    const newNome = String(form.get("nome") || "").trim();
    const newPassword = String(form.get("senha") || "");

    if (!newNome) return toast("Informe seu nome completo.");
    if (!newEmail) return toast("Informe um e-mail válido.");
    if (newEmail !== oldEmail && state.users[newEmail]) return toast("Já existe uma conta com este e-mail.");
    if (newPassword && newPassword !== form.get("confirmacao")) return toast("As senhas não coincidem.");

    const user = currentUser();
    user.nome = newNome;
    user.profissao = String(form.get("profissao") || "").trim();
    user.email = newEmail;

    if (newPassword) {
      user.salt = crypto.randomUUID();
      user.passwordHash = await passwordDigest(newPassword, user.salt);
    }
    if (newEmail !== oldEmail) {
      state.users[newEmail] = user;
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
  if (action === "quick-add") return showQuickAdd();
  if (action === "new-nf") return openNewFiscalDialog();
  if (action === "clear-data") {
    if (confirm("Isso apagará sua conta e todos os registros deste navegador. Continuar?")) {
      delete state.users[state.current];
      state.current = null;
      saveStore();
      renderAuth("signup");
    }
    return;
  }
  if (verb === "add") return openRecordDialog(key);
  if (verb === "edit") return openRecordDialog(key, id);
  if (verb === "delete") return deleteRecord(key, id);
  if (verb === "pay") return registerPayment(key);
  if (verb === "cancel-sale") return cancelSale(key);
  if (verb === "nf-from-sale") return openNewFiscalDialog(key);
  if (verb === "preview-nf") return previewFiscalDoc(key);
  if (verb === "cancel-nf") return cancelFiscalDoc(key);
}

function showQuickAdd() {
  const dialog = document.querySelector("#record-dialog");
  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="eyebrow">Novo registro</p>
        <h2>O que você quer adicionar?</h2>
        <p>Escolha uma área para continuar.</p>
      </div>
      <button class="icon-button" data-close aria-label="Fechar">×</button>
    </div>
    <div class="dialog-form">
      <div class="report-grid">
        ${["servicos", "financeiro", "clientes", "estoque", "agendamentos", "caderneta"].map(key => `
          <button class="secondary-button" style="justify-content:flex-start;min-height:48px" data-quick="${key}">
            ${MODULES[key].icon} &nbsp; ${TABLES[key].action}
          </button>`).join("")}
      </div>
    </div>`;
  dialog.showModal();
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => {
    dialog.close();
    openRecordDialog(button.dataset.quick);
  }));
}

render();
