for f in `ls lib | egrep -v 'frontend|backend|.*\.js'`
do echo --- lib/$f
echo -n Frontend refs
rgrep "/$f" lib/frontend | wc
echo -n 'Backend refs '
rgrep "/$f" lib/backend | wc
done
