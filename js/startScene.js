class StartScene extends Phaser.Scene{
	constructor(config){
		super(config);
	}
	preload(){
		this.load.image('start_background','assets/start_background.png');
	}
	
	create(){
		let backg = this.add.image(0,0,'start_background');
		backg.setOrigin(0,0);
		
		this.seconds = 3;//Время отсчеа в секундах
		this.seconds_field = this.add.text(config.width/2,config.height/2-50,String(this.seconds),{fontSize:'100px', fontStyle:'bold', color:'#ed9342'});
		//Выравнивание текста по центру
		this.seconds_field.setPosition(this.seconds_field.x-this.seconds_field.width/2,this.seconds_field.y);
		
		this.seconds_field.setShadow(1,1,"#000000",3);
		let scene = this;
		this.timerEvent = setInterval(this.timerLoop, this.seconds * 1000, this); 
	}
	
	timerLoop(main){
		main.seconds -=1;
		let progress = main.seconds;
		if(progress <= 0){
			clearInterval(main.timerEvent);
			main.seconds_field.setText('Начали!');
			main.seconds_field.setPosition(main.seconds_field.x-main.seconds_field.width/2,main.seconds_field.y);
			setTimeout(function(main) {
				game.scene.add('GameScene',GameScene,true);
				main.scene.remove(main);},1000, main);
		}else{
			main.seconds_field.setText(String(progress));
		}
	}
}
