# Extendiendo la plataforma

Al ser una "extension" de DemocracyOS, mucho del código viene por el lado de esta plataforma base. Para eso, es muy recomendable tener el codigo fuente de DemocracyOS a mano para poder ver cómo funcionan partes del código de su interes y entender el flujo de datos a la perfección.

Esta extension agrega otros API endpoints y vistas que complementan a DemocracyOS y permiten la correcta operacion de la plataforma.

Supuestamente todo lo que usted debe modificar (si es necesario) existira bajo la carpeta `/ext`

En última instancia, de ser necesario, puede agregar una copia de los archivos originales de DemocracyOS modificados a su antojo en la carpeta `dos-overrides`, respetando la estructura de directorios original. Estos archivos pisarán a los de DemocracyOS bajo la carpeta `lib`. Esta es la forma más directa (y peligrosa) de "editar" el código fuente base de DemocracyOS. Por ejemplo, si quiere editar el archivo original ubicado en `lib/models/comment.js`, tendría que copiar el original a `dos-overrides/models/comment.js` y modificarlo como usted quiera.

---

Siguiendo la estructura de DemocracyOS, se tiene:

* Todo lo que sea el sitio web, bajo `/ext/site`
* Todo lo que sea el panel de admin, bajo `/ext/admin`
* Nuevas api endpoints *pueden* llegar a convivir en `/ext/api`
* Nuevas interfaces con la base de dato *pueden* llegar a convivir en `/ext/db-api`

**NOTA:** Recomendamos tener mucho cuidado en la implementacion de funcionalidades complejas que impliquen el backend. Probablemente el interes se encuentre en la personalizacion del sitio web.

#### Dependencias
- ExpressJS
- Mongoose
- React
- Style (css)

#### Algunas consideraciones:

- Si el servicio está levantado, el sitio puede buidearse on-demand debido al watch. O sea, todo cambio que haga en `/ext/site` tiene un watcher que mira cambios. No tiene hot-reload, debe recargar la pagina en cada cambio.
- A igual que el punto anterior, tambien todo CSS se buildea y cuenta con un watcher. Es necesario tambien recargar la pagina.
- Si hace cambios en la API, debe detener el servicio (`Ctrl + C`) y volver a levantarlo. No cuenta con un watcher para buildear el codigo.
- Mucho del código css se encuentra en archivos `.styl` que son de [Stylus](http://stylus-lang.com/)
- Algunos códigos viejos html, con extensión `.jade`, están hechos con el motor de templates [Jade](http://jade-lang.com/)
---

Todo lo que necesita para adaptar su plataforma es modificar textos o imagenes bajo la carpeta `/ext/site`.

A continuacion damos un listado importantes 

## Imagenes para cambiar

- Icono del navbar: `/ext/lib/site/home-multiforum/assets/logo-header.svg`
- Icono del footer: `/ext/lib/site/footer/assets/logo-footer.svg`
- Background del header del home: `/ext/lib/site/home-multiforum/assets/header_consulta-publica.png`
- Iconos del listado del home: 
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-1.svg`
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-2.svg`
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-3.svg`

## Textos para cambiar

Se pueden cambiar cualquier texto dentro de `/ext/lib/site`. Algunas vistas pueden llegar a utilizar algun componente de **i18n** donde la funcion `t("mi.label")` toma del archivo de traduccion `es.json` ubicado en `/ext/translations/lib/es.json`

Si hay etiquetas de i18n que no se encuentran en el `es.json` lo mas probable es que vengan del core de DemocracyOS.

Si se quiere ver esos archivos, lo mas conveniente es entrar al bash del container o ver el repositorio de DemocracyOS en GitHub.

Para entrar al bash del container, ejecutar:

```
docker exec -it <containername> bash
```

El bash abre en `/usr/src` y ahi se encontraria el codigo de todo DemocracyOS y la carpeta ext que es de este repositorio.

## Vistas

Para overraidear vistas lo mejor es partir de la implementacion de DemocracyOS (entrando a su bash) y hacer su copia en la carpeta `/ext/lib` 

Se hacen las modificaciones y se tiene que declarar su override en el archivo `/ext/lib/site/boot/overrides.js`

Este seria un ejemplo de como overraidear una vista de DemocracyOS por una personalizada.

```js
import 'ext/lib/boot/overrides'

import * as HomeForum from 'lib/site/home-forum/component'
import HomeForumExt from 'ext/lib/site/home-forum/component'

import * as HomeMultiForum from 'lib/site/home-multiforum/component'
import HomeMultiForumExt from 'ext/lib/site/home-multiforum/component'

import * as TopicLayout from 'lib/site/topic-layout/component'
import TopicLayoutExt from 'ext/lib/site/topic-layout/component'

import * as Help from 'lib/site/help/component'
import HelpExt from 'ext/lib/site/help/component'

import * as SignIn from 'lib/site/sign-in/component'
import SignInExt from 'ext/lib/site/sign-in/component'


HomeForum.default = HomeForumExt
HomeMultiForum.default = HomeMultiForumExt
TopicLayout.default = TopicLayoutExt
Help.default = HelpExt
SignIn.default = SignInExt
```

## Assets

Cada carpeta dentro de `/ext/lib/site` cuenta con las vistas y cada una de ellas puede contar con una carpeta `assets` del cual el componente puede referenciar a esta carpeta.

Cuando se realiza el build, la estructura de carpetas se mantiene. O sea, si tengo un asset en `/ext/lib/site/home-multiforum/assets/logo-header.svg` entonces en la URL lo tendre en `http://localhost:3000/ext/lib/site/home-multiforum/logo-header.svg`

Note que en el codigo del componente de home-multiforum se referencia usando `url()` o si es un tag `<img>` con `src=` se hace asi:

```
<img
  src="/ext/lib/site/home-multiforum/logo-header.svg"
  alt="Logo"
  width="270px"
/>
```
