# USO E INSTALACIÓN DE LARAVEL

## Instalar xampp

- Descargar desde: <https://www.apachefriends.org/es/index.html>

- Instalar en ruta de referencia

- Poner los archivos de xampp de las carpetas de mysql y php.ini en las variables de entorno

- Verificar que se crearon correctamente por cmd

  mysql

            mysql --version

  php

            php --version

---

## Instalar composer

- Descargar desde: <https://getcomposer.org/download/>

- Instalar (Si tenemos xampp o php ya en el path al momento de instalarlo detectara automáticamente nuestro php)

- Verificar instalación en cmd

       composer -v

---

## Creación del proyecto laravel

- Buscar carpeta de preferencia y en consola poner

        composer create-project laravel/laravel nombre_proyecto

  ejemplo

        composer create-project laravel/laravel web_ejemplo

---

## Creación de modelos, migraciones y controladores

- Tener la consola fijada en la carpeta raíz de proyecto

        cd ruta_de_la_carpeta_del_proyecto

- Para crear un modelo solo (se guardan en app/Models/)

        php artisan make:model nombre_modelo

  ejemplo:

        php artisan make:model usuarios

- Para crear un modelo con su migración (se guardan en app/Models/ y database/migrations)

        php artisan make:model nombre_modelo -m

  ejemplo

        php artisan make:model usuarios -m

- Para crear controladores (se guardan en app/Http/Controllers/)

        php artisan make:controller nombre_controlador

  ejemplo

        php artisan make:controller usuarioController

---

## Enlazar nuestro proyecto con nuestra base de datos

- Crear una base de datos con el proveedor de tu preferencia (MySQL, Postgres, oracle, et

  ejemplo con MySQL o oracle

        CREATE DATABASE ejemplo_bd

- Buscar y abrir el archivo llamado .env ubicado en la carpeta raíz de proyecto y localizar los datos con los nombres

        DB_CONNECTION=
        DB_HOST=
        DB_PORT=
        DB_DATABASE=
        DB_USERNAME=
        DB_PASSWORD=

- LLenar os campos del paso anterior con

        DB_CONNECTION=tu_promovedor_de_tu_bd
        DB_HOST=ip_del servidor
        DB_PORT=puerto_del servidor
        DB_DATABASE=nombre_de_la_base_datos
        DB_USERNAME=tu_usuario
        DB_PASSWORD=tu_contraseña

  Ejemplo con mysql (xampp)

        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=ejemplo_bd
        DB_USERNAME=root
        DB_PASSWORD=

  Ejemplo con oracle

        DB_CONNECTION=oracle
        DB_HOST=1.18.1.35
        DB_PORT=1521
        DB_DATABASE=ejemplo_bd
        DB_USERNAME=user
        DB_PASSWORD=123456

---

## Migrar las tablas del proyecto a una base de datos

- Tener la consola fijada en la carpeta raíz de proyecto

        cd ruta_de_la_carpeta_del_proyecto

- Si tienes xampp ejecuta y pon en marcha el servidor de mysql de lo contrario dará error, paso solo para los que tienen xampp

- Para migrar las tablas de database/migrations poner:

        php artisan migrate

- Esperar a que termine, si no da ningún error las tablas de la base de datos se migraran y crearan automáticamente en la bd enlazada

---

## Enanzar nuestro archivos para visualizarlos desde la web (Opcional)

### Si queremos mostrar nuestros archivos (fotos, pdf, et que se guardan en la carpeta storage para que lo pueda ver cualquier persona hacemos lo siguiente

- Tener la consola fijada en la carpeta raíz de proyecto

        cd ruta_de_la_carpeta_del_proyecto

- Poner en consola

        php artisan storage:link

  Esto creara un enlace de la carpeta storage e nuestros archivos a la carpeta public para poder verlos

---

## Poner en marcha el servidor y nuestro proyecto

### Cuando estemos listos y preparados para correr nuestro proyecto hacemos lo siguiente

- Tener la consola fijada en la carpeta raíz de proyecto

        cd ruta_de_la_carpeta_del_proyecto

- Poner en consola

  Para Iniciar el servidor localmente (ip: 27.0.0.1 / puerto: 8000)

        php artisan serve

  Para Iniciar servidor globalmente con una ip o un puerto diferente:

        php artisan serve --host tu_ip --port tu_puerto

  Ejemplo:

        php artisan serve --host 10.15.4.79 --port 8099

---

## Algunos comandos útiles para la console de composer

- Actualizar composer

        composer update

- Ver las rutas de mi proyecto en funcionamiento:

        php artisan route:list

- Actualizar migraciones por si se hace algún cambio en las migraciones:

        php artisan migrate:refresh

- Instalar dependencias o módulos (equivalente a nmp i) al descargar un proyecto de gitHub, etc:

        composer install

- Limpiar/actualizar/etc nuestro proyecto

  Actualizar la información del cargador automático de clases (si no funciona .env en producción)

        composer dump-autoload

  Limpiar cache y actualizar

        php artisan cache:clear

  Actualizar las vistas

        php artisan view:clear

  Actualizar la Configuracion

        php artisan config:clear

  Limpiar cache de la Configuracion

        php artisan config:cache

  Limpiar cache de las rutas

        php artisan route:cache

  Actualizar rutas

        php artisan route:clear

- Acceder a la consola de laravel (para crear, consultar, programar, ejecutar, etc)

        php artisan tinker

  Ejemplo: (hacer una suma):

  Creando

        > $n1 = 5253;
        > $n2 = 8763;
        > echo("La suma de los 2 numeros es " . ($n1 + $n2));

  Respuesta

        La suma de los 2 numeros es 14016
