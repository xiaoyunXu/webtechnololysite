(function() {
  var c = document.getElementById('bg');
  var ctx = c.getContext('2d');
  var w = c.width = window.innerWidth;
  var h = c.height = window.innerHeight;
  function randomColor(){  
    var rainbow=['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF'];
    var r = Math.floor(Math.random() * rainbow.length);
    // var r = Math.random();
    // var threshold = 0.5;
    // if(r<threshold){
    //   r += threshold;
    // }
　　 var colorStr=Math.floor(r*0xFFFFFF).toString(16).toUpperCase();  
    return rainbow[r];
  } 
  var Box = function(x, y, vx, color) {
    this.color = color;
    this.vx = vx;
    this.x = x;
    this.y = y;
    this.w = 10 + Math.random() * 50;
    this.h = 5 + Math.random() * 300;
  };
  Box.prototype = {
    constructor: Box,
    update: function() {
      this.x += this.vx;
      if(this.x < -this.w / 2) {
        this.x = w + this.w / 2;
      }
    },
    render: function(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.w/2, -this.h, this.w, this.h);
      ctx.restore();
    }
  };
  
  var ctr = 50;
  var boxes = [];
  var boxes2 = [];
  var boxes3 = [];
  var box; 
  var speed = -5;
  
  for(var i = 0; i < ctr; i++) {
    box = new Box(Math.random() * w, h, speed * 0.25, randomColor());
    boxes.push(box);
  }
  for(var i = 0; i < ctr; i++) {
    box = new Box(Math.random() * w, h, speed * 0.4, randomColor());
    boxes2.push(box);
  }  
  for(var i = 0; i < ctr; i++) {
    box = new Box(Math.random() * w, h, speed * 0.5, randomColor() );
    boxes3.push(box);
  }    
  
  function loop(){
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.2;
    for(var i = 0; i < boxes.length; i++) {
      box = boxes[i];
      box.update();
      box.render(ctx);
    }
    ctx.globalAlpha = 0.4;
    for(var i = 0; i < boxes2.length; i++) {
      box = boxes2[i];
      box.update();
      box.render(ctx);
    }
    ctx.globalAlpha = 0.6;
    for(var i = 0; i < boxes3.length; i++) {
      box = boxes3[i];
      box.update();
      box.render(ctx);
    } 
  }

  requestAnimationFrame(loop);
})()