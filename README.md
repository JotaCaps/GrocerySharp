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

> Observação: neste projeto, a Application está **focada em DTOs e mapeamento**, enquanto a orquestração de casos de uso ainda ocorre nos Controllers.
> 

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

---

---

## 🌐 Camada de API — Grocery Sharp

A **Camada de API** é a porta de entrada do sistema.

Ela existe para **traduzir HTTP em chamadas de aplicação** e **traduzir respostas do sistema em HTTP**.

Nada mais.

Nada menos.

---

## 🎯 Responsabilidade da API no projeto

No **Grocery Sharp**, a API é responsável por:

- Expor endpoints REST (`/api/users`, `/api/products`, etc.)
- Receber requisições HTTP
- Validar existência de recursos
- Retornar status HTTP corretos
- Converter DTOs em respostas HTTP

Ela **não**:

- Implementa regra de negócio
- Decide persistência
- Cria queries complexas
- Manipula Entity Framework diretamente

---

## 📦 Estrutura da API

```
📂 GrocerySharp.API
 ┣ 📂 Controllers
 ┃ ┣ CategoryController.cs
 ┃ ┣ ProductController.cs
 ┃ ┣ OrderController.cs
 ┃ ┗ UserController.cs
 ┣ Program.cs
 ┗ appsettings.json

```

---

## 🚦 Controllers como Adaptadores HTTP

Cada Controller do projeto atua como um **adaptador HTTP**.

Exemplo de responsabilidades claras:

- Receber um `InputModel`
- Chamar repositórios (via abstrações)
- Retornar `IActionResult`

Exemplo real (simplificado):

```csharp
[HttpPost]
publicasync Task<IActionResult>Post(ProductInputModel model)
{
var product = model.ToEntity();
var id =await _productRepository.AddAsync(product);

return CreatedAtAction(nameof(GetById),
new { id },
        ProductViewModel.FromEntity(product));
}

```

📌 O Controller:

- Não sabe como o produto é salvo
- Não conhece EF Core
- Não serializa entidades diretamente

---

## 🔁 Fluxo padrão de uma requisição

1. Cliente envia requisição HTTP
2. Controller recebe o payload
3. InputModel converte para Entidade
4. Repositório persiste dados
5. Entidade retorna
6. ViewModel formata resposta
7. API devolve status HTTP correto

Fluxo limpo, previsível e fácil de manter.

---

## 📡 Endpoints expostos

### Categories

- `POST /api/categories`
- `GET /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Products

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `PUT /api/orders/{id}`
- `PUT /api/orders/{id}/confirm-payment`
- `DELETE /api/orders/{id}`

---

## 🧠 Tratamento de erros e status HTTP

O projeto segue boas práticas REST:

- `200 OK` → sucesso
- `201 Created` → recurso criado
- `204 NoContent` → update/delete sem retorno
- `400 BadRequest` → erro de validação
- `404 NotFound` → recurso inexistente

Isso garante:

- API previsível
- Frontend feliz
- Debug sem sofrimento

---

## 🔌 Configuração e Pipeline (Program.cs)

A API configura:

- **Entity Framework + SQL Server**
- **Injeção de Dependência** dos repositórios
- **Swagger** para documentação
- **CORS** liberado para o frontend
- **JSON** com `IgnoreCycles` para evitar loop de serialização

```csharp
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddCors(...);
builder.Services.AddControllers();

