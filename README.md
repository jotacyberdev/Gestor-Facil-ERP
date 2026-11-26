<div align="center">
  <img src="logo.jpeg" alt="Logo Gestor Fácil" width="96" style="border-radius: 20px;" />
  <h1>Gestor Fácil ERP</h1>
  <p><strong>Sistema de gestão empresarial leve, responsivo e sem dependências pesadas — feito em JavaScript puro, HTML5 e CSS3.</strong></p>

  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![APIs](https://img.shields.io/badge/APIs-ViaCEP%20%7C%20BrasilAPI%20%7C%20WhatsApp-25D366?style=for-the-badge)
</div>

---

## 📋 Sobre o Projeto

O **Gestor Fácil** é um mini ERP web projetado para autônomos, prestadores de serviço e pequenos comércios organizarem a operação diária em uma única interface. O sistema funciona imediatamente no navegador utilizando `localStorage` para persistência local por conta de usuário, além de contar com preenchimento automático de dados cadastrais e comunicação direta com clientes.

---

## ✨ Funcionalidades Principais

| Módulo | Recursos Incluídos |
| :--- | :--- |
| **📊 Dashboard** | Resumo financeiro em tempo real, indicadores de vendas, pendências da caderneta e visão rápida da operação. |
| **👥 CRM & Clientes** | Cadastro completo com máscara de CPF/telefone e **autopreenchimento de endereço via API ViaCEP**. |
| **📦 Estoque** | Controle de produtos, unidades de medida, alertas de estoque mínimo e histórico de movimentações/auditoria. |
| **🛒 Vendas & Serviços** | Registro integrado de vendas com baixa automática de estoque e cálculo de totais. |
| **📒 Caderneta Digital** | Controle de fiado/crediário, registro de pagamentos parciais e **botão de cobrança direta via WhatsApp** com valor restante e vencimento. |
| **📅 Agendamentos** | Agenda de atendimentos e serviços com **lembrete automático de confirmação via WhatsApp**. |
| **🧾 Notas Fiscais** | Módulo preparatório para NF-e, NFC-e e NFS-e com **consulta automática de CNPJ via BrasilAPI** nas configurações fiscais da empresa. |
| **📈 Relatórios & Perfil** | Consolidação de resultados, exportação/impressão e personalização de perfil com foto do usuário. |

---

## 🛠️ Tecnologias e Integrações

* **Front-end:** HTML5 semântico, CSS3 moderno (Grid, Flexbox, variáveis CSS e design responsivo) e Vanilla JavaScript (ES6+).
* **ViaCEP API:** Consulta automática de logradouro, bairro, cidade e UF a partir dos 8 dígitos do CEP.
* **BrasilAPI:** Consulta de dados cadastrais da empresa (Razão Social, Nome Fantasia e endereço) a partir do CNPJ.
* **WhatsApp Deep Links (`wa.me`):** Geração dinâmica de mensagens personalizadas de cobrança e confirmação de horário.

---

## 🚀 Como Executar Localmente

Como o projeto não exige compilação ou instalação de pacotes Node, basta servir os arquivos estáticos:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/jotacyberdev/Gestor-Facil-ERP.git](https://github.com/jotacyberdev/Gestor-Facil-ERP.git)
