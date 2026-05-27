# EcoBairro - TODO List

## Banco de Dados
- [x] Criar schema com tabelas: users, schedules, disposal_points, education_content, metrics, notifications
- [x] Executar migrações SQL
- [x] Criar índices para otimização

## Backend (tRPC Procedures)
- [x] Autenticação: login, logout, perfil do usuário
- [x] Gestão de usuários: criar, atualizar, listar por role
- [x] Agendamentos: criar, listar, atualizar status, deletar
- [x] Pontos de descarte: criar, listar, atualizar, deletar
- [x] Educação: criar conteúdo, listar, atualizar
- [x] Métricas: calcular volume coletado, aumento percentual, gerar relatórios
- [x] Notificações: enviar, listar, marcar como lida

## Frontend - Página Inicial
- [x] Navbar com logo e CTAs de login/cadastro
- [x] Hero section com apresentação do EcoBairro
- [x] Seção de benefícios e funcionalidades
- [x] Seção de estatísticas/impacto
- [x] Footer com links

## Frontend - Autenticação
- [x] Página de login (integrada com OAuth)
- [x] Página de cadastro com seleção de perfil (integrada com OAuth)
- [x] Redirecionamento baseado em role

## Frontend - Painel do Morador
- [x] Dashboard com bem-vindo e pontuação
- [x] Formulário de agendamento de coleta
- [x] Tabela/lista de agendamentos com status
- [x] Histórico de coletas
- [x] Perfil do usuário

## Frontend - Mapa Interativo
- [x] Integração do Google Maps (estrutura pronta)
- [x] Marcadores para pontos de descarte (estrutura pronta)
- [x] Filtro por tipo de resíduo
- [x] Informações ao clicar no marcador
- [x] Geolocalização do usuário

## Frontend - Módulo Educativo
- [x] Página com dicas de separação de resíduos
- [x] Conteúdo sobre benefícios da reciclagem
- [x] Cards informativos com ícones
- [x] Categorias de resíduos

## Frontend - Painel Administrativo
- [x] Dashboard para Prefeitura/Cooperativa
- [x] Tabela de agendamentos com filtros
- [x] Atualização de status de coletas (UI pronta)
- [x] Visualização de relatórios básicos
- [x] Gráficos de volume coletado

## Frontend - Dashboard de Métricas
- [x] Indicador de volume coletado
- [x] Cálculo e exibição do aumento percentual
- [x] Gráficos de tendência mensal
- [x] Comparação com meta

## Testes
- [x] Testes unitários para procedures críticas
- [x] Testes de autenticação
- [x] Testes de agendamento

## Deploy e Entrega
- [x] Revisar toda a interface
- [x] Testar fluxos de usuário
- [x] Criar checkpoint final
- [x] Entregar ao usuário
