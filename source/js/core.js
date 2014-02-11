'use strict';

(function() {
	/**
	 * 针对原型的方法添加应用支持
	 */
	
	/**
	 * 获取中文长度
	 */
	String.prototype.getLength = function(){
		return this.replace(/[^\x00-\xff]/g, "en").length; //若为中文替换成两个字母
	};
	
	/**
	 * 清空空格
	 */
	String.prototype.trim = function(){
		return this.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
	};
	
	/**
	 * 转为unicode编码
	 */
	String.prototype.toUnicode = function(){
		return escape( this.toLocaleLowerCase().replace(/%u/gi, '\\') );
	};
	
	/**
	 * 转为unicode编码
	 */
	String.prototype.unicodeTo = function(){
		return unescape( this.toLocaleLowerCase().replace(/%u/gi, '\\') );
	};
	
	/**
	 * zUI
	 * @namespace设定基本命名空间
	 * @author norion
	 * @blog http://zkeyword.com/
	 */
	var zUI = window.zUI || {};

	/*设定基本构架*/
	zUI = {
		_INSTALL: function(){
			window.zUI = zUI;
		},
		base: {}, //基础层,所有的基础函数库,如cookie等
		ui: {},   //前端显示层,用来重构和回流DOM,前端的特效显示处理
		page: {}, //用户页面层,用来做一些页面上特有的功能
		app: {}   //一些常用的小功能，如加入收藏夹之类
	};
	
	zUI._INSTALL();
}(window));


/**
 * zUI.base基础层
 * @class zUI.base 基础层,所有的基础函数库,如cookie等
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.base = {

	/**
	 * 设置地址
	 * @return {String}
	 */
	domain: {
		url: 'http://127.0.0.1'
	},
	
	/**
	 * 重写console，以防止在IE下出错
	 * @param {Object} 需要打印的对象
	 */
	log: function(msg){
		if( window["console"] ){
			console.log(msg);
		}
	},
	
	/**
	 * 判断是否是数组
	 * @param {Object} 
	 * @return {Boolean}
	 */
	isArray: function(o){
		return o ? jQuery.isArray(o) : false;
	},
	
	/**
	 * 判断是否是对象
	 * @param {Object} 
	 * @return {Boolean}
	 */
	isObject: function(o){
		return o ? Object.prototype.toString.call(o) === "[object Object]" : false;
	},
	
	/**
	 * 判断是否是函数
	 * @param {Function} 
	 * @return {Boolean}
	 */
	isFunction: function(o){
		return o ? Object.prototype.toString.call(o) === "[object Function]" : false;
	}
};

/**
 * browser
 * @class zUI.base.browser
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.base.browser = (function(){
	var na            = window.navigator,
		browserTester = /(msie|webkit|gecko|presto|opera|safari|firefox|chrome|maxthon|android|ipad|iphone|webos|hpwos)[ \/os]*([\d_.]+)/ig,
		ua            = na.userAgent.toLowerCase(),
		browser       = {
							platform: na.platform
						};
	ua.replace(browserTester, function(a, b, c) {
		var bLower = b.toLowerCase();
		if (!browser[bLower]) {
			browser[bLower] = c; 
		}
	});
	if( browser.msie ){
		browser.ie = browser.msie;
		var v = parseInt(browser.msie, 10);
		browser['ie' + v] = true;
	}	
	return browser;
}());

/*解决ie6下的背景图片缓存问题  */
if( zUI.base.browser.ie6 ) {
	try{
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

/**
 * cookie
 * @class zUI.base.cookie
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.base.cookie = {

	/**
	 * 设置cookie
	 * @param {String} cookie的名称
	 * @param {String} cookie的值
	 * @param {String} cookie的域名
	 * @param {String} cookie存放的路径
	 * @param {String} cookie的有效期
	 * @return {Boolean}
	 */
    set: function(name, value, domain, path, hour){
		if( hour ){
			var today  = new Date(),
				expire = new Date();
			expire.setTime(today.getTime() + 36E5 * hour);
		}
		document.cookie = name + "=" + escape(value) + "; " + (hour ? "expires=" + expire.toGMTString() + "; " : "") + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
		return true;
	},
	
	/**
	 * 获取cookie
	 * @param {String} cookie的名称
	 * @return {String} cookie的值
	 */
	get: function( name ){
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
			m = document.cookie.match(r);
		return unescape(decodeURI(!m ? "" : m[1]));
	},
	
	/**
	 * 删除cookie
	 * @param {String} cookie的名称
	 * @param {String} cookie的域名
	 * @param {String} cookie存放的路径
	 */
	del: function(name, domain, path){
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
	}
};

/**
 * zUI.ui前端显示层
 * @class zUI.ui 前端显示层,用来重构和回流DOM,前端的特效显示处理
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.ui = {

	/**
	 * 设置标识ID
	 */
	uniqueId: function(){
		
	},
	
	/**
	 * css中的z-index值
	 * @return {Number} z-index值
	 */
	zIndex: function(){
		return 9999 + $('.l-ui').length;
	},
	
	/**
	 * 需要ui元素需要绝对定位的容器
	 */
	wrap: function(){
		if( !$('#l-ui-wrap').length ){
			$('body').append('<div id="l-ui-wrap"><!--[if lte IE 6.5]><iframe src="javascript:false;" style="width:0;height:0;"></iframe><![endif]--></div>');
		}
	},
	
	/**
	 * 设置遮罩
	 */
	lock: function(){
		var body = $('body'),
			bodyW = body.width(),
			bodyH = $(document).height();
			
		if( !$('.l-ui-lock').length ){
			body.append('<div class="l-ui-lock"></div>')
				.find('.l-ui-lock').css({ width:bodyW, height:bodyH, filter:'Alpha(opacity=20)' });
		}else{
			$('.l-ui-lock').show();
		}
		
		//给.l-ui添加遮罩标识
		$('.l-ui').addClass('l-ui-mask');
	},
	
	/**
	 * 删除遮罩
	 */
	unlock: function(){
		$('.l-ui-lock').hide();
	},
	
	/**
	 * 获取鼠标位置
	 * @param {Object} event事件
	 * @return {Array} 返回鼠标的x、y轴：[positionX, positionY]
	 */
	mousePosition: function(e){
		var e = e || window.event,
			x = e.pageX || e.clientX + document.body.scrollLeft,
			y = e.pageY || e.clientY + document.body.scrollTop;
		return{
			positionX : x,
			positionY : y
		};
	},
	
	/**
	 * 判断是否宽屏
	 * @return {Boolean} 
	 */
	Widescreen: (function(){
		return (screen.width >= 1210);
	})()
};


/**
 * 拖动插件 
 * @constructor zUI.ui.drag
 * @extends zUI.ui
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 * @example 
   zUI.ui.drag({
	   dragItem:'#dragItem',
	   dragWrap:'#dragWrap'
   });
 */
zUI.ui.drag = function(options){         //IE下 iframe内的的拖动还是有问题

	var o = options || {};
	if( !o.dragItem ) return false;
	var	dragItem = $('body').find(o.dragItem),
		dragWrap = $('body').find(o.dragWrap),
		win      = parent.document || document,
		mouse    = {x:0,y:0};
		
	function _moveDialog(e){
        var e    = window.event || e,
			top  = dragWrap.css('top') == 'auto' ? 0 : dragWrap.css('top'),
			left = dragWrap.css('left') == 'auto' ? 0 : dragWrap.css('left');
			
        dragWrap.css({
			top  : parseInt(top) + (e.clientY - mouse.y),
			left : parseInt(left) + (e.clientX - mouse.x)
		});
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    dragItem.mousedown(function(e){
        var e = window.event || e;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        $(win).bind('mousemove', _moveDialog);
		e.preventDefault(); //阻止默认动作
    });
    $(win).mouseup(function(event){
        $(win).unbind('mousemove', _moveDialog);
    });
};


/**
 * ttabs选项卡插件
 * @constructor zUI.ui.tab
 * @extends zUI.ui
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 * @example 
	zUI.ui.tab({
		tabItem:'#tab li',
		tabWrap:'#tab div',
		isAuto:false,
		autoTime:100,
		onclick:function(i){
			alert(i)
		}
	});
 */
zUI.ui.tab = function(options){

	var o = options || {};
	if( !o.tabItem ) return false;
	var tabItem   = o.tabItem,                          //tab选卡对象
		tabWrap   = o.tabWrap || null,                  //tab切换内容对象
		tabEvent  = o.tabEvent || 'click',              //切换事件
		tabIndex  = o.tabIndex || 0,                    //初始位置
		isAuto    = o.isAuto || false,                  //是否自动播放
		autoTime  = o.autoTime || 2000,                 //自动播放时间
		autoSpeed = o.autoSpeed || 0,                   //自动播放速度
		onclick   = o.onclick ? o.onclick : null;       //切换后执行的函数
	
	/*切换动作*/
	var tabFn = {
		/*初始化*/
		init: function(){
			$(tabWrap).eq(tabIndex).show().siblings(tabWrap).hide();
			if( tabWrap != null ){
				var index = tabIndex;
				$(tabItem).bind(tabEvent,function(){
					index = $(tabItem).index(this);
					tabFn.cutoverFn(index);
				});
				if( isAuto ){
					tabFn.autoFn(index);
				}
			}
		},
		
		/*切换函数*/
		cutoverFn: function(i){
			//tab切换内容的html不为空才做下面动作
			if( $(tabWrap).eq(i).html() !== '' ){
				if( autoSpeed ){
					$(tabWrap).eq(i).stop(true,true).fadeIn(autoSpeed).siblings(tabWrap).fadeOut(autoSpeed);
				}else{
					$(tabWrap).eq(i).stop(true,true).show().siblings(tabWrap).hide();
				}
				$(tabItem).eq(i).addClass('on').siblings(tabItem).removeClass('on');
			}else{
				$(tabWrap).hide();
			}
			//点击tabItem执行函数
			if( zUI.base.isFunction(onclick) ){
				onclick(i);
			}
		},
		
		/*自动播放函数*/
		autoFn: function(i){
			var _mun    = $(tabWrap).size(),
				_MyTime = setInterval(function(){
					tabFn.cutoverFn(i);
					i++;
					if( i === _mun ){
						i = 0;
					};
				},autoTime);
			$(tabItem).parent().hover(function(){
				clearInterval(_MyTime);
			},function(){
				_MyTime = setInterval(function(){
					tabFn.cutoverFn(i);
					i ++;
					if( i === _mun ){
						i = 0;
					};
				},autoTime);
			});
		}
	};//end tabfn
	tabFn.init();
};


/**
 * title属性模拟插件
 * @constructor zUI.ui.tip
 * @extends zUI.ui
 * @requires zUI.base zUI.ui.wrap() zUI.ui.zIndex() zUI.ui.mousePosition()
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.ui.tip = function(options){
	var o = options || {};
	var id                = o.id || 'l-tip-'+(new Date()).valueOf(),
		tipItem           = $(o.tipItem),
		tipItemWidth      = tipItem[0].offsetWidth,
		tipItemHeight     = tipItem[0].offsetHeight,
		tipItemTop        = tipItem.offset().top,
		tipItemLeft       = tipItem.offset().left,
		attrTitle         = tipItem.attr('title'),
		tipItemWrap       = $(o.tipItemWrap||'body'),        //tipItem的最外层，默认网页的最外层为body，因为有可能在其他元素中定位
		tipItemWrapWidth  = tipItemWrap[0].offsetWidth,
		tipItemWrapHeight = tipItemWrap[0].offsetHeight,
		text              = o.text || attrTitle,             //tip的内容
		width             = o.width || 150,
		tipHeader         = o.tipHeader,                     //tip是否有标题
		isTrack           = o.isTrack || false,              //是否鼠标跟随
		isArrow           = o.isArrow || false,              //是否需要箭头
		arrowDirection    = o.arrowDirection || 'topBottom', //设箭头位置，默认是向上向下，可选是向左向右
		isInitShow        = o.isInitShow || false,           //初始化显示tip
		event             = o.event || 'mouseover';          //触发显示tip
	
	if( !text ){return;}
	
	var tipFn = {
		init: function(){
			if( $('#'+id).length ){ return; }
			if( tipItem ){ tipItem.removeAttr('title'); }
			var h = '';
				h += '<div id="'+ id +'" class="l-ui l-tip">';
				h += '<div class="l-tipMain">';
				if( tipHeader ){
					h += '<h5>'+ tipHeader +'</h5>';
				}
				h += '<div class="l-tipMain-text">'+ text +'</div>';
				h += '</div></div>';
		
			/*载入容器*/
			zUI.ui.wrap();
			$('#l-ui-wrap').prepend(h);
			var zIndex  = zUI.ui.zIndex(),
				tipWrap = $('#'+id).css({'width':width,'z-index':zIndex});
		},
		
		/*默认位置*/
		defaultPositon: function(){
			this.init();
			var tipWrap = $('#'+id).addClass('l-tip-default'),
				top     = 0,
				left    = 0;
			left = tipItemLeft;
			top = tipItemTop + tipItemHeight + 5;
			tipWrap.css({top:top,left:left});
		},
		
		/*鼠标跟随*/
		track: function(){
			this.init();
			var tipWrap       = $('#'+id).addClass('l-tip-track'),
				mousePosition = zUI.ui.mousePosition();
			tipWrap.css({top:mousePosition.positionY + 5,left:mousePosition.positionX  + 5});
		},
		
		/*带箭头*/
		arrow:function(){
			this.init();
			var tipWrap       = $('#'+id).addClass('l-tip-Arrow'),
				tipArrow      = tipWrap.prepend('<span class="l-tipArrow"></span>').find('.l-tipArrow'),
				tipWrapHeight = tipWrap[0].offsetHeight,
				tipWrapWidth  = tipWrap[0].offsetWidth,
				top           = 0,
				left          = 0;
			if( arrowDirection === 'topBottom' ){
				tipArrow.addClass('l-tipArrow-topBottom');
				var tipArrowH = tipArrow.height(),
					tipArrowW = tipArrow.width();
				/*判断obj在左还是在右*/
				if( tipItemLeft < tipItemWrapWidth/2 - tipItemWidth/2 ){
					left = tipItemLeft;
					/*判断obj在上还是在下*/
					if( tipItemTop < tipItemWrapHeight/2 - tipItemHeight/2 ){
						top = tipItemTop + tipItemHeight + tipArrowH;
						tipArrow.addClass('l-tipArrow-topLeft');
					}else{
						top = tipItemTop - tipWrapHeight - tipArrowH;
						tipArrow.addClass('l-tipArrow-bottomLeft');
					}
				}else{
					left = tipItemLeft + tipItemWidth - tipWrapWidth;
					/*判断obj在上还是在下*/
					if( tipItemTop < tipItemWrapHeight/2 - tipItemHeight/2 ){
						top = tipItemTop + tipItemHeight + tipArrowH;
						tipArrow.addClass('l-tipArrow-topRight');
					}else{
						top = tipItemTop - tipWrapHeight - tipArrowH;
						tipArrow.addClass('l-tipArrow-bottomRight');
					}
				}
			}else{
				var tipArrowH = tipArrow.height(),
					tipArrowW = tipArrow.width();
				tipArrow.addClass('l-tipArrow-leftRight');
				/*判断obj在左还是在右*/
				if( tipItemLeft < tipItemWrapWidth/2 - tipItemWidth/2 ){
					left = tipItemLeft + tipItemWidth + tipArrowW;
					/*判断obj在上还是在下*/
					if( tipItemTop < tipItemWrapHeight/2 - tipItemHeight/2 ){
						top = tipItemTop;
						tipArrow.addClass('l-tipArrow-leftTop');
					}else{
						top = tipItemTop + tipItemHeight - tipWrapHeight;
						tipArrow.addClass('l-tipArrow-leftBottom');
					}
				}else{
					left = tipItemLeft - tipItemWidth -tipArrowW;
					/*判断obj在上还是在下*/
					if( tipItemTop < tipItemWrapHeight/2 - tipItemHeight/2 ){
						top = tipItemTop;
						tipArrow.addClass('l-tipArrow-rightTop');
					}else{
						top = tipItemTop + tipItemHeight - tipWrapHeight;
						tipArrow.addClass('l-tipArrow-rightBottom');
					}
				}
			}
			tipWrap.css({top:top,left:left});
		},
		
		/*删除*/
		remove: function(){
			$('#'+id).remove();
			tipItem.attr('title',attrTitle);
		}
	};//end tipFn
	
	/*判断显示方式*/
	if( isInitShow ){
		tipFn.position();
	}else{
		tipItem.live(event,function(){
			if( isArrow ){
				tipFn.arrow();
			}else if( isTrack ){
				tipFn.track();
			}else{
				tipFn.defaultPositon();
			}
		}).live('mousemove',function(){
			if( isTrack ){
				tipFn.track();
			}
		}).live('mouseout',function(){
			tipFn.remove();
		});
		
	}//end if
	
};


