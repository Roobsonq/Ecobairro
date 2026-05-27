# Instruções de Deploy - EcoBairro

Este projeto foi modificado para rodar sem a necessidade de autenticação externa (Manus/OAuth) e está pronto para ser hospedado na **Render**.

## Requisitos
- Conta na [Render](https://render.com)
- Banco de Dados MySQL (Pode ser o Render Blueprints ou um serviço externo como PlanetScale/Tidb)

## Passos para Deploy na Render

1. **Crie um novo Web Service**:
   - Conecte seu repositório GitHub.
   - Selecione o diretório do projeto.

2. **Configurações**:
   - **Runtime**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`

3. **Variáveis de Ambiente**:
   - `DATABASE_URL`: Sua string de conexão MySQL (ex: `mysql://user:pass@host:port/db`)
   - `NODE_ENV`: `production`

## Alterações Realizadas
- Removida toda a integração com o sistema de autenticação Manus.
- Injetado um usuário administrador mockado no contexto do servidor.
- Simplificado o hook de autenticação no frontend para sempre considerar o usuário logado.
- Removidas dependências de OAuth e segredos de cookies desnecessários.

---
*Projeto preparado para rodar de forma independente.*
