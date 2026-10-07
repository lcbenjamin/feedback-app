# Integração do Implementation Block Protocol v2 com TLC Spec-Driven Development

> **Objetivo:** manter o TLC Spec-Driven Development como método de
> especificação e planejamento, acrescentando uma camada de execução
> controlada para agentes de IA.
>
> **Princípio central:** não substituir a Skill SDD existente. O
> protocolo entra **depois que a Skill produziu uma task executável** e
> governa **como a IA executa, comprova, commita e para**.

------------------------------------------------------------------------

## 1. Visão geral

Você já possui uma camada de **Spec-Driven Development (SDD)**. Ela deve
continuar sendo responsável por transformar uma necessidade em artefatos
de especificação e planejamento.

O problema que este complemento resolve é outro:

> Depois que uma task já existe, **como entregar essa task a uma IA sem
> depender apenas de "execute a task 1"?**

A integração proposta separa duas responsabilidades:

  -----------------------------------------------------------------------
  Camada                              Responsabilidade
  ----------------------------------- -----------------------------------
  **TLC Spec-Driven Development**     Descobrir, especificar, planejar e
                                      decompor o trabalho

  **Implementation Block Protocol     Executar cada bloco/task com gates,
  v2**                                evidência, commit e revisão

  **Revisor humano / segunda IA**     Auditar o resultado real e
                                      autorizar a continuação
  -----------------------------------------------------------------------

A Skill SDD continua sendo a **fonte de intenção**. O protocolo de
execução vira a **fonte de disciplina operacional**.

------------------------------------------------------------------------

# 2. Arquitetura do processo integrado

``` text
REQUISITO / PROBLEMA
        │
        ▼
TLC SPEC-DRIVEN DEVELOPMENT
        │
        ├── Discovery / contexto
        ├── Specification
        ├── Technical Plan / Design
        └── Tasks
                │
                ▼
       TASKS AGRUPADAS EM BLOCOS
                │
                ▼
┌──────────────────────────────────────┐
│ IMPLEMENTATION BLOCK PROTOCOL v2     │
│                                      │
│ Implement                            │
│   ↓                                  │
│ Scope Gate                           │
│   ↓                                  │
│ Contract Gate                        │
│   ↓                                  │
│ Test-Evidence Gate                   │
│   ↓                                  │
│ Focused Tests                        │
│   ↓                                  │
│ Full Regression                      │
│   ↓                                  │
│ Build / Static Gate                  │
│   ↓                                  │
│ Adversarial Self-Review              │
│   ↓                                  │
│ Diff Gate                            │
│   ↓                                  │
│ Commit                               │
│   ↓                                  │
│ Post-Commit Audit                    │
│   ↓                                  │
│ READY_FOR_REVIEW                     │
│   ↓                                  │
│ STOP                                 │
└──────────────────────────────────────┘
                │
                ▼
        REVISÃO INDEPENDENTE
          │            │
       aprovado      correção
          │            │
          ▼            └── novo commit
     PRÓXIMO BLOCO
                │
                ▼
    FEATURE INTEGRATION GATE
                │
                ▼
          FEATURE CLOSED
```

------------------------------------------------------------------------

# 3. O que NÃO deve mudar no seu SDD

Não transforme o Implementation Block Protocol em uma segunda
metodologia de especificação.

Ele **não deve**:

-   reescrever a Specification;
-   redefinir requisitos;
-   criar novas decisões de produto durante implementação;
-   substituir o Design;
-   substituir a decomposição de Tasks;
-   decidir silenciosamente arquitetura não aprovada;
-   permitir que a IA "melhore" o escopo por conta própria.

A regra é:

``` text
SDD decide O QUE deve ser construído.

Design/Plan decide COMO o sistema deve suportar isso.

Tasks decidem COMO dividir o trabalho.

Implementation Block Protocol decide COMO EXECUTAR E COMPROVAR cada pedaço.
```

------------------------------------------------------------------------

# 4. Onde integrar o protocolo

A integração mais limpa é adicionar uma camada de instruções permanente
no repositório.

Estrutura sugerida:

``` text
/
├── AGENTS.md
├── .ai/
│   ├── context/
│   │   └── implementation-block-protocol.md
│   └── features/
│       └── FXX-feature/
│           ├── specification.md
│           ├── design.md
│           └── tasks.md
└── ...
```

