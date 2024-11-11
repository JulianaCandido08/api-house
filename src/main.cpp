#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Inclua a biblioteca para JSON

const char* ssid = "inovagil"; // Altere para o SSID da sua rede Wi-Fi
const char* password = "1n0vag1l."; // Altere para a senha da sua rede Wi-Fi

const char* serverName = "http://192.168.1.138:3003/api/leds"; // Use o IP do seu servidor

// Nomes das LEDs e seus respectivos pinos
struct LED {
    String nome;
    int pin;
};

LED leds[] = {
    {"Sala", 2},
    {"Quarto 1", 4},
    {"Quarto 2", 12},
    {"Banheiro", 14},
    {"Garagem", 13},
    {"Luzes Externas", 16}
};

// Defina os pinos para o buzzer e o LED adicional
const int buzzerPin = 17; // Pino do buzzer
const int ledPin = 23;    // Pino do LED adicional

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando ao WiFi...");
    }
    Serial.println("Conectado ao WiFi");

    // Inicializa os pinos das LEDs
    for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
        pinMode(leds[i].pin, OUTPUT); // Configura cada pino como saída
        digitalWrite(leds[i].pin, LOW); // Inicializa todas as LEDs como desligadas
    }
    
    // Configura os pinos do buzzer e do LED adicional como saída
    pinMode(buzzerPin, OUTPUT);
    digitalWrite(buzzerPin, LOW); // Inicializa o buzzer como desligado
    
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW); // Inicializa o LED adicional como desligado
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverName); // Monta a URL da API

        int httpResponseCode = http.GET(); // Faz a requisição GET
        if (httpResponseCode > 0) {
            String payload = http.getString();
            Serial.print("Código de resposta: ");
            Serial.println(httpResponseCode);
            Serial.println(payload);

            // Usando StaticJsonDocument em vez de DynamicJsonDocument
            StaticJsonDocument<1024> doc;
            DeserializationError error = deserializeJson(doc, payload);
            
            if (!error) {
                // Itera sobre cada LED no JSON
                for (int i = 0; i < doc.size(); i++) {
                    String ledNome = doc[i]["nome"].as<String>();
                    int ledStatus = doc[i]["status"].as<int>();

                    Serial.print("LED ");
                    Serial.print(ledNome);
                    Serial.print(": ");
                    Serial.println(ledStatus);

                    // Encontra a LED correspondente e atualiza o estado
                    for (int j = 0; j < sizeof(leds) / sizeof(leds[0]); j++) {
                        if (leds[j].nome == ledNome) {
                            digitalWrite(leds[j].pin, ledStatus); // Liga ou desliga a LED
                        }
                    }

                    // Se o status for 1 e o nome do LED corresponder a "Alarme", liga o buzzer e o LED adicional
                    if (ledStatus == 1 && ledNome == "Alarme") {
                        digitalWrite(buzzerPin, HIGH); // Liga o buzzer
                        digitalWrite(ledPin, HIGH);    // Liga o LED adicional
                        delay(6000);                   // Mantém ambos ligados por 1 segundo
                        digitalWrite(buzzerPin, LOW);  // Desliga o buzzer
                        digitalWrite(ledPin, LOW);     // Desliga o LED adicional
                    }
                }
            } else {
                Serial.print("Erro ao analisar JSON: ");
                Serial.println(error.c_str());
            }
        } else {
            Serial.print("Erro ao fazer GET: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    } else {
        Serial.println("Erro na conexão WiFi");
    }
    delay(3000); // Espera 5 segundos antes de repetir
}