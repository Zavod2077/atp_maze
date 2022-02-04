class Sensor extends Phaser.GameObjects.Sprite{
	constructor(scene,x,y,name,type){
		super(scene,x,y,name);
		scene.add.existing(this);
		
		this.type = type;
		this.scene = scene;
		this.spots = scene.spots;
		this.x = x;
		this.y = y;
		this.setInteractive({cursor: 'pointer'});
		scene.input.setDraggable(this);
		
		this.on('pointerover', function(){
			scene.show_big_sensor(type,true);
		});
		
		this.on('pointerout', function(){
			scene.show_big_sensor(type,false);
		});
		
		this.on('pointerdown', function(){
			scene.show_big_sensor(type,false);
		});
		
	}
}


