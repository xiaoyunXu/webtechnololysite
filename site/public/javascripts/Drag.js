const panels = document.querySelectorAll('.panel');

function toggleOpen() {
  this.classList.toggle('open');
}

function toggleActive(e) {
  console.log(e.propertyName);
  if(e.propertyName.includes('flex')) {
   this.classList.toggle('open-active'); 
 }
}

panels.forEach(panel => panel.addEventListener('click', toggleOpen));
panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));
  
function Drag(){
  this.initialize.apply(this, arguments)
}
Drag.prototype = {
  initialize : function (drag, options){
    this.drag = this.$(drag);
    this._x = this._y = 0;
    this._moveDrag = this.bind(this, this.moveDrag);
    this._stopDrag = this.bind(this, this.stopDrag);
    
    this.setOptions(options);
    
    this.handle = this.$(this.options.handle);
    this.maxContainer = this.$(this.options.maxContainer);
    
    this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight;
    this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth;
    
    this.handle.style.cursor = "move";
        
    this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag))
  },

  startDrag : function (event){   
    var event = event || window.event;
    
    this._x = event.clientX - this.drag.offsetLeft;
    this._y = event.clientY - this.drag.offsetTop;
    
    this.addHandler(document, "mousemove", this._moveDrag);
    this.addHandler(document, "mouseup", this._stopDrag);
    
    event.preventDefault && event.preventDefault();
    this.handle.setCapture && this.handle.setCapture();
    
  },
  moveDrag : function (event){
    var event = event || window.event;
    
    var iTop = event.clientY - this._y;
    var iLeft = event.clientX - this._x;

    this.drag.style.top = iTop + "px";
    this.drag.style.left = iLeft + "px";
    
    event.preventDefault && event.preventDefault();
    
  },
  stopDrag : function (){
    this.removeHandler(document, "mousemove", this._moveDrag);
    this.removeHandler(document, "mouseup", this._stopDrag);
    
    this.handle.releaseCapture && this.handle.releaseCapture();
    
  },

  setOptions : function (options){
    this.options =
    {
      handle:this.drag,
      maxContainer:document.documentElement || document.body
    };
    for (var p in options) this.options[p] = options[p]
  },

  $ : function (id){
    return typeof id === "string" ? document.getElementById(id) : id
  },

  addHandler : function (oElement, sEventType, fnHandler){
    return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
  },
  
  removeHandler : function (oElement, sEventType, fnHandler){
    return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
  },
  //bind
  bind : function (object, fnHandler){
    return function ()
    {
      return fnHandler.apply(object, arguments) 
    }
  }
};

//call
window.onload = function (){
  // document.getElementById("boxR").style.display = "none";
  // hideloginBox();
  var oBox = document.getElementById("box");  
  var oTitle = oBox.getElementsByTagName("p")[0];
  var oDrag = new Drag(oBox, {handle:oTitle});

  var oBoxR = document.getElementById("boxR");  
  var oTitleR = oBoxR.getElementsByTagName("p")[0];
  var oDragR = new Drag(oBoxR, {handle:oTitleR});
  
};

function hideloginBox(){
  document.getElementById("box").style.display = "none";
  document.getElementById("mask").style.display = "none";
};
function showloginBox(){
  document.getElementById("box").style.display = "block";
  document.getElementById("mask").style.display = "block";
  document.getElementById("boxR").style.display = "none";
};
function showRegisterBox(){
  document.getElementById("boxR").style.display = "block";
  document.getElementById("mask").style.display = "block";
  document.getElementById("box").style.display = "none";
};
function hideRegisterBox(){
  document.getElementById("boxR").style.display = "none";
  document.getElementById("mask").style.display = "none";
};
function Loginfunction(){
  showloginBox();
}
function Registerfunction(){
  showRegisterBox();
}