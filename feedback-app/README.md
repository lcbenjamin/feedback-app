# Feedback App

Aplicação Angular 16+ para envio e acompanhamento de feedbacks, com página inicial de submissão e área administrativa em `/admin`.

## Funcionalidades

- Formulário de feedback com descrição e nota de 0 a 10.
- Envio via `FeedbackService` para o endpoint `/avaliacao`.
- Página administrativa com tabela, estatísticas e gráfico de distribuição das notas.
- Interface responsiva com Angular Material.
- Interceptor global para exibir mensagens de erro.
- Variáveis de ambiente para preparar a integração com Azure Functions.

## Estrutura

- `src/app/home`: página inicial do formulário.
- `src/app/admin`: módulo e página administrativa.
- `src/app/services`: serviço central de feedback.
- `src/app/interceptors`: tratamento global de erros HTTP.
- `src/environments`: configuração por ambiente.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie a aplicação:

```bash
npm start
```

3. Acesse:

- `http://localhost:4200/` para o formulário.
- `http://localhost:4200/admin` para o painel administrativo.

## Observações

- O serviço já usa mock local para a listagem inicial, mas está preparado para apontar para uma API real via `environment.ts`.
- Para produção, configure `apiBaseUrl` com a URL da sua Azure Function.
