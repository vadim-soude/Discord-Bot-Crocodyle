const { REST, SlashCommandBuilder, Routes, AttachmentBuilder, Client, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, TextChannel } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
var images = require("images");
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers", "GuildMembers","GuildBans","GuildPresences"] });
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const currentGuild = client.guilds.cache.get(process.env.DISCORD_BOT_GUILD_ID);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let loadBalancerRegister = [];
let loadBalancerUpdate = [];
let loadBalancerRequest = [];
let loadBalancerDelete = [];
let loadBalancerUpdateRole = [];

let cooldownUpdate = new Map();
let cooldownGetData = new Map();
let cooldownRemoveLink = new Map();

var teamLo = "";

var old_jaune, old_rouge = null;
var new_jaune,new_rouge;

var cache_jaune,cache_rouge;
var temp_jaune,temp_rouge;
var on_cd = 0;

const fs = require('fs');
const path = require('path');

const url = "";
const settings = { method: "Get" };

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(function(err) {
	if (err) throw err
});

client.commands = new Collection();
client.buttons = new Collection();
client.selects = new Collection();

const commands = [
	new SlashCommandBuilder().setName('link').setDescription('Setup the link between Twitch and Discord'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_BOT_CLIENT_ID, process.env.DISCORD_BOT_GUILD_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

function getData(type){
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        for (let index = 0; index < 2; index++) {
            const element = json[index];
            if(type = 1){
                if(element.id == 1){
                    cache_jaune = element;
                }else{
                    cache_rouge = element;
                }
            }
            if(type = 2){
                if(element.id == 1){
                    temp_jaune = element;
                }else{
                    temp_rouge = element;
                }
            }
        }
    });
}

function loadJSON(customUrl) {
	fetch(customUrl, settings)
    .then(res => res.json())
    .then((json) => {
		if(json!=null){
			teamLo = json.team.name;
		}else{
			teamLo = "caca";
		}
    });
}

function imageNumberGenerator(value){
    var temp = '' + value;
    var sizeNumber = 0;
    for (let index = 0; index < temp.length; index++) {
        sizeNumber = sizeNumber + 7 + images("./images/number/"+Array.from(temp)[index]+".png").size().width;
    }
    var imageBuffer = images(sizeNumber,93).draw(images("./images/number/"+Array.from(temp)[0]+".png"), 0, 0);
    sizeNumber = images("./images/number/"+Array.from(temp)[0]+".png").size().width + 7;

    if(value>9 || value<0){
        for (let index = 1; index < temp.length; index++) {
            imageBuffer.draw(images("./images/number/"+Array.from(temp)[index]+".png"), sizeNumber, 0);
            sizeNumber = sizeNumber + images("./images/number/"+Array.from(temp)[index]+".png").size().width + 7;
        }
    }
    return imageBuffer;
}

