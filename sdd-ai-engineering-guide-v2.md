# SDD + AI Engineering Guide v2

> **Guia operacional para integrar Spec-Driven Development com execução
> assistida por IA em sistemas reais, incluindo ambientes com múltiplos
> microsserviços.**
>
> Este documento é agnóstico de produto, stack e organização. Ele foi
> pensado para ser versionado no repositório e lido tanto por pessoas
> quanto por agentes de IA.

------------------------------------------------------------------------

## 1. Propósito

Este guia complementa uma prática existente de **Spec-Driven Development
(SDD)**.

Ele não substitui a metodologia de SDD usada pela equipe. Em particular,
pode ser utilizado como uma camada complementar a uma Skill como **TLC
Spec-Driven Development**.

O problema tratado aqui é mais amplo:

1.  Como dar à IA contexto confiável sobre um sistema existente?
2.  Como descobrir o impacto real de uma mudança antes de especificá-la?
3.  Como transformar uma especificação em blocos executáveis?
4.  Como permitir autonomia sem perder controle?
5.  Como exigir evidência concreta de que cada requisito foi
    implementado?
6.  Como trabalhar com múltiplos microsserviços e contratos
    distribuídos?
7.  Como aprender com os erros encontrados durante implementação e
    review?

A ideia central é:

``` text
ENTENDER O SISTEMA
        ↓
ENTENDER A MUDANÇA
        ↓
ESPECIFICAR
        ↓
PLANEJAR
        ↓
EXECUTAR EM BLOCOS
        ↓
PROVAR
        ↓
REVISAR
        ↓
INTEGRAR
        ↓
APRENDER
```

------------------------------------------------------------------------

# 2. Modelo mental

O processo é dividido em camadas com responsabilidades diferentes.

``` text
┌──────────────────────────────────────────────┐
│ SYSTEM BASELINE                              │
│ Como o sistema funciona hoje?                │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ DISCOVERY + IMPACT ANALYSIS                  │
│ O que queremos mudar e onde isso impacta?    │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ SDD                                          │
│ Specification → Design → Tasks               │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ DEFINITION OF READY                          │
│ O bloco possui contexto suficiente?          │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ IMPLEMENTATION BLOCK PROTOCOL v2             │
│ Como implementar, testar, provar e parar?    │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ INDEPENDENT REVIEW                           │
│ O commit real satisfaz o contrato?           │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ FEATURE INTEGRATION / REGRESSION GATE        │
│ A mudança funciona no ecossistema?           │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ SDD RETROSPECTIVE                            │
│ O que o processo deve aprender?              │
└──────────────────────┬───────────────────────┘
                       │
                       └──────────→ melhora o processo
```

------------------------------------------------------------------------

# 3. Princípios fundamentais

1.  **Repository reality wins.** O código, configurações, migrations,
    testes e contratos reais devem ser inspecionados antes de assumir
    comportamento.
2.  **Não inventar informação.** Se algo não foi comprovado, deve ser
    marcado como inferido ou desconhecido.
3.  **SDD define a mudança; o protocolo de execução não redefine
    produto.**
4.  **Autonomia termina no limite do implementation block.**
5.  **Teste verde não significa requisito testado.**
6.  **Código existente não significa contrato comprovado.**
7.  **Working tree limpa não significa commit completo.**
8.  **Relatório do agente não substitui evidência versionada.**
9.  **Testes são evidência, não prova absoluta.**
10. **Cada bloco possui uma Definition of Done verificável.**
11. **Correções seguras podem ser autônomas dentro do bloco.**
12. **Mudanças materiais de contrato, arquitetura ou segurança exigem
    STOP.**
13. **Revisão independente ocorre entre blocos.**
14. **A IA deve conhecer também o que NÃO pode mudar.**
15. **O processo deve aprender com defeitos recorrentes.**
16. **Documentação arquitetural deve ser living documentation, não
    fotografia esquecida.**

------------------------------------------------------------------------

# 4. Estrutura recomendada no repositório

Adapte os nomes ao padrão da organização.

``` text
/
├── AGENTS.md
├── .ai/
│   ├── context/
│   │   ├── system-context.md
│   │   ├── architecture.md
│   │   ├── services-catalog.md
│   │   ├── integration-map.md
│   │   ├── engineering-standards.md
│   │   ├── testing-standards.md
│   │   └── implementation-block-protocol.md
│   │
│   ├── decisions/
│   │   └── ADR-XXXX-*.md
│   │
│   └── features/
│       └── FXXX-feature/
│           ├── discovery.md
│           ├── impact-analysis.md
│           ├── specification.md
│           ├── design.md
│           ├── tasks.md
│           └── retrospective.md
│
└── ...
```

Não é obrigatório usar exatamente essa estrutura. O importante é manter
responsabilidades separadas.

------------------------------------------------------------------------

# 5. AGENTS.md

`AGENTS.md` deve ser curto e normativo.

Ele não deve duplicar todos os detalhes do processo.

Exemplo:

``` md
# AI Engineering Rules

Before implementation, read the applicable system context,
feature Specification, Design, Tasks and
implementation-block-protocol.md.

All implementation work MUST follow the Implementation Block Protocol.

Rules:

- execute one implementation block at a time;
- repository reality wins over assumptions;
- mandatory gates are blocking;
- READY_FOR_REVIEW always means STOP;
- never automatically start the next block;
- material contract, architecture or security decisions require STOP;
- never discard preexisting user changes;
- push/merge follow the organization's human-controlled policy.
```