Os nomes podem ser adaptados à estrutura que sua empresa já utiliza.

O importante é separar:

### `AGENTS.md`

Documento curto e normativo.

Ele diz à IA:

-   onde encontrar as regras;
-   qual documento é obrigatório;
-   que um bloco deve ser executado por vez;
-   que `READY_FOR_REVIEW` implica STOP;
-   que push/merge seguem política humana/organizacional.

### `implementation-block-protocol.md`

Documento detalhado e reutilizável.

Ele contém:

-   gates;
-   Definition of Done;
-   política de testes;
-   matriz AC → teste;
-   política de STOP;
-   autocorreção;
-   commit;
-   post-commit audit;
-   formato de relatório.

### `tasks.md`

Continua específico da feature.

Ele define:

-   blocos;
-   tasks;
-   Acceptance Criteria;
-   non-goals;
-   dependências;
-   ordem de execução.

------------------------------------------------------------------------

# 5. Mudança principal na forma de escrever Tasks

Uma task que hoje talvez seja:

``` text
Task 1 — Criar endpoint de consulta.

- Criar controller.
- Criar service.
- Criar repository.
- Adicionar testes.
```

continua útil, mas ainda deixa decisões demais para a IA.

Prefira:

``` text
## Block A — Consulta de recurso

### Scope

A1. Implementar consulta por ID.
A2. Restringir consulta ao owner autenticado.
A3. Mapear recurso inexistente/estrangeiro para o contrato definido.
A4. Retornar DTO aprovado.

### Non-goals

- Não implementar update.
- Não implementar delete.
- Não alterar autenticação.
- Não alterar schema fora do necessário.

### Acceptance Criteria

AC-A01 — owner consulta recurso próprio com sucesso.
AC-A02 — recurso inexistente retorna contrato aprovado.
AC-A03 — recurso de outro owner não vaza existência.
AC-A04 — response contém apenas os campos aprovados.
AC-A05 — nenhuma mutation ocorre durante consulta.

### Mandatory Evidence

- teste de integração para AC-A01;
- teste adversarial para AC-A03;
- teste de contrato para AC-A04;
- focused tests;
- full regression;
- build/static checks;
- AC → test matrix;
- adversarial self-review;
- diff gate;
- post-commit audit.

### Commit

feat(feature): add resource query

### Gate

FEATURE_BLOCK_A_READY_FOR_REVIEW
```

A diferença é que a task deixa de dizer apenas **o que programar** e
passa a definir também **como provar que terminou**.

------------------------------------------------------------------------

# 6. Acceptance Criteria devem ser identificáveis

Use IDs estáveis.

``` text
AC-A01
AC-A02
AC-A03
```

Isso permite que Specification, Tasks, testes e relatório conversem
entre si.

Exemplo:

``` text
Specification:
REQ-07 — Um usuário não pode acessar recurso pertencente a outro owner.

Task:
AC-B04 — consulta de recurso estrangeiro deve seguir o contrato de not-found.

Test Evidence:
AC-B04 → ResourceControllerIntegrationTest.foreignResourceIsNotExposed
```

Essa rastreabilidade reduz respostas vagas como:

> "Os testes passaram."

A pergunta passa a ser:

> **Qual teste prova AC-B04?**

------------------------------------------------------------------------

# 7. O prompt deixa de ser apenas "execute a task 1"

Você pode continuar usando as Tasks produzidas pela Skill TLC.

A diferença é que o comando passa a carregar um **Execution Envelope**.

Em vez de:

``` text
Execute a task 1.
```

use:

``` text
Execute o Block A definido em tasks.md usando o
Implementation Block Protocol v2.

Antes de implementar:

1. leia Specification, Design/Plan e Tasks;
2. inspecione o código real afetado;
3. confirme baseline e working tree;
4. liste os Acceptance Criteria deste bloco.

Execute SOMENTE o Block A.

Todos os gates definidos no protocolo são bloqueantes.

Antes de READY_FOR_REVIEW, produza a matriz:

AC | comportamento | arquivo de teste | nome exato do teste | resultado

Se qualquer AC obrigatório não possuir evidência adequada:
BLOCK INCOMPLETE.

Não inicie o próximo bloco.

Crie somente o commit definido para este bloco.

Não faça push.

Ao final, emita:

FEATURE_BLOCK_A_READY_FOR_REVIEW

e STOP.
```

