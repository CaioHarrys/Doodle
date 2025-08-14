# Doodle - Gerenciador de Tarefas Full-Stack

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-blue)

Um aplicativo de gerenciamento de tarefas e projetos inspirado no Asana, construído com React Native e Firebase. O Doodle é um projeto full-stack multiplataforma, projetado para rodar nativamente na web, em tablets e em dispositivos móveis (iOS e Android) a partir de um único código-base.

---

### Tabela de Conteúdos

* [Sobre o Projeto](#sobre-o-projeto)
    * [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Começando](#começando)
    * [Pré-requisitos](#pré-requisitos)
    * [Instalação](#instalação)
* [Funcionalidades](#funcionalidades)
* [Roteiro do Projeto (Roadmap)](#roteiro-do-projeto)
* [Contato](#contato)
* [Licença](#licença)

---

## Sobre o Projeto

O Doodle foi criado como um projeto de portfólio para demonstrar habilidades no desenvolvimento de aplicações full-stack modernas, responsivas e escaláveis. O objetivo é criar uma experiência de usuário fluida e intuitiva para o gerenciamento de tarefas diárias, tanto para uso pessoal quanto para pequenas equipes.

### Tecnologias Utilizadas

A stack do projeto foi escolhida para ser moderna, eficiente e com um generoso plano gratuito, ideal para projetos de portfólio.

* **Frontend:** [React Native](https://reactnative.dev/)
* **Framework:** [Expo](https://expo.dev/)
* **Backend & Banco de Dados:** [Google Firebase](https://firebase.google.com/)
    * **Autenticação:** Firebase Authentication
    * **Banco de Dados:** Cloud Firestore
    * **Hospedagem Web:** Firebase Hosting
* **Navegação:** [React Navigation](https://reactnavigation.org/)

---

## Começando

Para obter uma cópia local do projeto e começar a rodá-lo, siga os passos abaixo.

### Pré-requisitos

Você precisará ter as seguintes ferramentas instaladas em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* [Git](https://git-scm.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
    ```sh
    npm install -g expo-cli
    ```

### Instalação

1.  **Clone o repositório:**
    ```sh
    git clone [https://github.com/seu-usuario/doodle.git](https://github.com/seu-usuario/doodle.git)
    cd doodle
    ```

2.  **Instale as dependências do projeto:**
    ```sh
    npm install
    ```

3.  **Configure as variáveis de ambiente do Firebase:**
    * Crie um arquivo `.env` na raiz do projeto.
    * Acesse o console do seu projeto no Firebase.
    * Vá para "Configurações do Projeto" (Project Settings) > "Geral" (General).
    * Na seção "Seus apps" (Your apps), encontre as credenciais do seu app da web.
    * Copie os valores para o seu arquivo `.env`, seguindo o modelo abaixo:

    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    EXPO_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
    EXPO_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"
    ```

4.  **Inicie o servidor de desenvolvimento:**
    * Para rodar na web:
        ```sh
        npm run web
        ```
    * Para rodar no mobile (escaneie o QR code com o app Expo Go):
        ```sh
        npm start
        ```

---

## Funcionalidades

-   [x] **Autenticação de Usuários:** Cadastro e Login com e-mail e senha.
-   [x] **CRUD de Tarefas:** Crie, leia, atualize e delete tarefas.
-   [x] **Organização por Projetos:** Agrupe tarefas em projetos distintos.
-   [ ] **Filtros e Ordenação:** Encontre tarefas facilmente.
-   [ ] **Modo Claro e Escuro:** Tema adaptável para preferência do usuário.
-   [ ] **Responsividade Completa:** Layout otimizado para web, tablet e mobile.

---

## Roteiro do Projeto

O desenvolvimento do projeto segue um plano estruturado em 5 etapas, desde a configuração inicial até o polimento final e o deploy. Você pode acompanhar o progresso e os detalhes de cada etapa no nosso **[Painel Interativo do Projeto](URL_PARA_O_PAINEL_SE_HOUVER)**.

1.  **Base do Projeto e Configuração**
2.  **Autenticação de Usuários**
3.  **CRUD de Tarefas (MVP Funcional)**
4.  **Organização por Projetos**
5.  **Polimento e Funcionalidades Avançadas**

---

## Contato

Caio Harrys - [caiocompanyhc@gmail.com](mailto:caiocompanyhc@gmail.com)

Link do Projeto: [https://github.com/CaioHarrys/doodle](https://github.com/CaioHarrys/doodle)

---

## Licença

Distribuído sob a Licença MIT. Veja `LICENSE.txt` para mais informações.
