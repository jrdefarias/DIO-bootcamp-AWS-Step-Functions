# AWS Step Functions: Orquestração Serverless com Star Wars API (SWAPI)

Este repositório foi desenvolvido para o desafio prático da DIO. O objetivo é demonstrar a consolidação de workflows automatizados utilizando o **AWS Step Functions** para orquestrar chamadas de API e tomar decisões de fluxo baseadas em dados dinâmicos.

Para manter o laboratório focado na arquitetura serverless e na manipulação de estados, o projeto consome dados reais da saga Star Wars utilizando a **SWAPI** (`https://swapi.info/`).

---

## 📌 Visão Geral do AWS Step Functions

O AWS Step Functions é um orquestrador de fluxos de trabalho visual e baseado em estados (State Machines). Ele permite conectar diferentes serviços da AWS (como AWS Lambda, Amazon ECS, DynamoDB, SNS, SQS) em sequências lógicas estruturadas, tratando erros, retentativas e paralelismo de forma nativa.

### Conceitos-Chave Absorvidos:
* **Estados (States):** Elementos que compõem a máquina de estados. Podem ser de execução (`Task`), decisão (`Choice`), espera (`Wait`), ou finalização (`Pass`, `Fail`, `Succeed`).
* **ASL (Amazon States Language):** Linguagem baseada em JSON utilizada para definir a estrutura e o comportamento do workflow.
* **Gerenciamento de Estado Nativo:** A AWS cuida do progresso e do histórico de execução, reduzindo a complexidade do código da aplicação (`computeless orchestration`).

---

## 🏗️ Arquitetura do Projeto

O fluxo foi desenhado para ser o mais enxuto e performático possível, eliminando a necessidade de bancos de dados intermediários e utilizando recursos 100% *computeless* para a tomada de decisões.

1. **Input do Usuário:** O fluxo recebe um ID de personagem (variando de 1 a 83).
2. **AWS Lambda (Node.js):** Realiza um `fetch` assíncrono na SWAPI para extrair as informações do personagem.
3. **AWS Step Functions (Choice State):** Avalia nativamente o tamanho do array de filmes (`films_count`).
4. **Classificação:** Separa dinamicamente os personagens entre **Principais** (mais de 3 filmes) ou **Coadjuvantes**.

---

## 📂 Estrutura de Arquivos

* `/lambda/index.mjs` - Função AWS Lambda escrita em JavaScript nativo (Node.js 20+) usando `fetch` para consumo da API.
* `/step-functions/state-machine.json` - Definição da máquina de estados escrita em *Amazon States Language* (ASL).
* `/images/test-success.png` - Execução bem-sucedida, utilizando um ID válido dentro do intervalo permitido (1 a 83).
* `/images/test-error.png` - Execução com falha, ao utilizar um ID inválido fora da lista de valores aceitos.

---

## 💡 Aprendizados e Insights Técnicos

* **Abstração de Controle de Fluxo:** Em vez de poluir o código JavaScript da Lambda com condicionais (`if/else`) para decidir o rumo da aplicação, essa lógica foi delegada ao Step Functions usando o estado `Choice`. Isso torna o microsserviço focado apenas em buscar o dado, enquanto o orquestrador cuida do negócio.
* **Modern JavaScript na AWS:** O uso do Node.js runtime com `fetch` nativo eliminou a necessidade de empacotar pastas `node_modules` pesadas com bibliotecas de terceiros (como Axios), deixando o deploy da Lambda extremamente leve e rápido.
* **Manipulação de Estado (JSON):** Compreensão prática de como os payloads transitam entre os estados através dos seletores do Step Functions, enriquecendo o JSON original com a propriedade `$.resultado_analise`.

---

## 🚀 Como Executar o Laboratório

### 1. Criar a Lambda
* Crie uma função no console da AWS Lambda com o runtime **Node.js 20.x**.
* Cole o código contido na pasta `/lambda/index.mjs` e faça o Deploy.

### 2. Configurar o Step Functions
* No console do AWS Step Functions, crie uma nova máquina de estados *Standard*.
* Cole o código JSON de `/step-functions/state-machine.json`.
* **Atenção:** Lembre-se de substituir o campo `"Resource"` pelo ARN gerado pela sua Lambda.

### 3. Testar os Personagens (IDs 1 a 83)
Inicie uma execução passando o ID do personagem desejado no payload de entrada:

```json
{
  "character_id": 1
}
```

Experimente os IDs para ver o Step Functions alternar os caminhos visualmente no console da AWS!

---

## 🔗 Referências

* [AWS Step Functions](https://docs.aws.amazon.com/pt_br/step-functions/latest/dg/welcome.html)
* [Amazon States Language](https://docs.aws.amazon.com/pt_br/step-functions/latest/dg/concepts-amazon-states-language.html)
