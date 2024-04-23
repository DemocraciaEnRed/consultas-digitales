# Installation Guide

> Note: This document has been translated from Spanish to English using ChatGPT. It may not be perfect. The original document can be found [here](development.md).

## Docker

The easiest way to run Digital Queries is with **Docker** and **Docker compose**. It was successfully tested with versions **19.03.5** and **1.24.0** of them, on an **Ubuntu 18.04**. If you want to install locally, without Docker, you can see the section [Direct Installation](#direct-installation).

### Environment Variables

First, we need to adjust the `docker-compose.yml`.

The application uses the images of **Node 8** and **Mongo 3.2**.

In the repository, you will find the template [`docker-compose.example.yml`](../docker-compose.example.yml). Copy the template to a new file named `docker-compose.override.yml` in your local copy of the project; this file will be automatically picked up by the `docker-compose` command (it will override what is already defined in `docker-compose.yml`), and it won't bother in git since it's ignored (in `.gitignore`).

##### Notes
* It's very important that in `STAFF` you add the admin's email or the emails of the administrators. You can even do this before creating the respective accounts on the platform.
* You can comment out the `NOTIFICATION_*` variables if you don't have a defined mail server yet.
* You can configure DemocracyOS with any of the environment variables listed here: http://docs.democracyos.org/configuration.html
* By default, the application is mounted on port 3000. You can change this port by editing the number on the right under the key `ports` (e.g., `3000:9999`).
* If you prefer to connect to a local database, outside the environment, see the section [Connect to a local mongo database](#connect-to-a-local-mongo-database).
* Port `27017` is exposed so you can manage the database with some MongoDB client, for example, with [Robomongo](https://robomongo.org/).
* There are many customized views of Digital Queries found in [`/ext`](ext). Following the same folder pattern as [DemocracyOS/democracyos](https://github.com/DemocracyOS/democracyos).
* Environment variables are translated to code variables following the serialization described in [DemocracyOS/config](https://github.com/DemocracyOS/config#environment-variables).


After everything is defined, we can start the server by running:

```
docker-compose up --build
```

It may take a long time to build. When it's finished and if everything goes well, the server and container will be correctly up and ready to work.

To access the application go to [http://localhost:3000](http://localhost:3000).

### Useful Commands

To start the local server:

```
docker-compose up
```

If any dependency in `/ext/package.json` changes, you need to rebuild the Docker image:

```
docker-compose up --build
```

If you want to use another compose file:

```
docker-compose -f docker-compose-otro.yml up
```

To enter the DemocracyOS container:

```
docker exec -it miconsultapublica bash
```

To access the database (here named `mi-consultapublica` but can be changed):

```
docker exec -it miconsultapublica-mongo mongo mi-consultapublica
```

To quickly inspect the database (within the mongo console):

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
# borrar 1 usuario por mail
db.users.deleteOne({"email":"bungew@gmail.com"})
# borrar todos los usuarios
db.users.remove({})
```

### Connect to a local MongoDB database

If you prefer, you can connect the application to your local MongoDB. First, make sure it's **Mongo 3.2**, if not, try to use the container that is built in the docker-compose build.

Assuming the database is at `localhost:27017`, change the value of the variable `MONGO_URL`.


```yaml
  app: 
    [...]
    environment:
      [...]
      - MONGO_URL=mongodb://localhost:27017/mi-consultapublica
```

Then, comment the following:


```yaml
  app: 
    [...]
    # links:
    #  - mongo 
    [...]
```

And add:


```yaml
  app: 
    [...]
    network_mode: "host"
    [...]
```

Finally, we must comment out the mongo service so that the container is not built.

```yaml
  # mongo:
  #   container_name: miconsultapublica-mongo
  #   image: mongo:3.2
  #   ports:
  #     - 27017:27017
  #   volumes:
  #     - ./tmp/db:/data/db
```

### Connect to a local SMTP server

For this, we can use the image [namshi/smtp](https://hub.docker.com/r/namshi/smtp).

For example, if we use a test Gmail account, add to your compose:


```yaml
  mailserver:
    image: namshi/smtp
    environment:
      - GMAIL_USER=mi-usuario@gmail.com
      - GMAIL_PASSWORD=mi-contraseña-que-no-debo-publicar
```

Then, change the corresponding environment variables of the `app` container:

Note that although the connection to this SMTP server is not encrypted, the connection from the SMTP server to Gmail is encrypted.

# Direct Installation
For this, you should follow the official guides of DemocracyOS on [installation](https://docs.democracyos.org/install.html) and [development](https://docs.democracyos.org/develop/).

Briefly, it can be summarized as follows:

- Make sure you have **Node version 6** by checking what `node -v` returns. If not, you can [easily switch between node versions](#switching-node-versions).
- Make sure you have a **version >=3 and <5 of Npm** by checking what `npm -v` returns. If not, you can [easily switch between npm versions](#switching-npm-versions).
- Navigate to the root folder of the project.
- Run `make packages`.
- Add an email of staff that will be the admin. To do this, create the file `config/development.json` with the following content:   
`{ "staff": ["anemail@example.com"] }`   
- Start a MongoDB database listening on `localhost:27017`. For example, with Docker: `docker run -p 27017:27017 --name mongodb-dos mongo:3.2`. If necessary, you can change the MongoDB server URL by adding the `mongoUrl` option within `config/development.json`.
- Run the build-watch-serve script of `gulp` (it must be installed) by running `NODE_PATH=. DEBUG=democracyos* gulp bws`. If this doesn't work, you can try running `make run`.
- Go to [http://localhost:3000](http://localhost:3000), register your account with the staff email, and log in (no need to validate the email).

##### Switching Node Versions
The `node` version 6.x.x is required to run the platform. We recommend using [`nvm`](https://github.com/nvm-sh/nvm) to easily switch between different node versions. Its installation is straightforward, check [its documentation](https://github.com/nvm-sh/nvm#installation-and-update). If you have this tool installed, you would run `nvm install lts/boron` (which is version 6.17.1) to switch to the valid version. Once installed, you can directly use `nvm use lts/boron`. If you don't like `nvm`, you can try using [`n`](https://github.com/tj/n).



##### Switching Npm Versions
Once you have changed the Node version as explained in the previous point, you can run `npm install -g 'npm@>=3 <5'`. This will only affect the active Node version.

##### Installing Gulp
Once you have changed the Node version as explained in the previous point, you can run `npm install -g gulp` to install Gulp. This will only affect the active Node version.

### Configuration
The configuration of the local instance is done in the file `config/development.json`. The default values can be seen in `config/defaults.json`. There is an example configuration in `config/development.json.example`. These options are the same as for `docker-compose.yml` except that there is a renaming process, as explained in [DemocracyOS/config](https://github.com/DemocracyOS/config#environment-variables), which basically renames `SOME_VARIABLE_X` to `someVariableX` accessible from the code.

The frontend does not have access to all configuration variables, but only to those listed within the `"client"` option in the configuration file.

### Build Systems
The platform has various ways of building and running.

One way is with `make`. This uses the `Makefile` to run npm scripts as can be seen in its code. Notice how one script jumps to another (e.g., from `run` jumps to `built` and from `build` to `packages`).

Another way is with `gulp`. This uses `gulpfile.js`, which simply imports the file `lib/build/index.js`. There, all possible gulp scripts are assigned with the command `.task(...)`. Whenever you call a gulp script directly, you must supply the environment variable `NODE_PATH=.` so that it finds the modules, otherwise you'll get errors like `Error: Cannot find module`.

Finally, there's the classic way with npm scripts defined in the `package.json` file under the key `scripts`. These are run using `npm run <script_name>`, e.g., `npm run serve`. As you can see, many of these use `gulp`.

The only indispensable command for building the system is `gulp build` as it compiles all js and css files to the `public` folder, and also copies assets (images, fonts, etc.).
