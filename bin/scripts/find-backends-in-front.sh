#!/usr/bin/zsh
echo Backend references in frontend
rgrep -hEo "backend/[^/')]*" lib/frontend | cut -c8- | sort | uniq -c
echo
echo Frontend references in backend
rgrep -hEo "frontend/[^/')]*" lib/backend | cut -c9- | sort | uniq -c

