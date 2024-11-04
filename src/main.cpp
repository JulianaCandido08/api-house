#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> 

const char* ssid = "xxxxxx"; // Altere para o SSID da sua rede Wi-Fi
const char* password = "xxxxxxx"; // Altere para a senha da sua rede Wi-Fi

const char* serverName = "http://192.168.x.x:3003/api/leds"; // Use o IP do seu servidor

// Declaração das Leds 
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

// Alarme
const int buzzerPin = 17; 
const int ledPin = 23;    

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando ao WiFi...");
    }
    Serial.println("Conectado ao WiFi");

    for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
        pinMode(leds[i].pin, OUTPUT); 
        digitalWrite(leds[i].pin, LOW); // Começa todas as leds desligadas
    }
    
    //Alarme
    pinMode(buzzerPin, OUTPUT);
    digitalWrite(buzzerPin, LOW); // Começa com o buzzer desligado
    
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW); 
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverName); 

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
                        digitalWrite(buzzerPin, HIGH); 
                        digitalWrite(ledPin, HIGH);    
                        delay(6000);                   
                        digitalWrite(buzzerPin, LOW);  
                        digitalWrite(ledPin, LOW);     
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
    delay(3000); 
}