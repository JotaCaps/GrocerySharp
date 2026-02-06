## 🧠 Camada de Aplicação — Grocery Sharp

A **Camada de Aplicação** no *Grocery Sharp* é responsável por **mediar a comunicação entre a API e o Domínio**, garantindo que dados externos (HTTP/JSON) nunca acessem diretamente as entidades de negócio.

Ela atua como uma **camada de tradução e orquestração**, mantendo o domínio protegido e o código previsível.

---

## 🎯 Papel da Application no Grocery Sharp

No contexto deste projeto, a Application:

- Define **DTOs de entrada e saída**
- Converte dados externos em **Entidades de Domínio**
- Controla **o fluxo dos casos de uso**
- Evita que Controllers manipulem entidades diretamente
- Garante que o Domínio não conheça HTTP, JSON ou Swagger

Ela **não**:

- Implementa acesso a banco de dados
- Usa Entity Framework
- Contém regras de persistência
- Depende da Infraestrutura

---

## 📦 Estrutura atual da Application

```
📂 GorcerySharp.Application
 ┗ 📂 DTOs
   ┣ CategoryInputModel.cs
   ┣ CategoryViewModel.cs
   ┣ ProductInputModel.cs
   ┣ ProductViewModel.cs
   ┣ UserInputModel.cs
   ┣ GetAllUsersViewModel.cs
   ┣ GetUserByIdViewModel.cs
   ┣ OrderInputModel.cs
   ┣ OrderItemInputModel.cs
   ┣ OrderViewModel.cs
   ┗ PaymentStatusViewModel.cs

```


---

## 🔄 DTOs de Entrada (Input Models)

Os **InputModels** representam **dados que entram no sistema** vindos da API.

Exemplos:

- `CategoryInputModel`
- `ProductInputModel`
- `UserInputModel`
- `OrderInputModel`

Responsabilidades:

- Representar o payload da requisição
- Evitar exposição direta das entidades
- Converter dados externos para o Domínio

Exemplo conceitual:

```csharp
public ProductToEntity()
    =>new Product(Name, Description, Price, Img);

```

📌 **Importante:**

A criação da entidade acontece **na Application**, não no Controller.

---

## 👀 DTOs de Saída (View Models)

Os **ViewModels** representam **dados que saem do sistema**.

Exemplos:

- `ProductViewModel`
- `CategoryViewModel`
- `OrderViewModel`
- `GetAllUsersViewModel`
- `GetUserByIdViewModel`

Responsabilidades:

- Controlar o que a API expõe
- Evitar vazamento de propriedades sensíveis
- Adaptar entidades para respostas HTTP

Exemplo:

```csharp
publicstatic ProductViewModelFromEntity(Product model)
    =>new ProductViewModel(model.Id, model.Name, model.Description, model.Price, model.Img);

```

📌 O Domínio nunca sabe que isso existe.

📌 A API nunca retorna entidades diretamente.

---

## 🔐 Proteção do Domínio

A Application garante que:

- Entidades (`User`, `Product`, `Order`, etc.) **não são serializadas**
- Propriedades sensíveis só são expostas quando necessário
- Regras internas do Domínio não dependem da API

Exemplo claro:

- `GetAllUsersViewModel` **não retorna senha**
- `GetUserByIdViewModel` retorna mais detalhes (uso controlado)

---

## 🧩 Relação com os Controllers

No Grocery Sharp, o fluxo padrão é:

```
Controller
  → InputModel
     → Entity (Domain)
        → Repository (Interface)
           ← Entity
     ← ViewModel
  ← HTTP Response

```

O Controller:

- Recebe HTTP
- Chama a Application (DTOs)
- Retorna resposta

Ele **não decide regra de negócio**.

---

## 🧪 Testabilidade

A Application:

- Não depende de EF Core
- Não depende de banco
- Não depende de ASP.NET

Isso permite:

- Testar mapeamentos
- Testar fluxos de conversão
- Validar contratos de entrada/saída
