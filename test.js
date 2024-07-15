// NOTE: ./struct not included on test

const options = {
    paths: [
      'admin', 'client', 'Private',
      'Economy', 'fun', 'Information',
      'LeveledRoles', 'Search', 'setup','Utilities',
      'Tickets', 'Music'
    ]
  };
  
  const { readdir } = require('fs');
  
  // Test commands
  for (const path of options.paths){
    readdir(`./commands/${path}`, (err, files) => {
      files.filter(file => file.split('.').pop === 'js').forEach(file => {
        require(`./commands/${path}/${file}`);
      });
    });
  };
  
  // Test events
  readdir(`./events`, (err, files) => {
    files.filter(file => file.split('.').pop() === 'js').forEach(file => {
      require(`./events/${file}`);
    });
  });
  
  // Test JSON assets
  readdir('./assets/json', (err, files) => {
    files.filter(file => file.split('.').pop() === 'json').forEach(file => {
      require(`./assets/json/${file}`);
    });
  });
  
  // Test utils
  readdir('./util', (err, files) => {
    files.filter(file => file.split('.').pop() === 'js').forEach(file => {
      require(`./util/${file}`);
    });
  });
  
  
  // End of Test
  