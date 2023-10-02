# Segunda Pre-entrega final
# Comisión 55565  de CoderHouse

## Autor : Omar D'Agostino

## Tecnologías utilizadas : 
- Node JS : v18.16.1
- Motor de plantillas : Handlebars
- Websocket : socket.io
- Mongo DB Atlas usado con Mongoose
    -base de datos : ecommerce1
    -colecciones : products1 / carts1 / messages1
- Dependencias 
    - "express": "^4.18.2",
    - "express-handlebars": "^7.1.2",
    - "express-validator": "^7.0.1",
    - "mongoose": "^7.5.1",
    - "mongoose-paginate-v2": "^1.7.4",
    - "nodemon": "^3.0.1",
    - "socket.io": "^4.7.2",
    - "socket.io-client": "^4.7.2"

## Funcionalidades agregadas 

    - Se modifico el metodo GET para productos a efectos de poder recibir los parametros : limit , page, sort (asc o desc) y query (category o stck); para devolver en consecuencia  a los requerido, ademas del informe de paginación requerido.

    -se agregaron los siguientes endpoints para los carritos : DELETE para eliminar todos los productos del carrito o el producto solicitado, PUT para actualizar la cantidad de un producto o cambiar todo por un nuevo array de productos/cantidades.

    - se agrego un populate para la ruta /:cid para que traiga todos los datos de los productos del carrito

    - se creo una vista /products para visualizar todos los productos y poder generar un carrito en el boton Agregar al carrito

    - se creo una vista /carts para visualizar el contenido de un carrito

## Funcionalidades pre-existentes (ya desarralladas para la entrega anterior)

- El servidor app.js escucha peticiones en el puerto 8080.

- El enrutador managermd.js posee los siguientes servicios (para productos y carritos respectivamente) en las siguientes rutas 
    * Para Productos (en el router products.routes.js)
        + __GET__ = devuelve los objetos de los productos solicitados (todos o por id), en el caso de todos, se puede limitar la cantidad de productos solicitar por medio del parametro ? limit , en cuyo caso solo devolcera desde el principio hasta la cantidad solicitada. Si el id solicitado no existe, devuelve el error correspondiente
        + __POST__ = crea el producto con los datos enviados en el body de la requisición, siempre y cuando esten todos los datos requeridos con sus formatos pertienentes (caso contrario da un error explicando el motivo del rechazo). El id del producto (productId) es generado automaticamente a partir del ultimo elemento de la base de datos de productos, ademas del generado automaticamente por Mongo DB (se guardan los 2). Si el campo status no es "false" (o no es informado), graba el valor por defecto "true".
        + __PUT__ = actualiza el contenido del producto requerido (si no existe devuelve un mensaje de error), solo los campos informados en el body del mensaje, siempre y cuando tengan el formato correcto (caso contrario devuelve el error correpondiente)
        + __DELETE__ = borra el producto cuya id fue informada por parametro (si no existiera , devuelve el mensaje de error correpondiente)
        
    * Para Carritos de compra (en el router carts.routes.js)
        + __GET__ = devuelve el objeto de la id del carrito solicitado (si no existiera, devuelve el mensaje de error correspondiente)
        + __POST (para crear un carrito nuevo)__ = graba un registro en el carrito de compras con el id del producto informado (siempre y cuando exista en el archivo de productos) con cantidad en 1. Se genera la id del carrito automaticamente a partir de la id del último elemento la base de datos de carritos, ademas del generado automaticamente por MongoDB (se guardan los 2) 
        + __POST (para agregar un producto a un carrito existente)__ = debe informarse el id del carrito, busca el correpondiente carrito (en caso de no encontrarlo devuelve el error acorde), si esta todo ok , agrega el id del producto informado (siempra y cuando exista, sino devuelve un error), si el id del producto informado ya existe en el carrito, le agrega un 1 a la cantidad pre-existente en el archivo.

    * CHAT  La vista home.handlebars despliega el chat segun el requerimiento (se le agrego un estilo css para que se vea un poco mas bonito)

   El usuario que quiera ingresar al chat se tiene que identificar con un formato de email válido, e informa al resto de los usuarios conectados cuando ingresa o se desconecta un usuario, los mensajes se guardan en la base de datos en la coleccion correspondiente, y se levantan cada vez que el servidor entra en ejecución. También da un mensaje de bienvenida a quien se conecta enviado por el server, pero este mensaje no se guarda en la colección de datos. 

   *  Se desconecto el manejador de rutas de File System , pero no se eliminó (quedo en un manager separado y se comento en el código de app.js)
