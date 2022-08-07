# Next.js TesloShop App

Parra correr localmente, se necesita la base de datos

```
docker-compose up -d
```

* El -d, significa __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombra el archivo __.env.template.__ a __.env__

## Llenar la base de datos con informacion de pruebas

Llamar a:
```
	http://localhost:3000/api/seed
```