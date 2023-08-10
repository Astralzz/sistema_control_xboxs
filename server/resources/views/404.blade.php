<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <title>404 - Pagina no encontrada</title>
</head>

<body>
    <div class="container">
        <div class="icon">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <h1>404</h1>
        <p>La página que está buscando no existe.</p>
        <div class="lines"></div>
        <div class="links">
            <a href="{{ route('index') }}"><i class="fas fa-home"></i> Inicio</a>
        </div>
    </div>
</body>

</html>