async function output(){
    getData(2);

    //Génération de l'image avec les 2 jar avec la proportion entre 0 et 1000 de points de chaque equipe en sable de couleur
    images(480,1900).draw(images("./images/Sable_Jaune.png"), 0, (1900*(1000-temp_jaune.value))/1000).save("./images/output.png");
    images(930,2088).draw(images("./images/output.png"), 275, 52).draw(images("./images/TicrocoJar_EquipeJaune.png"), 0, 0).save("./images/output_eqj.png");
    images(480,1900).draw(images("./images/Sable_Rouge.png"), 0, (1900*(1000-temp_rouge.value))/1000).save("./images/output.png");
    images(985,2149).draw(images("./images/output.png"), 190, 108).draw(images("./images/TicrocoJar_EquipeRouge.png"), 0, 0).save("./images/output_eqr.png");
    images(1890,2149).draw(images("./images/output_eqj.png"), 0, 61).draw(images("./images/output_eqr.png"), 960, 0).save("./images/output.png");

    //Génération de l'affichage numérique sous les jars du nombre de points

    imageNumberGenerator(temp_jaune.value).save("./images/output_nj.png");
    imageNumberGenerator(temp_rouge.value).save("./images/output_nr.png");

    images(1890,2310)
        .draw(images("./images/output.png"), 0, 0)
        .draw(images("./images/output_nj.png"), 490 - (images("./images/output_nj.png").size().width/2), 2180)
        .draw(images("./images/output_nr.png"), 1410 - (images("./images/output_nr.png").size().width/2), 2180)
        .save("./images/output.png");

	let file = new AttachmentBuilder('./images/output.png');


	const showWarInfo = new EmbedBuilder()
		.setColor(0x01bd30)
		.setTitle('__Résumé de la guerre précédente !__')
		.setDescription(
			'\n ⠀'+
			'\n '+
			'Gagnant de la guerre précédente :' +
			'\n' +
			'\n⠀⠀'+ process.env.EMOTE_JAUNE + '⠀** ÉGALITÉ **⠀' + process.env.EMOTE_ROUGE +
			'\n' +
			'\n __Score final__: **0 pts** - **0 pts**'+
			'\n ⠀'+
			'\n ⠀'+
			'\n __Victoires__: ⠀**7** '+ process.env.EMOTE_JAUNE + '⠀|⠀**5** ' + process.env.EMOTE_ROUGE);


	const showPointCounter = new EmbedBuilder()
		.setColor(0x01bd30)
		.setTitle('**__Points des équipes en direct !__**')
		.setImage('attachment://output.png')
		.setTimestamp()
		.setFooter({ text: 'Suggestion : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

	client.channels.cache.get(process.env.CHANNEL_ID_PTS).messages.fetch(process.env.MESSAGE_ID_PTS)
		.then(msg=>{
			msg.edit({content:'',embeds:[showWarInfo, showPointCounter], files:[file]})
		});
	
	
	client.channels.cache.get(process.env.CHANNEL_ID_LOG).send({content:'**Log points de team**: \n__Jaune__: ' + temp_jaune.value + '\n__Rouge__: ' + temp_rouge.value });

    on_cd = 0;
}


process.on("exit", code => { console.log(`Le processus s'est arrêté avec le code: ${code}!`) });
process.on("unhandledRejection", (reason, promise) => { console.log(`UNHANDLED_REJECTION: ${reason}`, promise) });
process.on("warning", (...args) => console.log(...args));

client.login(process.env.DISCORD_BOT_TOKEN);











//					//
//		EMBEDS		//
//					//

const LinkEmbed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Role d\'équipe !')
	.setDescription('Pour obtenir le rôle discord qui correspond à la team de ton compte twitch tu peux cliquer sur le premier bouton!\n \nSi tu n\'as pas encore de team tu peux cliquer sur le deuxième bouton pour en rejoindre une!\n⠀').setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

const showTeamInfoembed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Comment rejoindre une team ? ')
	.setImage('https://i.imgur.com/PR4hZ9V.png')
	.setDescription('Pour rejoindre une team il suffit d\'**aller sur le stream de croco**, dans son chat et d\'**envoyer l\'émote de la couleur correspondante**.\n\n__Tu peux retrouver la chaîne de Crocodyle ici:__ https://www.twitch.tv/crocodyle_lol. \n\nLes émotes gratuites pour tous à utiliser dans le chat:\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

const showTwitchLinkembed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Connecter votre compte Twitch et Discord')
	.setImage('https://i.imgur.com/2iV0yLQ.png')
	.setDescription('Utilisez le **premier bouton** pour vous rendre sur le site de connexion. Sur celui-ci vous pourrez vous **connecter à travers Twitch** afin de fournir au site votre numéro de compte (Numéro unique lié à votre compte).\n\nUne fois connecté, vous pouvez suivre les indications présentes sur la page.\n\n*(Aucune information de connexion, tokens ou autres ne sont conservés après votre connexion.)*\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

const showNeedHelpembed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Options d\'aide :')
	.setDescription(
		'__**Mise à jour**__ : Vous permet de mettre à jour vos données si un problème est survenu durant l\'envoi de celles-ci.' +
		'\n' +
		'\n *- Utilisez cette option si vous n\'avez pas obtenu votre rôle après plus de 5 minutes.*' +
		'\n' +
		'\n **Cooldown : 15 minutes.**' +
		'\n' +
		'\n__**Obtenir mes données**__ : Vous permet d\'obtenir vos données pour vérifier si elles concordent entre le site et les données que le bot possède.' +
		'\n' +
		'\n *- Utilisez cette option si vous souhaitez vérifier que le bot n\'a pas eu de problème avec vos données.*' +
		'\n' +
		'\n **Cooldown : 1 heure.**' +
		'\n' +
		'\n__**Dé-lier son compte**__ : Vous permet de supprimer le lien existant entre le compte discord sur lequel vous êtes et le compte twitch avec lequel il est lié.' +
		'\n' +
		'\n *- Utilisez cette option si vous changez de compte twitch ou discord, aucune aide ne vous sera fournie si vous êtes banni de discord ou de ce discord.*' +
		'\n' +
		'\n **Cooldown : 1 semaine.**' +
		'\n⠀'
		).setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
		
const LoadingEmbed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Chargement en cours ...')
	.setDescription('Votre demande est en route et vous serez informé via ce message quand elle sera arrivé !\n\n**NE SUPPRIMEZ CE MESSAGE ! Sans quoi vous ne serez pas informé de l\'évolution de votre demande**\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
	
	
const Registerembed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('La manipulation est terminée !')
	.setDescription('\n**Le CrocoLink est en place !**\n\n*Si vous avez rempli correctement les informations et que vous possédez une team,* vous devrez __recevoir votre rôle d\'ici moins de 5 minutes__. \n \n __**Vous n\'aviez pas de team au moment de mettre en place le croco Link ? Vous n\'avez pas reçu de rôle après plus de 10 minutes ?**__\n Utilisez le bouton \'🚨Aides Supplémentaires / Demandes\'\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

const Error1embed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Une erreur est survenue !')
	.setDescription('**Le CrocoLink n\'a pas pu connecter votre compte discord et twitch.**\n\n Le compte twitch est déjà lié à un compte discord ou votre compte discord est déjà lié à un compte twitch.\n\n**OU**\n\nVous n\'ayez pas indiqué correctement les informations qui vous ont été demandées\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });

const Error2embed = new EmbedBuilder()
	.setColor(0x01bd30)
	.setTitle('Une erreur est survenue !')
	.setDescription('Le CrocoLink n\'a pas pu connecter votre compte discord et twitch. Il semble que vous n\'ayez pas indiqué correctement les informations qui vous ont été demandées !\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });


























client.on('ready', () => {
	runEvery200ms();
	setTimeout(output, 1000);

});
	
client.on('interactionCreate', async interaction => {

	if (interaction.isChatInputCommand()) {
		const { commandName } = interaction;
		if (commandName === 'link') {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('showTwitchLink')
						.setStyle(ButtonStyle.Primary)
						.setLabel('Lier le compte Discord et Twitch !')
						.setEmoji(process.env.EMOTE_TWITCH)
			);
			const row1 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('showTeamInfo')
						.setStyle(ButtonStyle.Success)
						.setLabel('Comment rejoindre une team !')
						.setEmoji(process.env.EMOTE_FFC)
			);	
			const row2 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('showNeedHelp')
						.setStyle(ButtonStyle.Danger)
						.setLabel('Aides Supplémentaires / Demandes')
						.setEmoji('🚨')
			);
			interaction.channel.send({ content: '', embeds: [LinkEmbed], components: [row, row1, row2] });
			interaction.reply({ content: 'Système mis en place.', ephemeral: true });
		}
	}
	else if (interaction.isButton()) {
		const button = interaction;
		if (button.customId == 'showTeamInfo') {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL('https://www.twitch.tv/crocodyle_lol')
						.setLabel('Chaine twitch de Crocodyle!')
						.setEmoji(process.env.EMOTE_TWITCH)
			);
			interaction.reply({
				content: '', embeds: [showTeamInfoembed], ephemeral: true, components: [row]
			});
		}
		if (button.customId == 'showTwitchLink') {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL('https://www.crocolink.fr/')
						.setLabel('Connecter son compte Twitch !')
						.setEmoji(process.env.EMOTE_TWITCH)
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('showDiscordID')
						.setStyle(ButtonStyle.Success)
						.setLabel('Entrer les informations du CrocoLink')
						.setEmoji('🛠️')
				);
			interaction.reply({
				content: '', embeds: [showTwitchLinkembed], ephemeral: true, components: [row]
			});
		}
		if (button.customId == 'showDiscordID') {
			const modal = new ModalBuilder()
				.setTitle('Entrer les infos du CrocoLink')
				.setCustomId('CrocoLinkModal')
				.setComponents(
					new ActionRowBuilder().setComponents(
						new TextInputBuilder()
							.setLabel('Compte Twitch')
							.setCustomId('twitch_name_account')
							.setStyle(TextInputStyle.Short)
					),
					new ActionRowBuilder().setComponents(
						new TextInputBuilder()
							.setLabel('ID TWITCH')
							.setCustomId('id_twitch')
							.setStyle(TextInputStyle.Short)
					),
					new ActionRowBuilder().setComponents(
						new TextInputBuilder()
							.setLabel('CLÉ DE VÉRIFICATION')
							.setCustomId('unique_key')
							.setMaxLength(32)
							.setMinLength(32)
							.setStyle(TextInputStyle.Short)
					)
					);
			interaction.showModal(modal);
		}
		if (button.customId == 'showNeedHelp') {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
					.setCustomId('updateCrocoLink')
					.setStyle(ButtonStyle.Success)
					.setLabel('Mettre à jour')
					.setEmoji('📡')
				).addComponents(
					new ButtonBuilder()
					.setCustomId('getMyData')
					.setStyle(ButtonStyle.Primary)
					.setLabel('Obtenir mes données')
					.setEmoji('📋')
				).addComponents(
					new ButtonBuilder()
					.setCustomId('deleteTwitchLinkAcount')
					.setStyle(ButtonStyle.Danger)
					.setLabel('Dé-lier son compte')
					.setEmoji('💣')
				);
			interaction.reply({content:'', embeds: [showNeedHelpembed], ephemeral:true, components: [row]});
		}
		if (button.customId == 'updateCrocoLink') {
			interaction.reply({content: '', embeds: [LoadingEmbed], ephemeral: true});
			await new Promise(r => setTimeout(r, 500));
			loadBalancerUpdate.push(interaction);
		}
		if (button.customId == 'getMyData') {
			interaction.reply({content: '', embeds: [LoadingEmbed], ephemeral: true});
			await new Promise(r => setTimeout(r, 500));
			loadBalancerRequest.push(interaction);
		}
		if (button.customId == 'deleteTwitchLinkAcount') {
			interaction.reply({content: '', embeds: [LoadingEmbed], ephemeral: true});
			await new Promise(r => setTimeout(r, 500));
			loadBalancerDelete.push(interaction);
		}
	}else if(interaction.isModalSubmit()){
		if(interaction.customId === 'CrocoLinkModal'){
			interaction.reply({content: '', embeds: [LoadingEmbed], ephemeral: true});
			await new Promise(r => setTimeout(r, 500));
			loadBalancerRegister.push(interaction);
		}
	}

});






















