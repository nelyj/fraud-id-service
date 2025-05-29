# 🕵️‍♂️ Deuna FraudID Service

Este microservicio genera un `fraudId` utilizando el SDK web de [Deuna](https://deuna.com) en un entorno simulado mediante `Playwright`. Ideal para entornos de integración, testing u obtención dinámica de `fraudId` desde backend.

---

## 🚀 Despliegue rápido en Railway

1. Haz fork o clona este repositorio.
2. Entra a [https://railway.app](https://railway.app).
3. Crea un nuevo proyecto y selecciona **"Deploy from GitHub Repo"**.
4. Railway detectará automáticamente que es un proyecto de Node.js.
5. ¡Listo! Tu servicio estará disponible públicamente.

---

## 🧪 Uso del endpoint

### Endpoint: POST /get-fraud-id

### Body (JSON)

```json
{
  "apiKey": "pk_test_tu_clave_publica",
  "env": "sandbox",              // Opcional: "sandbox" (default) o "production"
  "params": {
    "userId": "user@example.com" // Otros campos válidos según el SDK de Deuna
  }
}
```

### Respuesta exitosa
```json
{
  "fraudId": "deuna_fraud_id_abc123xyz"
}
```

### Respuesta con error
```json
{
  "fraudId": "ERROR:Cannot read properties of undefined (reading 'generateFraudId')"
}
```