(function() {
	/*针对原型的方法添加应用支持*/
	String.prototype.getLength = function(){
		return this.replace(/[^\x00-\xff]/g,"en").length; //若为中文替换成两个字母
	};
	String.prototype.trim = function(){
		return this.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
	};
	//unicode互转
	String.prototype.toUnicode = function(){
		return escape( this.toLocaleLowerCase().replace(/%u/gi, '\\') );
	};
	String.prototype.unicodeTo = function(){
		return unescape( this.toLocaleLowerCase().replace(/%u/gi, '\\') );
	};
	
	/*设定基本命名空间*/
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
}());

/*zUI.base基础层*/
zUI.base = {
	domain: {
		url: 'http://127.0.0.1'
	},
	/*重写console，以防止在IE下出错*/
	log: function(msg){
		if (window["console"]){
			console.log(msg);
		}
	},
	isArray: function(o){
		return o ? jQuery.isArray(o) : false;
	},
	isObject: function(o){
		return o ? Object.prototype.toString.call(o) == "[object Object]" : false;
	},
	isFunction: function(o){
		return o ? Object.prototype.toString.call(o) == "[object Function]" : false;
	}
};

/*zUI.base.browser*/
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
	if (browser.msie) {
		browser.ie = browser.msie;
		var v = parseInt(browser.msie, 10);
		browser['ie' + v] = true;
	}	
	return browser;
}());

/*解决ie6下的背景图片缓存问题  */
if( zUI.base.browser.ie6 ) {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

/*zUI.base.cookie*/
zUI.base.cookie = {
    set: function (name, value, domain, path, hour) {
		if (hour) {
			var today  = new Date,
				expire = new Date;
			expire.setTime(today.getTime() + 36E5 * hour);
		}
		document.cookie = name + "=" + escape(value) + "; " + (hour ? "expires=" + expire.toGMTString() + "; " : "") + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
		return true;
	},
	get: function (name) {
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
			m = document.cookie.match(r);
		return unescape(decodeURI(!m ? "" : m[1]));
	},
	del: function (name, domain, path) {
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
	}
};

/*zUI.ui前端显示层*/
zUI.ui = {
	/*标识ID*/
	uniqueId: function(){
		
	},
	
	/*z-index*/
	zIndex: function(){
		return 9999 + $('.l-ui').length;
	},
	
	/*需要ui元素需要绝对定位的容器*/
	wrap: function(){
		if( !$('#l-ui-wrap').length ){
			$('body').append('<div id="l-ui-wrap"><!--[if lte IE 6.5]><iframe src="javascript:false;" style="width:0;height:0;"></iframe><![endif]--></div>');
		}
	},
	
	/*遮罩*/
	lock: function(){
		var body = $('body'),
			bodyW = body.width(),
			bodyH = $(document).height();
		if( !$('.l-ui-lock').length ){
			body.append('<div class="l-ui-lock"></div>')
				.find('.l-ui-lock').css({ width:bodyW,height:bodyH,filter:'Alpha(opacity=20)' });
		}else{
			$('.l-ui-lock').show();
		}
		//给.l-ui添加遮罩标识
		$('.l-ui').addClass('l-ui-mask');
	},
	unlock: function(){
		$('.l-ui-lock').hide();
	},
	
	/*鼠标位置*/
	mousePosition: function(b) {
		var b = b || window.event,
			d = b.pageX || b.clientX + document.body.scrollLeft,
			c = b.pageY || b.clientY + document.body.scrollTop;
		return {
			positionX : d,
			positionY : c
		};
	},
	
	/*宽屏*/
	Widescreen: (function(){
		return (screen.width >= 1210);
	})()
};

/**
 * @name 拖动插件 v1.0
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.1
 * @param {object} options
 * @example 
   zUI.ui.drag({
	   dragItem:'#dragItem',
	   dragWrap:'#dragWrap'
   });
 */
zUI.ui.drag = function(options){
	var o = options || {};
	if( !o.dragItem ) return false;
	var	dragItem = $('body').find(o.dragItem),
		dragWrap = $('body').find(o.dragWrap),
		win      = parent.document || document,
		mouse    = {x:0,y:0};
	function moveDialog(event){
        var e    = window.event || event,
        	top  = parseInt(dragWrap.css('top')) + (e.clientY - mouse.y),
        	left = parseInt(dragWrap.css('left')) + (e.clientX - mouse.x);
        dragWrap.css({top:top,left:left});
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    dragItem.mousedown(function(event){
        var e = window.event || event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        $(win).bind('mousemove',moveDialog);
    });
    $(win).mouseup(function(event){
        $(win).unbind('mousemove', moveDialog);
    });
};

/**
 * @name tabs选项卡插件 v1.4
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.16
 * @param {object} options
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
				var _index  = tabIndex;
				$(tabItem).bind(tabEvent,function(){
					_index  =  $(tabItem).index(this);
					tabFn.cutoverFn(_index);
				});
				if( isAuto ){
					tabFn.autoFn(_index);
				}
			}
		},
		
		/*切换函数*/
		cutoverFn: function(i){
			//tab切换内容的html不为空才做下面动作
			if( $(tabWrap).eq(i).html() != '' ){
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
					i ++;
					if( i == _mun ){
						i = 0;
					};
				},autoTime);
			$(tabItem).parent().hover(function(){
				clearInterval(_MyTime);
			},function(){
				_MyTime = setInterval(function(){
					tabFn.cutoverFn(i);
					i ++;
					if( i == _mun ){
						i = 0;
					};
				},autoTime);
			});
		}
	};//end tabfn
	tabFn.init();
};

