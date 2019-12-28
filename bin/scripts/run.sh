# uso:
# source run.sh
nvm use v6.17.1
docker start mongodb-dos
NODE_PATH=. DEBUG=democracyos* gulp bws
