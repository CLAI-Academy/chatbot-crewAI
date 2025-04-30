
# OpenAI Chat Edge Function

Esta Edge Function maneja las solicitudes de chat que pueden incluir tanto texto como imágenes.

## Formato de Solicitud

La solicitud debe ser un objeto JSON con el siguiente formato:

```json
{
  "message": "Texto del mensaje del usuario",
  "image": "https://faqnxvmqwzymhbwlpwpg.supabase.co/storage/v1/object/public/temp_chat_images/user-id/uuid-filename.jpg"
}
```

### Parámetros:

- **message** (obligatorio): El texto del mensaje del usuario.
- **image** (opcional): URL de la imagen almacenada en Supabase Storage.

## Flujo de Imágenes

1. El frontend sube la imagen al bucket `temp_chat_images` en Supabase Storage.
2. Supabase genera una URL pública para la imagen.
3. El frontend envía esta URL junto con el mensaje al endpoint de la Edge Function.
4. La Edge Function recibe la URL de la imagen.
5. Una vez procesada la solicitud, el frontend elimina la imagen del Storage.

## Estructura de URL de la Imagen

Las URLs de las imágenes siguen este formato:
```
https://[project-ref].supabase.co/storage/v1/object/public/temp_chat_images/[user-id]/[uuid]-[filename]
```

Donde:
- **project-ref**: El ID del proyecto de Supabase (ej. faqnxvmqwzymhbwlpwpg).
- **user-id**: El ID del usuario que subió la imagen.
- **uuid**: Identificador único generado para evitar colisiones de nombres.
- **filename**: Nombre original del archivo subido.

## Formato de Respuesta

- **Éxito**: Stream de eventos con la respuesta de OpenAI.
- **Error**: Objeto JSON con mensaje de error.

## Consideraciones de Seguridad

- Las imágenes son temporales y se eliminan después de ser procesadas.
- Las imágenes se almacenan en carpetas específicas para cada usuario identificadas por su ID.
- Se generan nombres de archivo únicos para evitar colisiones.
