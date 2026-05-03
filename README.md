# Taller: Análisis de la Aplicación My Steamy App (Ionic + Capacitor)

Este documento contiene una revisión del proyecto, detallando los plugins de Capacitor implementados, las APIs consumidas, la estructura de vistas/modales y el funcionamiento del widget nativo de Android.

## 1. Plugins de Capacitor Utilizados

El proyecto hace uso de varios plugins de Capacitor, principalmente destacando:

- **`@capacitor/preferences`**: Utilizado para guardar y recuperar el juego favorito del usuario de forma local. En el widget nativo de Android, se accede a este mismo almacenamiento (`CapacitorStorage`) para leer la preferencia.
- **`@capacitor/browser`**: Utilizado para abrir los enlaces de las ofertas ("View Deal") en un navegador integrado dentro de la app, sin sacar al usuario a una aplicación externa.

## 2. APIs Usadas

Toda la aplicación se alimenta de la **API pública de CheapShark** (https://apidocs.cheapshark.com/) para obtener datos de videojuegos y ofertas en distintas tiendas.

### Endpoints usados en Ionic (Angular):

- **Listado de Tiendas (`GET /stores`)**: Se utiliza en `CheapsharkService` para recuperar la información estática de las tiendas (Steam, GOG, Epic Games, etc.), cruzando sus ID con sus nombres y logos correspondientes.
- **Búsqueda de Ofertas (`GET /deals?title={query}`)**: Se consume al usar el buscador de la vista "Deals", para traer una lista de ofertas que coincidan con el título ingresado.
- **Top Ofertas (`GET /deals?pageSize=5`)**: Se consume al iniciar la aplicación para traer los 5 mejores "deals" actuales (ordenados por el "Deal Rating" de CheapShark por defecto) y mostrarlos en el carrusel horizontal.
- **Redirección de Oferta (`https://www.cheapshark.com/redirect?dealID={dealID}`)**: Aunque no es un endpoint JSON, es la URL clave utilizada en `home.page.ts` para abrir la pasarela de compra correspondiente desde el InAppBrowser del dispositivo.

### Endpoints usados en Android Nativo (Java):

- **Detalles del Juego (`GET /games?id={gameID}`)**: Utilizado por `FetchAllDealsTask` dentro de `GameWidget.java`. Descarga toda la información específica del juego favorito guardado, extrayendo el array de todas las ofertas disponibles (`deals`) para iterar y mostrarlas rotando en el widget.
- **Listado de Tiendas (`GET /stores`)**: Consumido desde Java de manera paralela para cruzar el `storeID` de la oferta descargada en el endpoint `/games` con el catálogo de tiendas. Esto permite obtener la URL del logo y el nombre real de la tienda para pintarlos en la vista del widget (`RemoteViews`).

## 3. Vistas y Modales

La interfaz gráfica utiliza Ionic Angular y está diseñada con un estilo moderno tipo "Glassmorphism" (efectos de cristal, transparencias y fondos borrosos).

### Vistas

El usuario navega mediante una **Barra de Navegación Inferior (Bottom Tab Bar)** que divide la pantalla en dos vistas principales controladas por la variable `currentTab`:

1. **Vista "Deals" (Inicio)**:
    - **Cabecera**: Contiene un buscador (`ion-searchbar`) que reacciona a los cambios en tiempo real (con un *debounce*).
    - **Top Deals**: Si no hay una búsqueda activa, muestra un carrusel de desplazamiento horizontal con las 5 mejores ofertas del momento.
    - **Resultados de Búsqueda**: Muestra una cuadrícula (grid) vertical con tarjetas de los juegos encontrados.
    - **Estados**: Incluye *Skeleton Loaders* (pantallas de carga simuladas) mientras se obtienen los datos, y estados vacíos ("Empty States") si la búsqueda no arroja resultados.
    - **Tarjetas**: Cada tarjeta muestra la imagen del juego, porcentaje de ahorro, precio, rating, logo de la tienda y un botón de "corazón" para marcarlo como favorito.
2. **Vista "Favorite"**:
    - Muestra el juego que el usuario ha marcado como favorito (almacenado usando `@capacitor/preferences`).
    - Si no hay favorito, muestra un estado vacío amigable indicando cómo agregar uno.

### Modales

- **Modal de Detalles de Juego (`ion-modal`)**:
    - Se presenta como un *Bottom Sheet* (panel inferior deslizable) que puede cubrir toda la pantalla.
    - Muestra un "banner" superior con la imagen del juego y la información detallada: *Deal Rating*, *Metacritic Score*, precios (normal y de oferta) y el ahorro total.
    - Contiene un botón de llamada a la acción ("VIEW DEAL") que lanza el plugin `@capacitor/browser` para llevar al usuario a la página de compra (usando el redireccionador de CheapShark).

### Modules

- CoreModule
    - Services
        - HttpService
- SharedModule
    - Services
        - GameProvider (Usa el HttpService)
    - Components
        - CardComponent
        - InputComponent

## 4. Widget Nativo de Android (`GameWidget.java`)

El proyecto incluye un widget de escritorio para Android escrito en Java (`android/app/src/main/java/io/ionic/starter/GameWidget.java`). Este widget es autónomo y no depende de la capa web de Ionic para ejecutarse una vez renderizado.

### Funcionamiento del Widget

1. **Proveedor y Servicio**: Extiende `AppWidgetProvider` y utiliza un servicio en segundo plano (`WidgetUpdateService`) para mantenerse activo y actualizarse.
2. **Lectura de Preferencias**:
    - El servicio lee directamente las preferencias compartidas de Android bajo el nombre `"CapacitorStorage"` buscando la clave `"favoriteGame"`.
    - Esto le permite saber en tiempo real cuál fue el último juego que el usuario marcó como favorito en la app de Ionic.
3. **Extracción de Datos (API)**:
    - Si detecta un nuevo favorito, lanza un hilo asíncrono (`FetchAllDealsTask`) que se conecta de forma nativa a la API de CheapShark (`/games?id={id}`).
    - Descarga la información del juego (título e imagen de fondo) y todas las ofertas en diferentes tiendas para ese juego.
    - También hace un llamado al endpoint `/stores` para cruzar los datos y obtener el nombre y el logo de la tienda de cada oferta.
    - Descarga las imágenes (fondos y logos) convirtiéndolas a `Bitmap` para ser usadas en la vista.
4. **Renderizado y Animación**:
    - Los datos se inyectan en un layout nativo (`R.layout.game_widget`) usando `RemoteViews`.
    - El widget muestra la imagen de fondo del juego, su título, la tienda actual, el precio en oferta, precio normal y porcentaje de descuento.
    - **Carrusel Automático**: El servicio usa un `Handler` para ejecutar una tarea cada 5 segundos. Esta tarea rota entre todas las ofertas disponibles del juego favorito.
    - Para hacer la transición visual más suave, utiliza un `ViewFlipper` que alterna entre dos páginas (0 y 1), lo que presumiblemente dispara animaciones nativas de entrada y salida definidas en su XML.