------------------------------------------------------------------------

# 6. System Baseline

## 6.1 Objetivo

O System Baseline descreve **o sistema como ele existe hoje**.

Não é roadmap.

Não é proposta de refatoração.

Não é opinião arquitetural.

Ele responde:

> O que temos agora e quais evidências comprovam isso?

------------------------------------------------------------------------

## 6.2 Não documente tudo de uma vez

Em sistemas grandes, principalmente microsserviços, não tente produzir
uma enciclopédia completa antes de continuar desenvolvendo.

Use:

``` text
BASELINE GLOBAL RASO
        ↓
nova feature
        ↓
serviços impactados
        ↓
baseline aprofundado desses serviços
        ↓
implementação
        ↓
baseline atualizado
```

O contexto melhora progressivamente.

------------------------------------------------------------------------

## 6.3 Classificação de evidência

Toda informação importante descoberta pela IA deve poder ser
classificada.

``` text
CONFIRMED_BY_CODE
CONFIRMED_BY_CONFIG
CONFIRMED_BY_TEST
CONFIRMED_BY_SCHEMA
CONFIRMED_BY_DOC
INFERRED
UNKNOWN
```

Exemplo:

``` md
### Idempotência

Status: CONFIRMED_BY_CODE

Evidence:
- PaymentConsumer.java
- IdempotencyRepository.java

Behavior:
A chave eventId é persistida antes da confirmação do processamento.
```

Não permitir que `INFERRED` seja escrito como fato confirmado.

------------------------------------------------------------------------

# 7. Services Catalog

Para ambientes com múltiplos microsserviços, mantenha um catálogo
operacional.

Template:

``` md
# Service: <service-name>

## Responsibility
...

## Ownership
...

## Stack
...

## Entry points
...

## APIs provided
...

## APIs consumed
...

## Events published
...

## Events consumed
...

## Persistence
...

## External dependencies
...

## Authentication
...

## Authorization
...

## Retry / timeout / resilience
...

## Idempotency
...

## Observability
...

## Test strategy
...

## Deployment
...

## Known constraints
...

## Evidence
...
```

O objetivo não é descrever cada classe.

O objetivo é permitir que um engenheiro ou agente entenda rapidamente
**a responsabilidade e as fronteiras do serviço**.

------------------------------------------------------------------------

# 8. Integration Map

O Integration Map deve tornar dependências explícitas.

Exemplo:

``` text
customer-service
    ├── REST → account-service
    ├── publishes → customer.created
    └── consumes → customer.updated

account-service
    ├── REST → fraud-service
    └── DB → PostgreSQL

notification-service
    └── consumes → customer.created
```

Para integrações importantes, registre:

``` text
Producer
Consumer
Transport
Endpoint / Topic
Contract / Schema
Sync / Async
Authentication
Timeout
Retry
Fallback
Idempotency
Ordering assumptions
Compatibility policy
Failure behavior
Observability
```

------------------------------------------------------------------------

# 9. Documentation Drift

Durante qualquer feature, se o agente provar que a documentação está
incorreta, ele deve reportar:

``` text
DOCUMENTATION_DRIFT

Document:
integration-map.md

Current statement:
service-a calls service-b synchronously.

Repository evidence:
service-a publishes EventX through Kafka.

Classification:
STALE_DOCUMENTATION
```

A documentação não deve ser silenciosamente ignorada.

A correção pode:

-   entrar no bloco, se for diretamente relacionada e autorizada; ou
-   gerar uma task documental separada.

------------------------------------------------------------------------

# 10. Separar AS-IS, Assessment e TO-BE

Nunca peça:

> documente o sistema e diga como melhorar tudo.

Separe:

``` text
PHASE 1 — AS-IS
O que existe?

PHASE 2 — ASSESSMENT
Quais problemas e riscos existem?

PHASE 3 — TO-BE / ROADMAP
O que vale mudar e em qual ordem?
```

Isso evita que documentação factual seja contaminada por preferências
arquiteturais da IA.

------------------------------------------------------------------------

# 11. Discovery

Discovery fecha ambiguidades de negócio e de comportamento antes da
Specification.

Perguntas típicas:

-   Quem são os atores?
-   Qual é o comportamento desejado?
-   Quais estados existem?
-   Quais transições são válidas?
-   Quais casos são inválidos?
-   Quais decisões ainda estão abertas?
-   O que explicitamente não pertence à feature?
-   Há compatibilidade retroativa?
-   Há requisitos de segurança?
-   Há comportamento temporal?
-   Há requisitos de concorrência/idempotência?

Saída:

``` text
decisões suficientes para escrever Specification
sem inventar comportamento durante implementação
```

------------------------------------------------------------------------

# 12. Impact Analysis

## 12.1 Obrigatório para mudanças relevantes

Antes do Design/Tasks, especialmente em microsserviços, determine o
blast radius.

Template:

``` md
# Impact Analysis

## Change summary
...

## Directly affected services
- ...

## Indirectly affected services
- ...

## APIs affected
- ...

## Events affected
- ...

## Persistence affected
- ...

## Upstream dependencies
- ...

## Downstream consumers
- ...

## Compatibility risks
- ...

## Security impact
- ...

## Observability impact
- ...

## Migration impact
- ...

## Deployment / rollout impact
- ...

## Tests required
- ...

## Services inspected but NOT affected
- ...

## Unknowns
- ...

## Decisions required before implementation
- ...
```

