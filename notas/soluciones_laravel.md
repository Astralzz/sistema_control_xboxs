# Soluciones a problemas en laravel

## 1. NO FUNCIONA EL .ENV

### Pasos para solucionar

1. Instalar compouser
  
2. Poner en consola en este orden:

    1:

            composer dump-autoload

    2:

            php artisan cache:clear

    3:

            php artisan config:clear

    4:

            php artisan view:clear

---
