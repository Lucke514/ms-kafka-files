# ms-kafka-files

Ejemplo de microservicio en NestJS que:

- Recibe un lote de archivos vía HTTP (`POST /files/batch`) usando `multipart/form-data`.
- También puede recibir un lote de referencias a archivos vía Kafka (`files.batch`).
- Procesa cada archivo de forma secuencial.
- Al finalizar, notifica a otro microservicio HTTP.

## Flujo principal

1. **Recepción**
   - HTTP: el cliente envía un lote de archivos y el microservicio responde con un resumen.
   - Kafka: otro productor envía un mensaje con `files: [{ id, filename, url }]`.
2. **Procesamiento**
   - El servicio recorre cada archivo en un `for...of` y ejecuta la lógica de negocio.
3. **Notificación**
   - Se envía un `POST` a `http://downstream-service.local/notifications/files-complete` con el total procesado.

## Configuración rápida

```bash
npm install
npm run start:dev
```

> Ajusta el broker y el endpoint HTTP en `src/main.ts` y `src/files.service.ts` según tu entorno.
