class EndScene extends Phaser.Scene{
	constructor(config){
		super(config);
	}
	
	preload(){
		this.load.image('end_background','assets/end_background.jpg');
		this.load.image('m_gold','assets/medals/gold.png');
		this.load.image('m_silver','assets/medals/silver.png');
		this.load.image('m_bronze','assets/medals/bronze.png');
	}
	
	create(){
		let backg = this.add.image(200,10,'end_background');
		backg.setOrigin(0,0);
		
		let scene = this;
		this.scroller_exist = false; // Флаг на присутствие ползунка
		
		//Подложка таблицы
		let graphics = this.add.graphics();
		this.draw_graphics(graphics);
		
		// Маска таблицы
		//make как add, только JSON
		this.mask = this.make.graphics({
			add:false
		})
		this.mask.height = 290;
		this.draw_mask(this.mask, this.mask.height);
		
		// Маска медалей
		this.mask2 = this.make.graphics({
			add:false
		})
		this.draw_mask2(this.mask2, this.mask.height);
		
		//Кнопка обновления
		let button = this.add.graphics();
		this.draw_button(button,148,565);
		let button_text = this.add.text(148+2,565+8, 'Обновить таблицу', {fontSize:'20px', fontStyle:'bold', color:'#000000'});
		button_text.setInteractive({cursor: 'pointer'});
		button_text.on('pointerdown', function(){
			scene.getScore();
		});
		
		//Пока прячем кнопку
		button_text.visible=false;
		button.visible=false;
		
		//Надписи
		let end_text = 'Вами набрано '+ String(total_score)+' очков\n Из них:\n За верные датчики: '+String(total_score-time_score)+' очков\n За время: '+String(time_score)+' очков'+'\n\nИдет загрузка рекордов...'
		this.head = this.add.text(250,160,'Список рекордов:',{fontSize:'30px', fontStyle:'bold', color:'#000000'});
		
		//шапка таблицы
		this.table_field2= this.add.text(200,210,'',{fontSize:'20px', fontStyle:'bold', color:'#000000'});
		//таблица рекордов
		this.table_field= this.add.text(200,250,end_text,{fontSize:'20px', fontStyle:'bold', color:'#000000'});
		
		let score_table =''; //Таблица рекордов
		let score_table2 = 'Место       Игрок       Очки'; //Не скролящийся заголовок
		this.table_field2.setText(score_table2);
		
		this.table_field.mask = new Phaser.Display.Masks.GeometryMask(this, this.mask);
		
		this.medals=[];
		this.add_medals(this.medals);
		this.show_medals(0); //Убираем видимость 3 медалей 
		//this.show_medals(score_table.split('\n').length); Функция для вывода медалей
		
		
		//Делаем запрос на сервер с задержкой в 3 секунды
		this.time.delayedCall(3000, function(){
				this.setScore(scene);
				button_text.visible=true;
				button.visible=true;
			},[],this);
		
		
		sessionStorage.setItem('session_score',total_score);
	}
	
	//Рисуем подложку
	draw_graphics(gr){
		gr.lineStyle(5,0xE67E22 ,1.0);
		gr.fillStyle(0xF0B27A,0.4);
		gr.fillRect(150,150,500,410);
		gr.strokeRect(150,150,500,410);
	}
	
	//Очерчиваем маску
	draw_mask(gr, height){
		gr.fillStyle(0xF0B27A,0.4);
		gr.fillRect(160,250,400,height); // x,y,width,height
	}
	
	//Очерчиваем маску для медалей
	draw_mask2(gr, height){
		gr.fillStyle(0xF0B27A,0.4);
		gr.fillRect(160,240,400,height); // x,y,width,height
	}
	
	//Рисуем кнопку
	draw_button(gr,x,y){
		gr.lineStyle(2,0x000000 ,1.0);
		gr.fillStyle(0xD0D3D4,0.6);
		gr.fillRoundedRect(x,y,200,30, 5);
		gr.strokeRoundedRect(x,y,200,30, 5);
	}
	
