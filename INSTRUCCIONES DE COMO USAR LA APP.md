# Market 🛒

Cree un sistema sencillo para gestionar un catálogo de productos: crear, consultar, actualizar y eliminar (**CRUD**).

La aplicación se compone de una **API REST** construida con Java y Spring Boot, y una **interfaz web** construida con Angular.

---

## 1. Descripción

**Plaza** es una aplicación de gestión de productos que permite:

- **Crear** nuevos productos con nombre, descripción, precio, stock, categoría e imagen.
- **Consultar** el listado completo de productos o un producto específico por su ID.
- **Actualizar** los datos de un producto existente.
- **Eliminar** productos del catálogo.

---

## 2. Tecnologías utilizadas

| Capa       | Tecnología                                   |
|------------|-----------------------------------------------|
| Backend    | Java 17, Spring Boot 4.1.1, Maven             |
| Frontend   | Angular 22, TypeScript                        |
| Base de datos | MySQL (JPA / Hibernate)                    |

---

## 3. Requisitos para ejecutarlo

- **Java** 17 o superior instalado.
- **Maven** (se incluye el wrapper `mvnw` / `mvnw.cmd`).
- **Node.js** con **npm** (el proyecto usa `npm@11.17.0`).
- **MySQL** corriendo en `localhost:3306` con la base de datos `market` creada.
- **Angular CLI** (opcional; si no está instalado globalmente, se usa la versión local, ver sección 6).

---

## 4. Configuración de la base de datos

La conexión se define en `src/main/resources/application.yaml` y apunta a una base MySQL local:

- **URL:** `jdbc:mysql://localhost:3306/market`
- **Usuario:** `root`
- **Driver:** MySQL Connector/J
- **ddl-auto:** `none` (las tablas se crean manualmente, Hibernate no las crea automáticamente)

> No se incluyen credenciales sensibles en este documento. Configura la contraseña de tu usuario de MySQL directamente en `application.yaml`.

La aplicación ya viene con la tabla `productos` (id, nombre, descripcion, precio, stock, categoria, imagen_url) mapeada en la entidad `Producto`.

---

## 5. Cómo iniciar el BACKEND

Desde la raíz del proyecto:

```
cd plaza
```

Ejecuta el siguiente comando:

```bash
.\mvnw.cmd spring-boot:run
```

Al iniciar, la API queda disponible en:

```
http://localhost:9090/api/v1/wishlist_db
```

---

## 6. Cómo iniciar el FRONTEND

> **IMPORTANTE:** primero hay que cambiar la ruta a la carpeta `frontend`:

```
cd plaza\frontend
```

Primer paso: instalar las dependencias.

```bash
npm install
```

Segundo paso: iniciar el servidor de desarrollo de Angular.

```bash
ng serve
```

Si el comando `ng` no está disponible de forma global, usa la versión local:

```bash
.\node_modules\.bin\ng.cmd serve
```

La aplicación se abre en:

```
http://localhost:4200
```

El servidor de desarrollo (puerto 4200) redirige las peticiones `/api/v1/wishlist_db` al backend del puerto 9090 mediante el proxy configurado en `frontend/proxy.conf.json`.

---

## 7. Endpoints de la API (CRUD de productos)

Base de todas las rutas: `http://localhost:9090/api/v1/wishlist_db`

