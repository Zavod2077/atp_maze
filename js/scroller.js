class Scroller extends Phaser.Scene{
	constructor(config){
		super(config);
	}
	
	init(data){
		this.x = data.x; // x ползунка и слайдбара
		this.y = data.y; // y ползунка и слайдбара
		this.width = data.width; //ширина слайдбара
		this.height = data.height; // высота слайдбара
		this.table = data.table; //ссылка на таблицу - прокручиваемую
		this.scroll_factor = data.scroll_factor;  // сколько скроллить
		this.medals_dy = data.medals_dy;  // dy медалей от таблицы
		this.medals = data.medals; //медали
		
		this.slider_height=30;  //высота ползунка
		this.slider_active = false;  //флаг на то что ползунок можно двигать
		 
	}
	
	create(){
		 //рисуем слайдбар
		let slidebar = this.make.graphics({add:true});
		this.draw_slidebar(slidebar,this.x, this.y, this.width, this.height);
		 //рисуем ползунок
		this.slider = this.make.graphics({add:true});
		this.draw_slider(this.slider,0, 0,this.width, this.slider_height);
		 //задаем начальные координаты ползунка
		this.slider.x = this.x;
		this.slider.y=this.y+5; // 5 пикселей - отступ от границ слайдбара сверху и снизу
		
		 //данные внутри слайдбара, вытаскиваем в собитии перетаскивания мышью
		this.slider.data = {
			y0:this.y,
			slider_height:this.slider_height,
			height0: this.height,
			table:this.table,
			table_y0:this.table.y,
			scroll_factor:this.scroll_factor,
			medals_dy:this.medals_dy,
			medals:this.medals,
			scene:this
		};
		
		 //Задаем интнерактивность ползунку и границы этой интерактивности в виде прямогугольнка
		this.slider.setInteractive(new Phaser.Geom.Rectangle(-500,-300,700, 600), Phaser.Geom.Rectangle.Contains);
		
		//флаг true на перетаскивание мышью ползунка
		this.slider.on('pointerdown', function(pointer, gameObject){
			this.slider_active = true;
		});
		
		//флаг falst на перетаскивание мышью ползунка, когда мышка не нажата
		this.slider.on('pointerup', function(pointer, gameObject){
			this.slider_active = false;
		});
		
		//флаг falst на перетаскивание мышью ползунка, когда мышка ушла
		this.slider.on('pointerout', function(pointer, gameObject){
			this.slider_active = false;
		});
		
		//Задаем событие прокрутки ролика мыши
		this.input.on('wheel', function(pointer, currentlyOver, deltaX, deltaY, deltaZ){
			if(currentlyOver.length>0){
				//двигаем ползунок
				currentlyOver[0].y += deltaY/100*14;
				//задаем границы ползунка
				currentlyOver[0].data.scene.scroll_table(currentlyOver[0]);
			}
		});
		
		//при движении нажатой мыши на ползунке, его двигаем и прокручиваем таблицу
		this.slider.on('pointermove', function(pointer, gameObject){
			if(this.slider_active){
				//двигаем ползунок
				this.y = pointer.position.y-this.data.slider_height/2;
				//задаем границы ползунка и двигаем таблицу
				this.data.scene.scroll_table(this);
			}
		});
		
		
		
	}
	//задаем границы ползунка и двигаем таблицу
	scroll_table(slider){
		if(slider.y < (slider.data.y0+5)){
			slider.y=slider.data.y0+5;
		}else if((slider.y+slider.data.slider_height+5)>(slider.data.height0+slider.data.y0)){
			slider.y = slider.data.height0+slider.data.y0-slider.data.slider_height-5;
		}
		
		//прокручиваем таблицу
		slider.data.table.y = slider.data.table_y0 - ((slider.y-(slider.data.y0+5))/(slider.data.height0-10-slider.data.slider_height)*(slider.data.scroll_factor));
		//прокручиваем медали
		slider.data.scene.move_medals(slider.data.medals,(slider.data.table.y+slider.data.medals_dy));
	}
	
	//двигать медали
	move_medals(medals,y){
		let medal_y = y;
		let medal_dy = 19;
		for(let i=0;i<3;i++){
			medals[i].y =  medal_y+medal_dy*i;
		}
	}
	
	//меняем scroll_factor - кусок который прокручиваем
	set_scroll_factor(scroll_factor){
		this.slider.data.scroll_factor = scroll_factor;
	} 
	
	 //рисуем слайдбар
	draw_slidebar(gr, x, y, width, height){
		gr.lineStyle(5,0xE67E22 ,1.0);
		gr.strokeLineShape({x1:x,y1:y,x2:(x+width),y2:y});
		gr.strokeLineShape({x1:x,y1:y+height,x2:(x+width),y2:y+height});
		gr.fillStyle(0xc5bcbc,0.4);
		gr.fillRect(x,y, width, height);
	}
	 //рисуем ползунок
	draw_slider(gr,x, y, width, height){
		gr.lineStyle(5,0xE67E22 ,1.0);
		gr.fillStyle(0xE67E22,0.4);
		gr.fillRect(x,y, width, height);
		gr.strokeRect(x,y, width, height);
	}
	
}