```

---

## 🔐 Segurança e responsabilidades

Mesmo sem autenticação implementada ainda:

- API já separa responsabilidades
- Repositórios são acessados por interfaces
- Controllers são facilmente protegíveis no futuro (JWT, Roles, etc.)

---

---

## 🧩 Camada de Domínio — Grocery Sharp

A **Camada de Domínio** contém o **núcleo do negócio**.

Ela representa conceitos reais da mercearia: **Usuários, Produtos, Pedidos, Pagamentos, Categorias** e as **regras que governam essas entidades**.

Essa camada **não depende de nada externo**.

Se amanhã você jogar fora a API, o banco e o framework, o domínio continua fazendo sentido.

---

## 🎯 Responsabilidade do Domínio

No Grocery Sharp, o Domínio é responsável por:

- Representar **entidades do negócio**
- Garantir **consistência de estado**
- Centralizar **regras de negócio**
- Definir **comportamentos**, não só dados
- Expor contratos (interfaces) para persistência

Ele **não**:

- Conhece HTTP
- Conhece banco de dados
- Usa Entity Framework
- Sabe o que é JSON, Swagger ou Docker

---

## 📦 Estrutura do Domínio

```
📂 GrocerySharp.Domain
 ┣ 📂 Entities
 ┃ ┣ BaseEntity.cs
 ┃ ┣ User.cs
 ┃ ┣ Role.cs
 ┃ ┣ Product.cs
 ┃ ┣ Category.cs
 ┃ ┣ Order.cs
 ┃ ┣ OrderItem.cs
 ┃ ┗ Payment.cs
 ┣ 📂 Enums
 ┃ ┣ OrderStatus.cs
 ┃ ┗ PaymentStatus.cs
 ┣ 📂 Abstractions
 ┃ ┣ 📂 Interfaces
 ┃ ┃ ┗ ISoftDelete.cs
 ┃ ┗ 📂 Repositories
 ┃   ┣ IUserRepository.cs
 ┃   ┣ IProductRepository.cs
 ┃   ┣ IOrderRepository.cs
 ┃   ┣ ICategoryRepository.cs
 ┃   ┗ IRoleRepository.cs

```

---

## 🧱 Entidades e Identidade

Todas as entidades herdam de `BaseEntity`, que define a **identidade única**:

```csharp
publicclassBaseEntity
{
publicint Id {get;set; }
}

```

📌 No domínio, **identidade importa mais que dados**.

Dois produtos com o mesmo nome não são o mesmo produto.

---

## 👤 User e Roles

O `User` representa qualquer pessoa no sistema.

Características importantes:

- Possui múltiplos papéis (`Roles`)
- Pode ter vários pedidos
- Implementa **Soft Delete**

```csharp
publicclassUser :BaseEntity,ISoftDelete

```

Regras encapsuladas:

- Atualização de dados via método `Update`
- Exclusão lógica controlada pela Infra

Nenhuma propriedade sensível é pública para escrita direta.

---

## 🛒 Product e Category

### Product

Representa um item vendável.

- Nome, descrição, preço e imagem
- Relacionamento N:N com `Category`
- Participa de pedidos (`OrderItem`)
- Implementa **Soft Delete**

```csharp
publicvoidUpdate(string name,string description,decimal price,string img)

```

📌 Alterações passam por comportamento, não por `set` solto.

### Category

Agrupa produtos por classificação lógica.

- Nome imutável externamente
- Lista de produtos associados
- Método `Update` para mudanças controladas

---

## 📦 Order, OrderItem e Payment

### Order

É o agregado central de uma compra.

Responsabilidades:

- Pertence a um usuário
- Possui status próprio
- Controla itens do pedido
- Possui um pagamento associado

```csharp
publicOrder(int userId, OrderStatus status,decimal totalAmount)

```

O pedido nasce com:

- Status inicial definido
- Pagamento criado automaticamente
- Data registrada no momento da criação

---

### OrderItem

Representa a relação entre produto e pedido.

- Produto
- Quantidade
- Preço no momento da compra

📌 Preço é copiado para evitar alteração histórica.

---

### Payment

Encapsula regras de pagamento.

Estados possíveis:

- Pending
- Paid
- Cancelled

Regras explícitas:

```csharp
publicvoidConfirm() => Status = PaymentStatus.Paid;
publicvoidCancel() => Status = PaymentStatus.Cancelled;

```

Nenhuma atualização direta de status fora do domínio.

---

## 🧹 Soft Delete como Regra de Domínio

Entidades que implementam `ISoftDelete`:

- `User`
- `Product`

Contrato:

```csharp
bool IsDeleted;
DateTime? DeletedAt;

```

📌 O Domínio define **o conceito**.

📌 A Infra decide **como aplicar**.

---

## 📜 Repositórios como Contratos

Interfaces como:

- `IUserRepository`
- `IProductRepository`
- `IOrderRepository`

Definem **o que o domínio precisa**, não **como é feito**.

Exemplo:

```csharp
Task<Product> GetByIdAsync(int id);

