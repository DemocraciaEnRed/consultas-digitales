# Extending the Platform

> Note: This document has been translated from Spanish to English using ChatGPT. It may not be perfect. The original document can be found [here](personalizacion.md).

Initially, Digital Queries was an "extension" of DemocracyOS (DOS from now on). That's why much of its code remained in the `ext` folder. Later, it was decided to revert to the source code of DOS since this `ext` mechanism was more of a hindrance than a help in development. Although the repository is in a state of migration to abandon the `ext`, there are still many things left in `ext`.

This dynamic assumed that the source code of DOS would not be touched at all and everything would be done through "extension". An applied use can be seen, for example, in [ext/lib/site/boot/overrides.js](../ext/lib/site/boot/overrides.js) where many original DOS components are overridden. So **be careful** when modifying React components; if the changes are not reflected, **most likely some `ext` file is overriding them** (there are still many overrides: [boot](../ext/lib/boot/overrides.js), [admin](../ext/lib/admin/boot/overrides.js), [site](../ext/lib/site/boot/overrides.js), and [settings](../ext/lib/settings/boot/overrides.js)).

As mentioned, this practice has been abandoned and it is now recommended to edit the source code of DOS directly.

## Folder Structure

Following the structure of DemocracyOS, we have:

* Everything related to the configuration/profile panel under `frontend/settings`
* Everything related to the admin panel of a specific community/forum under `frontend/admin`
* Everything related to the website, not covered by the above, under `frontend/site`
* API stores used by the front end to communicate with the Web APIs under `frontend/stores`
* Web API endpoints in `backend/api`
* Interfaces with the database in `backend/db-api`
* Database models in `backend/models`

(and in `ext/<those_folders>` the same)

## Main Dependencies
- ExpressJS
- React
- [Stylus](http://stylus-lang.com/) (.styl)
- [Jade](http://jade-lang.com/) (.jade)
- Mongoose

## Builds and Watches

- If the service is up, the site can be built on-demand due to the watch. In other words, any change you make in `/site` has a watcher that observes changes. It doesn't have hot-reload, so you need to reload the page after each change.
- Similarly to the previous point, all CSS is built and has a watcher. It's also necessary to reload the page (without cache).
- If you make changes in the API, you need to kill the service (`Ctrl + C + C`) and restart it. There's no watcher to build the code.

## Images to Change

The images for the home are located in `/lib/frontend/site/home-multiforum/assets` and are as follows:
- Navbar Icon: `logo-header.svg`
- Footer Icon: `logo-footer.svg`
- Central Logo for the Home: `logo-central-home.png`
- Home Background: `background-home.jpeg`
- Icons for the Home Steps List:
  - `icono-home-informate.svg`
  - `icono-home-participa.svg`
  - `icono-home-comparti.svg`


## Texts to Change

You can change any text within `/ext/lib/site`. Some views may use an **i18n** component where the function `t("my.label")` retrieves from the translation file `es.json` located in `/ext/translations/lib/es.json`.

If there are i18n tags that are not found in `es.json`, they most likely come from the core of DemocracyOS.

If you want to see those files, the most convenient way is to enter the container's bash or view the DemocracyOS repository on GitHub.

To enter the container's bash, run:

```
docker exec -it <containername> bash
```

The bash opens in `/usr/src` and there you would find the code for all of DemocracyOS and the `ext` folder, which is from this repository.

## Assets

Each folder within `/ext/lib/site` has the views and each one of them may have an `assets` folder from which the component can reference.

When the build is performed, the folder structure remains the same. In other words, if I have an asset in `/lib/frontend/site/home-multiforum/assets/logo-header.svg`, then in the URL it will be at `http://localhost:3000/lib/frontend/site/home-multiforum/logo-header.svg`.

Note that in the code of the home-multiforum component, it is referenced using `url()` or if it's an `<img>` tag with `src=`, it's done like this:

```
<img
  src="/lib/frontend/site/home-multiforum/logo-header.svg"
  alt="Logo"
  width="270px"
/>
```

## Mail

The email templates are located in `ext/lib/notifier/jobs`, where you can find everything you need to edit texts, customize, etc.

Keep in mind that there is something very specific in `/ext/lib/notifier/responsive-html-email-template.js`. You should change both the colors and the dimensions width and height for `${baseUrl}/ext/lib/boot/logo-mail.png`.

One thing: If it's very annoying that an email is sent to the author every time a comment is made, then disable it within the middleware `lib/backend/api-v2/middlewares/notifications.js` by removing the "owner" within "topic", which for some reason wasn't there before and that prevented anything from being sent when a new comment was made on the digital query.

## CSS

The main CSS variables are defined in [global.styl](../lib/boot/global.styl).

In general, the organization of CSS is quite complicated. To begin with, it's important to understand that all screens under the same section ([site](../lib/frontend/site), [admin](../lib/frontend/admin), or [settings](../lib/frontend/settings)) share a universal CSS. These CSS files have the name of the section, plus `.css`, and are compiled when building and reside in the post-build folder `public`. That's why when inspecting the styles of a page, you can see that the compiled CSS files are large. The entry `.styl` files for each section are located in the `boot` folder of each section, for example, [the one for admin](../lib/frontend/admin/boot/boot.styl). Subsequently, all those from `ext` are loaded, for example, [the one for admin](../ext/lib/admin/boot/boot.styl). All this is compiled by `gulp`, and it's configured in [lib/build](../lib/build/index.js), where you can see how it loads the main `entries` such as those from `ext`.

Therefore, when you modify a style of a particular component, it may affect the rules of `ext` or the main ones. Please make an effort not to use `!important` and search throughout the code to find which rule might be causing trouble.

## Docker Compose Configuration Variables

These environment variables (e.g., `LOGO` or `STAFF`) are defined in [config/defaults.json](../config/defaults.json). If you want to change the name of any variable, remove or add new ones, you should do it there. Afterwards, to define the value of these variables according to the instance that is running, there are two paths: if it's running locally, without Docker, do it in `config/development.json` (an example in [config/development.json.example](../config/development.json.example)); if it's running in Docker, do it via environment variables, as seen in [`docker-compose.example.yml`](../docker-compose.example.yml), changing the name to all uppercase and using underscores instead of spaces.

For a configuration variable to be accessible from the code, you must import `lib/config` and access them directly. If you are in a React component, only the variables listed in the `"client"` key of `config/defaults.json` will be accessible (since exposing all to the client would be a security risk).