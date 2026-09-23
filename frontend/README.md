# Plaza — Proyecto Angular 22 + Spring Boot

## Descripción

**Plaza** es un catálogo de productos con operaciones CRUD (crear, leer, actualizar y eliminar). El frontend es una aplicación web construida con **Angular 22** que se conecta a un **backend Spring Boot** para gestionar productos reales a través de una API REST.

El frontend incluye:

- dashboard / listado de productos con estadísticas y filtros;
- detalle de producto;
- alta, edición y eliminación de productos;
- validaciones de formulario y estados de carga/error.

## Estructura del repositorio

El repositorio contiene las dos partes del proyecto:

```
.
├── frontend/   # Aplicación Angular 22
├── src/        # Backend Spring Boot (código Java)
├── pom.xml     # POM de Maven (Spring Boot)
├── mvnw        # Maven Wrapper (Linux/macOS)
├── mvnw.cmd    # Maven Wrapper (Windows)
└── ...
```

- El **backend Spring Boot** se encuentra en la raíz del repositorio.
- El **frontend Angular** se encuentra en la carpeta `frontend/`.

## Requisitos

### Frontend

- **Node.js** en una de las versiones soportadas por Angular CLI 22.1.8 instalado en el proyecto (`engines` real del CLI): `^22.22.3 || ^24.15.0 || >=26.0.0`.
- **npm** (`>=8`).
- El proyecto incluye **Angular CLI 22.1.8** y **TypeScript 6.0.2** como dependencias de desarrollo (`node_modules/.bin/ng`); no es imprescindible instalarlos globalmente.

### Backend

- **Java 17** (versión configurada en `pom.xml` → `java.version`).
- **Maven** — el proyecto incluye **Maven Wrapper** (`mvnw` / `mvnw.cmd`), por lo que no se requiere Maven instalado globalmente. Spring Boot (parent) **4.1.1**.
- **MySQL** con una base de datos `market` (la configuración real está en `src/main/resources/application.yaml`: `jdbc:mysql://localhost:3306/market`, usuario `root` y contraseña vacía; ajusta credenciales locales si es necesario).

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd plaza
   ```

2. Instalar las dependencias del frontend:

   ```bash
   cd frontend
   npm install
   ```

   No se requiere configuración adicional del frontend para desarrollo: la URL del backend se resuelve mediante proxy (ver sección [Backend](#backend)).

3. Preparar el backend:

   - Crear/asegurar la base de datos MySQL `market`.
   - El backend usa `ddl-auto: none`; importa el esquema de la tabla `productos` según el modelo de la entidad `Producto` antes de ejecutar (o carga los datos iniciales que necesites).

4. Iniciar el backend (ver [Ejecutar backend](#ejecutar-backend)) antes de iniciar el frontend.

## Backend

La URL real utilizada por Angular es:

```
http://localhost:9090/api/v1/wishlist_db
```

Confirmada en:

- `src/main/resources/application.yaml` del backend: `server.port: 9090` y `server.servlet.context-path: /api/v1/wishlist_db`.
- `frontend/src/environments/environment.ts` (producción).

### Proxy de desarrollo

Durante el desarrollo (`ng serve`), Angular sustituye la URL por una ruta relativa (`/api/v1/wishlist_db`) y el dev server redirige las peticiones al backend mediante el proxy definido en `frontend/proxy.conf.json`:

```
/api/v1/wishlist_db  →  http://localhost:9090
```

Endpoints reales (no inventados): el backend expone el CRUD de productos bajo el context-path, por ejemplo `GET/POST /api/v1/wishlist_db/productos` y `GET/PUT/DELETE /api/v1/wishlist_db/productos/{id}`.

## Ejecutar backend

El proyecto incluye Maven Wrapper, por lo que puedes ejecutar Spring Boot sin Maven global:

- **Windows:**

  ```bash
  mvnw.cmd spring-boot:run
  ```

- **Linux/macOS:**

  ```bash
  ./mvnw spring-boot:run
  ```

El backend quedará disponible en `http://localhost:9090/api/v1/wishlist_db`.