Esse prompt é curto porque as regras detalhadas já vivem no repositório.

------------------------------------------------------------------------

# 8. Template completo de Execution Envelope

Use este modelo quando o bloco for mais sensível.

``` text
FEATURE <ID> — BLOCK <ID> — <OBJETIVO>

## OBJECTIVE

Execute exclusivamente o Block <ID> definido em <tasks file>.

Não inicie o próximo bloco.
Não faça push.

## SOURCE OF TRUTH

Prioridade:

1. repository atual;
2. Specification;
3. Design / Technical Plan;
4. Tasks;
5. Implementation Block Protocol;
6. este prompt.

Se o repositório contradizer uma suposição do prompt:
inspecione e classifique antes de alterar.

## BASELINE

Confirme:

- cwd;
- branch;
- HEAD;
- git status;
- working tree limpa.

Se houver alteração preexistente do usuário:
STOP.

## ALLOWED SCOPE

- <scope 1>
- <scope 2>
- <scope 3>

## NON-GOALS

- <não fazer 1>
- <não fazer 2>
- <bloco futuro>

## IMMUTABLE CONTRACTS

C01 — <contrato>
C02 — <contrato>
C03 — <contrato>

Para cada contrato:
PASS + evidência
ou
FAIL + evidência.

CONTRACT_MISMATCH material:
STOP.

## ACCEPTANCE CRITERIA

AC01 — ...
AC02 — ...
AC03 — ...

## TEST-EVIDENCE GATE — BLOCKING

Para cada AC obrigatório:

AC | comportamento | arquivo | teste exato | resultado

Se qualquer AC não possuir evidência adequada:
READY_FOR_REVIEW é proibido.

Classifique:

New tests: N
Modified tests: N
Preexisting tests executed: N

## VALIDATION

1. focused tests;
2. full relevant regression;
3. build/package;
4. typecheck/lint/static analysis aplicável;
5. git diff --check.

Não avance com focused tests vermelhos.

## ADVERSARIAL SELF-REVIEW

Tente reprovar a implementação.

Verifique:

- happy path sem teste;
- failure path sem teste;
- data loss;
- mutation parcial;
- null/absent;
- loading/error;
- ownership/security;
- ordenação;
- compatibilidade;
- requisito ausente do diff;
- teste verde que prova coisa errada;
- implementação acidental do próximo bloco.

Para cada item:
PASS + evidência
ou
FAIL + evidência.

## DIFF GATE

Execute:

git status
git diff --check
git diff --stat
git diff

Confirme:

[ ] somente escopo autorizado
[ ] testes esperados presentes
[ ] nenhum arquivo incidental
[ ] nenhum bloco futuro iniciado

## COMMIT

Crie um único commit:

<commit message>

Não use amend.
Não faça squash.
Não faça push.

## POST-COMMIT AUDIT

Execute:

git show --stat --oneline HEAD
git show --name-only HEAD
git diff HEAD^ HEAD --check
git status --short

Confirme:

[ ] todos os arquivos esperados estão no commit
[ ] testes estão no commit
[ ] nenhum arquivo fora do escopo entrou
[ ] nada obrigatório ficou somente na working tree
[ ] working tree está limpa
[ ] commit corresponde ao bloco

## REPORT

Reportar:

1. baseline;
2. arquivos alterados;
3. contract gate;
4. matriz AC → teste;
5. classificação dos testes;
6. focused tests;
7. full regression;
8. build/static;
9. adversarial review;
10. autocorreções;
11. diff gate;
12. commit SHA;
13. post-commit audit;
14. final git state.

Somente se TODOS os gates obrigatórios estiverem verdes:

FEATURE_<ID>_BLOCK_<ID>_READY_FOR_REVIEW

STOP.
```

------------------------------------------------------------------------

# 9. O que o agente pode corrigir sozinho

A autonomia deve existir, senão o processo fica lento demais.

Mas ela precisa de limites.

## Pode autocorrigir

Exemplos:

-   comando executado no diretório errado;
-   erro de path;
-   configuração local reversível;
-   import quebrado;
-   expectativa de teste comprovadamente obsoleta;
-   pequeno erro de compilação causado pelo próprio bloco;
-   ajuste local inequívoco;
-   tooling equivalente.

Recomendação:

``` text
máximo de 2 tentativas seguras por problema
```

