echo front
echo back
echo -------
for f in `ls lib`
do echo $f
rgrep "/$f" lib/frontend | wc
rgrep "/$f" lib/backend | wc
echo ---------
done
