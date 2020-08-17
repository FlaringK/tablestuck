const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

    if(strifecall.strifeTest(client, message, message.author) == true){

    //  message.channel.send("You are already in STRIFE! You can leave by ABSCONDING, which is >act 6 1");
      //return;
    message.channel.send("Leaving Strife");

    var charid = message.guild.id.concat(message.author.id);
    let local = client.playerMap.get(charid,"local");
    let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`

    let players = client.strifeMap.get(strifeLocal,"players");
    if(players == 1){
      client.strifeMap.delete(strifeLocal);
    } else {

      let pos = client.playerMap.get(charid,"pos");

      let active = client.strifeMap.get(strifeLocal,"active");
      let playerpos = client.strifeMap.get(strifeLocal,"playerpos");

      let removed = [active.splice(active.indexOf(pos),1),playerpos.splice(playerpos.indexOf(pos),1)];
      players --;

      client.strifeMap.set(strifeLocal,active,"active");
      client.strifeMap.set(strifeLocal,players,"players");
      client.strifeMap.set(strifeLocal,playerpos,"playerpos");

    }
    client.playerMap.set(charid,false,"strife");
    return;

  }

  var charid = message.guild.id.concat(message.author.id);

  let armor = client.playerMap.get(charid,"armor");
  let vit = client.playerMap.get(charid,"vit");

  let spec =client.playerMap.get(charid,"spec");
  let equip = client.playerMap.get(charid,"equip");

  if(equip>=spec.length){
    message.channel.send("You must have a weapon equipped before entering strife!");
    return;
  }

  let grist;

  if(armor.length == 0){
    grist = "artifact"
  } else {
    grist = client.gristTypes[client.codeCypher[1][client.captchaCode.indexOf(armor[0][1].charAt(1))]];
  };


  let local = client.playerMap.get(charid,"local");

  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let occ = sec[local[1]][local[2]][2][local[3]][4];

  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`
  let profile = [true,charid,grist,vit,0,1,[],[]];

  if(client.strifeMap.has(strifeLocal)){

    let list = client.strifeMap.get(strifeLocal,"list");
    let init = client.strifeMap.get(strifeLocal,"init");
    let active = client.strifeMap.get(strifeLocal,"active");
    let players = client.strifeMap.get(strifeLocal,"players");
    let playerpos = client.strifeMap.get(strifeLocal,"playerpos");

    const pos = list.length;
/*
    [[player name,hp],[underlin 1]]

    turn 0

    [[1,15],[0,12],[3,4]]
*/
    list.push(profile);
    init.push([pos,1]);
    active.push(pos);
    players++;
    playerpos.push(pos);

    client.strifeMap.set(strifeLocal,list,"list");
    client.strifeMap.set(strifeLocal,init,"init");
    client.strifeMap.set(strifeLocal,active,"active");
    client.strifeMap.set(strifeLocal,players,"players");
    client.strifeMap.set(strifeLocal,playerpos,"playerpos");
    client.playerMap.set(charid,pos,"pos");

    client.playerMap.set(charid,true,"strife");
    message.channel.send("Entering Strife!");



  } else {

    var strifeSet = {
      list:[profile],
      init:[[0,Math.floor((Math.random() * 20) + 1)]],
      turn:0,
      active:[0],
      players:1,
      playerpos:[0],
      round:0,
      last:[]
    }

    /*if(occ.length > 1){
      //do a for check on each occupant in the room to see if there are any underlings. If there are, add them to the strife
    } else if(local[0]=="h"){
      //generate underlings for the player to fight in their house

      strifecall.underSpawn(client,local,"imp");



    }*/

    client.strifeMap.set(strifeLocal,strifeSet);
    client.playerMap.set(charid,0,"pos");
    client.playerMap.set(charid,true,"strife");

    strifecall.underRally(client,local);

    message.channel.send("Entering Strife!");

    strifecall.start(client,message,local);

  }

}