------------------------------------------------------------------------

# 13. Blast Radius

Cada feature/bloco deve declarar também o escopo negativo.

Exemplo:

``` md
## Expected Blast Radius

### May change
- payment-service
- PaymentCreated event producer

### Must remain unchanged
- public REST response
- topic name
- partition key
- fraud-service behavior
- database schema X

### Consumers requiring regression
- accounting-service
- notification-service
```

Dizer à IA o que **não pode mudar** é tão importante quanto dizer o que
implementar.

------------------------------------------------------------------------

# 14. Specification

Specification descreve comportamento observável.

Deve conter, conforme aplicável:

-   regras de negócio;
-   invariantes;
-   lifecycle;
-   estados;
-   casos válidos;
-   casos inválidos;
-   ownership;
-   segurança;
-   compatibilidade;
-   non-goals;
-   Acceptance Criteria.

Evite detalhes de implementação que pertencem ao Design.

------------------------------------------------------------------------

# 15. Design / Technical Plan

O Design transforma a Specification em decisões técnicas.

Pode conter:

-   domínio;
-   persistência;
-   migrations;
-   APIs;
-   schemas;
-   eventos;
-   segurança;
-   autorização;
-   idempotência;
-   concorrência;
-   retry;
-   timeout;
-   fallback;
-   observabilidade;
-   compatibilidade;
-   rollout;
-   frontend state model;
-   estratégia de testes.

Mudança material de produto descoberta aqui deve voltar para decisão
humana, não ser escondida como decisão técnica.

------------------------------------------------------------------------

# 16. ADR --- Architecture Decision Record

Use ADR para decisões arquiteturais relevantes e duradouras.

Não crie ADR para cada detalhe.

Bom candidato:

-   introdução de novo tópico/evento;
-   mudança de estratégia de idempotência;
-   novo mecanismo de persistência;
-   alteração relevante de comunicação síncrona/assíncrona;
-   decisão de compatibilidade;
-   padrão de segurança;
-   escolha arquitetural com trade-offs importantes.

Template:

``` md
# ADR-XXXX — <title>

## Status
Proposed | Accepted | Superseded

## Context
...

## Decision
...

## Alternatives considered
...

## Consequences
...

## Compatibility / migration
...

## Evidence / references
...
```

------------------------------------------------------------------------

# 17. Tasks como Implementation Blocks

Tasks devem ser agrupadas por coesão técnica.

Exemplo:

``` text
Block A — Domain + Persistence
Block B — Application + API + Security
Block C — Cross-service integration
Block D — Frontend
Block E — Observability / rollout integration
```

Não existe tamanho fixo.

O bloco ideal:

-   tem objetivo claro;
-   pode ser validado isoladamente;
-   produz evidência;
-   cabe em um commit coerente;
-   não exige contexto excessivo;
-   possui fronteira clara para review.

------------------------------------------------------------------------

# 18. Template de Implementation Block

``` md
## Block A — <objective>

### Scope

A1. ...
A2. ...
A3. ...

### Non-goals

- ...
- ...

### Expected Blast Radius

May change:
- ...

Must remain unchanged:
- ...

### Immutable Contracts

C-A01 ...
C-A02 ...

### Acceptance Criteria

AC-A01 ...
AC-A02 ...
AC-A03 ...

### Mandatory Evidence

- AC → exact test evidence matrix
- focused tests
- full relevant regression
- build/static checks
- adversarial self-review
- diff gate
- post-commit audit

### Commit

feat(feature): ...

### Ready Marker

FEATURE_BLOCK_A_READY_FOR_REVIEW
```

------------------------------------------------------------------------

# 19. Definition of Ready para IA

Uma task existir não significa que ela esteja pronta para execução.

Antes de implementar:

``` text
DEFINITION OF READY

[ ] Specification aprovada
[ ] Design/Plan suficiente
[ ] Impact Analysis realizado quando aplicável
[ ] serviços afetados conhecidos
[ ] upstream/downstream conhecidos
[ ] contratos relevantes identificados
[ ] Acceptance Criteria testáveis
[ ] non-goals definidos
[ ] blast radius definido
[ ] dependências conhecidas
[ ] decisões arquiteturais materiais resolvidas
[ ] decisões de segurança materiais resolvidas
[ ] nenhuma ambiguidade de produto bloqueante
[ ] baseline do repositório confirmado
```

Se um item obrigatório estiver ausente:

``` text
NOT_READY_FOR_IMPLEMENTATION
```

Não improvisar.

------------------------------------------------------------------------

# 20. Preflight antes de cada bloco

Antes de editar código:

``` text
1. confirmar cwd;
2. confirmar branch;
3. confirmar HEAD;
4. confirmar git status;
5. ler System Context relevante;
6. ler Impact Analysis;
7. ler Specification;
8. ler Design;
9. ler Tasks;
10. inspecionar código REAL;
11. inspecionar testes relevantes;
12. confirmar upstream/downstream;
13. comparar documentação com repository reality;
14. executar Definition of Ready.
```

Divergência material:

``` text
BASELINE_MISMATCH
```

→ STOP.

------------------------------------------------------------------------

# 21. Implementation Block Protocol v2

Sequência obrigatória:

``` text
IMPLEMENT
  → SCOPE GATE
  → CONTRACT GATE
  → TEST-EVIDENCE GATE
  → FOCUSED TEST GATE
  → FULL REGRESSION GATE
  → BUILD / STATIC GATE
  → ADVERSARIAL SELF-REVIEW
  → DIFF GATE
  → COMMIT
  → POST-COMMIT AUDIT
  → READY_FOR_REVIEW
  → STOP
```

A autonomia termina no limite do bloco.

O próximo bloco nunca começa automaticamente.

------------------------------------------------------------------------

# 22. Scope Gate

Comparar o diff com:

-   Scope;
-   Non-goals;
-   Expected Blast Radius;
-   blocos futuros.

Confirmar:

``` text
[ ] somente escopo autorizado
[ ] nenhum refactor oportunista
[ ] nenhum bloco futuro iniciado
[ ] nenhuma alteração incidental
[ ] alterações preexistentes do usuário preservadas
```

Expansão material:

``` text
SCOPE_MISMATCH → STOP
```

------------------------------------------------------------------------

# 23. Contract Gate

Transformar contratos em afirmações verificáveis.

Exemplo:

``` text
C01 PASS — public API remains backward compatible.
Evidence: ...

C02 PASS — foreign ownership is not exposed.
Evidence: ...

C03 FAIL — event schema changed.
Evidence: ...
```

FAIL material:

``` text
CONTRACT_MISMATCH → STOP
```

------------------------------------------------------------------------

# 24. Microservice Contract Gate

Para mudanças em fronteiras entre serviços, verificar explicitamente:

``` text
[ ] request schema
[ ] response schema
[ ] HTTP status
[ ] headers
[ ] endpoint
[ ] event schema
[ ] topic
[ ] partition key
[ ] serialization
[ ] ordering assumptions
[ ] idempotency
[ ] retry semantics
[ ] timeout
[ ] fallback
[ ] authentication
[ ] authorization
[ ] backward compatibility
[ ] consumer compatibility
[ ] observability
```

O relatório deve declarar:

``` text
CONTRACT_CHANGE = NONE
```

ou:

``` text
CONTRACT_CHANGE = YES
```

Se `YES`, os consumidores impactados devem estar identificados e
validados conforme o Design.

------------------------------------------------------------------------

# 25. Test-Evidence Gate --- bloqueante

Para cada Acceptance Criterion obrigatório:

``` text
AC | behavior | test file | exact test name | result
```

Exemplo:

``` text
AC-A01 | own resource is returned
ResourceControllerIntegrationTest.java
returnsOwnedResource
PASS
```

Se qualquer AC obrigatório não possuir evidência adequada:

``` text
BLOCK INCOMPLETE
```

`READY_FOR_REVIEW` é proibido.

------------------------------------------------------------------------

# 26. Classificação dos testes

Sempre reportar:

``` text
New tests: N
Modified tests: N
Preexisting tests executed: N

Focused suite: N/N
Full suite: N/N
```

Nunca usar apenas:

``` text
102 tests passed
```

como evidência de requisito novo.

------------------------------------------------------------------------

# 27. Focused Test Gate

Executar primeiro os testes diretamente relacionados ao bloco.

Se falharem:

1.  classificar;
2.  corrigir somente dentro da política autorizada;
3.  repetir;
4.  não avançar como se o gate tivesse passado.

------------------------------------------------------------------------

# 28. Full Regression Gate

Depois dos focused tests:

-   suíte completa relevante do serviço;
-   suites de consumidores diretamente impactados quando aplicável;
-   contract tests;
-   integration tests;
-   demais quality gates obrigatórios da organização.

Falha não pode ser descartada como "não relacionada" sem evidência.

------------------------------------------------------------------------

# 29. Build / Static Gate

Executar conforme o projeto:

-   build;
-   package;
-   compile;
-   typecheck;
-   lint;
-   static analysis;
-   Sonar;
-   SAST;
-   dependency scanning;
-   migration validation;
-   formatting/diff check.

Classificar:

``` text
ERROR
NEW_WARNING
PREEXISTING_WARNING
```

------------------------------------------------------------------------

# 30. Adversarial Self-Review

Antes do commit, o agente deve tentar reprovar o próprio trabalho.

Verificar:

``` text
1. Happy path sem teste?
2. Failure path sem teste?
3. Fallback com perda de dados?
4. Loading/error permite mutation perigosa?
5. Null/absent incorreto?
6. Ownership/security bypass?
7. Mutation parcial em erro?
8. Ordenação alterada?
9. Compatibilidade quebrada?
10. Retry/idempotência incoerentes?
11. Timeout/fallback alterados?
12. Consumer não considerado?
13. Requisito do prompt ausente no diff?
14. Teste verde que não prova o comportamento?
15. Bloco futuro iniciado?
16. Documentação ficou divergente do código?
```

Cada item:

``` text
PASS + evidence
```

ou:

``` text
FAIL + evidence
```

FAIL obrigatório deve ser corrigido ou causar STOP.

------------------------------------------------------------------------

# 31. Diff Gate

Antes do commit:

``` bash
git status
git diff --check
git diff --stat
git diff
```

Revisar como reviewer.

Confirmar:

``` text
[ ] escopo correto
[ ] testes presentes
[ ] nenhuma alteração incidental
[ ] nenhum segredo
[ ] nenhum debug temporário
[ ] nenhuma feature futura
[ ] documentação necessária atualizada
```

------------------------------------------------------------------------

# 32. Commit Policy

