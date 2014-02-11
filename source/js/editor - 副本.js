zUI.app.editor2 = function(options){
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
		editor     = {

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
					})
					.keydown(function(e){
						var k = e.keyCode;
						if( k == 13 && !e.shiftKey ){
							
						}
					});
				
			},

			
			/*获取连接插入框*/
			getLink: function(command){
				var _this = this,
					html  = '';

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
					btns:[
						{
							text:'插入链接',
							onclick:function(){
								var _val = $('#l-ui-editor-url').val();
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

			/*全屏显示*/
			fullscreen: function(){
				if( wrap.hasClass('l-ui-editorWrap-full') ){
					wrap.removeClass('l-ui-editorWrap-full')
						.css({width:'100%', height:height});
					this.iframe.css({width:'100%', height:height - toolHeight});
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

			/*获取图片插入框*/
			getImages: function(){
				var _this = this,
					html  = '';				
				html += '<div id="link-options">' +
							'<p class="howto">输入目标URL</p>' +
							'<div>' +
							'	<label><span>url</span><input id="l-ui-editor-img" type="text" name="linktitle"></label>'
							'</div>' +
						'</div>';
						
				zUI.ui.pop.open({
					title:'插入图片',
					width:200,
					height:150,
					html:html,
					btns:[
						{
							text:'插入图片',
							onclick:function(){
								var url = $('#l-ui-editor-img').val()
								_this.setCommand('insertImage', url)	
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

			/*保存快照用于IE定位*/
			saveBookMark: function(){
				var _this = this;

				_this.ifr.attachEvent('onbeforedeactivate', function (){
					var rng = _this.doc.selection.createRange();
					if( rng.getBookmark ){
						_this.bookmark = _this.doc.selection.createRange().getBookmark(); // 保存光标用selection下的createRange();
					}
				});

				_this.ifr.attachEvent('onactivate', function (){
					if( _this.bookmark ){
						// Moves the start and end points of the current TextRange object to the positions represented by the specified bookmark.
						// 将光标移动到 TextRange 所以需要用 body.createTextRange();
						var rng = _this.doc.body.createTextRange();
						rng.moveToBookmark(_this.bookmark);
						rng.select();
						_this.bookmark = null;
					}
				});
			},
			
			/*执行操作*/
			exec: function(cmd){
				var _this = this;
				switch (cmd){
					case 'insertUnorderedList':
						_this.getList(cmd,'ul');
					break;
					case 'insertOrderedList':
						_this.getList(cmd,'ol');
					break;
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
 
			/*执行命令*/
			setCommand: function(name, arg){
				try {
					this.ifr.contentWindow.focus(); // 放置焦点要操作contentWindow
					this.doc.execCommand(name, false, arg);
				} catch (e) {}
			},

			/*设置文本*/
			setText: function(){
				var text = _this.editorBox.html();
				trigger.val(text)
			},
			
			/*创建工具条*/
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

			/*创建空白iframe*/
			createIframe : function () {
				var _this = this;

				_this.iframe = wrap.append('<iframe class="l-ui-editor-iframe" src="javascript:;" frameborder="0"></iframe>')
								   .find('.l-ui-editor-iframe')
								   .css({width:width,height:height - _this.toolHeight});

				_this.ifr = _this.iframe[0];
				_this.doc = _this.ifr.contentDocument || _this.ifr.contentWindow.document; // W3C || IE
				_this.doc.open();
				_this.doc.write('<html><body style="margin:0;padding:5px;" contenteditable="true" designMode="on">'+ text +'</body></html>');
				_this.doc.close();

				_this.editorBox = $(_this.doc).find('body')
			}
		};
	editor.init()
}