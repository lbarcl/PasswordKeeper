const crypto = require('crypto');
const readline = require('readline-sync');
const editJsonFile = require('edit-json-file');

let file = editJsonFile(`./passwords.json`);

while (5 == 5){
    commandCheck();
}

function commandCheck(){
  var command = readline.question("What would like to do? ");
  var content = command.split(' ');

  switch(content[0]) {
  case 'add':
    add(content[1], content[2], content[3]);
    break;
  case 'find':
    find(content[1]);
    break;
  case 'del':
    del(content[1]);
    break;
  case 'help':
    help();
    break;
  case 'list':
    list();
    break;

   }

  command = '';
}

function add(nameofsite, username, password){
  if(!nameofsite || !username || !password){
    console.log('Incorrect syntax, should be like this "add <name_of_the_site> <usuername> <pasword>" ');
    return;
  }

  console.log(`Name of the site: ${nameofsite}`);
  console.log(`Username: ${username}`);
  console.log(`password: ${password}`);

  if(readline.question("Is info true? [y/n] ") === "y"){
    var i = file.get('index');
    if(!i){
      i = 0;
    }
    file.set('index', i + 1);
    file.set(`keeps[${i}].nameofsite`, nameofsite);
    file.set(`keeps[${i}].username`, crypt(username));
    file.set(`keeps[${i}].password`, crypt(password));
    file.save();
    return;
  }
  else {
    console.log('Information you have entered is wrong!');
    return;
  }

}

function find(nameofsite){
  var keep = findWithName(nameofsite);

  var username = file.get(`${keep}.username`);
  var password = file.get(`${keep}.password`);

 if(username && password ){
  username = decrypt(username);
  password = decrypt(password);
  console.log(`${nameofsite}, information for this site`);
  console.log(`Username that you use: ${username}`);
  console.log(`password that you use: ${password}`);
  return;
  }else {
  console.log(`We can't finde a site named this ${nameofsite}`);
  console.log(`Please control information that you gave us and try again`);
  return;
 }
}

function del(nameofsite){
  var keep = findWithName(nameofsite);

  var username = file.get(`${keep}.username`);

  if(username){
  file.unset(`${keep}`);
  file.save();
  console.log(`${nameofsite} site has been removed`);
  return;
  } else {
    console.log(`We can't finde a site named this ${nameofsite}`);
    console.log(`Please control information that you gave us and try again`);
    return;
  }
}

function help(){
  console.log('Commands we have add, find, del, list, help');

  switch(readline.question("Wich command info do you want? (leave it blank if you don't want) ")) {
  case 'add':
    console.log('Creates new info base, usage of command:');
    console.log('add <name_of_the_site> <username> <password>');
    break;
  case 'find':
    console.log('Finds info base, usage of command:');
    console.log('find <name_of_the_site>');
    break;
  case 'del':
    console.log('Deletes info base, usage of command:');
    console.log('del <name_of_the_site>');
    break;
  case 'list':
    console.log('List of registered apps/sites, usage of command:');
    console.log('list');
    break;
  case 'help':
    console.log('Gives help about system, usage of command:');
    console.log('help');
    break;
  default:
    console.log('I am sending you to start point');
    return;

 }
}

function list(){
  var index = file.get('index');
  if(!index){
    console.log('There is no record in our database');
    return;
  }
  for (var i = 0; i < index; i++) {
      var nof = file.get(`keeps[${i}].nameofsite`);
      if(nof){
        console.log(nof);
      } else {
        break;
      }
  }
  return;
}

function crypt(message){
  var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
  var mystr = mykey.update(message, 'utf8', 'hex');
  mystr += mykey.final('hex');

  return mystr;
}

function decrypt(message){
  var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
  var mystr = mykey.update(message, 'hex', 'utf8');
  mystr += mykey.final('utf8');

  return mystr;
}

function findWithName(nameofsite){
  var index = file.get('index');
  for (var i = 0; i < index; i++) {
   var nof = file.get(`keeps[${i}].nameofsite`);
   if(nof === nameofsite){
     var keep = `keeps[${i}]`;
     break;
   }
  }
  return keep;
}
