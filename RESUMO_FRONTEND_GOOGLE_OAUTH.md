# Integração Google OAuth - Life Gamification

## Resumo

A API de autenticação agora suporta login com Google OAuth 2.0. O frontend **não precisa** de credenciais do Google - toda a autenticação é processada pela API.

## Como a API Funciona

A API gerencia todo o fluxo OAuth server-side:
- Possui as credenciais do Google configuradas (Client ID e Client Secret)
- Redireciona o usuário para o Google
- Recebe o callback do Google
- Valida e cria/atualiza o usuário no banco
- Gera tokens JWT
- Redireciona de volta para o frontend com os tokens

## O que o Frontend Precisa Fazer

### 1. Iniciar o Login

Redirecione o usuário para o endpoint da API com o parâmetro `platform=4`:

```
GET http://localhost:3002/auth/google?platform=4
```

**Exemplo:**
```javascript
window.location.href = 'http://localhost:3002/auth/google?platform=4';
```

### 2. Receber o Callback

Crie uma rota `/auth/callback` que receberá os parâmetros de retorno da API.

## Endpoints da API

### Iniciar Login
```
GET /auth/google?platform=4
```

**Parâmetros:**
- `platform` (query, obrigatório): ID da plataforma (4 = Life Gamification)

**Comportamento:**
- Redireciona o usuário para o Google OAuth

### Callback (gerenciado pela API)
```
GET /auth/google/callback
```

**Comportamento:**
- Recebe o callback do Google
- Valida e processa o usuário
- Redireciona para: `http://localhost:3000/auth/callback?accessToken=...&refreshToken=...&id=...&email=...&name=...&lastName=...`

## Parâmetros de Retorno (Query String)

Quando o usuário retornar para `http://localhost:3000/auth/callback`, a URL conterá:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `accessToken` | string | Token JWT para autenticação nas requisições |
| `refreshToken` | string | Token para renovar o accessToken quando expirar |
| `id` | number | ID do usuário no banco de dados |
| `email` | string | Email do usuário |
| `name` | string | Primeiro nome do usuário |
| `lastName` | string | Sobrenome do usuário |

**Exemplo de URL de retorno:**
```
http://localhost:3000/auth/callback?accessToken=eyJhbG...&refreshToken=abc123...&id=42&email=user@example.com&name=João&lastName=Silva
```

## Uso dos Tokens

### Requisições Autenticadas

Incluir o `accessToken` no header `Authorization`:

```
Authorization: Bearer {accessToken}
```

### Renovar Access Token

Quando o `accessToken` expirar, usar o endpoint de refresh:

```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "abc123..."
}
```

## Fluxo Completo

```
1. Usuário clica em "Login com Google"
2. Frontend redireciona: GET /auth/google?platform=4
3. API redireciona para Google OAuth
4. Usuário autoriza no Google
5. Google → API callback
6. API processa e redireciona: http://localhost:3000/auth/callback?accessToken=...
7. Frontend extrai e armazena os tokens
8. Frontend usa accessToken nas requisições
```

## Configuração

### Ambiente de Desenvolvimento

- **API**: `http://localhost:3002`
- **Frontend**: `http://localhost:3000`
- **Platform ID**: `4` (Life Gamification)

### Google Cloud Console

A API já está configurada com as credenciais do Google. A URL de callback autorizada é:
```
http://localhost:3002/auth/google/callback
```

## Notas Importantes

- O frontend **não precisa** de credenciais do Google
- Todo o fluxo OAuth é gerenciado pela API
- Os tokens são retornados via query string no redirect
- O `accessToken` deve ser usado em todas as requisições autenticadas
- Use o `refreshToken` para renovar quando o access token expirar