Padrão recomendado:

``` text
1 implementation block = 1 implementation commit
```

Correção encontrada posteriormente:

``` text
novo commit
```

Evitar:

``` text
amend
automatic squash
reset --hard
clean -fd
automatic push
```

A trilha de correções é informação útil para retrospectiva.

------------------------------------------------------------------------

# 33. Post-Commit Audit

Obrigatório:

``` bash
git show --stat --oneline HEAD
git show --name-only HEAD
git diff HEAD^ HEAD --check
git status --short
```

Confirmar:

``` text
[ ] arquivos esperados estão no commit
[ ] testes novos/modificados estão no commit
[ ] nenhum arquivo fora do escopo
[ ] nenhum requisito ficou apenas na working tree
[ ] working tree limpa
[ ] commit corresponde ao bloco
```

Falha:

``` text
READY_FOR_REVIEW proibido
```

------------------------------------------------------------------------

# 34. READY_FOR_REVIEW

`READY_FOR_REVIEW` significa:

> O agente possui evidência suficiente para submeter o bloco a revisão
> independente.

Não significa:

> A feature está aprovada.

Depois do marker:

``` text
STOP
```

Nunca iniciar automaticamente o próximo bloco.

------------------------------------------------------------------------

# 35. Safe Autocorrection / STOP Taxonomy

## Pode autocorrigir

### EXECUTION_CONTEXT

-   cwd;
-   path;
-   comando incorreto.

### ENVIRONMENT

-   container;
-   porta;
-   configuração local reversível.

### TEST_DEFECT

-   expectativa de teste comprovadamente incorreta quando produção está
    demonstravelmente correta.

### TOOLING

-   comando equivalente seguro.

### DOCUMENTATION / CONFIG

-   correção inequívoca.

### LOCAL_PRODUCTION_BUG

-   somente quando dentro do escopo aprovado e sem decisão de
    produto/arquitetura.

Recomendação:

``` text
máximo 2 tentativas seguras por problema
```

------------------------------------------------------------------------

## Deve parar

``` text
CONTRACT_MISMATCH
ARCHITECTURAL_CHANGE
MATERIAL_SECURITY_CHANGE
MATERIAL_SCOPE_EXPANSION
BASELINE_MISMATCH
UNKNOWN_PERSISTENT_FAILURE
MATERIAL_VISUAL_DECISION
NOT_READY_FOR_IMPLEMENTATION
```

------------------------------------------------------------------------

# 36. Independent Review

O reviewer não deve aprovar apenas o relatório do agente.

Deve inspecionar:

1.  commit real;
2.  diff real;
3.  Specification;
4.  Design;
5.  Tasks;
6.  Acceptance Criteria;
7.  testes alegados;
8.  blast radius;
9.  contratos;
10. segurança;
11. compatibilidade;
12. documentação;
13. UI, quando aplicável.

Pergunta principal:

> A evidência real comprova o comportamento autorizado?

------------------------------------------------------------------------

# 37. Prompt de correção após review

``` text
FEATURE XX — BLOCK A — REVIEW CORRECTION

Baseline:
<implementation commit>

Review finding:
<precise defect>

Classification:
<TEST_GAP | IMPLEMENTATION_BUG | ...>

Allowed scope:
Fix only the reviewed defect and directly related tests.

Do not broaden scope.
Do not start the next block.

Required regression evidence:
<expected test>

Re-run:
- focused tests;
- affected full regression;
- build/static;
- adversarial review;
- diff gate.

Create a separate commit:

fix(xx): <correction>

No amend.
No squash.
No push.

Run Post-Commit Audit.

If all mandatory gates pass:

FEATURE_XX_BLOCK_A_CORRECTION_READY_FOR_REVIEW

STOP.
```

------------------------------------------------------------------------

# 38. Gate visual para UI

Mudança visual exige mais do que testes.

Após technical gate, revisar:

-   composição;
-   hierarquia;
-   design system;
-   responsividade;
-   accessibility;
-   loading;
-   empty;
-   error;
-   success;
-   menus;
-   modals/drawers;
-   disabled states;
-   keyboard behavior;
-   estados de lifecycle.

Quando a decisão for materialmente visual:

``` text
HUMAN_VISUAL_REVIEW_REQUIRED
```

------------------------------------------------------------------------

# 39. Feature Integration / Regression Gate

Depois de todos os blocks aprovados:

``` text
FEATURE INTEGRATION GATE
```

Ele não é implementation block.

Não criar commit vazio.

Validar:

``` text
[ ] contratos cross-layer
[ ] migrations
[ ] segurança
[ ] ownership
[ ] APIs
[ ] eventos
[ ] producer/consumer compatibility
[ ] retries
[ ] idempotência
[ ] timeouts
[ ] observabilidade
[ ] backend regressions
[ ] frontend regressions
[ ] contract tests
[ ] integração entre serviços
[ ] smoke proporcional
[ ] visual gates
[ ] documentation drift
```

Se nenhum defeito:

``` text
no commit
```

Se houver defeito inequívoco:

``` text
fix + regression test + separate commit
```

Decisão material:

``` text
STOP
```

------------------------------------------------------------------------

# 40. Integration Gate para microsserviços

Para features distribuídas, validar também o caminho completo.

Exemplo:

``` text
Producer
   ↓
schema
   ↓
broker/API
   ↓
consumer
   ↓
persistence
   ↓
side effect
```

Perguntas:

-   Producer envia o contrato esperado?
-   Consumer aceita versões compatíveis?
-   Falha intermediária é recuperável?
-   Retry duplica efeito?
-   Idempotência funciona?
-   Timeout causa estado inconsistente?
-   Deploy order importa?
-   Há necessidade de feature flag?
-   Rollback é seguro?
-   Observabilidade permite detectar falha?

------------------------------------------------------------------------

# 41. Process Lifecycle

Antes de iniciar processos persistentes:

-   inventariar containers;
-   inventariar portas;
-   identificar processos existentes;
-   não matar processos do desenvolvedor;
-   rastrear processos iniciados pelo agente;
-   limpar recursos próprios ao final;
-   reportar o que permanecer ativo.

Nunca executar comandos destrutivos sem autorização.

------------------------------------------------------------------------

# 42. Classificação de falhas do processo

Toda correção relevante encontrada durante review deve ser classificada.

Taxonomia inicial:

``` text
SPEC_GAP
DESIGN_GAP
TASK_GAP
CONTEXT_GAP
IMPLEMENTATION_BUG
TEST_GAP
INTEGRATION_GAP
CONTRACT_GAP
SECURITY_GAP
DOCUMENTATION_DRIFT
TOOLING_FAILURE
ENVIRONMENT_FAILURE
```

Objetivo:

> descobrir em qual camada o erro deveria ter sido evitado.

------------------------------------------------------------------------

# 43. SDD Retrospective

Ao final da feature:

``` md
# SDD Retrospective

## Feature
...

## Corrections found
...

## Classification

| Finding | Classification | Detected at | Should have been detected at |
|---|---|---|---|
| ... | TEST_GAP | review | Test-Evidence Gate |

## Recurrent patterns
...

## Process change required?
YES / NO

## Proposed improvement
...

## Protocol/template affected
...

## Action
...
```

Regra útil:

``` text
erro isolado → corrigir

erro recorrente → melhorar processo

erro recorrente e previsível → criar gate
```

------------------------------------------------------------------------

# 44. Métricas

Não use métricas para premiar volume de código.

Use para diagnosticar o processo.

``` text
First-pass block approval rate
Corrections per block
ACs without evidence
Scope violations
Contract mismatches
Context gaps
Integration defects
Defects found at Feature Gate
Post-merge defects
Review time per block
Agent retries per block
Documentation drift findings
```

Objetivo:

``` text
erros mecânicos
    → encontrados pelo agente

erros de integração
    → encontrados pelos gates

decisões reais
    → chegam ao humano
```

------------------------------------------------------------------------

# 45. Prompt de System Baseline

``` text
SYSTEM BASELINE DISCOVERY

Objective:
Document the current system AS-IS.

Do not propose refactors.
Do not implement changes.

Inspect repository reality:
- code
- configuration
- schemas/migrations
- tests
- deployment configuration
- API/event definitions
- existing documentation

For every important statement classify evidence as:

CONFIRMED_BY_CODE
CONFIRMED_BY_CONFIG
CONFIRMED_BY_TEST
CONFIRMED_BY_SCHEMA
CONFIRMED_BY_DOC
INFERRED
UNKNOWN

Produce/update:

- system-context
- architecture
- services catalog
- integration map

Do not present INFERRED information as confirmed.

List:
- unknowns
- contradictions
- stale documentation
- areas requiring human confirmation.

STOP after documentation/report.
Do not implement product changes.
```

------------------------------------------------------------------------

# 46. Prompt de Impact Analysis

``` text
FEATURE IMPACT ANALYSIS

Objective:
Determine the blast radius of the proposed change before implementation.

Read:
- system baseline
- services catalog
- integration map
- relevant repository code
- existing feature context

Identify:

1. directly affected services
2. indirectly affected services
3. upstream dependencies
4. downstream consumers
5. APIs
6. events
7. persistence
8. compatibility risks
9. security impact
10. observability impact
11. migration impact
12. deployment/rollout impact
13. required tests
14. services inspected but not affected
15. unknowns
16. decisions required before implementation

Do not implement.

Do not invent missing contracts.

Material unknown:
mark as DECISION_REQUIRED.

Produce impact-analysis.md.

STOP.
```

------------------------------------------------------------------------

# 47. Prompt de Assessment arquitetural

Executar separado do baseline.

``` text
ARCHITECTURE ASSESSMENT

The AS-IS baseline is already established.

Do not modify production code.

Analyze the current architecture for:
- coupling
- resilience
- contract risk
- security
- observability
- testing gaps
- deployment risk
- data consistency
- operational complexity

Every finding must contain:

Finding ID
Problem
Evidence
Impact
Likelihood
Recommendation
Effort
Requires architectural decision: YES/NO

Do not transform recommendations into implementation tasks automatically.

STOP for human review.
```

------------------------------------------------------------------------

# 48. Prompt completo para executar um bloco