	//Рисуем медали
	add_medals(medals){
		let medal_x = 180;
		let medal_y = 257;
		let medal_dy = 19;
		medals.push(this.add.image(medal_x,medal_y,'m_gold').setScale(0.3));
		medals.push(this.add.image(medal_x,medal_y+medal_dy,'m_silver').setScale(0.3));
		medals.push(this.add.image(medal_x,medal_y+medal_dy*2,'m_bronze').setScale(0.3));
		for(let i=0;i<3;i++){
			medals[i].mask = new Phaser.Display.Masks.GeometryMask(this, this.mask2);
		}
	}
	//показать медали
	show_medals(length){
		
		for(let i=0;i<3;i++){
			this.medals[i].visible=false;
		}
		
		if(length>2){
			length=3;
		}
		for(let i=0;i<length;i++){
			this.medals[i].visible=true;
		}
	}
	
	//добавляем ползунок
	add_scroller(){
		let scroller_settings={
			x:600,
			y:250,
			width: 15,
			height: 285,
			table: this.table_field,
			scroll_factor: this.table_field.height-this.mask.height,
			medals_dy:this.medals[0].y - this.table_field.y,
			medals:this.medals
		};
		this.scroller = this.scene.add('Scroller', Scroller, true, scroller_settings);
		this.scroller_exist = true;
	}
	
	//Запрос на сервер по поводу таблицы рекордов
	setScore(scene){
		
		var xhr = new XMLHttpRequest();
		
		var json = JSON.stringify({
			cipher: 123456,
			name: name,
			surname: surname,
			player_class: player_class,
			player_school: player_school,
			score: Number(total_score)
		});
		
		xhr.open("POST","HTTPS://Bulat102.pythonanywhere.com/set_score/atp",true);
		xhr.setRequestHeader("Content-type",'application/json; charset=utf-8');
			
		xhr.send(json);
			
		//console.log('Запрос post отправлен');
			
		xhr.onreadystatechange = function(){
			if (xhr.readyState !=4) return;
			
			if (xhr.status != 200){
				//обработать ошибку
				alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
			} else {
				// вывести результат
				let score_table = String(xhr.responseText).slice(0,-1);
				let top_place = Number(String(xhr.responseText).slice(-1)); //выводим топовое место, если получили, если нет то 0
				//console.log(xhr.responseText);
				
				score_table = score_table;
				scene.table_field.setText(score_table);
				
				
				
				//Если таблица больше маски, то прокрутка нужна
				if(scene.table_field.height>scene.mask.height){
					//полоса прокрутки для таблицы рекордов
					scene.add_scroller();
				}
				
				scene.show_medals(score_table.split('\n').length);
				
				/*if (Boolean(top_place)){
					scoresText.text = scoresText.text+"\n\n Ваш результат "+score+" попал на "+top_place+' место!';
				}else{
					scoresText.text = scoresText.text+"\n\n Ваш результат "+score+" не попал в топ(";
				}*/
			}
		}
	}
	
	//Делаем запрос на получение таблицы рекордов
	getScore(){
		
		var xhr = new XMLHttpRequest();
		var scene = this;
		var json = JSON.stringify({
			cipher: 123456
		});
		
		xhr.open("POST","HTTPS://Bulat102.pythonanywhere.com/get_score/atp_get",true);
		xhr.setRequestHeader("Content-type",'application/json; charset=utf-8');
			
		xhr.send(json);
		//console.log('Запрос на получение таблицы отправлен');
			
		xhr.onreadystatechange = function(){
			if (xhr.readyState !=4) return;
			
			if (xhr.status != 200){
				//обработать ошибку
				alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
			} else {
				// вывести результат
				let score_table = String(xhr.responseText).slice(0,-1);
				let top_place = Number(String(xhr.responseText).slice(-1)); //выводим топовое место, если получили, если нет то 0
				
				score_table = score_table;
				scene.table_field.setText(score_table);
				if(!scene.scroller_exist){
					if(scene.table_field.height>scene.mask.height){
						//полоса прокрутки для таблицы рекордов
						scene.add_scroller();
					}
				}else{
					scene.scroller.set_scroll_factor(scene.table_field.height-scene.mask.height);
				}
				
				scene.show_medals(score_table.split('\n').length);
				
			}
		}
	}
}
