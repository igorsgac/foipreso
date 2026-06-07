# Para e remove qualquer versão anterior do site
docker stop foipreso-site 2>$null
docker rm foipreso-site 2>$null

# Constrói a imagem Alpine (ultra compacta)
docker build -t foipreso-app .

# Inicia o container
# -d: em segundo plano
# -p 80:80: mapeia a porta do Windows para o container
# --restart always: sobe junto com o Windows/Docker
docker run -d --name foipreso-site -p 80:80 --restart always foipreso-app

Write-Host "==========================================" -ForegroundColor Green
Write-Host "SITE RODANDO EM CONTAINER DOCKER"
Write-Host "Acesse: http://individuo.foipreso.com.br"
Write-Host "==========================================" -ForegroundColor Green