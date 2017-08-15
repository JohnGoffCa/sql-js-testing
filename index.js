const pg = require('pg');
const settings = require('./settings'); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

if (!process.argv[2]) {
  console.error('Please supply a first or last name on the command line');
  return;
}

console.log('Searching...');
client.connect((err) => {
  if (err) {
    return console.error('Connection Error', err);
  }
  client.query('SELECT * FROM famous_people WHERE first_name LIKE $1 OR last_name LIKE $1;', [process.argv[2]])
    .then((result) => {
      if (result.rows.length > 0) {
        printPerson(result.rows);
      } else {
        console.log(`No person by name '${process.argv[2]}' could be found`);
      }
      client.end();
    })
    .catch((err) => console.error('error running query', err));
});


function printPerson(array) {
  console.log(`Found ${array.length} person(s) with name '${process.argv[2]}':`);
  array.forEach((person) => {
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
  });
}
