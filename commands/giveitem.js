const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

exports.run = (client, message, args) => {

  if(!message.mentions.members.first()){
    message.channel.send("You must @ a user to target them!");
    return;
  }

  var charid = message.guild.id.concat(message.mentions.members.first().id);
  var code = args[0];

  if(!code.length==8){
    message.channel.send("That is not a valid Captchalog Code!");
    return;
  }
  for(i=0;i<8;i++){
    if(!client.captchaCode.includes(code[i])){
      message.channel.send("That is not a valid Captchalog Code!")
      return;
    }
  }


  tier = parseInt(args[1], 10);
  if(isNaN(tier)){
    message.channel.send("That is not a valid tier!");
    return;
  } else if (tier < 1 || tier > 16) {
    message.channel.send("That is not a valid tier!");
    return;
  }
  let local = client.playerMap.get(charid,"local");
  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];

  let currentInv = client.playerMap.get(charid,"sdex");

  let item = ["CUSTOM ITEM",code,tier,1,[]];

  currentInv.unshift(item);
  let mess = `CAPTCHALOGUED the ${item[0]}.`
  if(currentInv.length > client.playerMap.get(charid,"cards")){
    let dropItem = currentInv.pop();
    room[5].push(dropItem);
    mess += `\nYour Sylladex is full, ejecting your ${dropItem[0]}!`
}
message.channel.send(mess);
sec[local[1]][local[2]][2][local[3]] = room;
client.landMap.set(land,sec,local[0]);
client.playerMap.set(charid,currentInv,"sdex");
}
