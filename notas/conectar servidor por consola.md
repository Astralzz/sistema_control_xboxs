# CONECTAR A SERVIDOR DESDE CMD POR SSH

---

## Abrir CMD

### Presionar

windows + R

### Escribir

cmd

---

## Conectarse al servidor por ssh

### Escribir dentro del cmd

Conectar a un servidor por ssh:

```cmd
ssh tu_usuario@tu_url_del_servidor
```

Ejemplo:

```cmd
ssh admin@www.mipagina.app.mx
```

Se te pedirá la contraseña de tu usuario en el servidor remoto.

Ingresa la contraseña correspondiente y presiona Enter.
Ten en cuenta que no verás los caracteres que escribas en la consola.

```cmd
tu_usuario@tu_url_del_servidor's password: tu_contraseña
```

Ejemplo:

```cmd
admin@www.mipagina.app.mx's password: 123456
```

Una vez que te hayas conectado, estarás en el entorno de tu servidor remoto.

La línea de comandos mostrará información sobre el sistema operativo y otros detalles relevantes.
Puedes utilizar los comandos de Linux para navegar por el sistema de archivos y realizar otras tareas.

Aparecerá algo como:

```cmd
Welcome to Ubuntu 00.00.0 LTS (GNU/Linux 0.0.0-60-generic x86_64)

- Documentation: https://help.ubuntu.com
- Management: https://landscape.canonical.com
- Support: https://ubuntu.com/advantage

  This system has been minimized by removing packages and content that are
  not required on a system that users do not log into.
```

---

## Navegar por las carpetas del servidor

Para ir a la ruta de tus archivos (en este caso Laravel) en el servidor, utiliza el comando "cd" para cambiar de directorio.

Por ejemplo, si tus archivos Laravel se
encuentran en la carpeta "/var/www/html", puedes navegar a ella con el siguiente comando:

```cmd
Ejemplo: cd /var/www/html
```

Desde aquí, puedes ejecutar comandos de Laravel en la consola como lo harías en tu servidor local.

Ejemplo:

```cmd
 php artisan config:clear
```

```cmd
 php artisan tinker
```

```cmd
 php artisan migrate
```

Etc....

---

## COMANDOS ÚTILES

### LINUX

Mostrar el contenido de la carpeta actual.

```cmd
ls
```

Limpia la consola

```cmd
clear
```

Cambia de directorio.

```cmd
cd
```

```cmd
cd /var/www/html
```

Crear una nueva carpeta

```cmd
mkdir
```

```cmd
mkdir mi_nueva_carpeta
```

Crear un nuevo archivo

```cmd
touch
```

```cmd
touch mi_nuevo_archivo.txt
```

Eliminar un archivo, carpeta, etc

```cmd
rm
```

```cmd
rm mi_nuevo_archivo.txt
```

Eliminar un archivo, carpeta, etc y su contenido

```cmd
rm -r
```

```cmd
rm -r mi_nuevo_archivo.txt
```

Copiar un archivo, carpeta, etc

```cmd
rm
````

```cmd
rm mi_nuevo_archivo.txt
```

Copiar un archivo, carpeta, etc y su contenido

```cmd
cp -r
```

```cmd
cp -r mi_nuevo_archivo.txt
```

Mover archivo o carpeta, etc

```cmd
mv
````

Ejemplo para mover el archivo a la carpeta "html"
dentro de "/var/www".

```cmd
mv archivo_original.txt /var/www/html
```

Cambiar los permisos de un archivo o carpeta

```cmd
chmod
```

Ejemplo para dar permisos de lectura, escritura y ejecución
al propietario y solo permisos de lectura y ejecución a otros usuarios.

```cmd
chmod 755 mi_archivo.php
```

Cambiar propietario de un archivo, carpeta, etc

```cmd
chown
```

Ejemplo para cambiar el propietario del archivo
al usuario "usuario" y el grupo al grupo "grupo"

```cmd
chown usuario:grupo mi_archivo.php
```