/**
 * 弹出框插件
 * @constructor zUI.ui.pop
 * @extends zUI.ui
 * @requires zUI.base zUI.borwser zUI.ui.wrap() zUI.ui.zIndex() zUI.ui.lock() zUI.ui.unlock() zUI.ui.drag()
 * @author norion
 * @blog http://zkeyword.com/
 * @example 
	$('#s').click(function(){
		zUI.ui.pop.open({
			title:'标题',
			html:'111111'
		});
	});
 */
zUI.ui.pop = {

	/**
	* 初始化弹出框
	* @member zUI.ui.pop
	*/
	open: function(options){
		var o = options || {};
		var id            = o.id || 'l-pop-'+(new Date()).valueOf(),
			titleid       = 'l-pop-title-'+(new Date()).valueOf(),
			title         = o.title || '',                                     //弹出框的标题
			width         = o.width || 500,                                    //弹出框内部的宽，不包括边框的宽度
			height        = o.height || 300,                                   //弹出框内部的高，不包括边框的高度
			top           = o.top,                                             //弹出框的top
			left          = o.left,                                            //弹出框的left
			cls           = o.cls || '',                                       //定义class
			url           = o.url || '',                                       //用iframe方式加载
			ajax          = o.ajax || '',                                      //用ajax方式加载
			html          = o.html || '',                                      //用html方式加载
			onloadFn      = o.onloadFn,                                        //载入时要触发的事件
			closeFn       = o.closeFn,                                         //关闭时要触发的事件
			btns          = o.btns || '',                                      //弹出框的按钮集合
			isMask        = o.isMask === undefined  || o.isMask,               //是否允许遮罩,默认true
			isMaskClose   = o.isMaskClose === undefined || o.isMaskClose,      //是否点击遮罩关闭,默认true
			allowClose    = o.allowClose === undefined || o.allowClose,        //允许关闭,默认true
			allowEscClose = o.allowEscClose === undefined || o.allowEscClose,  //允许esc关闭,默认true
			isDrag        = o.isDrag === undefined || o.isDrag;                //允许拖拽,默认true
									
		var h = '';
			h += '<div class="l-ui l-pop-wrap" id="'+ id +'">';
			h += '	<table class="l-pop-table">';
			h += '		<tr><td colspan="3" class="l-pop-border l-pop-border-top"></th></tr>';
			h += '		<tr>';
			h += '			<td class="l-pop-border l-pop-border-left"></td>';
			h += '			<td class="l-pop-main"><div class="l-pop-content"></div></td>';
			h += '			<td class="l-pop-border l-pop-border-right"></td>';
			h += '		</tr>';
			h += '		<tr><td colspan="3" class="l-pop-border l-pop-border-bottom"></td></tr>';
			h += '	</table>';
			h += '</div>';
			
		/*载入容器*/
		zUI.ui.wrap();
		$('#l-ui-wrap').prepend(h);
		
		var zIndex     = zUI.ui.zIndex(),
			popWrap    = $('#'+id).css({'z-index':zIndex}),
			popMain    = popWrap.find('.l-pop-main'),
			popContent = popWrap.find('.l-pop-content');
			
		/*标题*/
		if( title ){
			popMain.prepend('<div class="l-pop-title" id="'+ titleid +'">'+ title +'</div>');
			var popTitle       = popMain.find('.l-pop-title'),
				popTitleHeight = popTitle.height();
		}

		/*按钮集*/
		if( btns ){
			var i       = 0,
			    btnWrap = popMain.append('<div class="ui-floatCenter l-pop-btnWrap"><div class="ui-sl-floatCenter"></div></div>')
			    				 .find('.ui-floatCenter'),
			    btnMain = btnWrap.find('.ui-sl-floatCenter');			
			$.each(btns,function(i,item){
				btnMain.append('<a href="javascript:;" class="'+ (item.cls?'ui-btn ui-btnMain ui-floatCenter-item '+item.cls:'ui-btn ui-btnMain ui-floatCenter-item') +'"><span>'+item.text+'</span></a>');
				item.onclick && btnMain.find('a').eq(i).click(function(){
					item.onclick(i,item,id);
					zUI.ui.pop.close(id);
				});
			});		
			var popBtnsHeight = btnWrap.height();
		}
		
		/*内容*/
		var popHeight = height - ( popTitleHeight || 0 ) - ( popBtnsHeight || 0 );
		popContent.css({width:width,height:popHeight});
		if( url ){
			popContent.append('<iframe src="'+ url +'" id="l-pop-iframe" frameborder="no" border="0" style="width:'+ width +'px;height:'+ popHeight +'px"></iframe>').addClass('l-pop-contentIframe');
		}else if( ajax ){
			$.ajax({
				url     : ajax,
				cache   : false,
				success : function(data){
					popContent.append(data);
				}
			}); 
		}else if( html ){
			popContent.append(html);
		};
		
		/*位置*/
		var win  = $(window),
			top  = top || win.scrollTop() + win.height()/2 - popWrap.height()/2,
			left = left || ( win.width() - popWrap.width() )/2;
		popWrap.css({top:top, left:left});
		
		/*遮罩*/
		if( isMask ){
			zUI.ui.lock();
		}

		/*拖拽*/
		if( isDrag ){
			zUI.ui.drag({
				dragItem:'#'+titleid,
				dragWrap:'#'+id
			});
		}
		
		/*载入时要触发的事件*/
		if( zUI.base.isFunction(onloadFn) ){
			onloadFn(id);
		}
		
		/*关闭*/
		if( allowClose ){
		
			/*添加关闭按钮*/
			popMain.prepend('<div class="l-pop-close">x</div>');
			$('.l-pop-close').click(function(){
			
				/*关闭时要触发的事件*/
				if( zUI.base.isFunction(closeFn) ){
					closeFn(id);
				}
				
				zUI.ui.pop.close(id);
			});
			
			/*点击遮罩关闭*/
			if( isMask && isMaskClose ){
				$('.l-ui-lock').click(function(){
					
					/*关闭时要触发的事件*/
					if( zUI.base.isFunction(closeFn) ){
						closeFn(id);
					}
					
					zUI.ui.pop.close(id);
				});
			}
		
			/*esc退出*/
			if( allowEscClose ){
				var _modalKey = function(e){
					e = e || event;
					var code = e.which || event.keyCode;
					if(code == 27){
					
						/*关闭时要触发的事件*/
						if( zUI.base.isFunction(closeFn) ){
							closeFn(id);
						}
						
						zUI.ui.pop.close(id);
					}
				};
				
				if(document.attachEvent){
					document.attachEvent('onkeydown', _modalKey);
				}else{
					document.addEventListener('keydown', _modalKey, true);
				}
				
			}
		}//end if ( allowClose )
	},
	
	/**
	* 修改弹出框大小
	* @member zUI.ui.pop
	*/
	modifyWrap: function(id,height,type){
		if( type === 'iframe' ){
			var pop = $('#'+id,window.parent.document).find('.l-pop-contentIframe').height(height)
													  .find('#l-pop-iframe').height(height);
		}else{
			var pop = $('#'+id).find('.l-pop-content').height(height);
		}
	},
	
	/**
	* 关闭释放
	* @member zUI.ui.pop
	*/
	close: function(id){
		if(id){
			$('#'+id).remove();
		}else{
			$('.l-pop-wrap').remove();
		}
		if( !$('.l-ui-mask').length ){
			zUI.ui.unlock();
		}
	}
};