``` text
FEATURE <ID> — BLOCK <ID> — <OBJECTIVE>

OBJECTIVE

Execute ONLY Block <ID> from tasks.md.

Do not start another block.
Do not push.

SOURCE OF TRUTH

1. repository reality
2. approved Specification
3. approved Design / Technical Plan
4. approved Tasks
5. System / Integration context
6. Implementation Block Protocol
7. this execution prompt

PREFLIGHT

Confirm:
- cwd
- branch
- HEAD
- git status
- working tree
- relevant services
- upstream/downstream
- Definition of Ready

Read the real affected code and tests.

Material documentation/repository divergence:
BASELINE_MISMATCH → STOP.

ALLOWED SCOPE

<...>

NON-GOALS

<...>

EXPECTED BLAST RADIUS

May change:
<...>

Must remain unchanged:
<...>

Consumers requiring regression:
<...>

IMMUTABLE CONTRACTS

C01 ...
C02 ...
C03 ...

Material ambiguity:
CONTRACT_MISMATCH → STOP.

ACCEPTANCE CRITERIA

AC01 ...
AC02 ...
AC03 ...

IMPLEMENT

Use existing repository patterns where appropriate.
Prefer the smallest coherent change.
Do not implement future blocks.

SCOPE GATE

Verify implementation against:
- allowed scope
- non-goals
- blast radius

CONTRACT GATE

For each contract:
PASS + evidence
or
FAIL + evidence.

For microservice boundaries declare:
CONTRACT_CHANGE = NONE | YES.

TEST-EVIDENCE GATE — BLOCKING

For every mandatory AC:

AC | behavior | test file | exact test name | PASS/FAIL

If any AC lacks adequate evidence:
BLOCK INCOMPLETE.

READY_FOR_REVIEW is forbidden.

Report:

New tests: N
Modified tests: N
Preexisting tests executed: N

FOCUSED TEST GATE

Run directly related tests.
Do not proceed while red.

FULL REGRESSION GATE

Run the complete relevant regression,
including impacted consumer/contract suites when required.

BUILD / STATIC GATE

Run applicable:
- build/package
- typecheck
- lint
- static analysis
- quality/security scans
- migration validation
- diff check

Classify:
ERROR
NEW_WARNING
PREEXISTING_WARNING

ADVERSARIAL SELF-REVIEW

Try to reject the implementation.

Check:
- untested happy path
- untested failure path
- data loss
- partial mutation
- null/absent
- ownership/security
- compatibility
- retry/idempotency
- timeout/fallback
- ordering
- consumer impact
- requirement missing from diff
- test that proves the wrong behavior
- future block leakage
- documentation drift

For each:
PASS + evidence
or
FAIL + evidence.

DIFF GATE

git status
git diff --check
git diff --stat
git diff

Review as a reviewer.

SAFE AUTOCORRECTION

Operational/test/tooling/config:
max 2 safe attempts per problem.

Material contract/architecture/security/scope:
STOP.

Unknown persistent failure:
STOP.

COMMIT

Create exactly one implementation commit:

<message>

No amend.
No squash.
No push.

POST-COMMIT AUDIT

git show --stat --oneline HEAD
git show --name-only HEAD
git diff HEAD^ HEAD --check
git status --short

Confirm:

[ ] expected files committed
[ ] new/modified tests committed
[ ] no out-of-scope files
[ ] nothing required left only in working tree
[ ] clean working tree
[ ] commit exactly matches the block

REPORT

1. baseline
2. Definition of Ready
3. files changed
4. blast radius
5. contract gate
6. contract change declaration
7. AC → test matrix
8. test classification
9. focused tests
10. full regression
11. build/static/security
12. adversarial review
13. autonomous corrections
14. documentation drift
15. diff gate
16. commit SHA
17. post-commit audit
18. final git state

Only if every mandatory gate is green:

FEATURE_<ID>_BLOCK_<ID>_READY_FOR_REVIEW

STOP.
```

------------------------------------------------------------------------

# 49. Prompt mínimo após integração madura

Quando os documentos estiverem versionados e as tasks forem boas:

``` text
Execute o próximo implementation block definido em tasks.md.

Siga integralmente:
- System/Integration Context aplicável;
- Impact Analysis;
- Specification;
- Design;
- Tasks;
- Implementation Block Protocol.

Execute somente o bloco atual.

Faça o Preflight e valide a Definition of Ready antes de editar.

Todos os gates são bloqueantes.

READY_FOR_REVIEW significa STOP.

Não inicie o próximo bloco.
Não faça push.
```

O objetivo é não depender permanentemente de prompts gigantes.

A disciplina deve viver no repositório.

------------------------------------------------------------------------

# 50. Integração com TLC Spec-Driven Development

A estratégia recomendada é tratar este guia como **overlay
operacional**.

``` text
TLC SDD
   │
   ├── Specification
   ├── Design / Plan
   └── Tasks
          │
          ▼
Definition of Ready
          │
          ▼
Implementation Block Protocol
          │
          ▼
Independent Review
          │
          ▼
Feature Integration Gate
```

Não altere imediatamente a Skill original.

Primeiro valide o overlay em trabalho real.

Depois, gradualmente, adapte os templates da Skill para produzir:

``` text
Scope
Non-goals
Expected Blast Radius
Immutable Contracts
Acceptance Criteria IDs
Mandatory Evidence
Commit
Ready Marker
```

------------------------------------------------------------------------

# 51. Estratégia de adoção

## Fase 1 --- Execução

Adicione:

``` text
implementation-block-protocol.md
```

e faça `AGENTS.md` referenciá-lo.

Use nas tasks atuais.

Objetivo:

> reduzir erros de implementação e teste imediatamente.

------------------------------------------------------------------------

## Fase 2 --- Contexto

Crie baseline global raso:

``` text
system-context
services-catalog
integration-map
```

Não pare o desenvolvimento para documentar tudo.

Aprofunde conforme as features tocam cada serviço.

