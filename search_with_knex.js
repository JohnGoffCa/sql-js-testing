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


if (!process.argv[2]) {
  console.error('Please supply a first or last name on the command line');
  knex.destroy();
  return;
}

console.log('Searching...');
knex('famous_people')
  .where('first_name', process.argv[2])
  .orWhere('last_name', process.argv[2])
  .then((result) => {
    if (result.length > 0) {
      printPerson(result);
    } else {
      console.log(`No person by name '${process.argv[2]}' could be found`);
    }
  })
  .catch((err) => console.error(err))
  .finally(() => knex.destroy());

function printPerson(array) {
  console.log(`Found ${array.length} person(s) with name '${process.argv[2]}':`);
  array.forEach((person) => {
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
  });
}