async function runEvery200ms() {
    if(old_jaune == null || old_rouge == null){
        getData(1);
        old_jaune = cache_jaune;
        old_rouge = cache_rouge;
    }else{
        getData(1);
        new_jaune = cache_jaune;
        new_rouge = cache_rouge;
        if(new_jaune.value != old_jaune.value || new_rouge.value != old_rouge.value){
            if(on_cd == 0){
				old_jaune = new_jaune;
				old_rouge = new_rouge;
                setTimeout(output, 3000);
                on_cd = 1;
            }
        }
    }

	//LoadBalancer for registering user in DB
    if(loadBalancerRegister.length > 0){
		const interaction = loadBalancerRegister.at(0);
		const discord_id = interaction.user.id;
		const id_twitch = interaction.fields.getTextInputValue('id_twitch');
		const unique_key = interaction.fields.getTextInputValue('unique_key');
		let same_key = false;
		let allready_link_twitch = true;
		let allready_link_discord = true;
		await new Promise(r => setTimeout(r, 200));
		if(!isNaN(id_twitch) && !isNaN(discord_id)){
			db.query("SELECT `key_value` FROM `users` WHERE `twitch_user_id` = " + id_twitch, function (err, result, fields) {
				if (err) throw err;
				if(result[0] != null){
					if(result[0].key_value == unique_key){
						same_key = true;
					}
				}
			});
			db.query("SELECT `discord_user_id` FROM `users` WHERE `twitch_user_id` = " + id_twitch, function (err, result, fields) {
				if (err) throw err;
					if(result[0] != null){
					if(result[0].discord_user_id == 0){
						allready_link_twitch = false;
					}
				}
			});
			await new Promise(r => setTimeout(r, 500));
			db.query("SELECT `twitch_user_id` FROM `users` WHERE `discord_user_id` = " + discord_id, function (err, result, fields) {
				if (err) throw err;
				if(result[0] == null){
					allready_link_discord = false;
				}else{
					if(result[0].twitch_user_id == null){
						allready_link_discord = false;
						console.log(result[0].twitch_user_id);
					}
				}
			});
			await new Promise(r => setTimeout(r, 500));
			if(!allready_link_twitch && !allready_link_discord && same_key){
				db.query("UPDATE `users` SET `discord_user_id` = " + discord_id + " WHERE `users`.`twitch_user_id` = " + id_twitch);
				await new Promise(r => setTimeout(r, 500));
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('showNeedHelp')
							.setStyle(ButtonStyle.Danger)
							.setLabel('Aides Supplémentaires / Demandes')
							.setEmoji('🚨'));
				loadBalancerUpdateRole.push(interaction);
				interaction.editReply({
				content: '<@'+discord_id+'>', embeds: [Registerembed], ephemeral: true, components: [row]
				});
			}else{
				await new Promise(r => setTimeout(r, 500));
				interaction.editReply({content: '<@'+discord_id+'>', embeds: [Error1embed], ephemeral: true});
			}
		}else{
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [Error2embed], ephemeral: true});
		}
		loadBalancerRegister.shift();
	}
	//LoadBalancer for updating user and cooldown stuffs
	if(loadBalancerUpdate.length>0){
		const interaction = loadBalancerUpdate.at(0);
		const discord_id = interaction.user.id;
		await new Promise(r => setTimeout(r, 300));
		if(cooldownUpdate.get(discord_id) == null || (cooldownUpdate.get(discord_id) != null && cooldownUpdate.get(discord_id) <= Date.now())){
			loadBalancerUpdateRole.push(interaction);
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [LoadingEmbed], ephemeral: true});
			cooldownUpdate.set(discord_id, Date.now() + (15 * 60 * 1000))
		}else{
			let cooldownLeft = Math.floor( cooldownUpdate.get(discord_id) / 1000);
			const embed = new EmbedBuilder()
				.setColor(0x01bd30)
				.setTitle('Vous devez attendre !')
				.setDescription('Vous devez attendre encore avant d\'exécuter cette commande à nouveau !\n\nVous pourrez utiliser la commande <t:'+ cooldownLeft +':R>.\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [embed], ephemeral: true});
		}
		loadBalancerUpdate.shift();
	}
	//LoadBalancer for request data of user and cooldown stuffs
	if(loadBalancerRequest.length>0){
		const interaction = loadBalancerRequest.at(0);
		const discord_id = interaction.user.id;
		let twitch_user_id, key_value = 'error';
		await new Promise(r => setTimeout(r, 200));
		if(cooldownGetData.get(discord_id) == null || (cooldownGetData.get(discord_id) != null && cooldownGetData.get(discord_id) <= Date.now())){	
			db.query("SELECT `twitch_user_id`,`key_value` FROM `users` WHERE `discord_user_id` = " + discord_id, function (err, result, fields) {
				if (err) throw err;
					if(result[0] != null){
						if(result[0].twitch_user_id != null && result[0].key_value != null){
							twitch_user_id = result[0].twitch_user_id;
							key_value = result[0].key_value;
						}
					}
				});
			await new Promise(r => setTimeout(r, 500));
			const embed = new EmbedBuilder()
				.setColor(0x01bd30)
				.setTitle('Vos Données')
				.setDescription(
					'__ID de votre compte discord :__ **'+
					discord_id+
					'**\n\n__ID du compte twitch lié :__ **'+
					twitch_user_id+
					'**\n\n **NE PAS PARTAGER L\'INFORMATION SUIVANTE !**' +
					'\n__Clé unique du CrocoLink :__ ||**' +
					key_value+
					'**||\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [embed], ephemeral: true});
			cooldownGetData.set(discord_id, Date.now() + (60 * 60 * 1000))
		}else{
			let cooldownLeft = Math.floor( cooldownGetData.get(discord_id) / 1000);
			const embed = new EmbedBuilder()
				.setColor(0x01bd30)
				.setTitle('Vous devez attendre !')
				.setDescription('Vous devez attendre encore avant d\'exécuter cette commande à nouveau !\n\nVous pourrez utiliser la commande <t:'+ cooldownLeft +':R>.\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [embed], ephemeral: true});
		}
		loadBalancerRequest.shift();
	}
    //LoadBalancer for removing link of a user and cooldown stuffs
	if(loadBalancerDelete.length>0){
		const interaction = loadBalancerDelete.at(0);
		const discord_id = interaction.user.id;
		let twitch_user_id = 'error';
		await new Promise(r => setTimeout(r, 200));	
		if(cooldownRemoveLink.get(discord_id) == null || (cooldownRemoveLink.get(discord_id) != null && cooldownRemoveLink.get(discord_id) <= Date.now())){
			db.query("SELECT `twitch_user_id` FROM `users` WHERE `discord_user_id` = " + discord_id, function (err, result, fields) {
				if (err) throw err;
					if(result[0] != null){
						if(result[0].twitch_user_id != null){
							twitch_user_id = result[0].twitch_user_id;
						}
					}
				});
			db.query("UPDATE `users` SET `discord_user_id` = '0' WHERE `discord_user_id` = " + discord_id, function (err, result, fields) {if (err) throw err;});
			await new Promise(r => setTimeout(r, 500));
			const embed = new EmbedBuilder()
				.setColor(0x01bd30)
				.setTitle('Mise à jour ...')
				.setDescription(
					'__ID du compte twitch qui étais lié :__ **'+
					twitch_user_id+
					'**\n\n Votre Compte discord a bien été dissocié de ce compte twitch\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
				interaction.editReply({content: '<@'+discord_id+'>', embeds: [embed], ephemeral: true});
				cooldownRemoveLink.set(discord_id, Date.now() + (7 * 24 * 60 * 60 * 1000))
		}else{
			let cooldownLeft = Math.floor( cooldownRemoveLink.get(discord_id) / 1000);
			const embed = new EmbedBuilder()
				.setColor(0x01bd30)
				.setTitle('Vous devez attendre !')
				.setDescription('Vous devez attendre encore avant d\'exécuter cette commande à nouveau !\n\nVous pourrez utiliser la commande <t:'+ cooldownLeft +':R>.\n⠀').setTimestamp().setFooter({ text: 'Contact : Reytz#9806', iconURL: 'https://i.imgur.com/7x9cRxl.png' });
			interaction.editReply({content: '<@'+discord_id+'>', embeds: [embed], ephemeral: true});
		}
		loadBalancerDelete.shift();
	}
	if(loadBalancerUpdateRole.length>0){
		const interaction = loadBalancerUpdateRole.at(0);
		const discord_id = interaction.user.id;
		let twitch_user_id = 'error';
		db.query("SELECT `twitch_user_id` FROM `users` WHERE `discord_user_id` = " + discord_id, function (err, result, fields) {
			if (err) throw err;
				if(result[0] != null){
					if(result[0].twitch_user_id != null){
						twitch_user_id = result[0].twitch_user_id;
					}
				}
			});
		await new Promise(r => setTimeout(r, 200));
		if(twitch_user_id != 'error' && twitch_user_id != null && twitch_user_id != 0){
			loadJSON(''+twitch_user_id);
			await new Promise(r => setTimeout(r, 200));

			let roleCheck = teamLo;

			if(roleCheck == 'Jaune'){
				(await interaction.guild.members.fetch(discord_id)).roles.add(await interaction.guild.roles.fetch(process.env.ROLE_JAUNE));
			}
			if(roleCheck == 'Rouge'){
				(await interaction.guild.members.fetch(discord_id)).roles.add(await interaction.guild.roles.fetch(process.env.ROLE_ROUGE));
			}
		}
		loadBalancerUpdateRole.shift();
	}
	setTimeout(runEvery200ms, 200);
};


