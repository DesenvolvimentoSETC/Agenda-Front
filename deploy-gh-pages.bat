@echo off
REM Script para fazer deploy do projeto Angular no GitHub Pages
REM Este script automatiza o processo de build e deploy

echo 🚀 Iniciando deploy para GitHub Pages...

REM 1. Limpar diretório docs
echo 🧹 Limpando diretório docs...
if exist docs rmdir /s /q docs
mkdir docs

REM 2. Fazer build para produção
echo 🔨 Fazendo build para produção...
call npm run build:gh-pages

REM 3. Copiar arquivos do browser para docs (se necessário)
if exist docs\browser (
    echo 📁 Copiando arquivos do diretório browser...
    xcopy docs\browser\* docs\ /s /e /y
    rmdir /s /q docs\browser
)

REM 4. Verificar se o arquivo index.html existe
if not exist docs\index.html (
    echo ❌ Erro: arquivo index.html não encontrado em docs/
    pause
    exit /b 1
)

REM 5. Verificar e corrigir base href se necessário
findstr /c:"base href=\"/Agenda-Front/\"" docs\index.html >nul
if errorlevel 1 (
    echo ⚠️  Corrigindo base href...
    powershell -Command "(Get-Content docs\index.html) -replace 'base href=\"[^\"]*\"', 'base href=\"/Agenda-Front/\"' | Set-Content docs\index.html"
) else (
    echo ✅ Base href está correto
)

echo ✅ Deploy concluído!
echo 📝 Agora você pode fazer commit e push das alterações:
echo    git add docs/
echo    git commit -m "Deploy: atualização do GitHub Pages"
echo    git push origin main
echo.
echo 🌐 Site disponível em: https://desenvolvimentosetc.github.io/Agenda-Front/
pause
