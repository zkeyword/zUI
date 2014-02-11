zUI.app.editor = function(options){
	var o = options || {};
	if(!o.trigger){return;};
	var trigger    = $(o.trigger).wrap('<div class="l-ui-editorWrap"></div>').hide(),
		width      = o.width || 600,
		height     = o.height || 300,
		wrap       = trigger.parent().css({width:width,height:height}),
		text       = trigger.html(),
		form       = trigger.parents('form'),
		browser    = zUI.base.browser,
		iframe,
		editorWin,
		editorDoc,
		editorBox,
		toolHeight,
		range,
		bookmark,
		_core      = {
						data: [
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
						
						createTool: function(){
							var html = '',
								data = _core.data,
								len  = data.length,
								i    = 0;
							html += '<div class="l-ui-editor-tool fn-clear">';
							for(; i < len; i++){
								html += '<a href="javascript:;" title="'+ data[i].title +'"><span class="l-ui-editor-toolIco l-ui-editor-toolIco-'+ data[i].name +'" name="'+ data[i].name +'"></span></a>';
							}
							html += '</div>';
							wrap.prepend(html);
							toolHeight = wrap.find('.l-ui-editor-tool').outerHeight();
						},
						
						createEditor: function(){
							iframe    = wrap.append('<iframe class="l-ui-editor-iframe" src="javascript:;" frameborder="0"></iframe>')
											.find('.l-ui-editor-iframe')
											.css({width:width,height:height - toolHeight});
							editorWin = iframe[0].contentWindow;
							editorDoc = iframe[0].contentDocument || editorWin.document; // W3C || IE
							
							editorDoc.write('<html><body style="margin:0;padding:5px;" contenteditable="true" designMode="on">'+ text +'</body></html>');
							
							editorBox = $(editorDoc).find('body');
						},
						
						/*全屏显示*/
						fullscreen: function(){
							if( wrap.hasClass('l-ui-editorWrap-full') ){
								wrap.removeClass('l-ui-editorWrap-full')
									.css({width:'100%', height:height});
								iframe.css({width:'100%', height:height - toolHeight});
								$('body').css({position:''});
							}else{
								var winHeight = $(window).height(),
									iframeHeight = winHeight - wrap.find('.l-ui-editor-tool').outerHeight();
								wrap.addClass('l-ui-editorWrap-full')
									.css({width:'100%', height:winHeight});
								iframe.css({width:'100%', height:iframeHeight});
								$('body').css({position:'relative'});
							}
						},
						
						/*插入链接或修改链接*/
						getlink: function(){
							var html = '',
								sel  = _core.getSelection(),
								text,
								span;
							if( parseInt(browser.msie, 10) < 9 ){
								text = sel.text;
							}else{
								text = sel.toString();
							}

							_core.setCommand('inserthtml', '<span id="l-ui-editor-span">' + text + '</span>');
							span = editorBox.find('#l-ui-editor-span');
							
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
								colseFn:function(){
									span.replaceWith(text);
								},
								btns:[
									{
										text:'插入链接',
										onclick:function(){
											var url    = $('#l-ui-editor-url').val(),
												title  = $('#l-ui-editor-linkTitle').val(),
												target = $('#l-ui-editor-linkCheckbox').val();
											
											span.replaceWith('<a href="' + url + '">' +  text + '</a>');
										}
									},
									{
										text:'取消',
										onclick: function(){
											span.replaceWith(text);
										}
									}
								]
							});
						},
						
						/*获取选中对象*/
						getSelection: function(){
							if( editorWin.getSelection ){
								return editorWin.getSelection();
							}else if( editorDoc.selection ){
								return editorDoc.selection.createRange();
							}
						},
						
						/*获取选中对象的父节点*/
						getParentNode: function(){
							if (window.getSelection){
								return _core.getSelection().getRangeAt(0).startContainer.parentNode;
							}else if(document.selection){ 
								return _core.getSelection().parentElement();
							}
						},
						getCurrentNode: function(){
							if (window.getSelection) return _core.getSelection().getRangeAt(0).startContainer;
							else if (document.selection) return _core.getSelection();
						},
						setFocusNode: function(node, toStart){
							var range = _core.doc.createRange();

							var selection = _core.getSelection();
							toStart = toStart ? 0 : 1;
					
							if (selection !== null)
							{
								range.selectNodeContents(node);
								selection.addRange(range);
								selection.collapse(node, toStart);
							}

							_core.focus();
						},
						
						/*获取源码*/
						getSource: function(){
						
						},
						
						getList: function(){
							var parent          = _core.getParentNode(),
										parentNodeName  = parent.nodeName.toLowerCase(),
										current         = _core.getCurrentNode(),
										currentNodeName = current.nodeName.toLowerCase();
							_core.setCommand(cmd);
						},
						
						
						
						
						
						
						
						
						
						_getDoc: function(){
							return editorDoc || editorWin;
						},
						_getSelection: function(){
							return (editorWin.getSelection) ? editorWin.getSelection() : _core._getDoc().selection;
						},
						_getRange: function(){
							var selection=_core._getSelection(), d=_core._getDoc(),r;
							try{//标准dom
							r = selection.rangeCount > 0 ? selection.getRangeAt(0) : (selection.createRange ? selection.createRange() : d.createRange());
							}catch (e){}
							if(!r) r = browser.msie ? d.body.createTextRange() : d.createRange();
							return r;
						},
						
						getlink2: function(){
							var html = '';
							
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
						
						
						//事件绑定
						addEvent: function(el, type, fn) {
							el.addEventListener ? el.addEventListener(type, fn, false) : 
							el.attachEvent('on' + type, function() { fn.call(el); })
						},
						// 保存快照用于IE定位
						saveBookMark: function() {
							_core.addEvent(iframe[0], 'beforedeactivate', function() {
								var rng = editorDoc.selection.createRange();
								if(rng.getBookmark) {
									bookmark = editorDoc.selection.createRange().getBookmark(); // 保存光标用selection下的createRange();
								}
							});
							_core.addEvent(iframe[0], 'activate', function() {
								if(bookmark) {
									// Moves the start and end points of the current TextRange object to the positions represented by the specified bookmark.
									// 将光标移动到 TextRange 所以需要用 body.createTextRange();
									var rng = editorDoc.body.createTextRange();				
									rng.moveToBookmark(bookmark);
									rng.select();
									bookmark = null;
								}
							});
						},
						
						
						
						/*存储光标位置*/
						saveFocus: function(){
							if (editorDoc.selection) { //只有坑爹的IE才执行下面的代码
								range    = editorDoc.selection.createRange();
								//bookmark = range.getBookmark();
							}
						},
						insertImg: function(_img){
							if (range) { //同样，坑爹IE专用代码
								//range.moveToBookmark(bookmark);
							 range.select();
							}
							_core.setCommand('InsertImage', _img)
						},
						
						getImages: function(){
							var html = '';
							
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
											_core.insertImg(url);	
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
						
						createLink: function(url, title, target){
							editorDoc.execCommand('createlink',false,url);
						},
						
						getlink3: function(){
							var html = '';
							
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
											var url    = $('#l-ui-editor-url').val(),
												title  = $('#l-ui-editor-linkTitle').val(),
												target = $('#l-ui-editor-linkCheckbox').val();
											_core.createLink(url,title,target);	
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

						
						/*执行操作*/
						exec: function(cmd){
							switch (cmd){
								case 'insertUnorderedList':
									_core.getList(cmd,'ul');
								break;
								case 'insertOrderedList':
									_core.getList(cmd,'ol');
								break;
								case 'createlink':
									_core.getlink3();
								break;
								case 'fullscreen':
									_core.fullscreen();
								break;
								case 'source':
									_core.getSource();
								break;
								case 'insertImage':
									_core.getImages();
								break;
								default:
									_core.setCommand(cmd);
							}
							_core.setText();
						},
						
						/*设置文本execCommand*/
						setCommand: function(cmd, param){
							editorWin.focus();
							if (param != undefined) {
								if (cmd == 'inserthtml' && browser.msie){
									editorDoc.selection.createRange().pasteHTML(param);
								}else if (cmd == 'formatblock' && browser.msie){
									editorDoc.execCommand(cmd, false, '<' +param + '>');
								}else{
									editorDoc.execCommand(cmd, false, param);
								}
							} else {
								editorDoc.execCommand(cmd, false, null)
							}
						},
						
						/*设置文本*/
						setText: function(){
							var text = editorBox.html();
							trigger.val(text)
						},
						
						init: function(){
							_core.createTool();
							_core.createEditor();
							_core.saveBookMark();
							
							wrap.find('.l-ui-editor-toolIco')
								.mousedown(function(){
									var name = $(this).attr('name');
									_core.exec(name);
								});
								
							editorBox.blur(function(){
										_core.setText();
									 })
									//.click(function(){
										//_core.saveFocus();
										
										//_core.saveBookMark();
									// })
									.keydown(function(e){
										var k = e.keyCode;
										if( k == 13 && !e.shiftKey ){
											var parent          = _core.getParentNode(),
												parentNodeName  = parent.nodeName.toLowerCase(),
												current         = _core.getCurrentNode(),
												currentNodeName = current.nodeName.toLowerCase();
											console.log()
											if( parentNodeName == 'body' ){
												_core.setCommand('formatBlock','p');
											}else if( parentNodeName == 'ol' ){
												$(parent).parents('p').after($(parent));
											}
										}
										
										//_core.saveBookMark();
								
										//_core.saveFocus();
								
									// if(e.ctrlKey){
										// switch( k ){
											// case 90 :  // Ctrl + z
												// _core.setCommand('undo');
											// break;
											// case 90 :  // Ctrl + z
												// _core.setCommand('undo');
											// break;
										// }
									// }
									 });
									 
							
						}
					}
				
	_core.init();
}

