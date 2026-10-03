# Canil Kandinski · Site Oficial & Sistema de Gestão

Site oficial e plataforma de vendas com reserva simplificada, catálogo de ninhadas, cálculo de frete aéreo e painel administrativo do **Canil Kandinski** (Porto Alegre / RS).

Especializado na criação ética de:
- **Golden Retriever** (Pedigree CBKC/FCI, linhas de sangue selecionadas)
- **Bulldog Inglês** (Excelente tipicidade e acompanhamento veterinário)
- **Chihuahua Pelo Curto** (Micro porte, sociáveis e saudáveis)

---

## 🚀 Tecnologias Utilizadas

- **React 18** com **TypeScript**
- **Vite** para compilação ultrarrápida
- **Tailwind CSS** para estilização responsiva e elegante
- **Lucide Icons** para ícones vetoriais modernos
- **LocalStorage Database Service** para persistência e gestão em tempo real sem custos de banco de dados
- **Cálculo de Frete Aéreo LATAM Cargo / Gollog** e rotas terrestres RS/SC/PR

---

## 🛠️ Como Executar Localmente

1. Clone o repositório ou baixe os arquivos:
```bash
git clone https://github.com/SEU-USUARIO/canil-kandinski.git
cd canil-kandinski
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador:
`http://localhost:3000` ou `http://localhost:5173`

---

## 🔐 Painel Administrativo do Canil

- **Acesso:** Basta clicar no botão `🔒 Painel do Canil` no rodapé da página ou acessar `#admin` no final da URL.
- **Senha Padrão:** `kandinski2026` (pode ser alterada no próprio painel).
- **Recursos do Painel:**
  - Cadastrar, editar e excluir filhotes com fotos reais
  - Alterar preços, status (Disponível, Reservado, Vendido) e dados veterinários
  - Modificar informações do canil (telefones, WhatsApp, Instagram, endereço e texto institucional)
  - Gerenciar depoimentos e comunicados/notícias

---

## 🌐 Deploy no Domínio Oficial (www.canilkandinski.com.br)

### Deploy na Vercel (Recomendado):
1. Acesse [vercel.com](https://vercel.com) e conecte com sua conta do GitHub.
2. Clique em **"Add New Project"** e selecione o repositório `canil-kandinski`.
3. Clique em **Deploy**.
4. Em **Settings > Domains**, adicione `www.canilkandinski.com.br` e `canilkandinski.com.br`.
5. Aponte o CNAME no Registro.br conforme indicado pela Vercel.
