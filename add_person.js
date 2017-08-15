
const settings = require('./settings'); // settings.json
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.hostname,
    port : settings.port,
    ssl : settings.ssl,
    user : settings.user,
    password : settings.password,
    database : settings.database,
  }
});

const args = process.argv;

if (args.length < 5) {
  console.error('Please supply a first name, last name, and birthdate on the command line');
  knex.destroy();
  return;
}

knex('famous_people')
  .returning('id')
  .insert({
    first_name: args[2],
    last_name: args[3],
    birthdate: args[4],
  })
  .then((id) => console.log(`Inserted into ${id} - ${args[2]} ${args[3]} born ${args[4]}`))
  .finally(() => knex.destroy());
