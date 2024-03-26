
## Bibliotecas Utilizadas:

 - jsonwebtoken: Autenticação com JWT. 
 - bcryptjs: Criptografia de senhas.
 - express: Criação do servidor. 
 - knex: Query builder. 
 - sqlite3: Banco de dados local. 
 - zod: Validações de dados. 
 - est, ts-jest e supertest: Testes. typescript.

Entre outras dependências.

  

## Como Rodar o Projeto:
  
Primeiro crie o arquivo **.env**, copiei o **.env.example**.

Configuração do Banco de Dados: Execute ``yarn knex:migrate`` para preparar o banco.
Iniciar o Servidor: Use ``yarn dev`` para rodar o servidor.

  
## Rotas Disponíveis:
Listar Usuários: GET http://localhost:3333/api/users
<br>
Criar Usuário: POST http://localhost:3333/api/users/create

    {
		"name": "teste",
		"email": "a@test.com",
		"password": "123"
	}

Deletar Usuário: DELETE http://localhost:3333/api/users/delete

	{
		"id": 1
	}

Autenticação: POST http://localhost:3333/api/auth
	
	{
		"email": "a@test.com",
		"password": "123"
	}

## Swagger:
http://localhost:3333/swagger
 
## Testes:
Para rodar os testes, execute ``yarn test.``