# DriverApp - Landing Pages

Uma plataforma moderna que conecta alunos e instrutores de direção certificados através de landing pages responsivas e otimizadas para conversão.

## 🚀 Características

- **Duas Landing Pages Separadas**: Uma para Alunos (`/aluno`) e outra para Instrutores (`/instrutor`)
- **Modal de Seleção de Perfil**: Popup obrigatório na página inicial que redireciona para a landing page apropriada
- **Design Moderno**: Estilo SaaS limpo e profissional com cores suaves e componentes arredondados
- **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- **Animações Suaves**: Transições e scroll suave entre seções
- **Roteamento**: React Router para navegação entre páginas
- **Componentes Organizados**: Estrutura modular com separação por contexto (aluno/instrutor/comum)

## 🎨 Design

- **Cores Principais**:
  - Primary: `#2463EB` (Azul forte)
  - Secondary: `#1E1E1E` (Preto)
  - Accent: `#F5F7FE` (Azul claro)

- **Tipografia**: Inter e Plus Jakarta Sans

- **Estilo**: Design SaaS moderno com cards arredondados, ícones SVG e sombras suaves

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/fsgregorio/driverapp.git
cd driver_app
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🏗️ Estrutura do Projeto

```
src/
├── pages/
│   ├── Home.jsx                 # Página inicial com popup selector
│   ├── LandingAluno.jsx        # Landing page completa para alunos
│   └── LandingInstrutor.jsx    # Landing page completa para instrutores
├── components/
│   ├── aluno/                   # Componentes específicos de aluno
│   │   ├── Hero.jsx            # Hero section para alunos
│   │   ├── Vantagens.jsx       # Seção de vantagens
│   │   ├── ComoFunciona.jsx    # Processo em 5 passos
│   │   ├── Precos.jsx          # Informações sobre preços
│   │   ├── CTAFinal.jsx        # Call-to-action final
│   │   └── FAQ.jsx             # Perguntas frequentes para alunos
│   ├── instrutor/              # Componentes específicos de instrutor
│   │   ├── Hero.jsx            # Hero section para instrutores
│   │   ├── Vantagens.jsx       # Seção de vantagens
│   │   ├── ComoFunciona.jsx   # Processo em 5 passos
│   │   ├── Precos.jsx         # Informações sobre comissão
│   │   ├── CTAFinal.jsx       # Call-to-action final
│   │   └── FAQ.jsx            # Perguntas frequentes para instrutores
│   ├── Navbar.jsx              # Barra de navegação (comum)
│   ├── Footer.jsx              # Rodapé (comum)
│   ├── PopupSelector.jsx       # Modal de seleção de perfil (comum)
│   └── Hero.jsx                # Hero da página inicial (comum)
├── App.jsx                     # Componente principal com rotas
├── index.js                    # Entry point
└── index.css                   # Estilos globais e Tailwind
```

## 🎯 Rotas

- `/` - Página inicial com modal de seleção de perfil
- `/aluno` - Landing page completa para alunos
- `/instrutor` - Landing page completa para instrutores

## 📱 Landing Page Aluno (`/aluno`)

### Estrutura:
1. **Hero** - Apresentação focada em aulas para habilitados
2. **Vantagens** - 6 benefícios principais da plataforma
3. **Como Funciona** - 5 passos do processo:
   - Selecione o Tipo de Aula
   - Preencha seu Perfil
   - Escolha seu Instrutor
   - Agende sua Aula
   - Pratique e Melhore
4. **Preços** - Informações sobre uso gratuito da plataforma e preços das aulas
5. **CTA Final** - Call-to-action destacado antes do FAQ
6. **FAQ** - 6 perguntas frequentes específicas para alunos
7. **Footer** - Links e informações

### Menu de Navegação:
- Início
- Vantagens
- Como Funciona
- Preços
- Começar
- FAQ

## 👨‍🏫 Landing Page Instrutor (`/instrutor`)

### Estrutura:
1. **Hero** - Apresentação focada em gerar renda
2. **Vantagens** - 6 vantagens de ser instrutor na plataforma
3. **Como Funciona** - 5 passos do processo:
   - Cadastre-se e Envie sua Certificação
   - Preencha seu Perfil
   - Configure Horários e Preços
   - Receba Solicitações de Alunos
   - Receba Pagamentos de Forma Segura