/**
 * 对话框插件
 * @constructor zUI.ui.dialog
 * @extends zUI.ui
 * @requires zUI.base zUI.borwser zUI.ui.wrap() zUI.ui.zIndex() zUI.ui.lock() zUI.ui.unlock() zUI.ui.drag()
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.ui.dialog = {
	init: function(options){
		var o             = options || {},
			borwser       = zUI.borwser,
			title         = o.title || '',
			text          = o.text || '',
			btns          = o.btns || '',							          //按钮若为空，将默认
			type          = o.type || '',                                     //错误类型
			top           = o.top,
			left          = o.left,
			ok            = o.ok || '',
			no            = o.no || '',
			width         = o.width || 200,
			height        = o.height || 50,
			id            = o.id || 'l-dialog-' + (new Date()).valueOf(),      //随机id，多次调用可以用
			titleId       = 'l-dialog-title' + (new Date()).valueOf(),
			isMask        = o.isMask === undefined  || o.isMask,               //是否允许遮罩
			isMaskClose   = o.isMaskClose === undefined || o.isMaskClose,      //是否点击遮罩关闭
			allowClose    = o.allowClose === undefined || o.allowClose,        //允许关闭
			allowEscClose = o.allowEscClose === undefined || o.allowEscClose,  //允许esc关闭
			isDrag        = o.isDrag === undefined || o.isDrag;                //允许拖拽
		
		var h = '';
			h += '<div class="l-ui l-dialog-wrap" id="'+ id +'">';
			h += '	<table class="l-dialog-table">';
			h += '		<tr><td colspan="3" class="l-dialog-border l-dialog-border-top">&nbsp;</td></tr>';
			h += '		<tr>';
			h += '			<td class="l-dialog-border l-dialog-border-left">&nbsp;</td>';
			h += '			<td class="l-dialog-main"><div class="l-dialog-content" style="width:'+width+'px;height:'+height+'px">'+ text +'</div></td>';
			h += '			<td class="l-dialog-border l-dialog-border-right">&nbsp;</td>';
			h += '		</tr>';
			h += '		<tr><td colspan="3" class="l-dialog-border l-dialog-border-bottom">&nbsp;</td></tr>';
			h += '	</table>';
			h += '</div>';
		
		//载入容器
		zUI.ui.wrap();
		$('#l-ui-wrap').prepend(h);
		
		var zIndex        = zUI.ui.zIndex(),
			dialogWrap    = $('#'+id).css({'z-index':zIndex}),
			dialogMain    = dialogWrap.find('.l-dialog-main'),
			dialogcontent = dialogWrap.find('.l-dialog-content');
		
		/*标题*/
		if( title ){
			dialogMain.prepend('<div class="l-dialog-title" id="'+titleId+'">'+ title +'</div>');
		}	
		
		/*类型标识*/
		if( type ){
			dialogMain.find('.l-dialog-content').addClass('l-dialog-'+type);
		}
		
		/*按钮*/
		var i             = 0,
			btnWrap       = dialogMain.append('<div class="ui-floatCenter l-dialog-btnWrap"><div class="ui-sl-floatCenter"></div></div>')
									  .find('.ui-floatCenter'),
			btnMain       = dialogMain.find('.ui-sl-floatCenter'),
			btnWrapHeight = btnWrap.height();	
		if( btns ){
			$.each(btns,function(i,item){
				btnMain.append('<a href="javascript:;" class="'+ (item.cls?'ui-btn ui-btnMain ui-floatCenter-item '+item.cls:'ui-btn ui-btnMain ui-floatCenter-item') +'"><span>'+item.text+'</span></a>');
				item.onclick && btnMain.find('a').eq(i).click(function(){
					item.onclick(i,item);
					zUI.ui.dialog.close(id);
				});
			});	
		}else{
			switch( type ){
				case 'alert':
					btnMain.append('<a href="javascript:;" class="ui-btn ui-btnMain ui-floatCenter-item l-dialog-ok"><span>确定</span></a>');
					btnMain.find('.l-dialog-ok').click(function(){
						if( zUI.base.isFunction(ok) ){
							ok();
						}
						zUI.ui.dialog.close(id);
					});
					break;
				case 'confirm':
					btnMain.append('<a href="javascript:;" class="ui-btn ui-btnMain ui-floatCenter-item l-dialog-ok"><span>确定</span></a><a href="javascript:;" class="ui-btn ui-btnMain ui-btnMain-cancel ui-floatCenter-item l-dialog-no"><span>取消</span></a>');
					btnMain.find('.l-dialog-ok').click(function(){
						if( zUI.base.isFunction(ok) ){
							ok();
						}
						zUI.ui.dialog.close(id);
					});
					btnMain.find('.l-dialog-no').click(function(){
						if( zUI.base.isFunction(no) ){
							no();
						}
						zUI.ui.dialog.close(id);
					});
					break;
				case 'error':
					btnMain.append('<a href="javascript:;" class="ui-btn ui-btnMain ui-btnMain-cancel ui-floatCenter-item l-dialog-no"><span>取消</span></a>');
					btnMain.find('.l-dialog-no').click(function(){
						if( zUI.base.isFunction(no) ){
							no();
						}
						zUI.ui.dialog.close(id);
					});
					break;
			}//end switch
		}//end if
		
		
		/*位置*/
		var win  = $(window),
			top  = top || win.scrollTop() + win.height()/2 - dialogWrap.height()/2,
			left = left || ( win.width() - dialogWrap.width() )/2;
		dialogWrap.css({top:top,left:left});
		
		//zUI.base.log( dialogWrap.height() );
		
		/*遮罩*/
		if( isMask ){
			zUI.ui.lock();
		}
		
		/*拖拽*/
		if( isDrag ){
			zUI.ui.drag({
				dragItem:'#'+titleId,
				dragWrap:'#'+id
			});
		}
		
		/*关闭*/
		if( allowClose ){
		
			/*添加关闭按钮*/
			var dialogClose = dialogMain.prepend('<div class="l-dialog-close">x</div>').find('.l-dialog-close');
			dialogClose.click(function(){
				zUI.ui.dialog.close(id);
			});
			
			/*点击遮罩关闭*/
			/* if( isMask && isMaskClose ){
				$('.l-ui-lock').click(function(){
					zUI.ui.dialog.close(id);
				});
			} */
		
			/*esc退出*/
			if( allowEscClose ){
				var _modalKey = function (e){
					e = e || event;
					var code = e.which || event.keyCode;
					if(code === 27){
						zUI.ui.dialog.close(id);
					}
				};
				
				if(document.attachEvent){
					document.attachEvent('onkeydown', _modalKey);
				}else{
					document.addEventListener('keydown', _modalKey, true);
				}
			}
		}// end if( allowClose )
	},
	
	/**
	* 关闭释放
	* @member zUI.ui.dialog
	*/
	close: function(id){
		if( id ){
			$('#'+id).remove();
		}else{
			$('.l-dialog-wrap').remove();
		}
		if( !$('.l-ui-mask').length ){
			zUI.ui.unlock();
		}
	},
	
	/**
	* alert
	* @member zUI.ui.dialog
	*/
	alert: function(options){
		var o     = options || {},
			title = o.title || '提示',
			text  = o.text || '',
			ok    = o.ok || '';
		this.init({
			title:title,
			text:text,
			type:'alert',
			ok:ok
		});
	},
	
	/**
	* confirm
	* @member zUI.ui.dialog
	*/
	confirm: function(options){
		var o     = options || {},
			title = o.title || '确认？',
			text  = o.text || '',
			ok    = o.ok || '',
			no    = o.no || '';
		this.init({
			title:title,
			text:text,
			type:'confirm',
			ok:ok,
			no:no
		});
	},
	
	/**
	* error
	* @member zUI.ui.dialog
	*/
	error: function(options){
		var o     = options || {},
			title = o.title || '',
			text  = o.text || '错误',
			no    = o.no || '';
		this.init({
			title:title,
			text:text,
			type:'error',
			no:no
		});
	},
	
	/**
	* 小提示框
	* @member zUI.ui.dialog
	*/
	prompt: function(options){
		var o        = options || {},
			id       = o.id || 'l-dialog-' + (new Date()).valueOf(),
			top      = o.top,
			left     = o.left,
			cls      = o.cls || '',                          //自定义Class
			text     = o.text || '',                         //提示内容
			isMask   = o.isMask || true,                     //是否允许遮罩
			showTime = o.showTime || 2000,                   //显示时间，默认2秒
			endFn    = o.endFn || '',                        //关闭后需要执行的函数
			width    = o.width || '',
			height   = o.height || 'auto';
		
		//载入容器
		zUI.ui.wrap();
		var h = '';
		h += '<div class="l-ui l-dialog-wrap" id="'+ id +'">';
		h += '	<div class="l-dialog-prompt">'+ text +'</div>';
		h += '</div>';
		$('#l-ui-wrap').prepend(h);
		var zIndex     = zUI.ui.zIndex(),
			dialogWrap = $('#'+id).css({'width':width,'height':height,'z-index':zIndex});
		
		//位置
		var win  = $(window),
			top  = top || win.scrollTop() + win.height()/2 - dialogWrap.height()/2,
			left = left || ( win.width() - dialogWrap.width() )/2;
		dialogWrap.css({top:top,left:left});		
		
		//遮罩
		if( isMask ){
			zUI.ui.lock();
		}
		
		//关闭
		function show(){
			zUI.ui.dialog.close(id);
			if( endFn && typeof endFn === 'function' ){
				endFn();
			}
		};
		setTimeout(show,showTime);
		
	}
};


/**
 * 表单
 * @class zUI.ui.form
 * @extends zUI.ui
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.ui.form = {
	/**
	 * @name ajax无刷文件上传 v1.0
	 * @author norion
	 * @blog http://zkeyword.com/
	 * @update 2013.04.10
	 * @param {object} options
	 * @example 
		//$('#s').click(function(){
			zUI.ui.form.upload({
				trigger: '#s',
				url:'<c:url value="/file/upload.cf"/>?width=200&height=200',
				name:'imgFile',
				onSend: function(){
	                return true;
	        	},
				onComplate: function(data){
					alert(data)
				};
			});
		//});
	 */
	upload: function(options){
		var o = options || {};
		if( !o.trigger ){ return false; };
		var noop       = function(){return true;},
			trigger    = $(o.trigger),                           //触发上传事件的容器
			url        = o.url || '',                            //上传地址
			name       = o.name || 'filedata',                   //文件域名字
			params     = o.params || {},                         //隐藏域数据
			dataType   = o.dataType || 'json',
			onSend     = o.onSend || noop,
			onComplate = o.onComplate || noop,
			iframe     = '',
			form       = '';
		
		trigger.click(function(){
			/*添加form数据域*/
			var formHtml = '<input type="file" id="input-'+ name +'" name="' + name + '" />';
			
			for (key in params) {
				formHtml += '<input type="hidden" name="' + key + '" value="' + params[key] + '" />';
			}
			
			if( !$('#iframe_'+ name).length ){
				$('body').append('<iframe style="position:absolute;top:-9999px" id="iframe_'+ name +'" name="iframe_'+ name +'"></iframe>');
				$('body').append('<form method="post" style="display:none;" enctype="multipart/form-data" id="form_'+ name +'" name="form_'+ name +'" target="iframe_'+ name +'" action="'+ url +'"></form>');
				iframe = $('#iframe_'+ name);
				form   = $('#form_'+ name).html(formHtml);
			}
		
			if(!onSend){
				return;
			}
						
			/*iframe 在提交完成之后*/
			iframe.load(function() {
				var data = $(this).contents().find('body').html().match(/\{.+?\}/);
				if( dataType === 'json' ){
					data = window.eval('(' + data + ')');
				}
				onComplate(data);
				setTimeout(function() {
					iframe.remove();
					form.remove();
				}, 5000);
			});
			
			/*文件框提交动作*/
			var fileInput = $('#input-'+name);
			fileInput.change(function() {
				form.submit();
			});
			fileInput.click();
		});		
	},
	
	/**
	 * @name input file兼容模拟
	 * @author norion
	 * @blog http://zkeyword.com/
	 * @update 2013.12.24
	 * @param {object} options
	 * @example 
		zUI.ui.form.file({
			inputObj:'#uploadfile'
		});
	 */
	file: function(options){
		var o = options || {};
		if( !o.inputObj ) return false;
		var inputObj    = $(o.inputObj).addClass('.l-form-file'),    //input对象
			cls         = o.cls || '',
			inputParent = inputObj.wrap('<div class="l-form-fileWrap"></div>').parent()
																			  .append('<input type="text" class="ui-input l-form-fileInput" /><a href="javascript:;" class="ui-btn ui-btnMain l-form-fileBtn"><span>浏览</span></a>'),
			inputNewObj = inputParent.find('.l-form-fileInput').addClass(cls),
			btnObj      = inputParent.find('.l-form-fileBtn');
			
		inputObj.css({
			position : 'absolute',
			zIndex   : '1',
			top      : 0,
			left     : 0,
			width    : inputParent.width(),
			height   : inputParent.height(),
			opacity  : 0,
			filter   : 'Alpha(opacity:0)',
			cursor   : 'pointer',
			dispaly  : 'block'
		}).change(function () {
			inputNewObj.val(inputObj.val());
		});
			
	},
	
	/**
	 * @name input select兼容模拟
	 * @author norion
	 * @blog http://zkeyword.com/
	 * @update 
	 * @param {object} options
	 * @example 
		zUI.ui.form.select({
			inputObj:'#uploadfile'
		});
	 */
	select: function(options){
		
	}
};


/**
 * placeholder兼容插件
 * @constructor zUI.ui.selectArea
 * @extends zUI.ui
 * @requires zUI.base zUI.base.browser.ie
 * @author norion
 * @blog http://zkeyword.com/
 * @example 
   zUI.ui.placeholder({
	   inputObj:'#input'
   });
 */
zUI.ui.placeholder = function(options){
	var o = options || {};
	if( !o.inputObj ) return false;
	var inputObj   = $(o.inputObj),            //input对象
		inputColor = o.inputColor || '#999',   //value颜色
		isIE       = zUI.base.browser.ie;    //ie浏览器
	if( inputObj.length ){
		var searchValue = inputObj.css({'color':inputColor}).attr('placeholder');
		if( isIE ){
			inputObj.removeAttr('placeholder').val(searchValue).die().live({
				focus:function(){
					if ( inputObj.val() === searchValue ) { inputObj.val(''); };
				},blur:function(){
					if ( inputObj.val() === '' ){ inputObj.val(searchValue); };
				}
			});
		}else{
			inputObj.die().live({
				focus:function(){
					if ( inputObj.attr('placeholder') === searchValue ){ inputObj.attr('placeholder',''); };
				},blur:function(){
					if ( inputObj.attr('placeholder','') ){ inputObj.attr('placeholder',searchValue); };
				}
			});
		}
	}
};


/**
 * 地区切换
 * @constructor zUI.ui.selectArea
 * @extends zUI.ui
 * @requires zUI.base zUI.ui.tab()
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.ui.selectArea = function(options){
	var o = options || {};
	if(!o.wrap){return;}
	var wrap      = $(o.wrap),   //选择地区等代码的容器载体
		initValue = o.initValue, //初始值，即省份和城市的value
		data      = o.data,      //数据源
		callback  = o.callback,  //执行完返回的函数
		isShow    = false;
	var selectAreaFn = {
		init: function(){
			/*初始化数据*/
			var initData          = data,
				initProvinceValue = initValue.province,
				initCityValue     = initValue.city,
				initProvinceName  = '',
				initCityName      = '',
				initCityData      = '',
				initCityHtml      = '',
				i                 = 0,
				l                 = initData.length;
			for(; i < l; i++){
				if( initData[i].Province == initProvinceValue ){
					initProvinceName = initData[i].ProvinceName;
					initCityData     = initData[i];
					for(var j = 0,c = initCityData.CityArray.length; j < c; j++){
						if( initCityData.CityArray[j].City === initCityValue ){
							initCityName = initCityData.CityArray[j].CityName;
						}
						initCityHtml += '<div class="l-selectArea-city-item" value="'+initCityData.CityArray[j].City+'">'+ initCityData.CityArray[j].CityName +'</div>';
					}
				}
			}
			
			/*初始化html*/
			var html = ''; 
				html += '<div class="l-selectArea">';
				html += '	<div class="l-selectArea-selected fn-clear">';
				html += '		<div class="l-selectArea-selectedProvince fn-left" value="'+ initProvinceValue +'">'+ initProvinceName +'</div>';
				html += '		<div class="l-selectArea-selectedCity fn-left" value="'+ initCityValue +'">'+ initCityName +'</div>';
				html += '	</div>';
				html += '	<div class="l-selectArea-wrap fn-hide fn-clear">';
				html += '		<ul class="l-selectArea-tab fn-clear">';
				html += '			<li class="l-selectArea-tab-province" value="'+ initProvinceValue +'">'+ initProvinceName +'</li>';
				html += '			<li class="l-selectArea-tab-city on" value="'+ initCityValue +'">'+ initCityName +'</li>';
				html += '		</ul>';
				html += '		<div class="l-selectArea-main">';
				html += '			<div class="l-selectArea-mainItem l-selectArea-province fn-clear"></div>';
				html += '			<div class="l-selectArea-mainItem l-selectArea-city fn-clear"></div>';
				html += '		</div>';
				html += '	</div>';
				html += '</div>';
			wrap.html(html);
			
			/*载入初始城市*/	
			var initCityWrap = wrap.find('.l-selectArea-city').html(initCityHtml);
			selectAreaFn.selectCity(initProvinceValue,initProvinceName);
			
			/*载入省份*/
			selectAreaFn.getProvince();
			
			/*显示隐藏*/
			var selected = wrap.find('.l-selectArea-selected'),
				areaWrap = wrap.find('.l-selectArea');
			selected.bind('click',function(){
				selectAreaFn.show();
			});
			areaWrap.live('mouseover',function(){
				isShow = true;
			}).live('mouseout',function(){
				isShow = false;
			});
			$(document).bind('click',function(){
				if( !isShow ){
					selectAreaFn.hide();
				}
			});
			
			/*tab*/
			zUI.ui.tab({
				tabItem:'.l-selectArea-tab li',
				tabWrap:'.l-selectArea-mainItem',
				tabEvent:'click',
				tabIndex:1
			});
		},
		
		/*获取省*/
		getProvince: function(){
			var html         = '',
				provinceWrap = wrap.find('.l-selectArea-province'),
				cityWrap     = wrap.find('.l-selectArea-city'),
				provinceData = data;
			for(var i = 0,p = provinceData.length; i < p; i++){
				html += '<div class="l-selectArea-province-item" value='+provinceData[i].Province+'>'+ provinceData[i].ProvinceName +'</div>';
			}
			provinceWrap.html(html);
			
			/*载入城市*/
			var provinceItem    = provinceWrap.find('.l-selectArea-province-item'),
				cityTabWrap     = wrap.find('.l-selectArea-tab-city'),
				provinceTabWrap = wrap.find('.l-selectArea-tab-province');
			provinceItem.click(function(){
				selectAreaFn.getCity( $(this).attr('value'), $(this).html(), provinceItem.index($(this)) );
				cityTabWrap.html('请选择城市').addClass('l-selectArea-tab-city-noSelected');
				provinceTabWrap.html( $(this).html() );
				provinceWrap.hide();
				cityWrap.show();
			}).hover(function(){
				$(this).addClass('l-selectArea-item-over');
		    },function(){
		    	$(this).removeClass('l-selectArea-item-over');
		    });
		},
		
		/*获取城市*/
		getCity: function(provinceValue,provinceName,cityIndex){
			var html        = '',
				cityTabWrap = wrap.find('.l-selectArea-tab-city').addClass('on').siblings().removeClass('on'),
				cityWrap    = wrap.find('.l-selectArea-city'),
				cityData    = data[cityIndex];
		    for(var i = 0, c = cityData.CityArray.length; i < c; i++){
			   html += '<div class="l-selectArea-city-item" value="'+cityData.CityArray[i].City+'">'+ cityData.CityArray[i].CityName +'</div>';
		    }
		    cityWrap.html(html);
		    selectAreaFn.selectCity(provinceValue,provinceName);
		},
		
		/*选择城市*/
		selectCity: function(provinceValue,provinceName){
		    var cityItem         = wrap.find('.l-selectArea-city-item'),
		    	cityTabWrap      = wrap.find('.l-selectArea-tab-city'),
		    	selectedProvince = wrap.find('.l-selectArea-selectedProvince'),
		    	selectedCity     = wrap.find('.l-selectArea-selectedCity');
		    cityItem.click(function(){
		    	cityTabWrap.html( $(this).html() ).addClass('on').removeClass('l-selectArea-tab-city-noSelected').siblings().removeClass('on');
		    	selectAreaFn.hide();
		    	selectedProvince.html( provinceName  );
		    	selectedCity.html( $(this).html() );
		    	if( zUI.base.isFunction(callback) ){
		    		callback( provinceValue, $(this).attr('value') );
		    	}
		    }).hover(function(){
		    	$(this).addClass('l-selectArea-item-over');
		    },function(){
		    	$(this).removeClass('l-selectArea-item-over');
		    });
		},
		
		/*显示地区框*/
		show: function (){
			wrap.find('.l-selectArea-selected').addClass('l-selectArea-selected-on');
			wrap.find('.l-selectArea-wrap').removeClass('fn-hide');
		},
		
		/*隐藏地区框*/
		hide: function(){
			wrap.find('.l-selectArea-selected').removeClass('l-selectArea-selected-on');
			wrap.find('.l-selectArea-wrap').addClass('fn-hide');
			//城市没选择直接重载selectAreaFn.init()
			if(  wrap.find('.l-selectArea-tab-city-noSelected').length ){
				selectAreaFn.init();
			}
		}
	};//end selecAreaFn
	
	selectAreaFn.init();
};


