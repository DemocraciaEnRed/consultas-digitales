# uso: source run-dev.sh
# primer uso en repo hacer: npm install
# crear container mongo con:
# docker run -p 27017:27017 --name mongodb-NOMRBE -d mongo:3.2

# si docker no está prendido, prenderlo
pgrep dockerd > /dev/null || sudo systemctl start docker

# si el container no está corriendo, arrancarlo
NOMBRE_CONTAINER=mongodb-pulsos-juntas
docker inspect --format="{{.State.Status}}" $NOMBRE_CONTAINER | grep -q running || docker start $NOMBRE_CONTAINER

# si no estamos usando node v8, cambiar a esa
node -v | grep -q v8 || nvm use v8

# finalmente, levantar el sistema (bws=build watch serve)
#NODE_PATH=. DEBUG=democracyos* gulp bws
NODE_PATH=. DEBUG=democracyos* node_modules/.bin/gulp bws