| Método | Endpoint                       | Función                                   |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/productos`                   | Crear un nuevo producto                   |
| GET    | `/productos`                   | Obtener todos los productos               |
| GET    | `/productos/{id}`              | Obtener un producto por su ID             |
| PUT    | `/productos/{id}`              | Actualizar un producto existente          |
| DELETE | `/productos/{id}`              | Eliminar un producto por su ID            |

---

## 8. Flujo de la aplicación

1. El usuario interactúa con la interfaz **Angular** (listado, formularios, botones).
2. Angular envía una petición HTTP al **Spring Boot** (API REST).
3. Spring Boot consulta o modifica los datos en **MySQL** usando JPA/Hibernate.
4. Spring Boot devuelve la respuesta en formato JSON a Angular.
5. Angular actualiza la pantalla con la respuesta recibida.

```
Angular → Spring Boot → MySQL → Spring Boot → Angular
```

---

## 9. Estructura principal del proyecto

```
plaza/
├── src/                     → Backend (Spring Boot)
│   └── main/java/com/market/plaza/
│       ├── controller/      → Endpoints REST (ProductoController)
│       ├── service/         → Lógica de negocio (ProductoService)
│       ├── repository/      → Acceso a datos (JPA)
│       ├── entity/          → Entidad Producto
│       └── dto/             → Objetos de entrada/salida
│   └── main/resources/
│       └── application.yaml → Configuración (DB, puerto)
├── frontend/                → Frontend (Angular)
│   └── src/app/
│       ├── features/        → Páginas y componentes de productos
│       ├── services/        → Cliente HTTP (ProductoService)
│       ├── stores/          → Estado de la aplicación (signals)
│       ├── models/          → Tipos y DTOs del frontend
│       ├── core/            → Guards y utilidades
│       └── shared/          → Componentes reutilizables
└── pom.xml                  → Dependencias de Maven
```

---

## 10. Frontend: componentes, servicios y stores

El frontend está organizado con las herramientas modernas de **Angular 22**:

- **Páginas** (`features/productos/pages`): `producto-lista` (listado y borrado), `producto-form` (crear/editar) y `producto-detalle`.
- **Componentes** (`features/productos/components`): tarjetas de producto, grilla, estadísticas, filtros por nombre/categoría, formulario y estado de stock.
- **Servicios** (`services/producto.service.ts`): cliente HTTP que comunica el frontend con la API usando `HttpClient`.
- **Stores** (`stores/producto.store.ts`): manejan el estado con **signals** y `httpResource`, y exponen `computed` para listar, cargar, crear, actualizar y eliminar productos.
- **Shared** (`shared/`): componentes reutilizables como el diálogo de confirmación, estado vacío y páginas comunes (404).
- **Core** (`core/`): `guards` de rutas y utilidades de manejo de errores.

---

## 11. Operaciones CRUD

| Operación | Qué hace                                                             |
|-----------|----------------------------------------------------------------------|
| **Create** | Agrega un producto nuevo mediante el formulario de la pantalla `/productos/nuevo`. |
| **Read**    | Consulta todos los productos en el dashboard o uno en específico en su página de detalle. |
| **Update**  | Edita los datos de un producto desde la pantalla `/productos/:id/editar`. |
| **Delete**  | Elimina un producto desde el listado, confirmando la acción con un diálogo. |

---

## 12. Inicio rápido

**Backend** (desde `cd plaza`):

```bash
.\mvnw.cmd spring-boot:run
```

**Frontend** (desde `cd plaza\frontend`):

```bash
npm install
ng serve
```

> Si `ng` no está en el PATH: `.\node_modules\.bin\ng.cmd serve`

Listo: abre `http://localhost:4200` y la API estará disponible en `http://localhost:9090/api/v1/wishlist_db`.



## 13. CREACION DE BASE DE DATOS
-- 1) Crear la base de datos
CREATE DATABASE IF NOT EXISTS market;

USE market;

-- 2) Crear la tabla productos
-- (coincide con la entidad Producto del backend)
CREATE TABLE IF NOT EXISTS productos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(255)        NOT NULL,
    descripcion VARCHAR(255)        NOT NULL,
    precio      DECIMAL(10, 2)      NOT NULL,
    stock       INT                 NOT NULL,
    categoria   VARCHAR(255),
    imagen_url  VARCHAR(255)
);

-- 3) (Opcional) Datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url)
VALUES
    ('Manzana Roja', 'Manzana fresca de la mejor calidad', 2500.00, 50, 'Frutas', NULL),
    ('Leche Entera', 'Leche entera 1L', 4200.00, 30, 'Lácteos', NULL),
    ('Arroz', 'Arroz blanco 1kg', 4800.00, 100, 'Granos', NULL);