/**
 * 常用功能
 * @class zUI.app 一些常用的小功能，如加入收藏夹之类
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 */
zUI.app = {};


/**
 * 向上切换
 * @constructor zUI.app.marqueeUp
 * @extends zUI.app
 * @requires zUI.base
 * @example 
	zUI.app.marqueeUp('#index-shortcutBox');
	dom: 
		<div id="index-shortcutBox">
			<ul class="fn-clear">
				<li><a href="#" class="index-shortcutBox-item index-shortcutBox-item1">zUI咨询</a></li>
				<li><a href="#" class="index-shortcutBox-item index-shortcutBox-item2">zUI服务</a></li>
			</ul>
			<ul class="fn-clear">
				<li><a href="#" class="index-shortcutBox-item index-shortcutBox-item9">zUI管理咨询</a></li>
			</ul>
		</div>
*/
zUI.app.marqueeUp = function(obj){
	//多行应用@Mr.Think
	var _wrap = $(obj);//定义滚动区域
	var _interval=3000;//定义滚动间隙时间
	var _moving;//需要清除的动画
	_wrap.hover(function(){
		clearInterval(_moving);//当鼠标在滚动区域中时,停止滚动
	},function(){
		_moving=setInterval(function(){
			var _field=_wrap.find('ul:first');//此变量不可放置于函数起始处,li:first取值是变化的
			var _h=_field.height();//取得每次滚动高度
			_field.animate({marginTop:-_h+'px'},600,function(){//通过取负margin值,隐藏第一行
				_field.css('marginTop',0).appendTo(_wrap);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
			});
		},_interval);//滚动间隔时间取决于_interval
	}).trigger('mouseleave');//函数载入时,模拟执行mouseleave,即自动滚动
};

/**
 * 滚动的幻灯片
 * @constructor zUI.app.slides
 * @extends zUI.app
 * @requires zUI.base
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标容器，用来放置幻灯片容器
 * @param {boolean} options.isBtn 是否需要按钮，默认true
 * @param {boolean} options.isArrow 是否需要箭头，默认true
 * @param {boolean} options.index 幻灯片索引，默认从第一个开始，也就是0
 * @param {number} options.time 幻灯片切换时间，默认为3000ms
 * @param {boolean} options.isAuto 是否自动播放，默认true
 * @param {string} options.direction 向左还是向上切换，选项up、left，默认up
 */
zUI.app.slides = function(options){
	var o = options || {};
	if(!o.trigger){return;}
	var trigger     = $(o.trigger),
		isBtn       = o.isBtn === undefined ? true : o.isBtn,
		isArrow     = o.isArrow === undefined ? true : o.isArrow, //是否需要箭头
		index       = o.index ? o.index : 0,
		time        = o.time ? o.time : 3000,
		direction   = o.direction ? o.direction : 'up',
		timer       = null,
		isAuto      = o.isAuto === undefined ? true : o.isAuto,
		content     = trigger.find(o.content),
		item        = content.find('li'),
		itemLen     = item.length,
		itemHeight  = item.height(),
		itemWidth   = item.width(),
		createBtn   = function(){
							var i    = 0,
								html = '';
							for(; i < itemLen; i++){
								html += '<li'+ ( index === i ? ' class="on"' : '' ) +'>'+ (i+1) +'</li>';
							}
							var btnWrap = trigger.append('<ul class="l-ui-slidesBtn"></ul>')
										      .find('.l-ui-slidesBtn')
										      .append(html),   
							    btnItem = btnWrap.find('li')
												 .css({filter:'Alpha(opacity=50)'})
										         .mousemove(function(){
													index = btnItem.index( $(this) );
													switchable();
													clearInterval(timer);
												})
												.mouseout(function(){
													clearInterval(timer);
													timer = setInterval(function(){
														autoFn();
													}, time);
												});
						},
		createArrow = function(){
							var arrowWrap = trigger.append('<div class="l-ui-slidesArrow"><a href="javascript:;" class="l-ui-slidesArrow-btn l-ui-slidesArrow-left">&lt;</a><a href="javascript:;" class="l-ui-slidesArrow-btn l-ui-slidesArrow-right">&gt;</a></div>'),
								arrowItem = arrowWrap.find('a')
													 .css({filter:'Alpha(opacity=50)'})
													 .click(function(){
														/*判断点击左侧还是右侧*/
														if( $(this).hasClass('l-ui-slidesArrow-right') ){
															index++;
															if( index === itemLen ){
																index = 0;
															}
														}else{
															if( index === 0 ){
																index = itemLen;
															}
															--index;
														}
														switchable();
														clearInterval(timer);
													 })
													 .mouseout(function(){
														clearInterval(timer);
														timer = setInterval(function(){
																	autoFn();
																}, time);
													 });
						},
		autoFn      = function(){
							if(isAuto){
								if(index === itemLen){
									index = 0;
								}
								switchable();
								index ++;
							}
					    },
		switchable  = function(){

							/*判断方向*/
							if( direction === 'up' ){
								var marginTop = -index * itemHeight;
								content.stop().animate({top:marginTop}, 800);
							}else{
								var marginLeft = -index * itemWidth;
								item.css({float:'left'});
								content.stop().animate({left:marginLeft}, 800);
							}
							
							/*有按钮时*/
							if( isBtn ){
								trigger.find('.l-ui-slidesBtn li')
									   .eq(index)
									   .addClass('on')
									   .siblings()
									   .removeClass('on');
							}
						}
		
		/*创建按钮*/
		if( isBtn ){
			createBtn();
		}
		
		/*创建箭头*/
		if( isArrow ){
			createArrow();
		}
		
		/*初始化*/
		timer = setInterval(function(){
			autoFn();
		}, time);
};

/**
 * EmailSuggest 邮箱建议
 * @constructor zUI.app.emailsuggest
 * @extends zUI.app
 * @requires zUI.base
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标对象，最后返回的值将传给该对象
 * @param {Object} options.data 邮箱数据
 * @example 
	js:
		var arr = [
					'163.com',
					'126.com',
					'qq.com',
					'yahoo.com.cn',
					'qq1.com',
					'gmail.com',
					'sohu.com',
					'qq2.com',
					'hotmail.com'
				];
		zUI.app.emailsuggest({
			data: arr,
			trigger: '#email'
		});
	dom: 
		<input type="text" id="email" class="ui-input" />
*/
zUI.app.emailsuggest = function(options){
	var o = options || {};
	if(!o.trigger){return;}
	var trigger  = $(o.trigger).attr('autocomplete','off'),
		data     = o.data || ['163.com', '126.com', 'qq.com', 'yahoo.com.cn', 'gmail.com', 'sohu.com', 'hotmail.com'],
		parent   = trigger.wrap('<div class="l-app-emailsuggestWrap"></div>').parent().append('<div class="l-app-emailsuggestList"></div>'),
		listWrap = parent.find('.l-app-emailsuggestList').css({top:trigger.outerHeight() - 1, width:trigger.outerWidth()}).attr('index', 0),
		createFn = function(val, arr){
						var arr = arr === undefined ? data : arr,
							len = arr.length,
							str = '',
							i   = 0;
						for(; i<len; i++){
							str += '<li>'+ val +'@' + arr[i] + '</li>';
						}
						listWrap.show().html('<ul>'+str+'</ul>');
					},
		keymove  = function(isDown){
						var item = listWrap.find('li'),
							len  = item.length;
						if( isDown ){
							var index = listWrap.attr('index') == len ? 0 : listWrap.attr('index');
							item.eq(index++).addClass('current');
							listWrap.attr('index', index);
						}else{
							var index = listWrap.attr('index') == 0 ? len : listWrap.attr('index');
							item.eq(--index).addClass('current');
							listWrap.attr('index', index);
						}
					},
		closeFn  = function(){
						listWrap.hide().html('').attr('index', 0);
					}
	
	trigger.keyup(function(e){
		var v = trigger.val(),
			v = v.trim(v),
			s = v.replace(/@.*/, ""),
			k = e.keyCode;

		if( s.length ){
			
			if( /@/.test(v) ){
				/*重写data数组*/
				var str = v.replace(/.*@/, ""),
					arr = $.map(data, function(n){
								var reg = new RegExp(str);	
								if(reg.test(n)){
									return n;	
								}
							});
				createFn(s, arr);
			}else{
				createFn(s);
			}
			
			/*键盘事件处理*/
			switch( k ){
				case 40: //向下
					keymove(true);
					e.preventDefault();
				break;
				
				case 38: //向上
					keymove(false);
					e.preventDefault();
				break;
				
				case 13: //回车
					var index = listWrap.attr('index') - 1;
					trigger.val( listWrap.find('li').eq(index).html() );
					e.preventDefault();
					closeFn();
				break;
				
				default:
					listWrap.attr('index', 0)
			}
			
			/*鼠标事件处理*/
			listWrap.find('li').click(function(){
				trigger.val( $(this).html() );
				closeFn();
			}).hover(function(){
				$(this).addClass('current');
			},function(){
				$(this).removeClass('current');
			});
		}else{
			closeFn();
		}
	});
};

/**
 * Slider 滑动条
 * @constructor zUI.app.slider
 * @extends zUI.app 
 * @requires zUI.base zUI.ui.mousePosition()
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标对象
 * @param {number} options.min 最小值
 * @param {number} options.max 最大值
 * @param {number} options.ratio 默认占比，其中默认占比和默认值互斥，两个都有设置时，忽略值
 * @param {number} options.value 默认值
 * @param {string} options.axis 滑动方向，可选为x、y，默认x
 * @example 
	js:
		zUI.app.slider({
			trigger: '#slider',
			callback: function(val){
				$('#demoText').html(val);
			}
		})
	dom: 
		<div class="l-sliderWrap fn-left" id="slider">
			<div class="l-sliderBtn"></div>
			<div class="l-sliderComplete"></div>
		</div>
		<div id="demoText" class="demoText"></div>
*/
zUI.app.slider = function(options){
	var o = options || {};
	if(!o.trigger){return;}
	var trigger  = $(o.trigger),
		min      = o.min === undefined ? -100 : o.min,
		max      = o.max === undefined ? 100 : o.max,
		ratio    = o.ratio || 0,                       //默认占比，其中默认占比和默认值互斥，两个都有设置时，忽略值
		value    = o.value || 0,                       //默认值
		axis     = o.axis || 'x',                      //滑动方向
		isX      = axis === 'x',
		callback = o.callback,                         //返回函数
		triggerW = trigger.width(),                    //容器宽度
		triggerH = trigger.height(),                   //容器高度
		complete = trigger.find('.l-sliderComplete'),  //刻度
		btn      = trigger.find('.l-sliderBtn'),       //按钮宽度
		btnW     = btn.width(),                        //按钮宽度
		btnH     = btn.height(),                       //按钮高度
		offset   = btn.offset(),
		triggerT = offset.top,
		triggerL = offset.left,
		isMove   = false,                              //是否移动
		setValue = function(val, isComputed){
						var total = isX ? (triggerW - btnW) : (triggerH - btnH) //容器大小
						if( isComputed ){
							var number         = isX ? (val - btnW) : (val - btnH),           //游标位置
								currentValue   = min + number/total * (max - min),            //当前值
								currentPercent = number/total*100;                            //当前百分比
						}else{
							// 初始化
							if( o.value && o.ratio === undefined ){
								var number         = (value - min) * total / (max - min),
									currentValue   = value,
									currentPercent = number/total*100;
							}else{
								var number         = val/100*total,
									currentValue   = min + number/total * (max - min),
									currentPercent = val;
							}
						}
							
						if( isX ){
							btn.css({left:number});
							complete.css({width:number, height:'100%'});
						}else{
							btn.css({top:number})
							complete.css({width:'100%', height:number});
						}
						
						if( zUI.base.isFunction(callback) ){
							var obj = {
								val : currentValue.toFixed(0),    //当前值
								per : currentPercent.toFixed(0)+'%'  //当前百分比
							}
							callback(obj);
						}
					},
		drag     = function(e){
						var e        = window.event || e,
						    position = zUI.ui.mousePosition(),
							x        = position.positionX - triggerL,
							y        = position.positionY - triggerT,
							btnV     = isX ? btnW : btnH,
							val      = isX ? x : y,
							triggerV = isX ? triggerW : triggerH;
							
						if( val < btnV ){
							setValue(btnV, true);
						}else if(val > triggerV){
							setValue(triggerV, true);
						}else{
							setValue(val, true);
						}
					}
					
	//初始化
	setValue(ratio, false);
	
	btn.mousedown(function(e){
		isMove = true;
		var e = window.event || e;
		if(window.event){
			e.cancelBubble = true;
		}else{
			e.stopPropagation();
		}
		e.preventDefault(); //阻止默认动作
	});

	$(document).bind('mousemove', function(){
		if( isMove ){
			drag();
		}
	}).bind('mouseup', function(){
		isMove = false;
	});
	
	trigger.mousedown(function(e){
		drag();
	});
	
};

