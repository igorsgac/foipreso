@echo off
echo ==========================================
echo    AUTOMAÇÃO DOCKER - FOIPRESO.COM.BR
echo ==========================================

:: 1. Parar e remover container antigo (se existir) para evitar conflitos
echo Parando containers antigos...
docker stop foipreso-site >nul 2>&1
docker rm foipreso-site >nul 2>&1

:: 2. Construir a imagem Alpine compacta
echo Construindo imagem compacta (Alpine)...
docker build -t foipreso-app .

:: 3. Rodar o novo container
:: Mapeia a porta 80 do Windows para a 80 do container
echo Subindo novo container na porta 80...
docker run -d --name foipreso-site -p 80:80 --restart always foipreso-app

echo.
echo ==========================================
echo    SITE ONLINE! 
echo    Acesse: http://individuo.foipreso.com.br
echo ==========================================
pause