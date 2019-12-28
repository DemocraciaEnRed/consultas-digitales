#!/usr/bin/zsh
extpath=ext/lib/site/home-multiforum
for f in $extpath/**/*.js
do
 libpath=${f#ext/}
 cp $f $libpath
done
