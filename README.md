# Automação Residencial

Este projeto é uma aplicação de automação residencial que permite gerenciar LEDs e um alarme (buzzer) via uma interface web. A comunicação é feita através de uma API, que gerencia o estado dos dispositivos.

## Estrutura do Projeto

O projeto está organizado nas seguintes pastas:

- `api-house/`: Contém o código da API em Node.js que controla os LEDs e possivelmente o alarme. Aqui você encontrará o arquivo principal `server.js` e o banco de dados `database.db`.
- `arduino/`: Código-fonte do Arduino para controle dos LEDs e buzzer. Certifique-se de carregar o código nesta pasta para a sua placa Arduino.
- `web/`: Interface web em HTML e JavaScript para controle dos LEDs. Contém os arquivos front-end que podem ser acessados no navegador.
- `database.db`: Banco de dados SQLite que armazena os estados dos LEDs. A tabela será criada automaticamente ao iniciar a API, se ainda não existir.


## Requisitos

- **Node.js**: Para executar a API.
- **PlatformIO**: Para programar a placa Arduino.
- **Bibliotecas do Arduino**:
  - `ArduinoJson`: Para manipulação de JSON no Arduino.

## Banco de Dados

A tabela do banco de dados SQLite é criada automaticamente ao iniciar o servidor, caso não exista. A tabela possue a seguinte definição:

- Tabela das LED's
  - `id`:  Identificador único da Led.
  - `nome`: Nome da Led. (neste pode ser um cômodo da casa, lembrando de ser um nome único)
  - `status`: 0 para desligada e 1 para ligada.

# API de Controle de LEDs

Esta API fornece endpoints para gerenciar LEDs em um sistema. Você pode consultar o estado dos LEDs, adicionar novos LEDs e atualizar o estado de LEDs existentes.

## Rotas da API

### 1. **GET /api/leds**
   - **Descrição**: Retorna a lista de todos os LEDs com seus respectivos nomes e estados.
   - **Exemplo de Requisição**:
     ```bash
     GET http://localhost:3003/api/leds
     ```
   - **Resposta**:
     ```json
     [
       {
         "id": 1,
         "nome": "Sala",
         "status": 0
       },
       {
         "id": 2,
         "nome": "Quarto 1",
         "status": 1
       }
     ]
     ```
   - **Códigos de Status**:
     - 200: Requisição bem-sucedida.
     - 500: Erro interno do servidor ao acessar o banco de dados.

### 2. **POST /api/leds**
   - **Descrição**: Adiciona um novo LED ao banco de dados.
   - **Exemplo de Requisição**:
     ```bash
     POST http://localhost:3003/api/leds
     ```
   - **Corpo da Requisição**:
     ```json
     {
       "nome": "Quarto 2",
       "status": 1
     }
     ```
   - **Resposta**:
     ```json
     {
       "message": "LED adicionada com sucesso!",
       "led": {
         "id": 3,
         "nome": "Quarto 2",
         "status": 1
       }
     }
     ```
   - **Códigos de Status**:
     - 201: LED adicionada com sucesso.
     - 400: Dados inválidos (por exemplo, nome ou status inválido).
     - 500: Erro ao adicionar LED ao banco de dados.

### 3. **PUT /api/leds/:nome**
   - **Descrição**: Atualiza o estado de um LED existente pelo nome.
   - **Exemplo de Requisição**:
     ```bash
     PUT http://localhost:3003/api/leds/LED1
     ```
   - **Corpo da Requisição**:
     ```json
     {
       "status": 0
     }
     ```
   - **Resposta**:
     ```json
     {
       "message": "LED Quarto 2 atualizada para desligada",
       "led": {
         "nome": "Quarto 2",
         "status": 0
       }
     }
     ```
   - **Códigos de Status**:
     - 200: LED atualizada com sucesso.
     - 400: Status inválido (deve ser 0 ou 1).
     - 404: LED não encontrada.
     - 500: Erro ao atualizar o LED no banco de dados.

## Erros Comuns

- **400 Bad Request**: Normalmente, isso ocorre quando os dados enviados na requisição não são válidos, como um nome de LED vazio ou status fora de 0 ou 1.
- **404 Not Found**: A rota ou o LED solicitado não foi encontrado.
- **500 Internal Server Error**: Ocorre quando há um erro no servidor, como problemas ao acessar o banco de dados.

## API de Controle de Alarme (Buzzer)

Futuramente, serão adicionadas rotas para controle do alarme (buzzer) para alertas sonoros. As rotas podem ser semelhantes às de controle de LEDs, mas controlando o estado do buzzer (ligado/desligado).

## Configuração do Ambiente de Desenvolvimento

Para garantir que o projeto funcione corretamente, siga estas etapas:

1. **Instalar o Node.js**:
   - Certifique-se de que você tem o [Node.js](https://nodejs.org/) instalado. Você pode verificar executando:
     ```bash
     node -v
     npm -v
     ```

2. **Instalar o PlatformIO** (se for usar o Arduino):
   - O PlatformIO é uma plataforma de desenvolvimento para placas de hardware. Você pode instalar o PlatformIO como uma extensão no [Visual Studio Code](https://platformio.org/) ou como ferramenta de linha de comando.
   - Para instalar o PlatformIO como extensão do VSCode, acesse a aba de extensões e busque por "PlatformIO".

3. **Variáveis de Ambiente**:
   - Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:
     ```env
     DB_PATH=./database.db
     PORT=3003
     ```

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto:

### 1. Clonar o repositório:

```
git clone https://github.com/JulianaCandido08/api-house.git
cd api-house
```

### 2. Instalar as dependências da API:

```
npm install
```

## Execute a API:

 ```
node server.js
 ```

### O servidor estará disponível em http://localhost:3003.

## Configuração do Arduino

1. Abra o Arduino IDE ou PlataformIO e crie um novo sketch/projeto.
2. Copie o código do Arduino da pasta arduino/ e cole no seu sketch/projeto.
3. Certifique-se de que os pinos estão configurados corretamente.
4. Faça o upload do código para a sua placa Arduino.
  
## Uso da Interface Web
1. Abra o arquivo HTML da pasta web/ em um navegador.
2. Você verá botões para controlar cada LED e o alarme.
3. Clique nos botões para ligar ou desligar os LEDs.


### **Futuraas Implementações**
   Futuramente não terá só LEDs, será acrescentado mais sensores e este código será atualizado e toda sua interface. Com a finalidade de ter um app mobile. 

   ## Possíveis Melhorias
   - Implementação de sensor de chuva, sensor ultrassonico e mais.
   - Criação de um painel de controle mais avançado para a interface web com finalidade em app mobile.

## Licença
#### Este projeto está licenciado sob a MIT License.

## Contribuições
#### Contribuições são Bem-Vindas!
