enchant();

window.onload = function(){
  var game = new Game(320, 440);

  game.preload('res/BG.png', 'res/penguinSheet.png', 'res/Ice.png');

  game.fps = 30;
  game.scale = 1;

  game.onload = function(){
    var scene, label, bg;

    scene = new SceneGame();

    game.pushScene(scene);
  }

  game.start();

  var SceneGame = Class.create(Scene, {
    initialize: function(){
      var game, label, bg, penguin, iceGroup;

      Scene.apply(this);
      game = Game.instance;

      label = new Label('SCORE<br>0');
      label.x = 9;
      label.y = 32;
      label.color = 'white';
      label.font = '16px strong';
      label.textAlign = 'center';
      label._style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
      this.scoreLabel = label;

      bg = new Sprite(320, 440);
      bg.image = game.assets['res/BG.png'];

      penguin = new Penguin();
      penguin.x = game.width/2 - penguin.width/2;
      penguin.y = 280;
      this.penguin = penguin;

      iceGroup = new Group();
      this.iceGroup = iceGroup;

      this.addChild(bg);
      this.addChild(label);
      this.addChild(penguin);
      this.addChild(iceGroup);

      this.addEventListener(Event.TOUCH_START, this.handleTouchControl);
      this.addEventListener(Event.ENTER_FRAME, this.update);

      this.generateIceTimer = 0;
    },
    handleTouchControl: function(evt){
      var laneWidth, lane;
      laneWidth = 320/3;
      lane = Math.floor(evt.x/laneWidth);
      lane = Math.max(Math.min(2,lane),0);
      this.penguin.switchToLaneNumber(lane);
    },
    update: function(evt){
      this.generateIceTimer += evt.elapsed * 0.001;
      if (this.generateIceTimer >= 0.5){
        var ice;
        this.generateIceTimer -= 0.5;
        ice = new Ice(Math.floor(Math.random()*3));
        this.iceGroup.addChild(ice);
      }

      for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--){
        var ice;
        ice = this.iceGroup.childNodes[i];
        if (ice.intersect(this.penguin)){
          this.iceGroup.removeChild(ice);
          break;
        }
      }
    }
  });

  var Penguin = Class.create(Sprite, {
    initialize: function(){
      Sprite.apply(this, [30, 43]);
      this.image = Game.instance.assets['res/penguinSheet.png'];
      this.animationDuration = 0;
      this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
    },
    updateAnimation: function(evt){
      this.animationDuration += evt.elapsed * 0.001;
      if (this.animationDuration >= 0.25){
        this.frame = (this.frame + 1) % 2;
        this.animationDuration -= 0.25;
      }
    },
    switchToLaneNumber: function(lane){
      var targetX = 160 - this.width/2 + (lane-1)*90;
      this.x = targetX;
    }
  });

  var Ice = Class.create(Sprite, {
    initialize: function(lane){
      Sprite.apply(this,[48,49]);
      this.image = Game.instance.assets['res/Ice.png'];
      this.rotationSpeed = 0;
      this.setLane(lane);
      this.addEventListener(Event.ENTER_FRAME, this.update);
    },
    setLane: function(lane){
      var game, distance;

      game = Game.instance;
      distance = 90;

      this.rotationSpeed = Math.random() * 100 - 50;

      this.x = game.width/2 - this.width/2 + (lane -1) * distance;
      this.y = -this.height;
      this.rotation = Math.floor(Math.random() * 360);
    },
    update: function(evt){
      var ySpeed, game;

      game = Game.instance;
      ySpeed = 300;

      this.y += ySpeed * evt.elapsed * 0.001;
      this.rotation += this.rotationSpeed * evt.elapsed * 0.001;

      if (this.y > game.height) {
        this.parentNode.removeChild(this);
      }
    }
  });
}
