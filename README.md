<div align="center">
  <img src="logo.jpeg" alt="Logo Gestor Fácil" width="96" style="border-radius: 20px;" />
  <h1>Gestor Fácil ERP</h1>
  <p><strong>Sistema de gestão empresarial (mini ERP) leve, responsivo e com sincronização em nuvem — desenvolvido em Vanilla JavaScript, HTML5, CSS3 e Supabase.</strong></p>

  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20REST-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![APIs](https://img.shields.io/badge/APIs-ViaCEP%20%7C%20BrasilAPI%20%7C%20WhatsApp-25D366?style=for-the-badge)
</div>

---

## 📋 Sobre o Projeto

O **Gestor Fácil** é um sistema de gestão empresarial voltado para autônomos, prestadores de serviço e pequenos comércios. A aplicação opera com **arquitetura híbrida de persistência**: armazenamento local imediato no navegador (`localStorage`), portabilidade offline via arquivo `.json` e sincronização em nuvem com banco de dados **PostgreSQL no Supabase** via API REST.

---

## ✨ Módulos e Funcionalidades

| Módulo | Recursos Implementados |
| :--- | :--- |
| **📊 Visão Geral (Dashboard)** | Indicadores financeiros em tempo real, resumo de vendas, pendências da caderneta e alertas rápidos da operação. |
| **👥 CRM & Clientes** | Cadastro completo com máscara de CPF/telefone e **autopreenchimento de endereço via API ViaCEP**. |
| **📦 Estoque** | Controle de produtos, unidades de medida, alertas de estoque mínimo e histórico de auditoria de movimentações. |
| **🛒 Serviços & Vendas** | Registro integrado de vendas e serviços com cálculo automático de totais e baixa no estoque. |
| **📒 Caderneta Digital** | Controle de vendas a prazo/fiado, registro de pagamentos parciais e **cobrança direta via WhatsApp** com saldo restante e vencimento. |
| **📅 Agendamentos** | Agenda de atendimentos e serviços com **lembrete automático de confirmação via WhatsApp**. |
| **🧾 Notas Fiscais** | Emissão de **NF-e (55)**, **NFC-e (65)** e **NFS-e** vinculada às vendas, com **consulta automática de CNPJ via BrasilAPI**, simulação de autorização **SEFAZ (Homologação)**, geração de **Chave de Acesso de 44 dígitos** (Módulo 11) e protocolo. |
| **☁️ Nuvem, Backup & Perfil** | Sincronização de dados na nuvem com **Supabase (`PostgreSQL / JSONB`)**, exportação/restauração portátil em **`.json`** e personalização de perfil com foto. |

---

## 🛠️ Tecnologias e Integrações

* **Front-end:** HTML5 semântico, CSS3 moderno (Grid, Flexbox, variáveis CSS e layout responsivo) e JavaScript puro (ES6+).
* **Supabase (Banco de Dados na Nuvem):** Tabela `gestor_backups` em PostgreSQL com coluna `jsonb` e Row Level Security (RLS), consumida nativamente via `fetch` na API REST.
* **ViaCEP API (`viacep.com.br`):** Consulta automática de logradouro, bairro, cidade e UF pelo CEP.
* **BrasilAPI (`brasilapi.com.br`):** Preenchimento automático de Razão Social, Nome Fantasia e endereço fiscal a partir do CNPJ.
* **WhatsApp Deep Links (`wa.me`):** Geração de mensagens dinâmicas para cobrança de clientes e confirmação de agendamentos.
* **Persistência Híbrida:** `localStorage` para resposta instantânea offline + backup portátil em `.json` + sincronização na nuvem.

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/jotacyberdev/Gestor-Facil-ERP.git](https://github.com/jotacyberdev/Gestor-Facil-ERP.git)
