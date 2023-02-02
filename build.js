const { readdirSync, writeFile } = require('fs');
const { PermissionsBitField } = require('discord.js')
const files = [];

const paths = readdirSync('./commands').filter(x => x.split('.').length === 1);

for (const path of paths){
  const commands = readdirSync('./commands/' + path).filter(x => x.split('.').pop() === 'js');

  for (const command of commands){
    const file = require('./commands/' + path + '/' + command);


    const examples = file.examples?.map(example => `w!${file.name}${example ? " " + example : ''}`);
    delete file.examples;
    file.examples = examples;

    function getPermissionName(permission) {
      for (const perm of Object.keys(PermissionsBitField.Flags)) {
        if (PermissionsBitField.Flags[perm] === permission) {
          return perm;
        }
      }
      return 'UnknownPermission';
    }

    const permissions = file.permissions?.map(x => getPermissionName(x))
    delete file.permissions;
    file.permissions = permissions;

    delete file.run;

    files.push(file);
  };
};


const file = JSON.stringify(files, (key, value) =>
typeof value === 'bigint'
    ? value.toString()
    : value
, 2);

const path = './assets/json/commands-database.json';

writeFile(path, file, (err) => {
  console.log({ err })
})