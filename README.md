# Petstore

Functional pet e-commerce catalog built with Spring Boot, PostgreSQL, Vite, React, Tailwind CSS, and MUI.

## Local Development

Backend:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Render

The root `render.yaml` defines:

* `petstore-api` as a Docker web service
* `petstore-web` as a static site
* `petstore-db` as a managed PostgreSQL database

## API

The API base path is `/api/v1/pets`.
