--  Creamos la super entidad de usuarios
DROP TABLE IF EXISTS usuario_root;
CREATE TABLE usuario_root
(
	idRoot INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100),
	username VARCHAR(20),
	email VARCHAR(50),
	password VARCHAR(200),
	tipo VARCHAR(50) NOT NULL DEFAULT 'administrador'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS usuario_gerencial;
CREATE TABLE usuario_gerencial
(
	idGerencial INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100),
	apellido VARCHAR(100),
	username VARCHAR(20),
	email VARCHAR(50),
	password VARCHAR(200),
	tipo VARCHAR(50) NOT NULL DEFAULT 'gerencial'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS usuario_cliente;
CREATE TABLE usuario_cliente
(
	idCliente INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100),
	apellido VARCHAR(100),
	username VARCHAR(20),
	email VARCHAR(50),
	password VARCHAR(200),
	tipo VARCHAR(50) NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS proyectos;
CREATE TABLE proyectos
(
	idProyecto INT PRIMARY KEY  NOT  NULL AUTO_INCREMENT,
	idGerencial INT, 
	isValidate BOOLEAN NOT NULL,
	nombre VARCHAR(255),
	objetivo TEXT NOT NULL,
	mision TEXT NOT NULL,
	vision TEXT NOT NULL,
	logotipo VARCHAR(255) NOT NULL,
	FOREIGN KEY (idGerencial) REFERENCES usuario_gerencial(idGerencial) 
);


DROP TABLE IF EXISTS comentarios;
CREATE TABLE comentarios
(
	idComentario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	idCliente INT,
	idProyecto INT,
	comentario TEXT NOT NULL,
	FOREIGN KEY (idCliente) REFERENCES usuario_cliente(idCliente),
	FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) 
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS patrocinadores;
CREATE TABLE patrocinadores
(
	idPatrocinador INT PRIMARY KEY   NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100),
	Descripcion TEXT,
	logotipo VARCHAR(200)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;




DROP TABLE IF EXISTS proy_t_pat;
CREATE TABLE proy_t_pat
(
	idProyecto INT ,
	idPatrocinador INT,
	FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
	FOREIGN KEY (idPatrocinador) REFERENCES patrocinadores(idPatrocinador) 
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;




DROP TABLE IF EXISTS artcul;
CREATE TABLE artcul
(
	idProyecto INT,
	lugar VARCHAR(150) NOT NULL,
	fecha VARCHAR(150) NOT NULL,
	hora VARCHAR(150) NOT NULL,
	Descripcion TEXT NOT NULL,
	imagen VARCHAR(200),
	FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) 
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS serprod;
CREATE TABLE serprod
(
	idProyecto INT,
	nombre VARCHAR(150) NOT NULL,
	tipo VARCHAR(150) NOT NULL,
	categoria VARCHAR(150) NOT NULL,
	precio INT NOT NULL,
	stock INT NOT NULL,
	FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) 
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;




DROP TABLE IF EXISTS beneficiencia;
CREATE TABLE beneficiencia
(
	idProyecto INT,
	nombre_beneficiario VARCHAR(150) NOT NULL,
	evento VARCHAR(150) NOT NULL,
	lugar VARCHAR(150) NOT NULL,
	actividades TEXT NOT NULL,
	FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) 
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;


	DROP TABLE IF EXISTS us_reg_proy;
	CREATE TABLE us_reg_proy
	(
		idProyecto INT,
		idCliente INT,
		FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
		FOREIGN KEY (idCliente) REFERENCES usuario_cliente(idCliente)
	)ENGINE=InnoDB  DEFAULT CHARSET=utf8;