## Ejecutar frontend

Desde la carpeta `frontend/`:

```bash
npm install
ng serve
```

Abrir en el navegador:

```
http://localhost:4200
```

Con `ng serve` (configuración de desarrollo) el frontend usa el proxy `frontend/proxy.conf.json` para enviar las peticiones al backend en `http://localhost:9090`, evitando problemas de CORS en desarrollo.

## Funcionalidades

- **Dashboard / listado de productos** con estadísticas (total, unidades en stock, agotados y valor del inventario).
- **Filtros** de búsqueda por texto y por categoría.
- **Detalle de producto** con precio, stock y estado del stock (disponible / agotado / stock bajo).
- **Crear producto** y **editar producto** mediante formulario con validaciones.
- **Eliminar producto** con diálogo de confirmación.
- **Validaciones del formulario** (campos obligatorios, longitudes mínimas/máximas, precio mayor que 0 con máximo 2 decimales, stock no negativo, URL válida opcional).
- **Estados de carga y error** al consultar el catálogo y el detalle (incluye botón "Reintentar" y mensajes del backend).

## Rutas

Rutas reales de la aplicación (`frontend/src/app/app.routes.ts`):

| Ruta | Propósito |
|---|---|
| `/dashboard` | Listado de productos con estadísticas y filtros. |
| `/productos/nuevo` | Formulario para crear un producto. |
| `/productos/:id/editar` | Formulario para editar el producto con el identificador `:id`. |
| `/productos/:id` | Detalle del producto con el identificador `:id`. |
| `**` (wildcard) | Página 404 para rutas no encontradas. |

Las rutas dinámicas `/productos/:id` y `/productos/:id/editar` validan que `:id` sea un número; si no lo es, redirigen a la página 404.

## Estructura del frontend

Estructura real del proyecto Angular:

```
frontend/src/
├── index.html
├── main.ts
├── styles.scss
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
└── app/
    ├── app.ts
    ├── app.config.ts
    ├── app.routes.ts
    ├── core/
    │   ├── guards/
    │   └── utils/
    ├── features/
    │   └── productos/
    │       ├── components/
    │       ├── pages/
    │       └── stores/
    ├── models/
    ├── services/
    ├── shared/
    │   ├── components/
    │   └── pages/
    └── stores/
```

## Arquitectura Angular

El proyecto utiliza **Angular 22** (standalone) con la arquitectura moderna basada en signals:

- **Standalone components** (sin `NgModule`).
- Estado reactivo con **signals** y derivaciones con **computed**.
- Comunicación entre componentes mediante **input.required()**, **output()** y **model()**.
- Componentes **contenedores** (páginas) y **presentacionales** claramente separados.
- Proyección de contenido con **ng-content** (paneles, estados vacíos y diálogo de confirmación).
- Datos reales del backend mediante **httpResource** (con estados de loading, valor y error).
- **Signal Forms** con validaciones para el formulario de producto.
- **Lazy loading** con **loadComponent** para todas las rutas con contenido.
- **Guards** funcionales para validar los parámetros dinámicos de ruta (`:id`).
- **Servicios** declarados con el decorador moderno **@Service()** (registro automático) e inyección con **inject()**.
- **Stores** (singleton global y de alcance por ruta) para centralizar el estado.

Solo se mencionan conceptos que realmente existen en el código.

## Pruebas

El proyecto usa **Vitest** como runner de pruebas unitarias (`@angular/build:unit-test`).

Desde la carpeta `frontend/`:

```bash
ng test
```

La suite actualmente consta de **39 pruebas** (servicio HTTP, stores con `httpResource`, guard, páginas y componentes) y todas pasan.

## Build

Compilación de producción desde `frontend/`:

```bash
ng build
```

Genera la compilación de producción optimizada en `frontend/dist/frontend/` (compilación AOT, hashes de salida y presupuestos de tamaño configurados).