Depois disso:

``` text
STOP
```

## Deve parar

``` text
CONTRACT_MISMATCH
ARCHITECTURAL_CHANGE
MATERIAL_SECURITY_CHANGE
UNKNOWN_PERSISTENT_FAILURE
MATERIAL_SCOPE_EXPANSION
MATERIAL_VISUAL_DECISION
```

Exemplo:

Se a Specification não diz se um recurso inativo pode ser reassociado, a
IA não deve inventar:

``` text
409 RESOURCE_INACTIVE
```

Ela deve parar e pedir decisão.

------------------------------------------------------------------------

# 10. Test-Evidence Gate: a principal melhoria

Este é provavelmente o complemento mais importante ao seu fluxo atual.

Um relatório como:

``` text
10 testes passaram.
```

não é suficiente.

Pode significar que dez testes antigos passaram e nenhum comportamento
novo foi testado.

Exija:

``` text
AC01 | Create válido
ResourceControllerIntegrationTest.java
createsResource
PASS

AC02 | Owner estrangeiro rejeitado
ResourceControllerIntegrationTest.java
foreignOwnerCannotAccess
PASS

AC03 | Mutation inválida é atômica
ResourceControllerIntegrationTest.java
rejectedUpdateDoesNotPartiallyMutate
PASS
```

E também:

``` text
New tests: 6
Modified tests: 2
Preexisting tests executed: 94

Focused:
8/8

Full:
102/102
```

------------------------------------------------------------------------

# 11. Self-review adversarial

Antes de commitar, o agente deve mudar de papel:

> Pare de agir como implementador. Agora tente reprovar o seu próprio
> código.

Checklist genérico:

``` text
1. Existe happy path sem teste?
2. Existe failure path sem teste?
3. Existe fallback que perde dados?
4. Loading/error permite mutation?
5. Null e absent têm semânticas diferentes?
6. Existe bypass de ownership?
7. Erro pode causar mutation parcial?
8. Ordenação mudou silenciosamente?
9. Algum requisito não aparece no diff?
10. Algum teste passa sem provar o requisito?
11. Algum bloco futuro foi iniciado?
```

O resultado não deve ser apenas:

``` text
Tudo certo.
```

Prefira:

``` text
A01 PASS
Evidence: ResourceControllerIntegrationTest.foreignOwnerCannotAccess

A02 PASS
Evidence: service resolves owner from authenticated context

A03 FAIL
Evidence: submit remains enabled while dependency is unavailable
```

Se for FAIL obrigatório, corrige ou STOP.

------------------------------------------------------------------------

# 12. Revisão independente continua necessária

Mesmo com todos os gates, não deixe o agente ser o único juiz do próprio
trabalho.

Depois de:

``` text
FEATURE_BLOCK_A_READY_FOR_REVIEW
```

o processo deve parar.

O reviewer então verifica o **commit real**.

Fluxo:

``` text
AGENTE
  │
  ├── implementa
  ├── testa
  ├── self-review
  ├── commita
  └── READY
        │
        ▼
REVIEW INDEPENDENTE
        │
   ┌────┴────┐
   │         │
APPROVE   CORRECTION
   │         │
   ▼         └── novo commit
NEXT BLOCK
```

A revisão deve conferir:

-   diff real;
-   Specification;
-   Design;
-   Tasks;
-   testes alegados;
-   escopo negativo;
-   compatibilidade;
-   segurança;
-   regressão;
-   evidência visual quando aplicável.

------------------------------------------------------------------------

# 13. Correção encontrada durante review

Não faça amend no commit original.

Use um commit separado.

Prompt:

``` text
FEATURE XX — BLOCK A — REVIEW CORRECTION

Baseline:
<commit implementado>

Finding:
<defeito preciso encontrado na revisão>

Allowed scope:
corrigir exclusivamente o finding e testes diretamente relacionados.

Não iniciar próximo bloco.

Required regression evidence:
<teste esperado>

Reexecute:

- focused tests;
- full suite afetada;
- build/static;
- adversarial review;
- diff gate.

Crie commit separado:

fix(xx): <correction>

Não amend.
Não squash.
Não push.

Depois execute Post-Commit Audit.

Se tudo estiver verde:

FEATURE_XX_BLOCK_A_CORRECTION_READY_FOR_REVIEW

STOP.
```