```

O domínio não sabe se isso vem de SQL, Mongo ou magia negra.

---

## 🧪 Testabilidade do Domínio

O domínio pode ser testado:

- Sem banco
- Sem API
- Sem EF
- Sem mocks complexos

Se uma regra quebra aqui, o sistema inteiro quebra, por isso ele é pequeno, claro e protegido.

---

---

## 🏗️ Camada de Infraestrutura — Grocery Sharp

A **Camada de Infraestrutura (Infra)** é onde o sistema conversa com o mundo real.

Banco de dados, Entity Framework, migrations e implementações concretas vivem aqui.

Se algo **quebra quando troca tecnologia**, é porque está aqui — e **tem que ser assim**.

---

## 🎯 Responsabilidade da Infra no projeto

No Grocery Sharp, a Infra é responsável por:

- Implementar os **repositórios definidos no Domínio**
- Configurar e gerenciar o **Entity Framework Core**
- Persistir dados no **SQL Server**
- Aplicar **Soft Delete**
- Gerenciar **migrations e schema do banco**

Ela **não**:

- Contém regras de negócio
- Decide fluxo de aplicação
- Conhece Controllers
- Define contratos (isso é papel do Domínio)

---

## 📦 Estrutura da Infra

```
📂 GrocerySharp.Infra
 ┣ 📂 Persistence
 ┃ ┣ GrocerySharpDbContext.cs
 ┃ ┗ 📂 Migrations
 ┣ 📂 Repositories
 ┃ ┣ UserRepository.cs
 ┃ ┣ RoleRepository.cs
 ┃ ┣ ProductRepository.cs
 ┃ ┣ CategoryRepository.cs
 ┃ ┗ OrderRepository.cs

```

---

## 🗄️ DbContext (GrocerySharpDbContext)

O `GrocerySharpDbContext` é o **centro nervoso da persistência**.

Responsabilidades principais:

- Mapear entidades do Domínio
- Configurar relacionamentos
- Aplicar filtros globais
- Controlar comportamento de delete

---

### 🔁 Soft Delete automático

Entidades que implementam `ISoftDelete` recebem um **filtro global**:

```csharp
builder.Entity(entityType.ClrType).HasQueryFilter(filter);

```

E no `SaveChangesAsync`:

- `Delete` vira `Update`
- `IsDeleted = true`
- `DeletedAt = DateTime.UtcNow`

📌 Resultado:

- Nenhum `WHERE IsDeleted = false` espalhado
- Regra centralizada
- Código limpo

---

## 🔗 Relacionamentos mapeados

A Infra define como o domínio vira banco:

- **User ↔ Roles** → many-to-many (`UserRoles`)
- **User → Orders** → one-to-many
- **Order → Payment** → one-to-one
- **Order ↔ Product** → many-to-many via `OrderItem`
- **Product ↔ Category** → many-to-many

📌 O domínio descreve **o que é**,

a Infra decide **como armazenar**.

---

## 📚 Repositórios (implementações)

Cada repositório:

- Implementa uma interface do Domínio
- Usa EF Core internamente
- Encapsula queries e persistência

Exemplo real:

```csharp
publicclassProductRepository :IProductRepository

```

O resto do sistema só conhece a **interface**.

Trocar SQL Server por outro banco?

Só mexe aqui.

---

## 🧪 Comportamento previsível

Características importantes:

- `AddAsync` sempre salva e retorna `Id`
- `UpdateAsync` centraliza persistência
- `DeleteAsync` respeita Soft Delete
- Queries retornam entidades já filtradas

Nada de lógica escondida em Controller.

---

## 📦 Migrations

A Infra é dona do schema.

- Criação de tabelas
- Relacionamentos
- Índices
- Seed inicial (`Roles`)

Tudo versionado, rastreável e reproduzível.
---

## 🔌 Integração com a API (DI)

No `Program.cs` da API:

```csharp
builder.Services.AddScoped<IProductRepository, ProductRepository>();

```

📌 A API injeta **interfaces**

📌 A Infra entrega **implementações**

Isso fecha o ciclo da Clean Architecture.

---
