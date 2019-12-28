#!/usr/bin/zsh
for f in `ls lib`
do
 # poner -ne o -eq según se quiere backend o frontend, respectivamente
 [ `find lib/$f -name '*.styl' -o -name '*.jade' | wc -c` -eq 0 ] || echo $f
done
