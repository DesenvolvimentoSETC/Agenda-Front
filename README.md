# Agenda do Governador

Sistema de agenda desenvolvido em Angular 19 para gerenciamento de eventos do governador.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Angular CLI 19.2.9
- API Spring Boot rodando em `http://172.22.21.17:9090`

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/DesenvolvimentoSETC/Agenda-Front.git
cd Agenda-Front
```

2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor local de desenvolvimento:

```bash
ng serve
```

O aplicativo estará disponível em `http://localhost:4200/`.

## Build

Para gerar os arquivos de produção:

```bash
ng build
# ou
npm run build:prod
```

Os arquivos serão gerados na pasta `dist/`.

## Configuração

### API Backend
O projeto está configurado para se conectar com a API Spring Boot em:
- **URL da API:** `http://172.22.21.17:9090`

### Funcionalidades
- **Login de administrador**
- **Visualização pública da agenda**
- **Gerenciamento de eventos** (CRUD)
- **Autenticação JWT**

## Uso

1. **Acesse a aplicação:** `http://localhost:4200`
2. **Página inicial:** Visualização pública dos eventos
3. **Login:** Acesse `/login` para área administrativa
4. **Administração:** Após login, gerencie eventos em `/admin`

## Testes

Para executar os testes unitários:

```bash
ng test
```

Para executar os testes end-to-end:

```bash
ng e2e
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── home/          # Página inicial pública
│   │   ├── login/         # Página de login
│   │   └── admin/         # Área administrativa
│   ├── auth/              # Serviços de autenticação
│   ├── services/          # Serviços da aplicação
│   └── environments/      # Configurações de ambiente
```

## Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **JWT** - Autenticação
- **TypeScript** - Linguagem de programação
