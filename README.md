# Projeto Sistema Financeiro Billor

Este é um projeto de sistema financeiro desenvolvido com NestJS. O sistema permite gerenciar transações financeiras, carteiras e usuários, além de fornecer relatórios detalhados.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Docker (opcional, para executar o banco de dados)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/projeto-billor.git
cd projeto-billor
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=seu_banco_de_dados
JWT_SECRET=sua_chave_secreta

4. Executando o Projeto
* Certifique-se de que o banco de dados PostgreSQL está em execução e configurado corretamente.

* Execute o projeto:
```bash
npm run start:dev
```
5. Endpoints
- Autenticação
POST /auth/login: Realiza o login do usuário.

- Usuários
POST /user/register: Registra um novo usuário.

GET /user/:id: Obtém um usuário pelo ID.

PUT /user/:id: Atualiza um usuário pelo ID.

DELETE /user/:id: Exclui um usuário pelo ID.

- Transações
POST /transaction: Cria uma nova transação.

GET /transaction/balance/:userId: Obtém o saldo total de um usuário.

GET /transaction/statement/:userId: Obtém o extrato de transações de um usuário.

GET /transaction/category-summary/:userId: Obtém o resumo de transações por categoria de um usuário.

