# Deployment

Esta guía presenta los pasos necesarios para poder hacer un deployment de consultas digitales en plataformas basadas en GNU/Linux. La herramienta de aprovisionamiento seleccionada es [Ansible](https://www.ansible.com). Todos estos pasos se ejecutan desde el equipo del administrador. _Work in progress_.

## Pre-requisitos

**Imágen de Docker**

El sistema de consultas digitales se distribuye e instala generando una imágen de [Docker](https://www.docker.com). Es necesario que al momento de seguir esta guía el usuario cuente con una imágen disponible en el [registro oficial de Docker (Docker Hub)](https://hub.docker.com). Los pasos necesarios escapan al foco de esta guía pero pueden resumirse como:
* Crear una cuenta en [Docker Hub](https://hub.docker.com).
* Crear un repositorio en [Docker Hub](https://hub.docker.com).
* Pushear la imágen desde el entorno del desarrollador.

## Requisitos

**Acceso SSH**

Los distintos _playbooks de Ansible_ requieren acceso por SSH al servidor de destino. El mismo debe realizarse mediante la utilización de llaves asimétricas. Estos pasos se explican en [esta completa guía](https://www.digitalocean.com/community/tutorials/como-configurar-las-llaves-ssh-en-ubuntu-18-04-es). Una excelente práctica es utilizar el fichero de configuración del cliente ssh ubicado en `~/.ssh/config`, esto se explica en [esta completa guía (inglés)](https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client).

**Ansible**

Ansible es una herramienta de aprovisionamiento que permite aplicar planes de ejecución llamados _playbooks_ en los cuales se definen una serie de pasos a realizar en uno o más hosts. En este caso utilizamos Ansible para definir la instalación de la plataforma de consultas digitales, formalizando y automatizando el proceso. La guía oficial de instalación se encuentra [aquí](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) aunque es muy probable que se encuentre ya disponible en los repositorios oficiales de las distintas distribuciones:

* Versión mínima requerida: 2.3.

```bash
# Ubuntu
$ sudo apt-get install ansible
# RHEL/CentOS/Fedora yum
$ sudo yum install ansible
# RHEL/CentOS/Fedora dnf
$ sudo dnf install ansible
# macOS con brew
$ brew install ansible
# Python pip
$ pip install ansible
```

**Inventario de Ansible**

Ansible utiliza un inventario donde es necesario definir los hosts sobre los cuales va a trabajar. La ubicación por defecto del mismo es `/etc/ansible/inventory`, a modo de ejemplo se muestra como configurar el inventario y a su vez `~/.ssh/config`:

```bash
## Configuración del cliente SSH y el inventario de Ansible sin SSH alias
# Contenido de ~/.ssh/config
Host mi.server.local
  HostName mi.server.local
  User ubuntu
  Port 22
  IdentityFile ~/.ssh/llave

# Contenido de /etc/ansible/inventory
[servidores]
mi-server   ansible_ssh_host=mi.server.local ansible_connection=ssh ansible_port=22 ansible_user=ubuntu
```

```bash
## Configuración del cliente SSH y el inventario de Ansible con SSH alias
# Contenido de ~/.ssh/config
Host serveralias
  HostName mi.server.local
  User ubuntu
  Port 22
  IdentityFile ~/.ssh/llave

# Contenido de /etc/ansible/inventory
[servidores]
mi-server   ansible_ssh_host=serveralias ansible_connection=ssh ansible_port=22 ansible_user=ubuntu
```

## Plataformas Soportadas

El deployment está basado en Docker y docker-compose. Estos playbooks fueron probados con [Vagrant](https://www.vagrantup.com) utilizando boxes oficiales:
* CentOS (7.3, 7.4, 7.5).
* Debian (8 y 9).
* Ubuntu (16.04 LTS y 18.04 LTS, 14.04 ya no tiene soporte).

## Playbooks

IMPORTANTE: muchas configuraciones requieren permisos de superusuario, en caso de que el usuario configurado en el inventario de Ansible requiera de su password para utilizar `sudo` es necesario agregar a cada ejecución de `ansible-playbook` el flag `--ask-become-pass` al final de cada línea, ejemplo:

```bash
# ansible mostrará un prompt para ingresar el password de sudoer
$ ansible-playbook instalacion_docker.yaml --extra-vars "host_destino=mi-server" --ask-become-pass
```

### Instalación de Docker

La primera tarea a realizar es la instalación de Docker en el servidor de destino. Esto se realiza con el playbook `instalacion_docker.yaml` de la siguiente forma:

```bash
# mi-server es el nombre que aparece en el inventario de Ansible
$ ansible-playbook instalacion_docker.yaml --extra-vars "host_destino=mi-server"
```

### Instalación de la plataforma

La instalación de la plataforma se realiza con el segundo playbook, `instalacion_plataforma.yaml`. En este caso, primero es necesario completar el fichero con variables incluido como `variables.yaml`. Es necesario aclarar que el deployment requiere de un hostname al cual responderá la aplicación, en caso de no contar con resolución DNS es posible forzar dicha resolución en el fichero de hosts del sistema operativo del administrador.

La información sobre las posibles variables y sus valores puede obtenerse en el fichero `variables.yaml` de este repositorio.

**Funcionamiento del deployment**

La aplicación se instala en formato de docker-compose, por defecto se levantan tres contenedores:
* [Traefik](https://traefik.io): es un proxy/balanceador de carga orientado a entornos cloud. Es el que realiza la terminación TLS cuando se utiliza HTTPS y hace las veces de proxy reverso contra la aplicación.
* Aplicación de Consultas Digitales: la aplicación indicada en la variable `IMAGE` de `variables.yaml`.
* MongoDB: en caso de no utilizar una base de datos externa, el deployment levanta una instancia de MongoDB 3.2 en un contenedor.

Tanto el docker-compose como las configuraciones y archivos de MongoDB se almacenan como volúmenes de Docker en el path de instalación, una instalación por defecto se ve de la siguiente forma:

```bash
$ cd /opt/consultas-digitales && tree
.
├── docker-compose.yaml
├── volumenes
    ├── traefik
    └── mongo
```

#### Aplicación por HTTP

En este tipo de instalación la plataforma funciona por HTTP, la configuración básica es la siguiente:

```yaml
# variables.yaml
deploy:
  hostname: consulta.ejemplo.org

docker:
  IMAGE: democraciaenred/consultas-digitales:development
  # Resto de variables...
```

Luego se ejecuta el playbook:

```bash
# mi-server es el nombre que aparece en el inventario de Ansible
$ ansible-playbook instalacion_plataforma.yaml --extra-vars "host_destino=mi-server"
```

En este caso, la aplicación estará disponible en http://consulta.ejemplo.org.

#### Aplicación por HTTPS con certificado propio

En este tipo de instalación la plataforma funciona por HTTPS con certificados propios, es necesario completar el fichero de variables con las rutas absolutas hacia el certificado y la llave privada:

```yaml
# variables.yaml
deploy:
  hostname: consulta.ejemplo.org
  protocolo: https
  https_path_certificado: /home/ubuntu/server.crt
  https_path_llave: /home/ubuntu/server.key

docker:
  IMAGE: democraciaenred/consultas-digitales:development
  # Resto de variables...
```

Luego se ejecuta el playbook:

```bash
# mi-server es el nombre que aparece en el inventario de Ansible
$ ansible-playbook instalacion_plataforma.yaml --extra-vars "host_destino=mi-server"
```

En este caso, la aplicación estará disponible en https://consulta.ejemplo.org.

#### Aplicación por HTTPS con Let's Encrypt (Staging)

En este tipo de instalación se utiliza el servicio gratuito de Let's Encrypt para obtener un certificado y llave, es necesario completar el fichero de variables con una dirección de correo electrónico del responsable del dominio. Es importante aclarar que a menos que se trate de un entorno productivo es mejor utilizar los servidores de staging de Let's Encrypt tal como se muestra a continuación:

```yaml
# variables.yaml
deploy:
  hostname: consulta.ejemplo.org
  protocolo: https
  https_lets_encrypt_email: admin@consulta.ejemplo.org
  https_lets_encrypt_staging: true

docker:
  IMAGE: democraciaenred/consultas-digitales:development
  # Resto de variables...
```

```bash
# mi-server es el nombre que aparece en el inventario de Ansible
$ ansible-playbook instalacion_plataforma.yaml --extra-vars "host_destino=mi-server"
```

En este caso, la aplicación estará disponible en http://consulta.ejemplo.org.
