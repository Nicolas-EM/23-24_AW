# Gestión de Reservas de Instalaciones
## Intro
Esta es la práctica obligatoria en la asignatura Aplicaciones Web (AW) del curso 23-24 en la FDI UCM.

Fecha de entrega: 2023-12-13

## Objetivos
- Aplicación de Conceptos de Desarrollo Web: 
  - Los estudiantes aplicarán conceptos de desarrollo web, como la creación de páginas web dinámicas, el uso de frameworks de front-end y back-end, y la implementación de funcionalidades interactivas.
- Gestión de Usuarios y Roles:
  - Los estudiantes implementarán un sistema de registro y autenticación de usuarios, con validación de correos electrónicos de la UCM. También establecerán dos roles de usuarios: Administrador y Usuario Normal.
- Interacción con Bases de Datos:
  - Los estudiantes trabajarán con bases de datos para almacenar información de usuarios, instalaciones y reservas. Se implementará la capacidad de realizar consultas y actualizaciones en la base de datos.
- Diseño de Interfaz de Usuario Intuitiva:
  - Los estudiantes diseñarán una interfaz de usuario intuitiva y fácil de usar, que permita a los usuarios realizar reservas de instalaciones de manera sencilla y acceder a sus correos electrónicos.
- Comunicación Interna y Administración:
  - Los estudiantes desarrollarán la funcionalidad de mensajería interna entre usuarios y la capacidad del administrador para validar registros, gestionar instalaciones, asignar roles y acceder a estadísticas.
- Aplicación de Buenas Prácticas de Programación:
  - Los estudiantes aplicarán buenas prácticas de programación, como la organización de código, el uso de comentarios descriptivos y la implementación de seguridad en la gestión de usuarios y datos

## Requisitos
### Objetos
#### Instalación
- Nombre
- Disponibilad horaria
- Tipo de Reserva: Individual o Colectiva
- Aforo (si aplica)
- Fotografía / Icono

### Usuario
- email (@ucm.es)
- Nombre
- Apellidos
- Facultad
- Curso
- Grupo
- Contraseña
- Imagen perfil
- Validado

###  Funcionalidades
#### Usuario Administrador
1. Personalizar aparencia del sistema:
   1. Nombre, dirección, icono de org.
2. Gestionar instalaciones:
   1. Crear instalaciones
   2. Editar instalaciones
3. Gestionar usuarios:
   1. Registro
      1. Validar registros de usuarios (permitir acceso a plataforma)
      2. Enviar correo confirmación de registro a usuarios validados
   2. Roles
      1. Asignar roles de administrador a usuarios
4. Estadísticas y Listados
   1. Historial reservas (por usuario / instalación)
   2. Generar listados de usuarios por facultad
5. Comunicación Interna
   1. Enviar mensaje a cualquier usuario

#### Usuario No-Administrador
1. Registro
2. Reservar instalación seleccionando fecha y hora
3. Correo
   1. Ver correos recibidos
   2. Enviar correos a usuarios de misma organización