4. **Preços** - Informações sobre uso gratuito e modelo de comissão
5. **CTA Final** - Call-to-action destacado antes do FAQ
6. **FAQ** - 8 perguntas frequentes específicas para instrutores
7. **Footer** - Links e informações

### Menu de Navegação:
- Início
- Vantagens
- Como Funciona
- Preços
- Começar
- FAQ

## 🎯 Funcionalidades

### Modal de Seleção
- Aparece automaticamente na página inicial (`/`)
- Permite escolher entre "Sou Aluno" ou "Sou Instrutor Profissional"
- Redireciona para a landing page apropriada
- Botão "Trocar Perfil" persistente no menu e footer
- Usa `sessionStorage` para lembrar a escolha durante a sessão

### Navegação
- Menu fixo no topo com links para todas as seções
- Scroll suave entre seções
- Menu responsivo (mobile e desktop)
- Logo clicável que volta ao topo

### Componentes
- **Hero**: Seções hero com imagens e CTAs
- **Vantagens**: Grid de benefícios com ícones
- **Como Funciona**: Processo passo a passo
- **Preços**: Cards destacados com informações de preço/comissão
- **CTA Final**: Seção de call-to-action antes do FAQ
- **FAQ**: Accordion interativo com perguntas e respostas

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **React Router DOM 6** - Roteamento de páginas
- **TailwindCSS 3** - Framework CSS utilitário
- **React Scripts** - Ferramentas de build e desenvolvimento

## 📝 Componentes Principais

### Componentes Comuns
- `Navbar` - Navegação compartilhada entre páginas
- `Footer` - Rodapé com links e informações
- `PopupSelector` - Modal de seleção de perfil
- `Hero` - Hero da página inicial

### Componentes de Aluno
- `Hero` - Hero específico com imagem de aluno
- `Vantagens` - 6 vantagens da plataforma para alunos
- `ComoFunciona` - 5 passos do processo para alunos
- `Precos` - Informações sobre plataforma gratuita e preços
- `CTAFinal` - CTA final para alunos
- `FAQ` - 6 perguntas frequentes para alunos

### Componentes de Instrutor
- `Hero` - Hero específico com imagem de instrutor
- `Vantagens` - 6 vantagens para instrutores
- `ComoFunciona` - 5 passos do processo para instrutores
- `Precos` - Informações sobre comissão e modelo de negócio
- `CTAFinal` - CTA final para instrutores
- `FAQ` - 8 perguntas frequentes para instrutores

## 🎨 Assets

As imagens estão localizadas em:
- `/public/imgs/student.png` - Imagem do hero de aluno
- `/public/imgs/instrutor.png` - Imagem do hero de instrutor

## 📱 Responsividade

A landing page é totalmente responsiva e otimizada para:
- **Mobile** (320px+)
- **Tablet** (768px+)
- **Desktop** (1024px+)
- **Large Desktop** (1280px+)

## 🚀 Build para Produção

```bash
npm run build
```

Isso criará uma pasta `build` com os arquivos otimizados para produção.

## 📄 Scripts Disponíveis

- `npm start` ou `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa testes
- `npm run eject` - Ejeta configurações do Create React App

## 🔧 Configuração

### TailwindCSS
O projeto usa TailwindCSS configurado em `tailwind.config.js` com cores customizadas:
- Primary: `#2463EB`
- Secondary: `#1E1E1E`
- Accent: `#F5F7FE`

### Fontes
As fontes Inter e Plus Jakarta Sans são carregadas via Google Fonts no `public/index.html`.

## 📝 Notas Importantes

- O modal usa `sessionStorage` para lembrar a escolha do usuário durante a sessão
- Se o usuário já selecionou um perfil, é redirecionado automaticamente para a landing page correspondente
- Scroll suave implementado para todas as navegações
- Animações CSS personalizadas para melhor UX
- Cada landing page tem seu próprio Hero personalizado
- Todos os CTAs estão funcionais e prontos para integração com backend
- O botão "Trocar Perfil" limpa a sessão e redireciona para a página inicial

## 🎯 Próximos Passos

- Integração com backend para cadastro de alunos e instrutores
- Sistema de autenticação
- Dashboard para instrutores
- Sistema de agendamento
- Processamento de pagamentos
- Sistema de avaliações

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Contribuição

Este é um projeto privado. Para sugestões ou problemas, entre em contato com a equipe de desenvolvimento.
