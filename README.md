# Fresh project

Este es un proyecto de chat sencillo realizado con [Fresh](https://fresh.deno.dev/) y Deno.  
Permite crear y ver contactos, seleccionar un contacto, ver los mensajes y enviar mensajes.

Puedes seguir la guía oficial de Fresh para empezar aquí:  
https://fresh.deno.dev/docs/getting-started

---

### Usage

Asegúrate de tener Deno instalado:  
https://deno.land/manual/getting_started/installation

Luego, arranca el proyecto con:

```
deno task start
```


Esto iniciará el servidor en modo watch y recargará automáticamente los cambios que hagas en el código.

---

### ¿Qué puedes hacer en este proyecto?

- Crear nuevos contactos
- Ver y seleccionar contactos existentes
- Ver la conversación con cada contacto
- Enviar mensajes (y verlos en tiempo real tras enviarlos)

---

### Estructura y archivos importantes

Estos son los archivos principales que forman el núcleo de la aplicación:

- **`islands/ChatInteraction.tsx`**  
  Componente principal del chat: aquí selecciono el contacto, veo y envío mensajes.

- **`utils/api.ts`**  
  Funciones para interactuar con la API REST (obtener contactos, chats, mensajes y enviar mensajes).

- **`routes/index.tsx`**  
  Página principal de la app, donde se importa y muestra el chat.

- **`routes/create.tsx`**  
  Página para crear un nuevo contacto (junto con el formulario).

- **`islands/CreateContactForm.tsx`**  
  Formulario para crear un contacto.

- **`static/styles.css`**  
  Estilos globales de la aplicación.

- **`routes/_app.tsx`**  
  Layout global de la app (estilos y configuración común).

---

### API utilizada

Este proyecto consume una API REST externa para gestionar los datos de contactos, chats y mensajes.

- **URL:** `https://back-a-p4.onrender.com`

---

### Notas

- El chat se crea automáticamente al enviar el primer mensaje a un contacto.
- El refresco de mensajes es manual (al seleccionar contacto o enviar mensaje).

---


