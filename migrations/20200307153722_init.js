const casesSeed = [{
  title: 'stolenBike',
  brand: 'BMX',
  city: 'MALMO',
  description: 'stolen Bike in Malmo',
  image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
}];

const officers = [
  { name: 'Camren Keeling', token: '566515d6-5f12-11ea-bc55-0242ac130003' },
  { name: 'Khalid VonRueden', token: '566532d6-5f12-11ea-bc55-0242ac130003' },
  { name: 'Daphney Klocko', token: '555532d6-5f12-11ea-bc55-0242ac130003' },
  { name: 'Dessie Rath', token: '566532d6-5f12-11ja-bc55-0242ac130003' },
  { name: 'Lizeth Rempel', token: '566576d6-5f12-11ea-bc55-0242ac130003' },
  { name: 'Beulah Walter', token: '566532d6-5f12-11ea-fe55-0242ac130003' },
];


exports.up = async (knex) => {
  await knex.schema.createTable('cases', (t) => {
    t.increments();
    t.text('title');
    t.text('brand');
    t.text('description');
    t.text('city');
    t.timestamp('reported').defaultTo(knex.fn.now());
    t.timestamp('updated');
    t.text('officer_id');
    t.boolean('solved').defaultTo(false);
    t.text('image');
  }).then(() => knex('cases').insert(casesSeed));
  await knex.schema.createTable('officers', (t) => {
    t.increments();
    t.text('name');
    t.text('token');
    t.boolean('engaged').defaultTo(false);
  }).then(() => knex('officers').insert(officers));
};


exports.down = async (knex) => {
  await knex.schema.dropTable('cases');
  await knex.schema.dropTable('officers');
};
