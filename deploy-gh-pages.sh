#!/bin/bash

# Script para fazer deploy do projeto Angular no GitHub Pages
# Este script automatiza o processo de build e deploy

echo "🚀 Iniciando deploy para GitHub Pages..."

# 1. Limpar diretório docs
echo "🧹 Limpando diretório docs..."
rm -rf docs/*

# 2. Fazer build para produção
echo "🔨 Fazendo build para produção..."
npm run build:gh-pages

# 3. Copiar arquivos do browser para docs (se necessário)
if [ -d "docs/browser" ]; then
    echo "📁 Copiando arquivos do diretório browser..."
    cp -r docs/browser/* docs/
    rm -rf docs/browser
fi

# 4. Verificar se o arquivo index.html existe
if [ ! -f "docs/index.html" ]; then
    echo "❌ Erro: arquivo index.html não encontrado em docs/"
    exit 1
fi

# 5. Verificar se o base href está correto
if grep -q 'base href="/Agenda-Front/"' docs/index.html; then
    echo "✅ Base href está correto"
else
    echo "⚠️  Corrigindo base href..."
    sed -i 's|base href="[^"]*"|base href="/Agenda-Front/"|g' docs/index.html
fi

echo "✅ Deploy concluído!"
echo "📝 Agora você pode fazer commit e push das alterações:"
echo "   git add docs/"
echo "   git commit -m 'Deploy: atualização do GitHub Pages'"
echo "   git push origin main"
echo ""
echo "🌐 Site disponível em: https://desenvolvimentosetc.github.io/Agenda-Front/"
