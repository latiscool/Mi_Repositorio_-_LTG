const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'repertorio',
  password: 'postgresql',
  port: 5432,
});

const saveData = async (canciones) => {
  const data = Object.values(canciones);
  console.log('consultas data ', data);
  const query = {
    text: 'INSERT INTO repertorio (cancion, artista, tono) VALUES ($1,$2,$3) RETURNING *;',
    values: data,
  };
  try {
    const res = await pool.query(query);
    console.log('Cancion agregada con exito');
    return res.rows;
  } catch (error) {
    console.log('No se ha podido agregar cancion');
    return error;
  }
};
const getData = async () => {
  const query = {
    text: 'SELECT * FROM repertorio ;',
  };
  try {
    const res = await pool.query(query);
    return res;
  } catch (error) {
    console.log('Error en mostar listado de canciones ' + error);
    return error;
  }
};

const editCancion = async (canciones) => {
  const data = Object.values(canciones);
  console.log(data);

  const query = {
    text: 'UPDATE repertorio SET cancion=$2, artista=$3, tono=$4 WHERE id=$1  RETURNING *;',
    values: data,
  };
  try {
    const res = pool.query(query);
    console.log('Se ha editado con exito');
    return res;
  } catch (error) {
    console.log('Ha ocurrido un error en Editar: ' + error);
    return error;
  }
};

const eliminarCancion = async (id) => {
  const query = {
    text: `DELETE FROM repertorio WHERE id= ${id} RETURNING *;`,
  };
  try {
    const res = await pool.query(query);
    console.log('Se ha elminado con exito');
    return res;
  } catch (error) {
    console.log('Ha ocurrido un error en Eliminar: ' + error);
    return error;
  }
};

module.exports = { saveData, getData, editCancion, eliminarCancion };