/**
 * sortable 拖拽排序（目前只支持一个单个拖拽）
 * @constructor zUI.app.sortable
 * @extends zUI.app
 * @requires zUI.base zUI.ui.zIndex() zUI.ui.mousePosition() zUI.ui.wrap()
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标对象
 * @example 
	js:
		zUI.app.sortable({
			trigger: '#sortable2'
		});
	dom: 
		<div class="l-sortableWrap fn-left" id="sortable2">
			<div class="l-sortableItem">1</div>
			<div class="l-sortableItem">2</div>
			<div class="l-sortableItem">3</div>
			<div class="l-sortableItem">4</div>
			<div class="l-sortableItem">5</div>
		</div>
*/
zUI.app.sortable = function(options){
	var o = options || {};
	if(!o.trigger){return;}
	var trigger  = $(o.trigger),
		callback = o.callback,                         //返回函数
		item     = trigger.find('.l-sortableItem'),     //按钮宽度
		//connect  = o.connect ? o.connect : null,
		current  = null,
		isMove   = false,
		start    = function(){
						/*插入容器*/
						zUI.ui.wrap();
						
						var offset = current.css({opacity:'0.3'})
											.offset(),
							top    = offset.top,
							left   = offset.left,
							width  = current.width(),
							height = current.height(),
							zIndex = zUI.ui.zIndex(),
							proxy  = $('#l-ui-wrap').append('<div id="l-sortable-proxy"></div>')
													.find('#l-sortable-proxy')
													.css({width:width, height:height, zIndex: zIndex, top:top, left:left});
					},
		end      = function(){
						current.animate({opacity : '1'});
						$('#l-sortable-proxy').remove();
						if( zUI.base.isFunction(callback) ){
							callback();
						}
					},
		drag     = function(e){
						var next     = current.next(),
							prev     = current.prev(),
							offset   = current.offset(),
							top      = offset.top,
							left     = offset.left,
							width    = current.outerWidth(),
							height   = current.outerHeight(),
							e        = window.event || e,
						    position = zUI.ui.mousePosition(),
							x        = position.positionX,
							y        = position.positionY;
						
						switch (true) {
							case y < top - height:
								prev.before(current);
								break;
							case y > top + height:
								next.after(current);
								break;
						}
						
						// if( connect ){
							// $(connect).find('.l-sortableItem').bind('mouseover', function(){
								// $(this).after(current);
								// console.log('ss')
							// })
						// }

						//移动虚线框
						$('#l-sortable-proxy').css({top:y, left:x});
					}	
	
	/*拖拽开始*/
	item.bind('mousedown', function(e){
		isMove  = true;
		current = $(this);
		start();
		e.preventDefault(); //阻止默认动作
	});
	
	$(document).bind('mousemove', function(){
		if( isMove ){
			drag();
		}
	}).bind('mouseup', function(){
		if( isMove ){
			end();
			isMove  = false;
		}
	});		
};


/**
 * zoom 图片放大
 * @class zUI.app.BaseZoom
 * @constructor
 * @extends zUI.app
 * @requires zUI.ui.mousePosition()
 * @author norion
 */

zUI.app.BaseZoom = function(){
	var g = this;
	
	/**
	 * 目标原图
	 * @member zUI.app.BaseZoom
	 */
	this.trigger = {};
	
	/**
	 * 大图对象
	 * @member zUI.app.BaseZoom
	 */
	this.big = {};
	
	/**
	 * 初始化
	 * @member zUI.app.BaseZoom
	 * @param {Object} options.options 目标对象
	 * @param {Number} options.bigHeight 大图高度
	 * @param {Boolean} options.bigWidth 大图宽度
	 * @return {Object} zUI.app.BaseZoom
	 */
	this.init = function(options){
		var o = options || {};
		if(!o.trigger){return;}
		var trigger  = $(o.trigger).addClass('l-ui-zoom'),
			offset   = trigger.offset(),
			triggerT = offset.top,
			triggerL = offset.left,
			triggerH = trigger.height(),
			triggerW = trigger.width(),
			wrap     = trigger.wrap('<div class="l-ui-zoomWrap" style="height:'+ triggerH +'px;width:'+ triggerW +'px;"></div>')
							  .parent(),
			big      = wrap.append('<div class="l-ui-zoomBig"><img src="'+ trigger.find('img').attr('zoom') +'" /></div>')
						   .find('.l-ui-zoomBig'),
			bigH     = o.bigHeight || 350,
			bigW     = o.bigWidth || 350,			   
			mask     = wrap.append('<div class="l-ui-zoomMask"></div>')
						   .find('.l-ui-zoomMask'),
			maskH    = mask.outerHeight(),
			maskW    = mask.outerWidth();
			
		wrap.mouseover(function(){
				big.css({display:'block', left:triggerW + 10, width:bigW, height:bigH});
				mask.css({display:'block', filter:'Alpha(opacity=40)'});
			})
			.mousemove(function(e){
				var e        = window.event || e,
					position = zUI.ui.mousePosition(),
					px       = position.positionX,
					py       = position.positionY,
					x        = px - maskW/2 - triggerL,
					y        = py - maskH/2 - triggerT,
					l        = x < 0 ? 0 : x > triggerW - maskW ? triggerW - maskW : x,
					t        = y < 0 ? 0 : y > triggerH - maskH ? triggerH - maskH : y,
					bigImg   = big.find('img'),
					bigImgH  = bigImg.outerHeight(),
					bigImgW  = bigImg.outerWidth(),
					bigL     = l / (triggerW - maskW) * (bigW - bigImgW),
					bigT     = t / (triggerH - maskH) * (bigH - bigImgH);
					
				if( px <= triggerL + triggerW && px >= triggerL && py <= triggerT + triggerH && py >= triggerT){
					bigImg.css({top:bigT, left:bigL, position:'absolute'});
					mask.css({top:t, left:l});
				}else{
					big.hide();
					mask.hide();
				}
			}).mouseout(function(){
				big.hide();
				mask.hide();
			});
			
		g.trigger = trigger;
		g.big = big;
			
		return g;
	};
	
	/**
	* 刷新
	* @member zUI.app.BaseZoom
	* @param {string} 要刷新的html
	* @return {Object} zUI.app.BaseZoom
	*/
	this.reflash = function(html){
		var trigger = g.trigger,
			big     = g.big;
		trigger.html(html);
		big.html('<img src="'+ trigger.find('img').attr('zoom') +'" />')
		return g;
	};
};
zUI.app.zoom = function(options){
	var zoom = new zUI.app.BaseZoom();
	zoom.init(options);
	return zoom;
};

/**
 * 日历
 * @constructor zUI.app.calendar
 * @extends zUI.app
 * @requires zUI.base
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标对象
 * @param {number} options.top 相对于trigger的y坐标
 * @param {number} options.left 相对于trigger的x坐标
 * @param {Object} options.callback 回调函数
 * @param {number} options.beginYear 开始年
 * @param {number} options.endYear 结束年
 * @param {Object} options.language 语言数据
 * @param {string} options.dateFormat 时间格式，选项yyyy-MM-dd hh:mm:ss \ yyyy-MM-dd，默认yyyy-MM-dd hh:mm:ss
 * @param {Object} options.date 时间数据，默认本地时间
 * @example 
	zUI.app.calendar({
		trigger:'#calendar',
		dateFormat:'yyyy-MM-dd hh:mm:ss',
		beginYear:'1970',
		endYear:'2030',
		callback: function(time){
			alert(time)
		}
	});
 */
