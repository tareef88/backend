import knex from 'knex';

const knexConfig = require('../../knexfile');

const db = knex(knexConfig);


function get(tableName: string, values: any) {
  return db(tableName).select('*').where(values);
}
async function insert(tableName: string, values: any) {
  const insertQuery = await db(tableName).insert(values).returning('*');
  return insertQuery[0];
}

async function update(table: string, id: number, values: any) {
  const insertQuery = await db(table).where({ id }).update(values).returning('*');
  return insertQuery[0];
}

function deleteObject(tableName: string, id: number) {
  return db(tableName).delete().where('id', id);
}

function deleteWhere(tableName: string, values: any) {
  return db(tableName).delete().where(values);
}
export default {
  get,
  insert,
  update,
  deleteObject,
  deleteWhere,
};
