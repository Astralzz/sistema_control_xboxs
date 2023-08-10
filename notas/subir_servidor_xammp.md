# PONER UN SERVIDOR DE LARAVEL EN XAMPP

---

## 1\_ Añadir los/el host/s al archivo httpd-vhosts.conf

1. ve a la ruta

        C:\xampp\apache\conf\extra

2. Abre el archivo httpd-vhosts.conf

        httpd-vhosts.conf

3. Añade los host al final

    Para usar <http://localhost/>: y toda la carpeta htdocs

        ##Todas la carpeta
        <VirtualHost \*:80>
        DocumentRoot "C:/xampp/htdocs/"
        ServerName localhost
        </VirtualHost>

    Para usar <http://nombre_de_mi_host/>: (un host nuevo)

        ##Proyecto laravel
        <VirtualHost *:80>
        DocumentRoot "C:/xampp/htdocs/servidores/mi_proyecto/public"
        ServerName nombre_de_mi_host
        </VirtualHost>

    Ejemplo:

        ##Todas las carpeta
        <VirtualHost *:80>
            DocumentRoot "C:/xampp/htdocs/"
            ServerName localhost
        </VirtualHost>

        ##Proyecto control de Xbox
        <VirtualHost *:80>
            DocumentRoot "C:/xampp/htdocs/servidores/controlxbox/public"
            ServerName controlxbox
        </VirtualHost>

---

## 2\_ Verificar el archivo httpd.conf

1. ve a la ruta

        C:\xampp\apache\conf

2. Abre el archivo httpd-vhosts.conf

        httpd.conf

3. Busca y ve que exista y no este comentado Include conf/extra/httpd-vhosts.conf

   Mal:

        # Virtual hosts
        # Include conf/extra/httpd-vhosts.conf

   Bien:

        # Virtual hosts
        Include conf/extra/httpd-vhosts.conf

---

## 3\_ Añadir un nuevo hosting al archivo host

1. Abre el blog de notas como administrador

2. Abre el archivo host

   Ruta del archivo:
  
        C:\Windows\System32\drivers\etc

3. Añade los host que desees usar:

   Al final del archivo host:

        127.0.0.1 nombre_de_mi_host

    Ejemplo:

        127.0.0.1 controlxbox

---

## 4\_ Verificar que todo salio bien

1. Abre xampp
2. Pon en marcha apache
3. Busca el tu buscador hosting que se puso

        http://mi_host/

    Ejemplo:

        http://controlxbox/

4. Si todo salio bien podrás usar el proyecto de laravel sin poner php artisan serve, etc

Ahi que tener en cuenta que es posible que se necesite reiniciar XAMPP o limpiar la caché de DNS de tu sistema para que los cambios surtan efecto.
