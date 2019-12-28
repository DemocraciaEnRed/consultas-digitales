#!/usr/bin/zsh
# Cuidado que reemplaza mal los middlewares de lib/api-v2! (porque tiene su propio middleware)
# y 'forums' también (porque matche forum)
# También si ya lo ejecutaron una vez y movieron cosas y vuelve a ejecutar
# tal vez ocurran dirs tipo frontend/frontend/, que se soluciona con un simple replace global

dirs=(db-api models tags-images translations)

#esta var es backend o frontend
backorfront=backend

pathregex="(lib/|(\.\./)+)"
for d in ${dirs[@]}
do
 echo "--Remplazando referencias a lib/$d"
 c=0
 for f in `rgrep -E "$pathregex$d(/|')" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=public -l`
 do
  echo "En archivo $f"
  # el \3 de la backreference es porq \1 es (lib|..) y \2 es el (\.\./) dentro del anterior
  sed -Ei "s@$pathregex$d(/|')@lib/$backorfront/$d\3@g" $f
  c=$((c + 1))
 done
 [ $c -ne 0 ] && echo "$c ocurrencias remplazadas" || echo "(nada por aquí)"
done