------------------------------------------------------------------------

## Fase 3 --- Impact Analysis

Torne Impact Analysis obrigatório para mudanças distribuídas.

Objetivo:

> descobrir dependências antes de criar tasks.

------------------------------------------------------------------------

## Fase 4 --- Definition of Ready

Impeça execução de tasks ambíguas.

Objetivo:

> não implementar corretamente uma especificação incompleta.

------------------------------------------------------------------------

## Fase 5 --- Contracts

Fortaleça Contract Gate e Integration Gate para fronteiras entre
microsserviços.

Objetivo:

> reduzir defeitos que só aparecem fora do serviço alterado.

------------------------------------------------------------------------

## Fase 6 --- Retrospective

Classifique correções e transforme padrões recorrentes em novos gates.

Objetivo:

> fazer o processo aprender.

------------------------------------------------------------------------

# 52. Anti-padrões

Evitar:

``` text
"execute task 1"
```

quando `task 1` não referencia regras operacionais versionadas.

Evitar também:

-   documentar toda a empresa antes de voltar a desenvolver;
-   deixar IA misturar AS-IS com opinião arquitetural;
-   feature inteira executada sem checkpoints;
-   prompts gigantes repetindo regras permanentes;
-   build verde tratado como aceite;
-   testes antigos usados como prova automática de requisito novo;
-   refactor oportunista;
-   contrato inventado para resolver ambiguidade;
-   próximo bloco iniciado automaticamente;
-   commit vazio para marcar gate;
-   amend apagando histórico de correção;
-   smoke declarado sem execução;
-   documentação tratada como verdade quando contradiz o código;
-   IA alterando múltiplos microsserviços sem Impact Analysis;
-   matar processos/containers do desenvolvedor indiscriminadamente.

------------------------------------------------------------------------

# 53. Definition of Done do processo

Uma feature está tecnicamente pronta para fechamento quando:

``` text
[ ] Specification aprovada
[ ] Design aprovado
[ ] Tasks aprovadas
[ ] Impact Analysis concluído quando aplicável
[ ] todos os implementation blocks aprovados
[ ] todos os ACs possuem evidência
[ ] regressões relevantes verdes
[ ] contratos validados
[ ] segurança validada
[ ] consumidores impactados considerados
[ ] migrations validadas
[ ] integration gate aprovado
[ ] visual gates aprovados quando aplicável
[ ] documentação relevante consistente
[ ] nenhuma decisão material pendente
[ ] retrospective registrada quando adotada pelo time
```

------------------------------------------------------------------------

# 54. Regra de ouro

> **Dê autonomia para a IA executar, mas não dê autonomia para ela
> redefinir silenciosamente o problema, o contrato, a arquitetura, a
> segurança, o escopo ou o critério de conclusão.**

O melhor sistema de engenharia assistida por IA não é aquele em que a IA
escreve mais código.

É aquele em que:

``` text
contexto é confiável
+
mudança é explícita
+
impacto é conhecido
+
execução é limitada
+
evidência é obrigatória
+
review é independente
+
integração é comprovada
+
o processo aprende com os próprios erros
```

------------------------------------------------------------------------

# 55. Checklist de implantação no repositório

``` text
[ ] AGENTS.md contém regras globais curtas.
[ ] Implementation Block Protocol está versionado.
[ ] System Context existe.
[ ] Services Catalog existe ou está sendo construído incrementalmente.
[ ] Integration Map existe para integrações relevantes.
[ ] Documentação distingue confirmed/inferred/unknown.
[ ] AS-IS é separado de Assessment/TO-BE.
[ ] Impact Analysis existe para mudanças distribuídas.
[ ] Tasks possuem Scope e Non-goals.
[ ] Tasks possuem Blast Radius.
[ ] Tasks possuem contratos identificáveis.
[ ] Tasks possuem Acceptance Criteria identificáveis.
[ ] Definition of Ready é executada antes da implementação.
[ ] Preflight ocorre antes de editar código.
[ ] Cada AC obrigatório exige evidência exata.
[ ] New/Modified/Preexisting tests são distinguidos.
[ ] Focused tests precedem full regression.
[ ] Microservice Contract Gate existe quando necessário.
[ ] Adversarial Self-Review é obrigatório.
[ ] Diff Gate ocorre antes do commit.
[ ] Um implementation commit por bloco.
[ ] Post-Commit Audit ocorre depois do commit.
[ ] READY_FOR_REVIEW significa STOP.
[ ] Independent Review ocorre entre blocos.
[ ] Correções de review usam commit separado.
[ ] UI possui human visual gate quando aplicável.
[ ] Feature Integration Gate não cria commit vazio.
[ ] Process lifecycle preserva ambiente do desenvolvedor.
[ ] Documentation Drift é reportado.
[ ] Findings são classificados.
[ ] Retrospective alimenta melhorias do processo.
[ ] Push/merge seguem a política da organização.
```

------------------------------------------------------------------------

## Observação final

Este guia foi desenhado para complementar uma prática de Spec-Driven
Development já existente. Nomes de comandos, artefatos, diretórios,
quality gates e políticas de Git devem ser adaptados ao ambiente real da
organização.

A integração recomendada é incremental:

``` text
não substituir o SDD
        +
não reescrever tudo
        +
adicionar contexto verificável
        +
adicionar execução controlada
        +
medir os defeitos
        +
evoluir os gates com evidência real
```
