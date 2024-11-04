# Automação Residencial

Este projeto é uma aplicação de automação residencial que permite controlar LEDs e um alarme (buzzer) via uma interface web. A comunicação é feita através de uma API, que gerencia o estado dos dispositivos.

## Estrutura do Projeto

- `api-house/`: Código da API em Node.js que controla os LEDs.
- `arduino/`: Código do Arduino para controle dos LEDs e buzzer.
- `web/`: Código HTML e JavaScript para a interface web.

## Requisitos

- **Node.js**: Para executar a API.
- **PlatformIO**: Para programar a placa Arduino.
- **Bibliotecas do Arduino**:
  - `ArduinoJson`: Para manipulação de JSON no Arduino.

## Configuração da API

1. Clone o repositório:
   ```
   git clone https://github.com/JulianaCandido08/api-house.git
   cd api-house
   ```

## Instale as dependências da API:

 ```
npm install
 ```

## Execute a API:

 ```
node server.js
 ```
### A API estará disponível em http://localhost:3003/api/leds.

## Configuração do Arduino
1. Abra o Arduino IDE e crie um novo sketch.
2. Copie o código do Arduino da pasta arduino/ e cole no seu sketch.
3. Certifique-se de que os pinos estão configurados corretamente:
   - LED no pino 23
   - Buzzer no pino 17
4. Faça o upload do código para a sua placa Arduino.
  
## Uso da Interface Web
1. Abra o arquivo HTML da pasta web/ em um navegador.
2. Você verá botões para controlar cada LED e o alarme.
3. Clique nos botões para ligar ou desligar os LEDs.

## Licença
#### Este projeto está licenciado sob a MIT License.

## Contribuições
#### Contribuições são Bem-Vindas!
