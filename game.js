define(['order!enchant','order!nineleap.enchant', 'order!util.enchant', 'order!ScrollableScene.enchant'], function (){
        enchant();
		var table = [
				['H', '',  '',  '',  '', '', '',  'He'],
				['Li','Be','B', 'C', 'N','O','F', 'Ne'],
				['Na','Mg','Al','Si','P','S','Cl','Ar']
			],
			GameScene = enchant.Class.create(enchant.Scene, {
				initialize: function () {
					enchant.Scene.call(this);
					var x, y, panel, that = this;

					this.answers = new Group();
					this.addChild(this.answers);
					this.answers.x = 64 / 2;
					this.answers.y = 64 * 4;
					for (x = 0; x < 4; ++x) {
						panel = new MutableText(x * 64, 0, 64, 64);
						panel.centered = true;
						panel.text = '';
						panel.height = 64;
						panel.backgroundColor = (x % 2) ? '#eef' : '#eff';
						panel.addEventListener(Event.TOUCH_END, function(e) {
							if (e.target.text === that.answer) {
								that.score.score += 1;
							};
							that.update(randomSelect());
						});
						this.answers.addChild(panel);
					}

					this.panels = new Group();
					this.addChild(this.panels);
					this.panels.x = (game.width - 64 * 3) / 2;
					this.panels.y = 48;
					for (y = 0; y < 3; ++y) {
						for (x = 0; x < 3; ++x) {
							panel = new MutableText(x * 64, y * 64, 64, 64);
							panel.centered = true;
							panel.text = '';
							panel.height = 64;
							panel.backgroundColor = ((x + y) % 2) ? '#ffe' : '#fef';
							this.panels.addChild(panel);
						}
					}
					this.score = new ScoreLabel(0, 0);
					this.addChild(this.score);

					this.time = new TimeLabel(0, 16, 'countdown');
					this.addChild(this.time);
					this.addEventListener(Event.ENTER_FRAME, function(){
						if (that.time.time <= 0) {
							that.end();
						}
					});
				},
				start: function (){
					this.time.time = 60;
					this.update(randomSelect());
				},
				end: function (){
					game.end(this.score.score, '1分間で' + this.score.score + '点獲得しました');
				},
				update: function (elementInfo) {
					var panels;
					this.answer = elementInfo.element;
					panels = this.updatePanels(elementInfo);
					this.updateAnswers(elementInfo, panels);
				},
				updatePanels: function(elementInfo) {
					var origin = {
							x: Math.min(Math.max(0, elementInfo.x - 1), table[0].length - 3),
							y: Math.min(Math.max(0, elementInfo.y - 1), table.length - 3)
						},
						x, y, c, panel, result = [];
					for (y = 0; y < 3; ++y) {
						for (x = 0; x < 3; ++x) {
							c = table[y + origin.y][x + origin.x];
							if (c === this.answer) { c = '?'; } else { result.push(c); }
							panel = this.panels.childNodes[y * 3 + x];
							panel.text = c;
							panel.height = 64;
							panel.redraw();
						}
					}
					return result;
				},
				updateAnswers: function(elementInfo, panels) {
					var i, answer, answers = [elementInfo.element], panel;
					do {
						answer = randomSelect().element;
						if (!contains(answers, answer) && !contains(panels, answer)) {
							answers.push(answer);
						}
					} while (answers.length < 4);
					shuffle(answers);
					for (i = 0; i < answers.length; ++i) {
						panel = this.answers.childNodes[i];
						panel.text = answers[i];
						panel.height = 64;
						panel.redraw();
					}
				}
			}),
			game = new Game(320, 320),
			gameScene;

		// select one element from table
		function randomSelect (){
			var result = {};
			do {
				result.x = Math.floor(Math.random() * table[0].length);
				result.y = Math.floor(Math.random() * table.length);
				result.element = table[result.y][result.x];
			} while (!result.element);
			return result;
		}

		function shuffle(arr) {
			var i;
			for (i = 0; i < arr.length; ++i) {
				swap(arr, i, Math.floor(Math.random() * arr.length));
			}
		}

		function swap(arr, x, y) {
			var tmp = arr[x];
			arr[x] = arr[y];
			arr[y] = tmp;
		}

		function contains(arr, val) {
			var i;
			for (i = 0; i < arr.length; ++i) {
				if (arr[i] === val) { return true; }
			}
			return false;
		}

        game.preload(['start.png', 'end.png']);
        game.onload = function (){
        	gameScene = new GameScene();
			game.pushScene(gameScene);
        };
        game.onstart = function() {
        	gameScene.start();
        };
        game.start();

});
