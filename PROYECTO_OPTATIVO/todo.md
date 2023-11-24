# TODO:
- [-] Fotos de usuario (Casi listo) (!!)
  - [X] Usar multer().single()
- [ ] ajax (evitar recargar la pagina)
  - [X] busqueda
  - [X] inciar sesión (sin relogear la pagina)
    - [X] Pendiente actualizar navbar + reservarBtn en /destino
  - [X] cerrar sesión
    - [X] Pendiente actualizar navbar + reservarBtn en /destino
  - [X] registro
  - [ ] añadir comentario
  - [ ] crear reserva (pendiente double check)
  - [X] cancelar reserva
  - [X] cargar destinos paginando
- [ ] filtro de precio
- [ ] jQuery
- [ ] uso de cookie de sesion
- [ ] modificar reservas ya hechas (no cancerlar y volver a hacerla)  
- [ ] fechas ocupadas en rojo
- [ ] usar emit/ajax para que se te cambie tu calendario dinamicamente, marcando las fechas recien cogidas
- [ ] encriptar formularios con enctype="multipart/form-data" (slide 93 aprox)
- [ ] request checker (express-validator)

todos los post -> pasan a ser ajax

util de la practica de steven:
----------------------------------
const session = require("express-session");
const sessionMySql = require("express-mysql-session");
const MySQLStore = sessionMySql(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "avisos22",
    resave: false,
    store: sessionStore 
});

app.use(middlewareSession);

const morgan = require("morgan");
app.use(morgan("dev"));
----------------------------------