# In Touch

Aplicación web para chatear con miembros de la plataforma.

## Funcionalidades

* Registrarme en la plataforma
* Iniciar sesión
* Crear un chat y añadir miembros
* Ver listado de chats a los que pertenezco
* Filtrar los chat por algún texto en los mensajes
* Abrir un chat de los que pertenezco
* Enviar mensajes a todos los miembros del chat
* Recibir mensajes del resto de los miembros del chat
* Eliminar un mensaje de chat enviado por mí
* Cerrar sesión

## Pendiente

1. Separar los contactos de la tabla user-contact para que un registro sea un usuario y un contacto.
    Ya que si no habría que actualizar todos los registros de los contactos asociados a un chat.
    Además, ahora sólo se actualizan los contactos del de crea el chat, dejando al member sin ese contacto.
2. Mostrar siempre la cabecera del chat para poder cerrar sesión mínimamente si falla el listado de chats.
3. Securizar API para que sólo se pueda consultar los endpoints del usuario logado (Cookie).
