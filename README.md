# Campus Events

Aplicación frontend para descubrir, publicar e inscribirse en actividades universitarias. Proyecto de demostración para la Actividad Evaluada 1: Desarrollo de Interfaz Frontend.

## Problemática
La información sobre talleres, charlas, actividades deportivas y encuentros estudiantiles suele estar dispersa. Campus Events propone una agenda visual centralizada para que la comunidad encuentre actividades y gestione sus inscripciones.

## Funcionalidades
- Listado de eventos con fecha, categoría, lugar, cupos y organizador.
- Búsqueda por texto y filtros por categoría y próximos 7 días.
- Inscripción y cancelación de inscripción con actualización de cupos.
- Formulario para publicar eventos con campos obligatorios, límites y validación de fecha/cupos.
- Sección “Mis inscripciones”.
- Persistencia local mediante `localStorage`; no requiere backend.
- Diseño responsive con Bootstrap 5 y CSS personalizado.

## Tecnologías
HTML5 semántico, CSS3, Bootstrap 5.3, JavaScript ES6, DOM API y localStorage.

## Cómo ejecutar
1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador. Para una experiencia más consistente, usa la extensión Live Server de VS Code.
3. No se requiere instalación de dependencias ni servidor backend. Bootstrap y Google Fonts se cargan desde CDN, por lo que esas partes requieren conexión a internet.

## Estructura
- `index.html`: estructura y componentes de la interfaz.
- `css/styles.css`: identidad visual y adaptación responsive.
- `js/app.js`: datos de ejemplo, filtros, renderizado, inscripciones y validaciones.

## Flujo Git sugerido
```bash
git init
git branch -M main
git checkout -b develop
git add .
git commit -m "chore: estructura inicial de Campus Events"
git checkout -b feature/event-list
# implementar listado y tarjetas
git add .
git commit -m "feat: mostrar y filtrar eventos"
git checkout develop
git merge feature/event-list
git checkout -b feature/registration-form
# implementar formulario e inscripciones
git add .
git commit -m "feat: agregar publicación e inscripción a eventos"
```
En GitHub, publicar `main` y `develop`, abrir Pull Requests desde ramas `feature/*` hacia `develop`, revisar y luego integrar `develop` a `main`.

## Uso de herramientas de IA
Si se utilizaron herramientas de IA durante el desarrollo, documentar aquí qué se solicitó, qué partes se tomaron como apoyo y qué cambios o pruebas realizó el equipo. El equipo debe revisar y poder explicar cada sección del código antes de la defensa.

## Pruebas manuales recomendadas
- Buscar por título y lugar; combinar búsqueda y filtros.
- Inscribirse en un evento y comprobar el cambio de cupos y “Mis inscripciones”.
- Cancelar la inscripción y verificar que el cupo se restaura.
- Enviar el formulario vacío, con fecha pasada y cupos fuera de rango.
- Publicar un evento válido y comprobar que aparece en el listado.
- Revisar el diseño en móvil y escritorio.
