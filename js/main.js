var config = {
		scale:{parent: 'game', autoCenter: Phaser.Scale.CENTER_BOTH, mode: Phaser.Scale.FIT},
        type: Phaser.AUTO,
        width: 1100,
        height: 600,
        backgroundColor:0xFFFFFF
    };
//, mode: Phaser.Scale.FIT - под телефоны

var game = new Phaser.Game(config);
let player_info = String(decodeURIComponent(window.location.search)); //Информация про игрока
player_info=player_info.slice(1);
let str = player_info.split('&');

var name = str[0].slice(str[0].indexOf('=')+1);
var surname = str[1].slice(str[1].indexOf('=')+1);
var player_class = str[2].slice(str[2].indexOf('=')+1);
var player_school = str[3].slice(str[3].indexOf('=')+1);
var cipher = Number(str[4].slice(str[4].indexOf('=')+1)); //Шифр сессии
player_class = player_class.replace('+',' ');
player_school = player_school.replace('+',' ');
//alert(String(cipher) + '  '+ name +' ' +surname+' '+ player_class+' '+ player_school);

//Смотрим прошлые значения score, чтобы не переигрывать.
let session_score = Number(sessionStorage.getItem('session_score'));
var total_score = 0; //очки за время + очки за верные
var time_score = 0; //очки за время
var lifes = 5; //Дано 5 жизней - довольных аппаратчиков

//session_score = 5; //Временно - отладка

if(session_score>0){
	total_score=session_score;	
	game.scene.add('EndScene',EndScene,true);//Идем в конец, если игра уже сыграна
}else{
	//Идем в игру, т.к. нет очков
	game.scene.add('StartScene',StartScene,true);
}
