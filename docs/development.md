# Guía de instalación

## Docker

La forma más fácil de correr Consultas Digitales es con **Docker** y **Docker compose**. Se probó exitósamente con las versiones **19.03.5** y **1.24.0** de las mismas, sobre un **Ubuntu 18.04**. Si quiere instalar localmente, sin Docker, puede ver el apartado [Instalación directa](#instalación-directa).

Una vez que verifique que cuenta con estas dependencias, haga un _fork_ de este repositorio y clónelo localmente.

### Variables de entorno

En primer lugar debemos adecuar el `docker-compose.yml`

La aplicación utiliza las imagenes de **Node 6** y **Mongo 3.2**

Es preferente trabajar en el entorno de desarrollo utilizando Docker Compose donde definimos las variables de entorno y los servicios con la que la aplicación trabaja.

En el repositorio encontrará la siguiente plantilla en `docker-compose.yml.example`. Pase este contenido a `docker-compose.yml` y utilice la plantilla como base. Opcionalmente puede crear un `docker-compose.override.yml` en su copia local del proyecto; este archivo será tomado automáticamente por el comando `docker-compose` (`docker-compose.yml` no será leído), y no molestará a git ya que se encuentra ignorado (en `.gitignore`).

La plantilla es la siguiente:

```yaml
version: '3'

services:
  app:
    container_name: miconsultapublica
    build: .
    command: ["./node_modules/.bin/gulp", "bws"]
    environment:
      - NODE_ENV=development
      - DEBUG=democracyos*
      - MONGO_URL=mongodb://mongo/mi-consultapublica
      # Importante: Defina el "Staff" de administradores para que en su registro el sistema le de privilegios de admin
      # Para un solo admin:
      # - STAFF=hola@miemail.com
      # Para varios admins:
      # - STAFF=hola@miemail.com,usuario@otroemail.com,otrousuario@nuevoemail.com
      - STAFF=hola@miemail.com
      # Logos
      - LOGO=/ext/lib/site/home-multiforum/logo-header.svg
      - LOGO_MOBILE=/ext/lib/site/home-multiforum/logo-header.svg
      # Organizacion
      - ORGANIZATION_EMAIL=miconsultapublica@midominio.com.ar
      - ORGANIZATION_NAME="Mi Consulta Pública"
      # Social media y email settings
      - SOCIALSHARE_SITE_NAME="Mi Consulta Pública"
      - SOCIALSHARE_SITE_DESCRIPTION="Plataforma de participación ciudadana"
      - SOCIALSHARE_IMAGE=https://urlexterno.com/mi-imagen-externa.png #Cambiar
      - SOCIALSHARE_DOMAIN=miconsultapublica.midominio.com #Cambiar
      - SOCIALSHARE_TWITTER_USERNAME=@miConsultaPublica #Cambiar
      - TWEET_TEXT="Estoy tratando de mejorar esta propuesta “{topic.mediaTitle}” ¡Participá vos también!"
      # Configuracion del mailer
      - NOTIFICATIONS_MAILER_EMAIL=miconsultapublica@midominio.com
      - NOTIFICATIONS_MAILER_NAME="Mi consulta pública"
      - NOTIFICATIONS_NODEMAILER={"host:"xxxxx.smtp.com","port":465,"secure":true,"auth":{"user":"xxxxxxxx","pass":"xxxxxxx"}} #Cambiar
      # El mail del que recibe los pedidos de verificación de cuentas
      - VERIFY_USER_REQUEST_EMAIL=unmail@correo.com
      # Requerido: Genere un token para JWT
      - JWT_SECRET= #Cambiar
      - LOCALE=es
      - ENFORCE_LOCALE=true
    links:
      - mongo 
    ports:
      - 3000:3000
    volumes:
      - ./ext/lib:/usr/src/ext/lib
      - ./public:/usr/src/public
    tty: true

  mongo:
    container_name: miconsultapublica-mongo
    image: mongo:3.2
    ports:
      - 27017:27017
    volumes:
      - ./tmp/db:/data/db
      
#  mailserver:
#    image: namshi/smtp
#    environment:
#      - GMAIL_USER=mi-usuario@gmail.com
#      - GMAIL_PASSWORD=mi-contraseña-que-no-debo-publicar
```

##### Notas
* Es muy importante que en `STAFF` agregues el email del admin o el de los administradores.
* Por defecto, tal com esta en el docker-compose, está en el puerto 3000. Puede cambiar el puerto el cual se expone la aplicación (Ej: `3000:9999`)
* Podés comentar las variables `NOTIFICATION_*` si todavía no tenés un servidor de correo definido.
* Si se prefiere conectar a una base de datos local, fuera del entorno, vea el apartado [Conectar a una base de datos mongo local](#local-mongo)
* Podés configurar DemocracyOS con cualquiera de las variables de entorno listadas acá: http://docs.democracyos.org/configuration.html
* El puerto `27017` está expuesto para que puedas administrar la base de datos con algún cliente de MongoDB, por ejemplo con [Robomongo](https://robomongo.org/).
* Todas las vistas personalizadas para Consultas Digitales se encuentran en [`/ext`](ext). Siguiendo el mismo patrón de carpetas que [DemocracyOS/democracyos](https://github.com/DemocracyOS/democracyos).
* Las variables de entorno se traducen a variables en código siguiendo la serialización descripta en [DemocracyOS/config](https://github.com/DemocracyOS/config#environment-variables).


Luego de que todo este definido, podemos arrancar el servidor ejecutando:

```
docker-compose up --build
```

Puede tardar un rato largo en buildear. Cuando haya terminado y si todo sale bien, el servidor y container estarán correctamente levantados y listos para poder trabajar.


Para entrar a la aplicacion a [http://localhost:3000](http://localhost:3000)


### Comandos utiles

Para abrir el server local

```
docker-compose up
```

Si cambia alguna dependencia del `/ext/package.json`, tiene que volver a buildear la imagen de Docker

```
docker-compose up --build
```

Si desea utilizar otro archivo de compose:

```
docker-compose -f docker-compose-otro.yml up
```

Para poder entrar al container de DemocracyOS:

```
docker exec -it miconsultapublica bash
```

Para entrar a la base de datos

```
docker exec -it miconsultapublica-mongo mongo mi-consultapublica
```

Para inspeccionar rápidamente la base de datos (dentro de la consola de mongo):
```
# enumerar tablas
show tables
# volcar tabla forums
db.forums.find()
# volcar solo ids, names y titles
db.forums.find({}, {name:1, title:1})
# buscar por id
db.forums.find(ObjectId("5dbc5619a035c3000f2f1f45"))
# buscar por nombre
db.forums.find({name: 'un nombre'})
```

### Conectar a una base de dato Mongo local

Si lo prefiere, puede conectar la aplicacion a su mongo local. En primer lugar aseguresé que sea **Mongo 3.2**, si no, procure utilizar el container que se construye en el build del docker-compose.

Suponiendo que la base de datos esta en `localhost:27017` cambiar el valor de la variable `MONGO_URL`

```yaml
  app: 
    [...]
    environment:
      [...]
      - MONGO_URL=mongodb://localhost:27017/mi-consultapublica
```
Luego, debe comentar:

```yaml
  app: 
    [...]
    # links:
    #  - mongo 
    [...]
```
Y agregar:

```yaml
  app: 
    [...]
    network_mode: "host"
    [...]
```

Por ultimo debemos comentar el servicio de mongo, para que no se construya el container

```yaml
  # mongo:
  #   container_name: miconsultapublica-mongo
  #   image: mongo:3.2
  #   ports:
  #     - 27017:27017
  #   volumes:
  #     - ./tmp/db:/data/db
```

### Conectar a un servidor SMTP local

Para esto podemos usar la imagen [namshi/smtp](https://hub.docker.com/r/namshi/smtp).

Por ejemplo, si usamos una cuenta de Gmail de prueba, agregar en su compose:

```yaml
  mailserver:
    image: namshi/smtp
    environment:
      - GMAIL_USER=mi-usuario@gmail.com
      - GMAIL_PASSWORD=mi-contraseña-que-no-debo-publicar
```

Posteriormente, cambiar las variables de entorno correspondientes del contenedor `app`:

```yaml
      - NOTIFICATIONS_MAILER_EMAIL=mi-usuario@gmail.com
      - NOTIFICATIONS_NODEMAILER={"host":"mailserver","port":25,"secure":false}
 ```
 
 Notar que si bien la conexión a este servidor SMTP no está cifrada, la conexión del servidor SMTP a Gmail sí lo está.

## Instalación directa
Para esto debe seguir las guías oficiales de DemocracyOS sobre [instalación](https://docs.democracyos.org/install.html) y [desarrollo](https://docs.democracyos.org/develop/).

De forma breve se puede resumir en:

- Asegurarse de tener la versión 6 de node mirando lo que devuelve `node -v`. Si no, mire el párrafo de abajo que explica cómo cambiar fácilmente entre versiones de node.
- Ubicarse dentro de la carpeta raíz del proyecto
- Hacer `make packages`
- Agregar algún mail de staff que será lx admin. Para esto crear el archivo `config/development.json` con contenido:   
`{ "staff": ["unmail@elmail.com"] }`   
- Levantar una base de datos mongo que escuche en `localhost:27017`. Por ejemplo con docker: `docker run -p 27017:27017 --name mongodb-dos mongo:3.2`. De ser necesario puede cambiar la url del servidor mongo agregando la opción `mongoUrl` dentro de `config/development.json`
- Correr el script build-watch-serve de `gulp` haciendo `NODE_PATH=. DEBUG=democracyos* gulp bws`. Si esto no funciona pueden intentar correr `make run`
- Ir a [http://localhost:3000](http://localhost:3000), registrar su cuenta con el mail de staff y entrar (no hace falta validar el mail)

Se requiere la versión de `node` 6.x.x para correr la plataforma. Recomendamos usar [`nvm`](https://github.com/nvm-sh/nvm) para cambiar fácilmente entre una versión y otra de node. Su instalación es ultrasimple, mirar [su documentación](https://github.com/nvm-sh/nvm#installation-and-update). Si tenemos esta herramienta instalada, haríamos `nvm install lts/boron` (que es la versión 6.17.1) para cambiar a una versión válida. Una vez instalada, ya podemos hacer directamente `nvm use lts/boron`. Si no les gusta `nvm` puede intentar usar [`n`](https://github.com/tj/n).

Si no tiene `gulp` instalado puede instalarlo haciendo `npm install -g gulp` (asegurarse de previamente cambiar a la versión de `node` correcta).

### Configuración
La configuración de la instancia de hace en el archivo `config/development.json`. Los valores por defecto se pueden ver en `config/defaults.json`. Estas opciones son las mismas que para `docker-compose.yml` salvo que hay un proceso de traducción (para el caso del compose), como se explica en [DemocracyOS/config](https://github.com/DemocracyOS/config#environment-variables).

### Sistemas de builds
La plataforma cuenta con diversas formas de buildearse y correr.

Una es con `make`. Esta utiliza el archivo `Makefile` para correr scripts de `npm` como se puede ver en su código. Notar como desde un script se salta a otro (p.ej. de `run` salta a `built` y de `build` a `packages`).

Otra forma es con `gulp`. Este utiliza `gulpfile.js` que simplemente importa el archivo `lib/build/index.js`. Allí, se asignan todos los posibles scripts de `gulp` con el comando `.task(...)`. Siempre que se llame a un script de `gulp` directamente deben suministrar la variable de entorno `NODE_PATH=.` así encuentra los modulos, sino les saldrán errores del tipo `Error: Cannot find module`.

Finalmente está la forma clásica con scripts de `npm` definidos en el archivo `package.json` bajo la llave `scripts`. Estos, se corren haciendo `npm run <nombre_del_script>`, p. ej. `npm run serve`. Como verán, muchos de estos utilizan `gulp`.

El único comando indispensable para buildear el sistema es `gulp build` ya que compila todos los archivos js y css a la carpeta `public`, y también copia los assets (imágenes, fonts, etc.).
