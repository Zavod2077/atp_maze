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
		
		this.seconds = 3;
		this.seconds_field = this.add.text(config.width/2,config.height/2-50,String(this.seconds),{fontSize:'100px', fontStyle:'bold', color:'#ed9342'});
		//Выравнивание текста по центру
		this.seconds_field.setPosition(this.seconds_field.x-this.seconds_field.width/2,this.seconds_field.y);
		
		this.seconds_field.setShadow(1,1,"#000000",3);
		let scene = this;
		this.timerEvent = this.time.addEvent({callback:this.timerLoop, delay : 1000, repeat: this.seconds-1, callbackScope:this}); 
	}
	
	timerLoop(){
		this.seconds --;
		if(this.seconds == 0){
			this.seconds_field.setText('Начали!');
			this.seconds_field.setPosition(this.seconds_field.x-this.seconds_field.width/2,this.seconds_field.y);
			this.time.delayedCall(1000, function() {
				game.scene.add('GameScene',GameScene,true);
				this.scene.remove(this);}, [], this);
		}else{
			this.seconds_field.setText(String(this.seconds));
		}
	}
}