zUI.app.calendar = function(options){
	var o = options || {};
	if(!o.trigger){return;}
	var trigger    = $(o.trigger).wrap('<div class="l-ui-calendarWrap"></div>'),
		wrap       = trigger.parent(),
		top        = o.top || trigger.outerHeight(),
		left       = o.left || 0,
		main       = wrap.append('<div class="l-ui-calendarMain" style="top:'+ top +'px;left:'+ left +'px"></div>')
						 .find('.l-ui-calendarMain'),
		callback   = o.callback,
		beginYear  = Number(o.beginYear) || 1980,
		endYear    = Number(o.endYear) ||  2050,
		language   = o.language || {
										next: '上个月',
										prev: '下个月',
										submit: '提交',
										year: '年',
										month: '月',
										time: '时间',
										weeks: ['日', '一', '二', '三', '四', '五', '六']
									},
		days       = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		weeks      = language.weeks,
		months     = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		dateFormat = o.dateFormat || 'yyyy-MM-dd hh:mm:ss',
		date       = o.date || new Date(),
		globalDate = date,
		isShowTime = /(h+)/.test(dateFormat),
		
		/**
		 * 日历内部构造
		 * @private
		 */
		_core      = {
						/**
						 * 格式化日期
						 * @param {Number} 年
						 * @param {Number} 月
						 * @param {Number} 日
						 * @param {Number} 小时
						 * @param {Number} 分钟
						 * @param {Number} 秒钟
						 * @param {Number} 周
						 * @param {Number} 四季
						 * @param {Number} 毫秒
						 */
						format: function(year, month, day, hour, minute, second, week, quarter, millisecond){
							var o = {
									// "M+" : month + 1 || date.getMonth() + 1,                                       //month
									// "d+" : day || date.getDate(),                                                  //day
									// "h+" : hour || date.getHours(),                                                //hour
									// "m+" : minute || date.getMinutes(),                                            //minute
									// "s+" : second || date.getSeconds(),                                            //second
									// "w+" : weeks[week] || weeks[date.getDay()],                                    //week
									// "q+" : Math.floor((quarter + 3) / 3) || Math.floor((date.getMonth() + 3) / 3), //quarter
									// "S"  : millisecond || date.getMilliseconds()                                   //millisecond
									'M+': month + 1,
									'd+': day,
									'h+': hour,
									'm+': minute,
									's+': second,
									'w+': weeks[week],
									'q+': Math.floor((quarter + 3) / 3),
									'S' : millisecond
								},
								year = year.toString(),
								str  = dateFormat;
								
							if( /(y+)/.test(str) ){
								str = str.replace(/(y+)/, year.substr(4 - Math.min(4, RegExp.$1.length)));
							}
							for( var k in o ){
								if(	new RegExp("("+ k +")").test(str) ){
									if(	o[k] !== undefined && !isNaN(o[k]) ){
										str = str.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
									}else{
										str = str.replace(/\s[^\d](.)*/, '')
									}
								}
							}
							return str;
						},
					
						/**
						 * 判断闰年
						 * @param {Number} 年
						 */
						isLeapYear: function(y){
							if((y % 400 === 0) || (y % 100 !== 0) && (y % 4 === 0)){
								return true;
							}
							return false;
						},
						
						/**
						 * 获取月份天数
						 * @param {Number} 年
						 * @param {Number} 月
						 */
						getDayCount: function(y, m){
							if( _core.isLeapYear(y, m) ){
								days[1] = 29;
							}else{
								days[1] = 28;
							}
							return days[m];
						},
						
						/**
						 * 获取新date
						 * @param {Number} 年
						 * @param {Number} 月
						 * @param {Number} 日
						 */
						getNewDate: function(y, m, d) {
							var newDate = new Date();
							newDate.setFullYear(y, m, d);
							// !isNaN(y) && newDate.setFullYear(y);
							// !isNaN(m) && newDate.setMonth(m);
							// !isNaN(d) && newDate.setDate(d);
							return newDate;
						},
						
						/**
						 * 获取上下月
						 * @param {Number} 递增活递减
						 */
						getPrevNextMonth: function(poor){
							var y = globalDate.getFullYear(),
								m = globalDate.getMonth() + poor;
							if(m < 0){
								y -= 1;
								m = 11;
							}else if(m > 11){
								y += 1;
								m = 0;
							}
							return _core.getNewDate(y, m, 1);
						},
						
						/**
						 * 获取上月
						 * @param {return} _core.getPrevNextMonth(-1)
						 */
						getPrevDate: function(){
							return _core.getPrevNextMonth(-1);
						},
						
						/**
						 * 获取上月
						 * @param {return} _core.getPrevNextMonth(1);
						 */
						getNextDate: function(){
							return _core.getPrevNextMonth(1);
						},
						
						/**
						 * 创建头部
						 */
						createHeader: function(){
							var html     = '',
								yearLen  = endYear - beginYear,
								i        = 0,
								monthLen = 12,
								n        = 0;
								
							html += '<a class="l-ui-calendarHeader-btn l-ui-calendarHeader-prev" href="javascript:;" title="'+ language.prev +'"></a>';
							html += '<div class="l-ui-calendarHeader-text">';
							html += '<select class="l-ui-calendarHeader-year">';
							for(; i < yearLen; i++){
								var year = beginYear + i;
								if( year === globalDate.getFullYear() ){
									html += '<option value="'+ year +'" selected>'+ year +'</option>';
								}else{
									html += '<option value="'+ year +'">'+ year +'</option>';
								}
							}
							html += '</select>' + language.year;
							html += '<select class="l-ui-calendarHeader-month">';
							for(; n < monthLen; n++){
								var month = months[n];
								if( n === globalDate.getMonth() ){
									html += '<option value="'+ n +'" selected>'+ month +'</option>';
								}else{
									html += '<option value="'+ n +'">'+ month +'</option>';
								}
							}
							html += '</select>' + language.month;
							html += '</div>';
							html += '<a class="l-ui-calendarHeader-btn l-ui-calendarHeader-next" href="javascript:;" title="'+ language.next +'"></a>';
							
							return '<div class="l-ui-calendarHeader fn-clear">'+ html +'</div>';
						},
						
						/**
						 * 创建周
						 */
						createWeeks: function(){
							var html = '',
								i    = 0;
							html += '<div class="l-ui-calendarWeeks fn-clear">';
							for(; i < 7; i++){
								if( i == 0 ){
									html += '<span class="l-ui-calendarWeek l-ui-calendarWeek-sunday">'+ weeks[i] +'</span>';
								}else if( i == 6 ){
									html += '<span class="l-ui-calendarWeek l-ui-calendarWeek-saturday">'+ weeks[i] +'</span>';
								}else{
									html += '<span class="l-ui-calendarWeek">'+ weeks[i] +'</span>';
								}
							}
							html += '</div>';
							return html;
						},
						
						/**
						 * 创建日
						 */
						createDays: function(){
							var //year       = date.getFullYear(),
								//month      = date.getMonth(),
								day        = date.getDate(),
								curYear    = globalDate.getFullYear(),              //当前全局date对象
								curMonth   = globalDate.getMonth(),
								curDay     = globalDate.getDate(),
								curDayNum  = _core.getDayCount(curYear, curMonth),
								prevDate   = _core.getPrevDate(),                    //获取上月的date
								prevYear   = prevDate.getFullYear(),
								prevMonth  = prevDate.getMonth(),
								prevDayNum = _core.getDayCount(prevYear, prevMonth),
								nextDate   = _core.getNextDate(),                    //获取下月的date
								nextYear   = nextDate.getFullYear(),
								nextMonth  = nextDate.getMonth(),
								lastWeek   = new Date(curYear, curMonth, 1).getDay(), //获取本月1号的星期数
								html       = '',
								p          = prevDayNum - lastWeek +1,               //上月剩余天数(礼拜从礼拜日算起)
								nextDayNuM = 42 - lastWeek - curDayNum,              //下月剩余天数
								i          = 1,
								n          = 1;

							for(; p <= prevDayNum; p++) {
								var prevDayStr =  _core.format(prevYear, prevMonth, p);
								html += '<a href="javascript:;" class="l-ui-calendarDay l-ui-calendarDay-prev l-ui-calendarDay-disable" title="'+ prevDayStr +'" year="'+ prevYear +'" month="'+ prevMonth +'">'+ p +'</a>';
							}
							
							for(; i <= curDayNum; i++){
								var cls       = '',
									curDayStr = _core.format(curYear, curMonth, i)
								if( day === i ){
									cls = ' l-ui-calendarDay-current'
								}
								html += '<a href="javascript:;" class="l-ui-calendarDay'+ cls +'" title="'+ curDayStr +'" year="'+ curYear +'" month="'+ curMonth +'">'+ i+'</a>';
							}
							
							for(; n <= nextDayNuM; n++) {
								var nextDayStr =  _core.format(nextYear, nextMonth, n);
								html += '<a href="javascript:;" class="l-ui-calendarDay l-ui-calendarDay-next l-ui-calendarDay-disable" title="'+ nextDayStr +'" year="'+ nextYear +'" month="'+ nextMonth +'">'+ n +'</a>';
							}
											
							return '<div class="l-ui-calendarDays fn-clear">'+ html +'</div>';
						},
						
						/**
						 * 创建时间
						 */
						createTime: function(){
							var hour       = date.getHours(),
								minute     = date.getMinutes(),
								second     = date.getSeconds(),
								hourHtml   = '',
								minuteHtml = '',
								secondHtml = '',
								h          = 0,
								m          = 0,
								s          = 0;
								
							hour   = hour < 10 ? '0' + hour  : hour;
							minute = minute < 10 ? '0' + minute  : minute;
							second = second < 10 ? '0' + second  : second;
							
							for(; h < 24; h++){
								hourHtml += '<a href="javascript:;">'+ (h < 10 ? '0' + h  : h) +'</a>';
							}
							
							for(; m < 60; m++){
								minuteHtml += '<a href="javascript:;">'+ (m < 10 ? '0' + m  : m) +'</a>';
							}
							
							for(; s < 60; s++){
								secondHtml += '<a href="javascript:;">'+ (s < 10 ? '0' + s  : s) +'</a>';
							}
								
							return  '<div class="l-ui-calendarTime fn-clear">' +
										'<div class="l-ui-calendarTimeTitle">'+ language.time +':</div>' + 
										'<div class="l-ui-calendarTimeWrap fn-clear">' +
											'<div class="l-ui-calendarTime-timeWrap l-ui-calendarTime-hourWrap">' +
												'<input type="text" class="l-ui-calendarTime-hourInput" value="'+ hour +'" /><span>:</span>' +
												'<div class="l-ui-calendarTime-hour">'+ hourHtml +'</div>' +
											'</div>' + 
											'<div class="l-ui-calendarTime-timeWrap l-ui-calendarTime-minuteWrap">' + 
												'<input type="text" class="l-ui-calendarTime-minuteInput" value="'+ minute +'" /><span>:</span>' + 
												'<div class="l-ui-calendarTime-minute">'+ minuteHtml +'</div>' + 
											'</div>' + 
											'<div class="l-ui-calendarTime-timeWrap l-ui-calendarTime-secondWrap">'  +
												'<input type="text" class="l-ui-calendarTime-secondInput" value="'+ second +'" />' + 
												'<div class="l-ui-calendarTime-second">'+ secondHtml +'</div>' + 
											'</div>'  +
										'</div>' + 
										'<a href="javascript:;" class="l-ui-calendarTimeBtn">'+ language.submit +'</a>' +
									'</div>';
						},
						
						/**
						 * 点击下个月
						 */
						clickNext: function(){
							globalDate = _core.getPrevNextMonth(1);
							_core.init();
						},
						
						/**
						 * 点击上个月
						 */
						clickPrev: function(){
							globalDate = _core.getPrevNextMonth(-1);
							_core.init();
						},
						
						/**
						 * 年月选择
						 */
						clickYearMonth: function(year, month){
							globalDate = new Date(year, month, 1);
							_core.init();
						},
						
						/**
						 * 关闭日历
						 */
						close: function(val){
							trigger.val(val);
							main.hide();
							if( zUI.base.isFunction(callback) ){
								callback(val);
							}
						},
			 
						/**
						 * 初始化函数
						 */
						init: function(){
							main.html(_core.createHeader() + _core.createWeeks() + _core.createDays());
							
							main.find('.l-ui-calendarHeader-prev').click(function(){
								_core.clickPrev();
							});
							main.find('.l-ui-calendarHeader-next').click(function(){
								_core.clickNext();
							});

							main.find('.l-ui-calendarHeader-month').change(function(){
								var year  = main.find('.l-ui-calendarHeader-year').val(),
									month = $(this).val();
								_core.clickYearMonth(year, month);
							});
							main.find('.l-ui-calendarHeader-year').change(function(){
								var year  = $(this).val(),
									month = main.find('.l-ui-calendarHeader-month').val();
								_core.clickYearMonth(year, month);
							});
							
							main.find('.l-ui-calendarDay').each(function(i){
								var saturday = i%7 === 6 ? ' l-ui-calendarDay-saturday' : '',
									sunday   = i%7 === 0 ? ' l-ui-calendarDay-sunday' : ''
								$(this).addClass(saturday+sunday)
							}).click(function(){
								var self = $(this),
									val  = self.attr('title');
									
								self.addClass('l-ui-calendarDay-current')
									.siblings()
									.removeClass('l-ui-calendarDay-current');
									
								if( !isShowTime ){
									_core.close(val);
								}else{
									var curYear  = self.attr('year'),
										curMonth = self.attr('month'),
										curDay   = self.text();
									
									globalDate = _core.getNewDate(curYear, curMonth, curDay);
								}
							});
							
							if( isShowTime ){
								if( !main.find('.l-ui-calendarTime').length ){
									main.append(_core.createTime())
								}
			 
								var hourInput   = main.find('.l-ui-calendarTime-hourInput'),
									minuteInput = main.find('.l-ui-calendarTime-minuteInput'),
									secondInput = main.find('.l-ui-calendarTime-secondInput'),
									inputTime   = function( o ){
													o.siblings('div')
													 .show()
													 .find('a')
													 .click(function(){
														o.val( $(this).text() )
														 .siblings('div')
														 .hide();
													 });
													o.parent().siblings().find('div').hide();
												}
								
								hourInput.click(function(){
									inputTime( $(this) );
								});
								minuteInput.click(function(){
									inputTime( $(this) );
								});
								secondInput.click(function(){
									inputTime( $(this) );
								});
								main.find('.l-ui-calendarTimeBtn').click(function(){
									var hour     = hourInput.val(),
										minute   = minuteInput.val(),
										second   = secondInput.val(),
										curYear  = globalDate.getFullYear(),  //当前全局date对象
										curMonth = globalDate.getMonth(),
										curDay   = globalDate.getDate(),
										val      = _core.format(curYear, curMonth, curDay, hour, minute, second);
									
									_core.close(val);
								});
							}
						}
					}
	
	_core.init();
	trigger.click(function(){
		main.show();
	});
};

/**
 * 编辑器
 * @constructor zUI.app.editor
 * @extends zUI.app
 * @requires zUI.base zUI.ui.pop zUI.base.browser
 * @param {Object} options 页面传过来的对象
 * @param {Object} options.trigger 目标对象
 * @param {Object} options.width 编辑器的宽度
 * @param {Object} options.height 编辑器的高度
 * @example 
	html:
		<textarea id="editor"></textarea>
	js:
		zUI.app.editor({
			trigger:'#editor',
			callback: function(time){
				alert(time)
			}
		});
	
 */
