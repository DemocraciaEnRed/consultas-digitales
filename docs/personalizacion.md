# Extendiendo la plataforma

En un principio Consultas Digirales era una "extensión" de DemocracyOS (DOS a partir de ahora). Por eso, mucho de su código quedó en la carpeta `ext`. Posteriormente se decidió volver al código fuente de DOS dado que este mecanismo del `ext` molestaba más de lo que ayudaba en el desarrollo. Si bien el repositorio se encuentra en estado de migración, para abandonar el `ext`, todavía hay muchas cosas que quedaron en `ext`.

Esta dinámica suponía que no se toque en absoluto el código fuente de DOS y se haga todo mediante "extensión". Un uso aplicado se puede ver, p. ej., en [ext/lib/site/boot/overrides.js](../ext/lib/site/boot/overrides.js) donde se hace una pisada de muchos componentes originales de DOS. Así que **tenga cuidado** cuando modifique componentes de React; si los cambios no se reflejan, **lo más probable es que algún archivo de `ext` lo esté pisando** (todavía hay muchos overrides: [boot](../ext/lib/boot/overrides.js), [admin](../ext/lib/admin/boot/overrides.js), [site](../ext/lib/site/boot/overrides.js) y [settings](../ext/lib/settings/boot/overrides.js)).

Como dijimos, esta práctica fue abandonada y ahora se recomienda editar el código fuente de DOS directamente.

## Estructura de carpetas

Siguiendo la estructura de DemocracyOS, se tiene:

* Todo lo que sea el panel de configuración/perfil, bajo `frontend/settings`
* Todo lo que sea el panel de admin de una comunidad/forum específica, bajo `frontend/admin`
* Todo lo que sea el sitio web, que no sea de lo anterior, bajo `frontend/site`
* API stores que usa el front para comunicarse con las Web API `frontend/stores`
* Web API endpoints en `backend/api`
* Interfaces con la base de dato en `backend/db-api`
* Modelos de la base de dato en `backend/models`

(y en `ext/<esas_carpetas>` lo mismo)

## Dependencias principales
- ExpressJS
- React
- [Stylus](http://stylus-lang.com/) (.styl)
- [Jade](http://jade-lang.com/) (.jade)
- Mongoose

## Buildeos y watchs

- Si el servicio está levantado, el sitio puede buidearse on-demand debido al watch. O sea, todo cambio que haga en `/site` tiene un watcher que mira cambios. No tiene hot-reload, debe recargar la pagina en cada cambio.
- A igual que el punto anterior, tambien todo CSS se buildea y cuenta con un watcher. Es necesario tambien recargar (sin cache) la página.
- Si hace cambios en la API, debe matar el servicio (`Ctrl + C + C`) y volver a levantarlo. No cuenta con un watcher para buildear el codigo.

## Imagenes para cambiar

Las imágenes de la home se encuentran en `/lib/frontend/site/home-multiforum/assets` y son las siguientes:
- Icono del navbar: `logo-header.svg`
- Icono del footer: `logo-footer.svg`
- Logo central del home: `logo-central-home.png`
- Background del home: `background-home.jpeg`
- Iconos del listado de pasos del home: 
  - `icono-home-informate.svg`
  - `icono-home-participa.svg`
  - `icono-home-comparti.svg`

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

Cuando se realiza el build, la estructura de carpetas se mantiene. O sea, si tengo un asset en `/lib/frontend/site/home-multiforum/assets/logo-header.svg` entonces en la URL lo tendre en `http://localhost:3000/lib/frontend/site/home-multiforum/logo-header.svg`

Note que en el codigo del componente de home-multiforum se referencia usando `url()` o si es un tag `<img>` con `src=` se hace asi:

```
<img
  src="/lib/frontend/site/home-multiforum/logo-header.svg"
  alt="Logo"
  width="270px"
/>
```

## CSS

La organización del css es bastante complicada. Para empezar hay que comprender que todas las pantallas bajo una misma sección ([site](../lib/frontend/site), [admin](../lib/frontend/admin) o [settings](../lib/frontend/settings)) comparten un css universal. Estos css tienen el nombre de la sección, más `.css`, y son compilados cuando se buildea y residen en la carpeta post-buildeo `public`. Por eso cuando se inspeccionan los estilos de una página se puede ver que los css compilados son gigantes. Los `.styl` de entrada de cada sección, residen en la carpeta `boot` de cada sección, por ejemplo [el de admin](../lib/frontend/admin/boot/boot.styl). Posteriormente se cargan todos los de `ext`, por ejemplo [el de admin](../ext/lib/admin/boot/boot.styl). Todo esto lo compila `gulp`, y está configurado en [lib/build](../lib/build/index.js), donde se puede ver cómo carga las `entries` principales como las de `ext`.

Por eso cuando modifique un estilo de un componente particular, puede que afecten las reglas de `ext` o las principales. Por favor hacer un esfuerzo por no utilizar `!important` y buscar en todo el código cuál es la regla que puede llegar a estar molestando.

## Variables de configuración de Docker Compose

Estas variables de entorno (p. ej. `LOGO` o `STAFF`) vienen definidas en [config/defaults.json](../config/defaults.json). Si desean cambiar el nombre de alguna, sacar o agregar nuevas, deben hacerlo ahí. Posteriormente, para definir el valor de esas variables según la instancia que esté corriendo hay dos caminos: si está corriendo local, sin Docker, hacerlo en `config/development.json` (un ejemplo en [config/development.json.example](../config/development.json.example); si está corriendo en Docker hacerlo vía variables de entorno, como se ve en [`docker-compose.example.yml`](../docker-compose.example.yml), cambiándole el nombre a toda mayúsculas y con guiones bajos en vez de espacios.

Para que una variable de configuración sea accesible desde el código debe importar `lib/config` y accederlas directamente. Si estamos en un componente de React, solo van a ser accesibles las variables que estén listadas en la llave `"client"` de `config/defaults.json` (ya que exponer todas al cliente sería un riesgo de seguridad).