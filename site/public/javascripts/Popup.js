(function(window,document,$){

	var pluginName = 'Popup',
		config = {
			'trigger' : '',
			'event' : 'mouseenter',
			'time' : 400,
			'class' : 'active'
		}

	function Popup(obj,option){
		this._ele = $(obj);
		this._config(option);
		this._index = 0;//fadeIn or fadeOut.
	}
	Popup.prototype = {
		//处理配置
		_config : function(option){
			this._option = $.extend('deep',config,option);
			this._init(this._option.trigger);
			this._handle(this._option.event,this._option.time,this._option.class);
		},
		//初始化状态
		_init : function(trigger){
			this._trigger = (trigger?$(trigger):$(this._ele).children()).css('display','none');
		},
		//事件处理
		_handle : function(event,time,name){
			var This = this;
			var eE = 'mouseleave';

			this._ele.unbind().bind(event,function(){
					if(This._index == 0){
						This._trigger.fadeIn(eval(time));//fadein
						This._ele.addClass(name);
						This._index=1;
					}else{
						This._trigger.fadeOut(eval(time));//fadein
						This._index=0;
						This._ele.removeClass(name);
					}
				})
		}
	}
	$.fn[pluginName] = function(option){ //add a function (Popup()) for every object, line 62
		return this.each(function(){
			if(!$.data(this,'plugin_'+pluginName)){
				$.data(this,'plugin_'+pluginName,new Popup(this,option));
			}
		})
	};
})($(window),$(document),jQuery);

var $pop = $('.plug-pop');//get all object with "class="plug-pop""

$.each($pop,function(){
	var data = $(this).data('pop'),
	option = getOption(data);

	$(this).Popup(option);
});

function getOption(data){
	var option = {},
		op = data.split(';');
	$.each(op,function(){
		if(this!=''){
			var attr = this.split(':');
			option[attr[0]] = attr[1];
		};
	});
	return option;
};