Isso preserva a trilha:

``` text
feat: implementação
test/fix: correção descoberta pelo review
```

Essa trilha é extremamente útil para retrospectiva do processo.

------------------------------------------------------------------------

# 14. Feature Integration / Regression Gate

Depois que todos os blocos forem aprovados, execute um último gate.

Ele **não é uma nova task de implementação**.

Objetivo:

``` text
A + B + C + D funcionam juntos?
```

Verifique:

-   contratos de domínio;
-   migrations;
-   segurança;
-   cross-layer contracts;
-   backend;
-   frontend;
-   integrações;
-   regressões;
-   performance relevante;
-   adversarial review da feature inteira;
-   smoke quando seguro;
-   gates visuais.

Regra:

``` text
nenhum defeito → nenhum commit
```

Não crie:

``` text
chore: feature gate passed
```

Se houver defeito:

``` text
fix + regression test + novo commit
```

------------------------------------------------------------------------

# 15. Gate visual para UI

Se a task muda UI:

``` text
tests green
+
build green
+
lint green
```

não significa:

``` text
UI aprovada
```

Adicione um gate humano quando necessário.

Avalie:

-   composição;
-   hierarquia;
-   consistência com design system;
-   loading;
-   empty;
-   error;
-   success;
-   responsive;
-   accessibility;
-   drawers/modals/menus;
-   estados ativo/inativo;
-   densidade.

O agente pode fazer technical gate.

O humano faz o visual gate.

------------------------------------------------------------------------

# 16. Como adaptar isso à sua Skill TLC

A forma mais segura é **não editar a Skill TLC imediatamente**.

Comece adicionando uma camada local ao repositório.

## Fase 1 --- Overlay

Mantenha:

``` text
TLC SDD Skill
```

como está.

Adicione:

``` text
implementation-block-protocol.md
```

ao projeto.

No arquivo de instruções do agente:

``` text
After SDD planning produces executable tasks, all implementation work
MUST follow implementation-block-protocol.md.

Execute one implementation block at a time.

A block is not complete until all mandatory gates defined by the protocol
have passed.

READY_FOR_REVIEW always means STOP.

Never automatically start the next block.
```

Assim você consegue testar o processo sem modificar a Skill original.

------------------------------------------------------------------------

# 17. Fase 2 --- Fazer Tasks da Skill produzirem informação melhor

Depois que o overlay estiver funcionando, adapte seu template de Tasks
para gerar:

``` text
Block
Scope
Non-goals
Acceptance Criteria IDs
Mandatory evidence
Commit message
Ready marker
```

Isso é mais importante do que fazer a Skill gerar prompts gigantes.

A task passa a ser uma estrutura executável.

------------------------------------------------------------------------

# 18. Fase 3 --- Prompts ficam pequenos

Quando o protocolo estiver versionado e as Tasks tiverem ACs claros, seu
comando diário pode voltar a ser simples:

``` text
Execute o Block B de tasks.md seguindo integralmente
implementation-block-protocol.md.

Não execute blocos seguintes.

READY_FOR_REVIEW → STOP.

Não faça push.
```

Ou até:

``` text
Execute a task 1 usando o Implementation Block Protocol v2.
```

A diferença é enorme:

antes, **"execute a task 1" carregava regras implícitas**;

depois, **"execute a task 1" referencia um contrato operacional
versionado**.

------------------------------------------------------------------------

# 19. Fase 4 --- Integrar à própria Skill

Só depois de validar o overlay em algumas features vale alterar a Skill
SDD.

A Skill pode passar a gerar automaticamente no `tasks.md`:

``` text
## Execution Model

All implementation blocks MUST follow:
<implementation-block-protocol>

Rules:

- one block at a time;
- one implementation commit per block;
- independent review between blocks;
- next block never starts automatically;
- READY_FOR_REVIEW means STOP;
- Feature Integration Gate runs after all blocks;
- no empty gate commit.
```

E para cada bloco:

``` text
### Acceptance Criteria

AC-A01 ...
AC-A02 ...

### Mandatory Evidence

- AC → test matrix
- focused tests
- full regression
- build/static
- adversarial self-review
- diff gate
- post-commit audit
```

------------------------------------------------------------------------

# 20. O que NÃO colocar em todo prompt

Evite repetir 150 linhas em cada execução.

Se a regra já está em:

``` text
implementation-block-protocol.md
```

não precisa repetir:

-   política geral de commit;
-   classificação geral de testes;
-   comandos padrão de post-commit;
-   política genérica de STOP;
-   lifecycle genérico;
-   definição de READY.

O prompt específico deve concentrar-se em:

``` text
baseline
+
scope
+
non-goals
+
contratos específicos
+
ACs específicos
+
test matrix específica
+
riscos específicos
```

Regra:

> **Contexto menor, contrato mais preciso.**

------------------------------------------------------------------------

# 21. Separação recomendada de documentos

``` text
AGENTS.md
│
├── regras globais curtas
│
└── aponta para:
       │
       ▼
implementation-block-protocol.md
       │
       ├── gates
       ├── STOP
       ├── commits
       ├── tests
       ├── self-review
       └── post-commit

FEATURE/
│
├── specification.md
│      └── comportamento
│
├── design.md
│      └── decisões técnicas
│
└── tasks.md
       ├── blocos
       ├── ACs
       ├── non-goals
       └── evidence requirements
```

Não misture os quatro.

------------------------------------------------------------------------

# 22. Exemplo de rotina diária

Suponha que o SDD gerou:

``` text
Block A — Persistence
Block B — API
Block C — Integration
```

Você executa:

``` text
Execute Block A usando o protocolo.
```

Agente responde:

``` text
BLOCK_A_READY_FOR_REVIEW
```

Você ou uma segunda IA audita.

Se houver problema:

``` text
BLOCK_A_CORRECTION
```

Novo commit.

Revisa novamente.

Aprovado:

``` text
Execute Block B usando o protocolo.
```

Nunca:

``` text
Execute A, B e C e só me chame quando terminar.
```

A autonomia termina na fronteira do bloco.

------------------------------------------------------------------------

# 23. Por que isso funciona melhor

O modelo reduz quatro classes comuns de erro.

## 23.1 Implementação incompleta

O agente implementa produção, mas esquece testes.

Mitigação:

``` text
Test-Evidence Gate
```

## 23.2 Testes verdes enganadores

O agente executa testes antigos e considera a feature coberta.

Mitigação:

``` text
New / Modified / Preexisting classification
+
AC → test matrix
```

## 23.3 Escopo expandido

O agente começa a "ajudar" implementando a próxima parte.

Mitigação:

``` text
Scope Gate
+
Non-goals
+
READY → STOP
```

## 23.4 Bug óbvio encontrado apenas pelo reviewer

Mitigação:

``` text
Adversarial Self-Review
```

A revisão humana continua existindo, mas encontra problemas mais
interessantes.

------------------------------------------------------------------------

# 24. Métrica para saber se a integração está funcionando

Acompanhe por feature:

  -----------------------------------------------------------------------
  Métrica                             Interpretação
  ----------------------------------- -----------------------------------
  First-pass block approval rate      Quantos blocos são aprovados sem
                                      correção

  Corrections per block               Quantos problemas escapam dos gates

  AC without evidence                 Falha do Test-Evidence Gate

  Scope violations                    Qualidade da decomposição/prompt

  Defects found at Feature Gate       Falhas que escaparam dos blocos

  Post-merge defects                  Qualidade real do processo

  Review time per block               Custo humano

  Agent retries per block             Qualidade de contexto/tooling
  -----------------------------------------------------------------------

O objetivo **não** é chegar artificialmente a 100% de aprovação.

O objetivo é:

``` text
problemas simples → encontrados pelo próprio agente

problemas de integração → encontrados nos gates

decisões reais → chegam ao humano
```

------------------------------------------------------------------------

# 25. Política corporativa

Em ambiente de trabalho, adapte o protocolo às ferramentas oficiais.

Inclua, quando aplicável:

-   CI corporativo;
-   Sonar;
-   SAST;
-   dependency scanning;
-   contract tests;
-   mutation tests;
-   quality gates;
-   observabilidade;
-   padrões de arquitetura;
-   ADRs;
-   políticas de branch;
-   PR templates;
-   compliance;
-   LGPD;
-   change management.

O protocolo não deve contornar governança corporativa.

Ele deve incorporá-la como gate.

------------------------------------------------------------------------

# 26. Segurança de contexto

Em ambiente corporativo:

-   use somente ferramentas/agentes aprovados;
-   não copie segredos para prompts;
-   não exponha dados de cliente;
-   não envie código proprietário a serviços não autorizados;
-   respeite políticas internas de retenção;
-   trate logs, dumps e arquivos de produção como informação
    potencialmente sensível.

Essas regras devem ficar acima do protocolo de execução.

------------------------------------------------------------------------

# 27. Regra de ouro da integração

``` text
TLC SDD continua definindo o trabalho.

Implementation Block Protocol governa a execução.

A IA pode executar autonomamente dentro do bloco.

A IA não pode redefinir silenciosamente:
- requisito;
- contrato;
- arquitetura;
- segurança;
- escopo;
- Definition of Done.

READY_FOR_REVIEW significa:
“tenho evidência suficiente para ser revisado”.

Não significa:
“eu decidi que terminei a feature”.
```

------------------------------------------------------------------------

# 28. Plano de adoção recomendado

## Semana / piloto 1

Não altere a Skill.

Adicione apenas:

``` text
implementation-block-protocol.md
```

e uma referência no arquivo de instruções do agente.

Use em uma feature pequena.

## Piloto 2

Adapte o template de `tasks.md` para incluir:

``` text
Scope
Non-goals
AC IDs
Mandatory Evidence
Commit
Ready Marker
```

## Piloto 3

Comece a usar prompts curtos que apenas referenciam o protocolo.

Meça:

-   correções;
-   violações de escopo;
-   ACs sem teste;
-   tempo de review.

## Depois

Se o padrão funcionar:

integre o Execution Model aos templates da própria Skill TLC.

Não faça a integração definitiva antes de observar alguns ciclos reais.

------------------------------------------------------------------------

# 29. Checklist de integração

``` text
[ ] A Skill SDD continua sendo a fonte de Specification/Plan/Tasks.
[ ] Existe um Implementation Block Protocol versionado.
[ ] AGENTS/instructions referencia o protocolo.
[ ] Tasks possuem blocos tecnicamente coesos.
[ ] Cada bloco possui non-goals.
[ ] Cada bloco possui ACs identificáveis.
[ ] Cada AC obrigatório exige evidência.
[ ] READY_FOR_REVIEW implica STOP.
[ ] Próximo bloco nunca inicia automaticamente.
[ ] Testes novos/modificados/preexistentes são distinguidos.
[ ] Self-review adversarial é obrigatório.
[ ] Diff Gate ocorre antes do commit.
[ ] Post-Commit Audit ocorre depois do commit.
[ ] Correções de review usam commit separado.
[ ] UI possui gate visual quando necessário.
[ ] Feature Integration Gate não cria commit vazio.
[ ] Push/merge respeitam política humana/corporativa.
[ ] Decisões materiais causam STOP.
[ ] Métricas são acompanhadas para melhorar o protocolo.
```

------------------------------------------------------------------------

# 30. Prompt mínimo após a integração

Quando tudo acima estiver versionado, este pode ser suficiente para o
dia a dia:

``` text
Execute o próximo implementation block definido em tasks.md.

Siga integralmente o Implementation Block Protocol v2.

Use Specification, Design/Plan e Tasks como fonte de verdade,
confirmando tudo contra o repositório real.

Execute somente o bloco atual.

Todos os gates são bloqueantes.

READY_FOR_REVIEW significa STOP.

Não inicie o próximo bloco.
Não faça push.
```

Esse é o objetivo final da integração:

> **não depender de prompts gigantes para obter disciplina; colocar a
> disciplina no processo versionado e deixar o prompt carregar apenas o
> contexto específico do bloco.**

------------------------------------------------------------------------

## Nota sobre a TLC Spec-Driven Development

Este documento foi escrito como uma **camada complementar**, e não como
uma substituição da abordagem TLC Spec-Driven Development. A referência
pública fornecida descreve a abordagem de Spec-Driven Development; a
integração acima preserva a responsabilidade do SDD sobre especificação
e planejamento e adiciona um protocolo próprio para a fase de execução
assistida por IA.

Como Skills e templates internos podem possuir comandos, nomes de
artefatos e convenções diferentes, adapte os nomes (`specification.md`,
`design.md`, `tasks.md`, comandos da Skill etc.) ao que a sua instalação
realmente produz. O ponto de integração permanece o mesmo: **entre o
planejamento executável e a implementação de cada bloco**.
