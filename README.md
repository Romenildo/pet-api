# Pet API
Aplicação backend de adoção de pets

# API Rest-ful pets
A aplicação consiste em uma api restful com sistema de de login e registro de usuarios com autenticação e rotas protegidas,
utilização de tokens na verificação da autorização dos usuários, e conexão com banco de dados mongodb do cluster online.
Contém todo o crud de usuarios e para os pets, como criar, editar, excluir, retornar os pets cadastrados do usuario, suas adoçoes.


Projeto desenvoldido com as ferramentas de:
<p align="center">

  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
 </p>
 
 ## Aprendizados
 - Criação de uma aplicação restful com nodeJs
 - conexão e configuração com banco de dados não relacional moongodb com a dependencia do mongoose
 - Toda a estrutura de uma aplicação node com autenticação
 - Criação dos modelos e schemas das entidades para banco de dados
 - Confiração do cors da aplicação
 - Configuração das rotas e rotas protegidas da aplicação
 - Como colocar middlewares nas rotas e colocar verificação de token em rotas protegidas
 - Adição de imagens e multi-imagens na hora de edição e criação
 - Toda a manipulaçao no controller de validações, autenticações com tokens, autorização e se o item é do usuarioq eu solicitou a requisição
 - Criptografia de senha do usuario com bscrypt
 - Reponse das requisições padronizadas com messagens detalhadas para o front
 - Criação, edicao, edição e pegar itens de uma aplicação restful em node
 - Toda configuração de registro e login do usuario e seus dados
 - Configuração e utilização dos tokens com jsonwebtoken
 - Armazenamento de imagens na Api
 
 # Rotas
 
 ## users
 - registrar
 - login
 - checar usuario logado
 - pegar usuario por id
 - editar usuario(protegida)
 
 ## pets
 - criar um novo pet(protegida)
 - pegar todos os pets cadastrados no sistema
 - pegar todos os pets cadastrados do usuario(protegida)
 - pegar todos os pets adotados do usuario(protegida)
 - pegar pet pelo id
 - deltetar pet (protegida)
 - editar pet (protegida)
 - marcar visita ao pet (protegida)
 - concluir adocao (protegida)   
 (As rotas são protegidas pois precisam do token para identificar qual usuario está manipulando aquelas informações e se ele tem permissão para fazer o mesmo)

---
 ``` Obs: Os commits e comentários no código foram organizados com foco no aprendizado dos conteúdos para revisões futuras```
