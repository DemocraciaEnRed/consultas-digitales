# Extendiendo la plataforma

En un principio Consultas Digirales era una "extensión" de DemocracyOS (DOS a partir de ahora). Por eso, mucho de su código quedó en la carpeta `ext`. Posteriormente se decidió volver al código fuente de DOS dado que este mecanismo del `ext` molestaba más de lo que ayudaba en el desarrollo. Si bien el repositorio se encuentra en estado de migración, para abandonar el `ext`, todavía hay muchas cosas que quedaron en `ext`.

Esta dinámica suponía que no se toque en absoluto el código fuente de DOS y se haga todo mediante "extensión". Un uso aplicado se puede ver, p. ej., en [ext/lib/site/boot/overrides.js](../ext/lib/site/boot/overrides.js) donde se hace una pisada de muchos componentes originales de DOS. Así que **tenga cuidado** cuando modifique componentes de React; si los cambios no se reflejan, lo más probable es que algún archivo de `ext` lo esté pisando (todavía hay muchos overrides: [boot](../ext/lib/boot/overrides.js), [admin](../ext/lib/admin/boot/overrides.js), [site](../ext/lib/site/boot/overrides.js) y [settings](../ext/lib/settings/boot/overrides.js)).

Como dijimos, esta práctica fue abandonada y ahora se recomienda editar el código fuente de DOS directamente.

## Estructura de carpetas

Siguiendo la estructura de DemocracyOS, se tiene:

* Todo lo que sea el sitio web, bajo `/site`
* Todo lo que sea el panel de configuración, bajo `/settings`
* Todo lo que sea el panel de admin de una comunidad/forum, bajo `/admin`
* Web API endpoints en `/api`
* Interfaces con la base de dato en `/db-api`

(y en `ext/<esas_carpetas>` lo mismo)

## Dependencias principales
- Mongoose
- ExpressJS
- React
- [Stylus](http://stylus-lang.com/) (.styl)
- [Jade](http://jade-lang.com/) (.jade)

## Buildeos y watchs

- Si el servicio está levantado, el sitio puede buidearse on-demand debido al watch. O sea, todo cambio que haga en `/site` tiene un watcher que mira cambios. No tiene hot-reload, debe recargar la pagina en cada cambio.
- A igual que el punto anterior, tambien todo CSS se buildea y cuenta con un watcher. Es necesario tambien recargar (sin cache) la página.
- Si hace cambios en la API, debe matar el servicio (`Ctrl + C + C`) y volver a levantarlo. No cuenta con un watcher para buildear el codigo.

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

---
## Documentación vieja del `ext`
### Vistas

Para overraidear vistas lo mejor es partir de la implementacion de DemocracyOS (entrando a su bash) y hacer su copia en la carpeta `/ext/lib` 

Se hacen las modificaciones y se tiene que declarar su override en el archivo `/ext/lib/site/boot/overrides.js`

Este seria un ejemplo de como overraidear una vista de DemocracyOS por una personalizada.

```js
import 'ext/lib/boot/overrides'

import * as HomeForum from 'lib/frontend/site/home-forum/component'
import HomeForumExt from 'ext/lib/site/home-forum/component'

import * as HomeMultiForum from 'lib/frontend/site/home-multiforum/component'
import HomeMultiForumExt from 'ext/lib/site/home-multiforum/component'

import * as TopicLayout from 'lib/frontend/site/topic-layout/component'
import TopicLayoutExt from 'ext/lib/site/topic-layout/component'

import * as Help from 'lib/frontend/site/help/component'
import HelpExt from 'ext/lib/site/help/component'

import * as SignIn from 'lib/frontend/site/sign-in/component'
import SignInExt from 'ext/lib/site/sign-in/component'


HomeForum.default = HomeForumExt
HomeMultiForum.default = HomeMultiForumExt
TopicLayout.default = TopicLayoutExt
Help.default = HelpExt
SignIn.default = SignInExt
```
