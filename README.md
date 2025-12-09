# DriverApp - Landing Page

Uma landing page moderna e responsiva para um marketplace que conecta alunos e instrutores de direção certificados.

## 🚀 Características

- **Duas Landing Pages Separadas**: Uma para Alunos (`/aluno`) e outra para Instrutores (`/instrutor`)
- **Modal de Seleção de Perfil**: Popup obrigatório na página inicial que redireciona para a landing page apropriada
- **Design Moderno**: Estilo SaaS limpo e profissional com cores suaves
- **Totalmente Responsivo**: Funciona perfeitamente em mobile e desktop
- **Animações Suaves**: Transições e scroll suave entre seções
- **Roteamento**: React Router para navegação entre páginas
- **Componentes Reutilizáveis**: Estrutura organizada em componentes React

## 🎨 Design

- **Cores Principais**:
  - Primary: `#2463EB` (Azul forte)
  - Secondary: `#1E1E1E` (Preto)
  - Accent: `#F5F7FE` (Azul claro)

- **Tipografia**: Inter e Plus Jakarta Sans

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🏗️ Estrutura do Projeto

```
src/
├── pages/
│   ├── Home.jsx             # Página inicial com popup selector
│   ├── LandingAluno.jsx     # Landing page para alunos
│   └── LandingInstrutor.jsx # Landing page para instrutores
├── components/
│   ├── PopupSelector.jsx    # Modal de seleção de perfil
│   ├── Navbar.jsx           # Barra de navegação
│   ├── Hero.jsx             # Seção hero (página inicial)
│   ├── HeroAluno.jsx        # Hero específico para alunos
│   ├── HeroInstrutor.jsx   # Hero específico para instrutores
│   ├── SectionStudent.jsx   # Seção para alunos
│   ├── SectionInstructor.jsx # Seção para instrutores
│   ├── FAQ.jsx              # Perguntas frequentes
│   └── Footer.jsx           # Rodapé
├── App.jsx                  # Componente principal com rotas
├── index.js                 # Entry point
└── index.css                # Estilos globais e Tailwind
```

## 🎯 Funcionalidades

### Rotas
- `/` - Página inicial com modal de seleção de perfil
- `/aluno` - Landing page completa para alunos
- `/instrutor` - Landing page completa para instrutores

### Modal de Seleção
- Aparece automaticamente na página inicial (`/`)
- Permite escolher entre "Sou Aluno" ou "Sou Instrutor Profissional"
- Redireciona para a landing page apropriada
- Botão "Trocar Perfil" persistente no menu e footer

### Landing Page Aluno (`/aluno`)
1. **Hero Aluno**: Apresentação focada em aprender a dirigir
2. **Como Funciona**: 3 passos explicativos
3. **Benefícios**: 6 benefícios principais
4. **FAQ**: Perguntas frequentes com accordion
5. **Footer**: Links e informações

### Landing Page Instrutor (`/instrutor`)
1. **Hero Instrutor**: Apresentação focada em gerar renda
2. **Proposta de Valor**: Transformar experiência em renda
3. **Como Começar**: 4 passos para cadastro
4. **Benefícios**: Vantagens da plataforma
5. **FAQ**: Perguntas frequentes com accordion
6. **Footer**: Links e informações

## 🛠️ Tecnologias

- React 18
- React Router DOM 6
- TailwindCSS 3
- React Scripts

## 📱 Responsividade

A landing page é totalmente responsiva e otimizada para:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1280px+)

## 🎨 Componentes Principais

### PopupSelector
Modal full-screen que aparece ao carregar a página solicitando a escolha do perfil do usuário.

### Hero
Seção inicial com headline, subheadline e CTA principal.

### SectionStudent
Seção focada em alunos com informações sobre como funciona, benefícios e CTA.

### SectionInstructor
Seção focada em instrutores com proposta de valor, passos e benefícios.

### FAQ
Seção de perguntas frequentes com accordion interativo.

## 📝 Notas

- O modal usa `sessionStorage` para lembrar a escolha do usuário durante a sessão
- Se o usuário já selecionou um perfil, é redirecionado automaticamente para a landing page correspondente
- Scroll suave implementado para todas as navegações
- Animações CSS personalizadas para melhor UX
- Cada landing page tem seu próprio Hero personalizado
- Todos os CTAs estão funcionais e prontos para integração com backend
- O botão "Trocar Perfil" limpa a sessão e redireciona para a página inicial

## 🚀 Build para Produção

```bash
npm run build
```

Isso criará uma pasta `build` com os arquivos otimizados para produção.

## 📄 Licença

Este projeto é privado e proprietário.