/**
 * @name title属性模拟插件 v1.0
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.2
 * @param {object} options
 * @example 
	
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
			if( arrowDirection == 'topBottom' ){
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
 * @name 弹出框插件 v1.0
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.2
 * @param {object} options
 * @example 
	$('#s').click(function(){
		zUI.ui.pop.open({
			title:'标题',
			html:'111111'
		});
	});
 */
zUI.ui.pop = {
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
				btnMain.append('<a href="javascript:void(0);" class="'+ (item.cls?'ui-btn ui-btnMain ui-floatCenter-item '+item.cls:'ui-btn ui-btnMain ui-floatCenter-item') +'"><span>'+item.text+'</span></a>');
				item.onclick && btnMain.find('a').eq(i).click(function(){
					item.onclick(i,item,id);
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
				url: ajax,
				cache: false,
				success: function(data){
					popContent.append(data);
				}
			}); 
		}else if( html ){
			popContent.append(html);
		};
		
		/*载入时要触发的事件*/
		if( zUI.base.isFunction(onloadFn) ){
			onloadFn(id);
		}
		
		//位置
		var win  = $(window),
			top  = top || win.scrollTop() + win.height()/2 - popWrap.height()/2,
			left = left || ( win.width() - popWrap.width() )/2;
		popWrap.css({top:top,left:left});
		
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
		
		/*点击遮罩关闭*/
		if( isMask && isMaskClose ){
			$('.l-ui-lock').click(function(){
				zUI.ui.pop.close(id);
			});
		}
		
		/*关闭*/
		if( allowClose ){
			popMain.prepend('<div class="l-pop-close">x</div>');
			$('.l-pop-close').click(function(){
				zUI.ui.pop.close(id);
			});
		}
		/*esc退出*/
		if( allowEscClose ){
			if(document.attachEvent){
				document.attachEvent('onkeydown', modalKey);
			}else{
				document.addEventListener('keydown', modalKey, true);
			}
			function modalKey(e){
				e = e || event;
				var code = e.which || event.keyCode;
				if(code == 27){
					zUI.ui.pop.close(id);
				}
			}
		}
	},
	
	/*修改弹出框大小*/
	modifyWrap: function(id,height,type){
		if( type == 'iframe' ){
			var pop = $('#'+id,window.parent.document).find('.l-pop-contentIframe').height(height)
													  .find('#l-pop-iframe').height(height);
		}else{
			var pop = $('#'+id).find('.l-pop-content').height(height);
		}
	},
	
	/*关闭释放*/
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
 * @name 对话框插件 v1.0
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.07
 * @param {object} options
 * @example 
	$('#s').click(function(){
		zUI.ui.pop.open({
			title:'标题',
			html:'111111'
		});
	});
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
				btnMain.append('<a href="javascript:void(0);" class="'+ (item.cls?'ui-btn ui-btnMain ui-floatCenter-item '+item.cls:'ui-btn ui-btnMain ui-floatCenter-item') +'"><span>'+item.text+'</span></a>');
				item.onclick && btnMain.find('a').eq(i).click(function(){
					item.onclick(i,item);
					zUI.ui.dialog.close(id);
				});
			});	
		}else{
			switch (type) {
				case 'alert':
					btnMain.append('<a href="javascript:void(0);" class="ui-btn ui-btnMain ui-floatCenter-item l-dialog-ok"><span>确定</span></a>');
					btnMain.find('.l-dialog-ok').click(function(){
						if( zUI.base.isFunction(ok) ){
							ok();
						}
						zUI.ui.dialog.close(id);
					});
					break;
				case 'confirm':
					btnMain.append('<a href="javascript:void(0);" class="ui-btn ui-btnMain ui-floatCenter-item l-dialog-ok"><span>确定</span></a><a href="javascript:void(0);" class="ui-btn ui-btnMain ui-btnMain-cancel ui-floatCenter-item l-dialog-no"><span>取消</span></a>');
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
					btnMain.append('<a href="javascript:void(0);" class="ui-btn ui-btnMain ui-btnMain-cancel ui-floatCenter-item l-dialog-no"><span>取消</span></a>');
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
		
		zUI.base.log( dialogWrap.height() );
		
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
		
		/*点击遮罩关闭*/
		/* if( isMask && isMaskClose ){
			$('.l-ui-lock').click(function(){
				zUI.ui.dialog.close(id);
			});
		} */
		
		/*关闭*/
		if( allowClose ){
			var dialogClose = dialogMain.prepend('<div class="l-dialog-close">x</div>').find('.l-dialog-close');
			dialogClose.click(function(){
				zUI.ui.dialog.close(id);
			});
		}
		
		/*esc退出*/
		if( allowEscClose ){
			if(document.attachEvent){
				document.attachEvent('onkeydown', modalKey);
			}else{
				document.addEventListener('keydown', modalKey, true);
			}
			function modalKey(e){
				e = e || event;
				var code = e.which || event.keyCode;
				if(code == 27){
					zUI.ui.dialog.close(id);
				}
			}
		}
	},
	
	/*关闭释放*/
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
	
	/*alert*/
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
	
	/*confirm*/
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
	
	/*error*/
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
	
	/*小提示框*/
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
			if( endFn && typeof endFn == 'function' ){
				endFn();
			}
		};
		setTimeout(show,showTime);
		
	}
};