zUI.app.editor = function(options){
	var o = options || {};
	if(!o.trigger){return;};
	var trigger    = $(o.trigger).wrap('<div class="l-ui-editorWrap"></div>').hide(),
		width      = o.width || 600,
		height     = o.height || 300,
		wrap       = trigger.parent().css({width:width,height:height}),
		text       = trigger.html(),
		browser    = zUI.base.browser,
		data       = [
						{name: 'bold', title: '加粗'},
						{name: 'italic', title: '斜体'},
						{name: 'strikethrough', title: '删除线'},
						{name: 'insertOrderedList', title:'序号式列表'},
						{name: 'insertUnorderedList', title:'非序号式列表'},
						{name: 'justifyleft', title: '左对齐'},
						{name: 'justifycenter', title: '居中对齐'},
						{name: 'justifyright', title: '右对齐'},
						{name: 'createlink', title:'插入链接或编辑链接'},
						{name: 'unlink', title:'取消链接'},
						{name: 'insertImage', title:'插入图片'},
						{name: 'fullscreen', title:'全屏显示'},
						{name: 'source', title:'源码'}
					],
		/**
		 * 编辑器内部构造
		 * @private
		 */
		editor     = {
			
			/**
			 * 初始化
			 */
			init: function () {

				var _this = this;

				_this.bookmark = null;

				// 创建工具条
				_this.createTool();

				// 创建iframe容器
				_this.createIframe();

				// 创建快照书签
				browser.msie && _this.saveBookMark();

				wrap.find('.l-ui-editor-toolIco')
					.mousedown(function(e){
						var name = $(this).attr('name');
						_this.exec(name);
						// $('#editorWrap').append('<input type="text" name="" id="ss"><span id="dd">提交</span>');
						// $('#dd').mousedown(function(e){
						// 	_this.setCommand('insertImage', $('#ss').val)
						// })
					})
					.keydown(function(e){
						var k = e.keyCode;
						if( k == 13 && !e.shiftKey ){
							
						}
					});
					
				
				_this.editorBox.blur(function(){
					_this.setText();
				});
			},
			
			/**
			 * 获取连接插入框
			 */
			getLink: function(){
				var _this = this,
					html  = '',
					id    = 'l-pop-'+(new Date()).valueOf();

				html += '<div id="link-options">' +
							'<p class="howto">输入目标URL</p>' +
							'<div>' +
							'	<label><span>URL</span><input id="l-ui-editor-url" value="http://" type="text" name="href"></label>' +
							'</div>' +
							'<div>' +
							'	<label><span>标题</span><input id="l-ui-editor-linkTitle" type="text" name="linktitle"></label>'
							'</div>' +
							'<div class="link-target">' +
							'	<label><input type="checkbox" id="l-ui-editor-linkCheckbox"> 在新窗口或标签页打开链接</label>' +
							'</div>' +
						'</div>';
						
				zUI.ui.pop.open({
					title:'插入链接',
					width:200,
					height:150,
					html:html,
					id:id,
					btns:[
						{
							text:'插入链接',
							onclick:function(){
								var _val = $('#l-ui-editor-url').val();

								zUI.ui.pop.close(id); //防止焦点在父级丢失，提前关闭
								if (_val.length == 0)
									_val = '#'; // IE下链接可以为空.但其他最起码有一个空格.否则报错
								_this.setCommand('createLink', _val);
							}
						},
						{
							text:'取消',
							onclick: function(){
								
							}
						}
					]
				});		
			},

			/**
			 * 全屏显示
			 */
			fullscreen: function(){
				var _this = this;
				
				if( wrap.hasClass('l-ui-editorWrap-full') ){
					wrap.removeClass('l-ui-editorWrap-full')
						.css({width:'100%', height:height});
					this.iframe.css({width:'100%', height:height - _this.toolHeight});
					$('body').css({position:''});
				}else{
					var winHeight = $(window).height(),
						iframeHeight = winHeight - wrap.find('.l-ui-editor-tool').outerHeight();
					wrap.addClass('l-ui-editorWrap-full')
						.css({width:'100%', height:winHeight});
					this.iframe.css({width:'100%', height:iframeHeight});
					$('body').css({position:'relative'});
				}
			},

			/**
			 * 获取图片插入框
			 */
			getImages: function(){
				var _this = this,
					html  = '',
					id    = 'l-pop-'+(new Date()).valueOf();			
				html += '<div id="link-options">' +
							'<p class="howto">输入目标URL</p>' +
							'<div>' +
							'	<label><span>url</span><input id="l-ui-editor-img" type="text" name="linktitle"></label>' +
							'</div>' +
						'</div>';
						
				zUI.ui.pop.open({
					title:'插入图片',
					width:200,
					height:150,
					id:id,
					html:html,
					btns:[
						{
							text:'插入图片',
							onclick:function(){
								var url = $('#l-ui-editor-img').val();
								zUI.ui.pop.close(id); //防止焦点在父级丢失，提前关闭
								_this.setCommand('insertImage', url);
							}
						},
						{
							text:'取消',
							onclick: function(){
								
							}
						}
					]
				});
			},

			/**
			 * 保存快照用于IE定位
			 */
			saveBookMark: function(){
				var _this = this;

				_this.ifr.attachEvent('onbeforedeactivate', function(){
					var rng = _this.doc.selection.createRange();
					if( rng.getBookmark ){
						_this.bookmark = _this.doc.selection.createRange().getBookmark(); // 保存光标用selection下的createRange();
					}
				});

				_this.ifr.attachEvent('onactivate', function(){
					if( _this.bookmark ){
						// Moves the start and end points of the current TextRange object to the positions represented by the specified bookmark.
						// 将光标移动到 TextRange 所以需要用 body.createTextRange();
						var rng = _this.doc.body.createTextRange();
						rng.moveToBookmark( _this.bookmark );
						rng.select();
						_this.bookmark = null;
					}
				});
			},
			
			/**
			 * 获取Selection对象
			 */
			getSelection: function(){
				var _this = this;
				if (_this.win.getSelection){
					return _this.win.getSelection();
				}else if (_this.doc.selection) {
					return _this.doc.selection.createRange();
				}
			},
			
			/**
			 * 获取ParentNode对象
			 */
			getParentNode: function(){
				var _this = this;
				if (window.getSelection) return _this.getSelection().getRangeAt(0).startContainer.parentNode;
				else if (document.selection) return _this.getSelection().parentElement();
			},
			
			/**
			 * 获取CurrentNode对象
			 */
			getCurrentNode: function(){
				var _this = this;
				if (window.getSelection) return _this.getSelection().getRangeAt(0).startContainer;
				else if (document.selection) return _this.getSelection();
			},
			
			/**
			 * 获取html源码
			 */
			getSource: function(){
				var _this = this,
					btn   = wrap.find('.l-ui-editor-toolIco-source');
										
				if( btn.hasClass('l-ui-editor-toolIco-source-open') ){
					_this.editorBox.html(trigger.hide().val())
					btn.removeClass('l-ui-editor-toolIco-source-open');
				}else{
					trigger.show().val(_this.editorBox.html())
					btn.addClass('l-ui-editor-toolIco-source-open');
				}
				
			},
			
			/**
			 * 执行操作
			 * @param {string} 调用方式
			 */
			exec: function(cmd){
				var _this = this;
				switch (cmd){
					// case 'insertUnorderedList':
						// _this.getList(cmd,'ul');
					// break;
					// case 'insertOrderedList':
						// _this.getList(cmd,'ol');
					// break;
					case 'createlink':
						_this.getLink();
					break;
					case 'fullscreen':
						_this.fullscreen();
					break;
					case 'source':
						_this.getSource();
					break;
					case 'insertImage':
						_this.getImages();
					break;
					default:
						_this.setCommand(cmd);
				}
			},
 
			/**
			 * 执行命令
			 * @param {string} document.execCommand的方法
			 * @param {array} document.execCommand的方法
			 */
			setCommand: function(name, arg){
				try {
					this.ifr.contentWindow.focus(); // 放置焦点要操作contentWindow
					this.doc.execCommand(name, false, arg);
				} catch (e) {}
			},

			/**
			 * 设置文本
			 */
			setText: function(){
				var _this = this,
					text  = _this.editorBox.html();
					
				trigger.val(text)
					   .css({width:width - 10, height:height - _this.toolHeight - 10, border:'0', padding:'5px'})
			},
			
			/**
			 * 创建工具条
			 */
			createTool: function(){
				var _this = this,
					html = '',
					len  = data.length,
					i    = 0;
				html += '<div class="l-ui-editor-tool fn-clear">';
				for(; i < len; i++){
					html += '<a href="javascript:;" title="'+ data[i].title +'"><span class="l-ui-editor-toolIco l-ui-editor-toolIco-'+ data[i].name +'" name="'+ data[i].name +'"></span></a>';
				}
				html += '</div>';
				wrap.prepend(html);
				_this.toolHeight = wrap.find('.l-ui-editor-tool').outerHeight();
			},

			/**
			 * 创建空白iframe
			 */
			createIframe : function () {
				var _this = this;

				_this.iframe = wrap.append('<iframe class="l-ui-editor-iframe" src="javascript:;" frameborder="0"></iframe>')
								   .find('.l-ui-editor-iframe')
								   .css({width:width, height:height - _this.toolHeight});
								   
				trigger.css({width:width, height:height - _this.toolHeight, border:'0 none'});

				_this.ifr = _this.iframe[0];
				_this.win = _this.ifr.contentWindow,
				_this.doc = _this.ifr.contentDocument || _this.win.document; // W3C || IE
				_this.doc.open();
				_this.doc.write('<html><body style="margin:0;padding:5px;" contenteditable="true" designMode="on">'+ text +'</body></html>');
				_this.doc.close();

				_this.editorBox = $(_this.doc).find('body');
			}
		};
	editor.init()
};

/**
 * 懒加载
 * @constructor zUI.app.lazyload
 * @extends zUI.app
 * @requires zUI.base
 * @example 
	zUI.app.lazyload({
		defObj:'.home_main',
		defHeight:50
	});
	dom: <img alt="" src2="http://p.www.xiaomi.com/images/xmFocus/tee01.jpg" style="margin: 0px" />
 */	
zUI.app.lazyload = function(e){
	var d = {
			defObj : null,
			defHeight : 0
		};
	d = $.extend(d, e || {});
	var c = d.defHeight,
		ipad = zUI.base.browser.ipad;
	h = (typeof d.defObj === "object") ? d.defObj.find("img") : $(d.defObj).find("img");
	var b = function(){
		var i = document,
		j = ipad ? window.pageYOffset : Math.max(i.documentElement.scrollTop, i.body.scrollTop);
		if( ipad ){
			d.defHeight = 0;
		}
		return i.documentElement.clientHeight + j - d.defHeight;
	};
	var f = function(j){
		var i = j.attr("src2");
		if(i){
			j.css({
				opacity : "0.3"
			}).attr("src", i).removeAttr("src2").animate({
				opacity : "1"
			});
		}
	};
	var g = function(){
		h.each(function () {
			if( ipad ) {
				f($(this));
			} else {
				if ($(this).offset().top <= b()) {
					f($(this));
				}
			}
		});
	};
	g();
	$(window).bind("scroll", function () {
		g();
	});
};

/**
 * grid插件
 * @class zUI.ui.BaseGrid
 * @constructor
 * @extends zUI.ui
 * @requires zUI.base
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.07.24
 * @example 
	zUI.ui.grid({
		wrap:'#main',
		data: AllOrdersData,
		columns: [
			{ display: '表头0', name: 'OrderID', width: 120, render: function(rdata, rindex, value){
					var h = '<span style="color:#ddd">'+ value +'</span>';
					return h;
				}
			},
			{ display: '表头1', name: 'CustomerID', width: 100},
			{ display: '表头2', name: 'EmployeeID', width: 100},
			{ display: '表头3', name: 'ShipCity', width: 100},
			{ display: '表头4', name: 'ShipRegion', width: 100},
			{ display: '表头5', name: 'ShippedDate', width: 100},
			{ display: '表头6', name: 'ShipName', width: 100}
		]
	});
	
	$('#reflash').click(function(){
		zUI.ui.grid.reflash(gridData2)
	});
 */
