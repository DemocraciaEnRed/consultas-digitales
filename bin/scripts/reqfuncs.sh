cookiename=cp-cookie
host=http://localhost:3000
aforumname=ss

connmongo() { docker exec -it miconsultapublica-mongo mongo mi-consultapublica }

signinuser(){ 
 curl -c $cookiename \
  -d 'email=wencha_@hotmail.com&password=123123' \
  $host/api/signin
}

signinuserw() {
 hola_soy_error 2>/dev/null
 while [ $? -ne 0 ]
 do
  sleep 1
  signinuser
 done
}

verifyuser(){
 curl -b $cookiename \
  -XPOST $host/ext/api/user-verify/verify/$1
}

# param 1: user string
searchusers(){
 curl -s -b $cookiename \
  "$host/ext/api/user-verify/search?q=$1" \
  -H 'Accept: application/json' | jq
}

testurls(){
 myget(){ curl -sb $cookiename $host/api/user/me > /dev/null && curl -sb $cookiename $1 > /dev/null }
 urls=(/ \
  /ajustes /ajustes/administrar /ajustes/perfil /ajustes/contrasena /ajustes/notificaciones /ajustes/user-badges \
  /notificaciones \
  /ayuda/como-funciona /ayuda/acerca /ayuda/estadisticas /ayuda/terminos-y-condiciones /ayuda/privacidad /ayuda/markdown \
  /$aforumname /$aforumname/admin/topics /$aforumname/admin/permissions /$aforumname/admin/edit-forum /$aforumname/admin/tags /$aforumname/admin/comments /$aforumname/admin/tags-moderation
 )
 for u in $urls
 do
  echo "Get $host$u"
  myget $host$u
 done
}