/**
 * @name 表单
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.04.16
 */
zUI.ui.form = {
	/**
	 * @name ajax无刷文件上传 v1.0
	 * @author norion
	 * @blog http://zkeyword.com/
	 * @update 2013.04.10
	 * @param {object} options
	 * @example 
		$('#s').click(function(){
			zUI.ui.form.upload({
				url:'<c:url value="/file/upload.cf"/>?width=200&height=200',
				name:'imgFile',
				onSend: function(){
	                return true;
	        	},
				onComplate: function(data){
					alert(data)
				};
			});
		});
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
				if( dataType == 'json' ){
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
	fill: function(options){
		
	},
	select: function(options){
		
	}
};


/**
 * @name placeholder兼容插件 v1.3
 * @author norion
 * @blog http://zkeyword.com/
 * @update 2013.03.31
 * @param {object} options
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
					if ( inputObj.val() == searchValue ) { inputObj.val(''); };
				},blur:function(){
					if ( inputObj.val() == '' ){ inputObj.val(searchValue); };
				}
			});
		}else{
			inputObj.die().live({
				focus:function(){
					if ( inputObj.attr('placeholder') == searchValue ){ inputObj.attr('placeholder',''); };
				},blur:function(){
					if ( inputObj.attr('placeholder','') ){ inputObj.attr('placeholder',searchValue); };
				}
			});
		}
	}
};

/*地区切换*/
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
				initCityHtml      = '';
			for(var i = 0, l = initData.length; i < l; i++){
				if( initData[i].Province == initProvinceValue ){
					initProvinceName = initData[i].ProvinceName;
					initCityData     = initData[i];
					for(var j = 0,c = initCityData.CityArray.length; j < c; j++){
						if( initCityData.CityArray[j].City == initCityValue ){
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

/*小功能*/
zUI.app = {
	/**
	 * @name 向上切换
	 * @example 
		zUI.app.marqueeUp('#index-shortcutBox');
		dom: 
			<div id="index-shortcutBox">
				<ul class="fn-clear">
					<li><a href="/portal/service/advisory.jsp" class="index-shortcutBox-item index-shortcutBox-item1">融资咨询</a></li>
					<li><a href="/portal/service/displayService.jsp" class="index-shortcutBox-item index-shortcutBox-item2">展览服务</a></li>
				</ul>
				<ul class="fn-clear">
					<li><a href="/portal/service/managementService.jsp" class="index-shortcutBox-item index-shortcutBox-item9">管理咨询</a></li>
				</ul>
			</div>
	*/
	marqueeUp: function(obj){
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
	},
	
	/*带箭头的图标滚动*/
	pictureScroll: function(options){
		
	},
	
	/*向上滚动幻灯片*/
	slidesUp: function(options){
		
	},
	
	/**
	 * @name 懒加载
	 * @example 
		zUI.app.lazyload({
			defObj:'.home_main',
			defHeight:50
		});
		dom: <img alt="" src2="http://p.www.xiaomi.com/images/xmFocus/tee01.jpg" style="margin: 0px" />
	*/	
	lazyload: function(e){
		var d = {
				defObj : null,
				defHeight : 0
			};
		d = $.extend(d, e || {});
		var c = d.defHeight,
			ipad = zUI.base.browser.ipad;
		h = (typeof d.defObj == "object") ? d.defObj.find("img") : $(d.defObj).find("img");
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
	}
};

var gridData = [
	{"CustomerID":"1", "CompanyName":"1212 Futterkiste", "ContactName":"Maria 12", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"Berlin", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"2", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"3", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"4", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"5", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"6", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"7", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"8", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"9", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"10", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"11", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"12", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"13", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"14", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"}
];

var gridData2 = [
	{"CustomerID":"1", "CompanyName":"1212 Futterkiste", "ContactName":"Maria 12", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"Berlin", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"},
	{"CustomerID":"2", "CompanyName":"Alfreds Futterkiste", "ContactName":"Maria Anders", "ContactTitle":"Sales Representative", "Address":"Obere Str. 57", "City":"111", "Region":null, "PostalCode":"12209", "Country":"Germany", "Phone":"030-0074321", "Fax":"030-0076545"}
];


zUI.ui.baseGrid = function(){
	var _core = {
		
		/**
		* 表格主体内容
		* @param {object}
		* @param {object} 
		* @param {number} 
		*/
		tBodyFn: function(columns, data, pageSize){
			var tBodyHtml = '',
				dataLen   = data.length,  //记录总数
				size      = pageSize < dataLen ? pageSize : dataLen,
				j         = pageSize;
			
			tBodyHtml += '<table>';
			for(; j < dataLen; j++){
				tBodyHtml += '<tr>';
				for(var h=0; h < columns.length; h++){
					if( columns[h].render !== undefined ){
						var str = columns[h].render(data[j], j, data[j][columns[h].name]);
						tBodyHtml += '<td>'+ str +'</td>';
					}else{
						tBodyHtml += '<td>'+ data[j][columns[h].name] +'</td>';
					}
				}
				tBodyHtml += '</tr>';
			}
			tBodyHtml += '</table>';
			return tBodyHtml;
		},
		
		/**
		* 内部分页函数
		* @param {string} 分页容器
		* @param {number} 记录总数
		* @param {number} 显示条数
		* @param {number} 当前页
		* @param {function} 
		*/
		pagerFn: function (el, count, pageStep, pageNum, fnGo) {
			this.getLink = function (fnGo, index, pageNum, text) {
				var s = '<a href="#p' + index + '" onclick="' + fnGo + '(' + index + ');" ';
				if (index == pageNum) {
					s += 'class="aCur" ';
				}
				text = text || index;
				s += '>' + text + '</a> ';
				return s;
			}

			//总页数
			var pageNumAll = Math.ceil(count / pageStep);
			if(pageNumAll == 1){
				$(el).html('');
				return;
			}
			var itemNum = 5; //当前页左右两边显示个数
			pageNum = Math.max(pageNum, 1);
			pageNum = Math.min(pageNum, pageNumAll);
			var s = '';
			if(pageNum > 1){
				s += this.getLink(fnGo, pageNum - 1, pageNum, '上一页');
			}else{
				s += '<span>上一页</span> ';
			}
			var begin = 1;
			if(pageNum - itemNum > 1){
				s += this.getLink(fnGo, 1, pageNum) + '... ';
				begin = pageNum - itemNum;
			}
			var end = Math.min(pageNumAll, begin + itemNum * 2);
			if(end == pageNumAll - 1){
				end = pageNumAll;
			}
			for(var i = begin; i <= end; i++) {
				s += this.getLink(fnGo, i, pageNum);
			}
			if(end < pageNumAll){
				s += '... ' + this.getLink(fnGo, pageNumAll, pageNum);
			}
			if(pageNum < pageNumAll){
				s += this.getLink(fnGo, pageNum + 1, pageNum, '下一页');
			}else{
				s += '<span>下一页</span> ';
			}
			$(el).html(s);
		}
	}
	
	/*表格初始化*/
	this.init = function(options){
		var o = options || {},
			g = this;
		if( !o.data ){ return false; }
		var data      = o.data,                                     //json数据源
			columns   = o.columns || {},                            //表格列信息
			wrap      = $(o.wrap),                                  //收纳表格的容器
			id        = o.id || 'l-grid-' + (new Date()).valueOf()  //表格ID
			html      = '<div class="l-gird" id="'+ id +'"></div>',   
			cls       = '',                                         //自定义class
			isPager   = o.isPager || true,                          //是否分页
			pageIndex = 1,                                          //默认当前页
			pageSize  = 10;                                         //每页默认的结果数
		
		wrap.append(html);
		var grid = $('#'+id);
		
		//表头
		var tHeadHtml = '';
		tHeadHtml += '<div class="l-grid-header"><table>';
		tHeadHtml += '<tr>';
		for(var i = 0, l = columns.length; i < l; i++){
			tHeadHtml += '<th>'+ columns[i].display +'</th>';
		}
		tHeadHtml += '</tr>';
		tHeadHtml += '</table></div>';
		grid.append(tHeadHtml);
		
		//内容
		var tBodyHtml = _core.tBodyFn(columns, data, pageSize);
		grid.append('<div class="l-grid-body">'+ tBodyHtml +'</div>');
		
		//固定栏
				
		//底部
			//底部结构
			var tFootHtml = '';
			tFootHtml += '<div class="l-grid-footer">';
			tFootHtml += '<div class="l-grid-footer-message">显示从1到20，总 30 条 。每页显示：'+ pageSize +'</div>';
			tFootHtml += '<div class="l-grid-footer-btns"></div>';
			if( isPager ){
				tFootHtml += '<div class="l-grid-footer-pager"></div>';
			}
			tFootHtml += '<div>';
			grid.append(tFootHtml);
			
			//分页
			if( grid.find('.l-grid-footer-pager') ){
				_core.pagerFn('.l-grid-footer-pager', data.length, pageSize, pageIndex, 'goPage');
			}

		//共享对象
		this.o = o,
		this.id = id,
		this.pageSize = pageSize;
	};
	
	/*表格刷新数据源*/
	this.reflash = function(data){
		var o        = this.o
			columns  = o.columns || {},
			wrap     = $(o.wrap),
			id       = this.id,
			pageSize = this.pageSize,
			html     = '<div class="l-gird" id="'+ id +'"></div>',
			cls      = '';
			
		var grid     = $('#'+id),
			gridBody = grid.find('.l-grid-body');
		
		//内容
		var tBodyHtml = _core.tBodyFn(columns, data, pageSize);
		gridBody.html(tBodyHtml);
	}
}

zUI.ui.grid = new zUI.ui.baseGrid();