zUI.ui.BaseGrid = function(){
	var g       = this,
	
		/**
		* 全局已选记录
		* @private
		*/
		_records = {
			rowSelected: [],
			detailSelected: []
		},
		
		/**
		* 内部对象
		* @private
		*/
		_core   = {
			/**
			* 内部表格表头内容
			* @param {object} init 和 reflash共享的对象
			*/
			tHeadFn: function(options){
				var columns   = options.columns,
					len       = columns.length,
					width     = options.width,
					detail    = options.detail,   //表格明细
					checkbox  = options.checkbox, //复选框
					i         = 0,
					s         = '';

				s += '<div class="l-grid-header"><table style="width:'+ width +'px">';
				s += '<tr>';
				if( detail ){
					s += '<th><div class="l-grid-row-cell-inner"><span class="l-detailbtn"></span></div></th>';
				}
				if( checkbox ){
					s += '<th><div class="l-grid-hd-cell-inner"><span class="l-checkbox l-grid-hd-checkbox"></span></div></th>';
				}
				for(; i < len; i++){
					s += '<th><div class="l-grid-hd-cell-inner" style="width:'+ columns[i].width +'px">'+ columns[i].display +'</div></th>';
				}
				s += '</tr>';
				s += '</table></div>';
				return s;
			},
			/**
			* 内部表格主体内容
			* @param {object} init 和 reflash共享的对象
			*/
			tBodyFn: function(options){
				var columns   = options.columns,
					data      = options.data.Rows,
					pageSize  = options.pageSize,
					pageIndex = options.pageIndex,
					width     = options.width,
					checkbox  = options.checkbox,                      //选择框
					dataLen   = options.data.Total,                    //记录总数
					pageStar  = (pageIndex-1)*pageSize,                //当前记录的起始
					pageEnd   = Math.min(pageIndex*pageSize, dataLen), //当前记录的结束
					detail    = options.detail,                        //行明细
					s         = '';

				s += '<table style="width:'+ width +'px">';
				for(; pageStar < pageEnd; pageStar++){
					if( data[pageStar] ){
						s += '<tr>';
						if( detail ){
							s += '<td><div class="l-grid-row-cell-inner"><span class="l-detailbtn l-grid-row-detailbtn l-detailbtn-close"></span></div></td>';
						}
						if( checkbox ){
							s += '<td><div class="l-grid-row-cell-inner"><span class="l-checkbox l-grid-row-checkbox"></span></div></td>';
						}
						for(var h = 0; h < columns.length; h++){
							if( columns[h].render !== undefined ){
								var str = columns[h].render(data[pageStar], pageStar, data[pageStar][columns[h].name]);
								s += '<td><div class="l-grid-row-cell-inner" style="width:'+ columns[h].width +'px">'+ str +'</div></td>';
							}else{
								s += '<td><div class="l-grid-row-cell-inner" style="width:'+ columns[h].width +'px">'+ data[pageStar][columns[h].name] +'</div></td>';
							}
						}
						s += '</tr>';
						if( detail.render !== undefined ){
							var str    = detail.render(data[pageStar], pageStar),
								colLen = columns.length + (checkbox ? 1 : 0) + 1;
							s += '<tr class="l-grid-row-cell-detail"><td colspan="'+ colLen +'">'+ str +'</td></tr>';
						}
					}
				}
				s += '</table>';
				return s;
			},
			
			/**
			* 内部分页函数
			* @param {object} init 和 reflash共享的对象
			*/
			pagerFn: function(options){
				var columns     = options.columns,                   //表格columns
					id          = options.id,                        //表格ID
					pageSize    = options.pageSize,                  //每页显示多少个
					pageIndex   = options.pageIndex,                 //起始位置
					count       = options.data.Total || 0,           //记录总个数
					onPageFn    = options.onPageFn,                  //记录总个数
					isMemory    = options.isMemory,                  //翻页是否记住选择记录
					isPageCache = options.isPageCache,               //翻页是否缓存
					itemNum     = 2,                                 //当前页两边显示个数
					html        = '',
					grid        = $('#'+id),
					gridHeader  = grid.find('.l-grid-header'),       //表格头
					gridBody    = grid.find('.l-grid-body'),         //表格主体
					pager       = grid.find('.l-grid-footer-pager'), //分页容器
					
					/**
					* 获取数字连接
					* @private
					* @param {Number} 当前位置
					* @param {Number} 
					* @param {String} 上下翻页的文本
					*/
					_getLink    = function(index, pageNum, txt){
						var s       = '',
							current = txt ? (index === pageNum ? ' class="on"' : '') : '',
							txt     = txt || index;
							
						s += '<a href="#p'+ index +'" page="'+ index +'"' 
							 + current + '>'+ txt +'</a>';
						return s;
					},
					
					/**
					* 获取显示的数据
					* @private
					* @param {Number} 每页显示条数
					* @param {Number} 数据长度
					* @param {Number} 当前位置
					*/
					_getCount   = function(pageSize, count, index){
						var s = '';
						
						s += '显示从'+ ( (index-1)*pageSize + 1 ) +'到'+ index*pageSize;
						s += '，总 '+ count +' 条 。每页显示：'+ pageSize;
						return s;
					},
					
					/**
					* 获取分页按钮
					* @private
					* @param {Number} 每页显示条数
					* @param {Number} 数据长度
					* @param {Number} 当前位置
					*/
					_getBtn     = function(pageSize, count, index){
						var s       = '',
							begin   = 1,
							end     = 1,
							i       = 0,
							pageNum = Math.ceil(count / pageSize);
							
						if(index > 1){
							s += _getLink(index - 1, itemNum, '上一页');
						}else{
							s += '<span>上一页</span>';
						}
						if(index - itemNum > 1){
							s += _getLink(1, index) + '<em>...</em>';
							begin = index - itemNum;
						}
						end = Math.min(pageNum, begin + itemNum * 2);
						if(end === pageNum - 1){
							end = pageNum;
						}
						for(i = begin; i <= end; i++) {
							s += _getLink(i, index);
						}
						if(end < pageNum){
							s += '<em>...</em>' + _getLink(pageNum, index);
						}
						if(index < pageNum){
							s += _getLink(index + 1, index, '下一页');
						}else{
							s += '<span>下一页</span> ';
						}
						return s;
					},
					
					/**
					* 设置是否记录选择框的选择结果
					* @private
					*/
					_setMemory  = function(){
						if( !isMemory ){
							_records.rowSelected = []; //修改选中的数组值
						}else{
							_core.initCheckbox(options, _records.rowSelected); //初始化选中状态
						}
					};
					

				/*分页统计*/
				html += '<div class="l-grid-footer-pager-msg">'+ _getCount(pageSize, count, pageIndex) +'</div>';
				
				/*分页按钮*/
				html += '<div class="l-grid-footer-pager-btn">'+ _getBtn(pageSize, count, pageIndex) +'</div>';				
				
				/*生成分页*/
				pager.html(html);
				
				/*初始化records.rowSelected*/
				_setMemory();
				
				/*分页事件*/
				pager.find('.l-grid-footer-pager-btn a').live('click',function(){
				
					var gridpageMsg = pager.find('.l-grid-footer-pager-msg'),
						gridpageBtn = pager.find('.l-grid-footer-pager-btn'),
						index       = Number( $(this).attr('page') ); // attr返回 string
														
					/*修改全局g.o的 pageIndex 成员*/
					options.pageIndex = index;
					
					/*返回接口，可能修改全局g.o对象，所以前置*/
					if( zUI.base.isFunction(onPageFn) ){
						if( isPageCache ){
							var cache = options.cache[index];
							onPageFn(index, pageSize, cache);
						}else{
							onPageFn(index, pageSize);
						}
					}
					
					/*重载html*/
					gridBody.html( _core.tBodyFn(options) );
					gridpageMsg.html( _getCount(pageSize, count, index) );
					gridpageBtn.html( _getBtn(pageSize, count, index) );
					
					/*全部选上时给表头全选*/
					if( gridBody.find('.l-checkbox-selected').length == pageSize ){
						gridHeader.find('.l-checkbox').addClass('l-checkbox-selected');
					}else{
						gridHeader.find('.l-checkbox').removeClass('l-checkbox-selected');
					}
					
					/*修改records.rowSelected*/
					_setMemory();
				});
			},
			
			/**
			* 内部获取行数据
			* @param {Object} init 和 reflash共享的对象
			* @param {Number} 记录的索引值
			*/
			getRowData: function(options, index){
				var	data      = options.data.Rows; //表格数据
					
				if( index === -1 ){
					return false;
				}
				
				return data[index];
			},
			
			/**
			* 初始化选择框
			* @param {object} init 和 reflash共享的对象
			*/
			initCheckbox: function(options, selectedRecords){
				var pageSize   = options.pageSize,                  //每页显示多少个
					pageIndex  = options.pageIndex,                  //起始位置
					id         = options.id,                         //表格ID
					grid       = $('#'+id),
					gridHeader = grid.find('.l-grid-header'),        //表格头
					gridBody   = grid.find('.l-grid-body'),          //表格主体
					checkbox   = gridBody.find('.l-checkbox'),       //复选框
					len        = selectedRecords.length,
					i          = pageSize*(pageIndex-1),
					j          = 0,
					selected   = Math.min(pageSize, checkbox.length); //已选数量
				
				for(; i < len; i++, j++){
					if( selectedRecords[i] ){
						checkbox.eq(j).addClass('l-checkbox-selected');
					}
				}

				/*全部选上时给表头全选*/
				if( gridBody.find('.l-checkbox-selected').length === selected ){
					gridHeader.find('.l-checkbox').addClass('l-checkbox-selected');
				}
			},
			
			/**
			* 选择框事件
			* @param {object} init 和 reflash共享的对象
			*/
			checkboxFn: function(options){
				var id         = options.id,                  //表格ID
					grid       = $('#'+id),
					gridHeader = grid.find('.l-grid-header'), //表格头
					gridBody   = grid.find('.l-grid-body'),   //表格主体
					isMemory   = options.isMemory,            //是否记住选择
					onCheckFn  = options.onCheckFn;           //点击后执行

				/*多选*/
				gridBody.find('.l-checkbox').live('click',function(){
					var self      = $(this),
						pageSize  = g.o.pageSize,                        //每次触发重新查找pageSize
						pageIndex = g.o.pageIndex,                       //每次触发重新查找pageIndex
						checkbox  = gridBody.find('.l-checkbox'),
						i         = checkbox.index(self),
						arr       = [],
						selected  = Math.min(pageSize, checkbox.length); //已选数量
					
					if( isMemory ){
						i = i + pageSize*(pageIndex - 1);
					}
										
					if( !self.hasClass('l-checkbox-selected') ){
						self.addClass('l-checkbox-selected');
						_records.rowSelected[i] = _core.getRowData(options, i);

						/*全部选上时给表头全选*/
						if( gridBody.find('.l-checkbox-selected').length === selected ){
							gridHeader.find('.l-checkbox').addClass('l-checkbox-selected');
						}
					}else{
						_records.rowSelected.splice(i, 1, null); //赋一个null值，站位，防bug
						self.removeClass('l-checkbox-selected');
						gridHeader.find('.l-checkbox').removeClass('l-checkbox-selected');
					}
										
					/*返回选择数据*/
					if( zUI.base.isFunction(onCheckFn) ){
						onCheckFn();
					}

				});
				
				/*全选*/
				gridHeader.find('.l-checkbox').live('click',function(){
					var self      = $(this),
						pageSize  = g.o.pageSize,                 //每次触发重新查找pageSize
						pageIndex = g.o.pageIndex,                //每次触发重新查找pageIndex
						checkbox  = gridBody.find('.l-checkbox'),
						len       = checkbox.length,
						i         = 0,
						j         = len - 1;
					
					if( isMemory ){
						i   = pageSize*(g.o.pageIndex - 1);
						len = len + i;
					}
						
					if( !self.hasClass('l-checkbox-selected') ){
						self.addClass('l-checkbox-selected');
						checkbox.addClass('l-checkbox-selected');
						for(; i < len; i++){
							_records.rowSelected[i] = _core.getRowData(options, i);
						}
					}else{
						self.removeClass('l-checkbox-selected');
						checkbox.removeClass('l-checkbox-selected');
						for(; j > -1; j--){
							_records.rowSelected.splice(j, 1);
						}
					}
					
					/*返回选择数据*/
					if( zUI.base.isFunction(onCheckFn) ){
						onCheckFn();
					}
				});
			},
			
			/**
			* 明细按钮事件
			* @param {object} init 和 reflash共享的对象
			*/
			detailBtnFn: function(options){
				var id         = options.id,                  //表格ID
					grid       = $('#'+id),
					gridBody   = grid.find('.l-grid-body'),   //表格主体
					isMemory   = options.isMemory,            //是否记住选择
					onCheckFn  = options.onCheckFn;           //点击后执行
					
				gridBody.find('.l-detailbtn').live('click',function(){
					var self = $(this),
						next = self.parents('tr').next('.l-grid-row-cell-detail');
					
					if( self.hasClass('l-detailbtn-close') ){
						self.removeClass('l-detailbtn-close');
						next.show();
					}else{
						self.addClass('l-detailbtn-close');
						next.hide();
					}
				});
			}// _core.detailBtnFn end
		}
	
	/**
	* 表格初始化
	* @member zUI.ui.BaseGrid
	* @param {Object} options 页面传过来的对象
	* @param {Object} options.data json数据源
	* @param {Object} options.columns 表格列信息
	* @param {String} options.wrap 收纳表格的容器
	* @param {String} options.id 表格ID
	* @param {Object} options.bottomBtns 底部按钮
	* @param {Boolean} options.isPager 是否分页
	* @param {Number} options.pageSize 每页显示条数
	* @param {Number} options.pageIndex 默认当前页
	* @param {Function} options.onPageFn 击分页加载的事件
	* @param {Boolean} options.checkbox 是否有checkbox
	* @param {Boolean} options.onCheckFn 选择事件(复选框)
	* @param {Number} options.width 表格总宽度
	* @param {Boolean} options.isMemory 翻页是否记住选择记录
	* @param {Boolean} options.isPageCache 翻页是否缓存数据
	* @param {String} options.nullText 数据为空时的提示文本
	* @param {Object} options.detail 表格详细
	* @return {Object} zUI.ui.baseGrid
	*/
	this.init = function(o){
		if(!o){return false;}
		var options = {
				data:         o.data || {},
				columns:      o.columns || {},
				wrap:         $(o.wrap),
				id:           o.id || 'l-grid-' + (new Date()).valueOf(),
				bottomBtns:   o.bottomBtns || {},
				isPager:      o.isPager ? false : true,
				pageIndex:    o.pageIndex || 1,
				pageSize:     o.pageSize || 10,
				onPageFn:     o.onPageFn,
				checkbox:     o.checkbox ? true : false,
				width:        o.width || 'auto',
				onCheckFn:    o.onCheckFn || null,
				isMemory:     o.isMemory ? false : true,
				isPageCache:  o.isPageCache ? false : true,
				nullText:     o.nullText ? o.nullText : '',
				detail:       o.detail || {}
			};
					
		/*复制options共享g.o对象*/
		for(var key in options){
			if( options.hasOwnProperty(key) ){
				g.o[key] = options[key];
			}
		}
		
		/*生成表格*/
		
			/*插入容器*/
			options.wrap.append('<div class="l-gird" id="'+ options.id +'"></div>');
			var grid = $('#' + options.id);
			
			/*表头*/
			var tHeadHtml = _core.tHeadFn(options);
			grid.append(tHeadHtml);
			
			/*内容*/
			if( options.data ){
				var tBodyHtml = _core.tBodyFn(options);
				grid.append('<div class="l-grid-body">'+ tBodyHtml +'</div>');
			}else{
				grid.append('<div class="l-grid-body">'+ options.nullText +'</div>');
			}
							
			/*底部*/
			
				/*底部结构*/
				var tFootHtml = '';
				tFootHtml += '<div class="l-grid-footer">';
				if( options.bottomBtns.length ){ // 是否有底部按钮
					tFootHtml += '<div class="l-grid-footer-btns"></div>';
				}
				if( options.isPager ){ // 是否显示分页
					tFootHtml += '<div class="l-grid-footer-pager"></div>';
				}
				tFootHtml += '</div>';
				grid.append(tFootHtml);
		
				var gridFooter = grid.find('.l-grid-footer');
					
				/*按钮*/
				if( gridFooter.find('.l-grid-footer-btns') ){
					var gridFooterBtn = gridFooter.find('.l-grid-footer-btns'),
						btnData       = options.bottomBtns;

					$.each(btnData, function(i, item){
						gridFooterBtn.append('<a href="#btn" id="'+ item.id +'" class="l-btn ui-btn"><span class="ui-btnItem">'+ item.text +'</span></a>')
						item.onclick && gridFooterBtn.find('.l-btn').eq(i).click(function(){
							item.onclick(i, item);
						});
					});
				}
				
				/*分页*/
				if( gridFooter.find('.l-grid-footer-pager') ){
									
					/*翻页缓存*/
					if(	options.isPageCache ){
						g.o.cache = [];  //给g.o添加一个cache成员
						g.o.cache[options.pageIndex] = true;
					};
					
					_core.pagerFn(g.o);
				}
			
			/*选择框*/
			_core.checkboxFn(g.o);
			
			/*明细*/
			_core.detailBtnFn(g.o);

		return g;
	};
	
	/**
	* 表格全局数据源
	* @member zUI.ui.BaseGrid
	*/
	this.o = {};
	
	/**
	* 表格刷新数据源
	* @member zUI.ui.BaseGrid
	* @param {Object} 数据源
	* @param {Number} 页面值索引
	* @param {Boolean} 是否缓存
	* @return {Object} zUI.ui.BaseGrid
	*/
	this.reflash = function(data, index, cache){
		var options   = g.o,                       //全局数据源
			columns   = options.columns || {},
			wrap      = $(options.wrap),
			id        = options.id,
			pageSize  = options.pageSize,          //每页长度
			count     = options.data.Total || 0,   //记录总个数
			grid      = $('#'+id),
			gridBody  = grid.find('.l-grid-body');
		
		if( cache ){
			/*缓存已翻页数据，与_core.pageFn配合*/
			var arr  = [],
				star = (index - 1) * pageSize, //当前页的起始位置
				i    = 0,
				n    = 0;

			for(; i < count; i++){
				if( options.data.Rows[i] ){
					arr[i] = options.data.Rows[i];
				}else{
					arr[i] = null;
				}
			}
			if( !options.cache[index] && data ){
				for(; n < pageSize; n++){
					arr[star] = data.Rows[n];
					star++;
				}
			}
			
			/*修改全局数据源中的成员*/
			options.pageIndex = index;
			options.data.Rows = arr;
			options.cache[index] = true;
		}else{
			var tBodyHtml = '';
			
			/*index不存在默认pageIndex*/
			if(index){
				options.pageIndex = index;
			}
			options.data = data; //覆盖全局数据源中的data成员
			tBodyHtml = _core.tBodyFn(options);
			gridBody.html(tBodyHtml);
		}
		
		/*分页*/
		if( grid.find('.l-grid-footer-pager') ){
			_core.pagerFn(options);
		}
		
		return g;
	};
		
	/**
	* 获取选中的数据，并组装成表格可用的数据格式
	* @member zUI.ui.BaseGrid
	* @return {Object} 返回一个表格数据源
	*/
	this.getSelectData = function(){
		var arr   = [],
			i     = 0,                
			len   = _records.rowSelected.length, //记录的长度
			data  = {},             //data对象
			total = 0;              //data个数
			
		/*过滤掉records下面的空元素*/
		for(; i < len; i++){
			if( _records.rowSelected[i] ){
				arr.push( _records.rowSelected[i] );
			}
		}
		
		/*组装一个表格适用的data数据*/
		total = arr.length;
		data = {
			"Rows": arr,
			"Total":total
		}
		
		return data;
	};
	
};

/**
 * grid实例化
 * @dest 封装在zUI.ui.grid里，可创建多个zUI.ui.grid，又避免多个表格this互相影响
 */
zUI.ui.grid = function(options){
	var grid = new zUI.ui.BaseGrid();
	grid.init(options);
	return grid;
};
//zUI.ui.BaseGrid = new zUI.ui.BaseGrid();
//zUI.ui.grid = zUI.ui.BaseGrid.init;


/* var test = function(o){
	var self = this;
	self.o = o;
}
test.prototype.init = function(arg){
	var s = {
		name: 'null'
	}
	this.arg = arg;
}
test.prototype.reflash = function(){
	console.log(this.arg.name)
}

var fn = function(options){
	var run = new test();
	run.init(options);
	return run;
}

var a = fn({
	name:'norion'
});

var b = fn({
	name:'norion2'
});

b.reflash();
a.reflash(); */

/* function test(name,arg){
	this.name = name;
	this.arg = arg;
}
function testApply(name,arg,ground){
	test.call(this, name, arg);
	this.ground = ground;
	alert(this.name+':'+this.arg+':'+this.ground);
}
var testA = new testApply('ss',21,'二'); 

var test = {
	saytest: function(name){
		alert(name)
	}
}
test.saytest.call(this, 'norion')*/