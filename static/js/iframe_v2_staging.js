//V1 - 	if(document.referrer.indexOf("google")<0) return true;//this request is not coming from google - then don't load the parent
function getParameterByName(name) {
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(window.location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
function iframeHelper (initParams){ 
	window.nanoRepProdDomain = initParams.nanoRepProdDomain;
	if(initParams.parentURL != undefined) {
		var strippedParentUrl = initParams.parentURL;
		strippedParentUrl = strippedParentUrl.replace("http://","");
		strippedParentUrl = strippedParentUrl.replace("https://","");
	}
	var self=this; 
	this.inIframe=function () {
							if (window.self == window.top) 
							{
									setTimeout(function(){
									document.getElementsByTagName("body")[0].style.overflow="visible"; // Add a ruler in case we use the iframe as stand alone
									},3000);
							
									//if this paramter is set - then dont allow ever for the iframe to stand alone - only with a parent
									if(initParams.dontAllowJustiframe !=undefined && initParams.dontAllowJustiframe) return false;
									if (strippedParentUrl != undefined && strippedParentUrl == initParams.iframeBasicURL)
									{
										return true;
									}
									
									if(document.referrer.indexOf("google")<0) {
										
										return true;//this request is not coming from google - then don't load the parent
									}
							}
							try {
								return window.self !== window.top;
							} catch (e) {
								return true;
							}
		};
				/*If the page is not in an iframe, we have to reload with the iframe*/
	this.hostingParentURL=initParams.parentURL;
	if(initParams.showImageInModal !== undefined) this.showModal = true; else this.showModal=false;
    if(initParams.showselectiveImageInModal !== undefined) {this.showModal = true;this.showSelectiveModal=true;} ;
	if(initParams.dontshowselectiveImageInModal !== undefined) {this.showModal = true;this.dontshowSelectiveModal=true;} ;
	if(initParams.dontchangeparentURL !== undefined) {
		this.dontchangeparentURL = initParams.dontchangeparentURL;
	}
	else {
		this.dontchangeparentURL = false;
	}
	if(initParams.usequestionmarkinparentUrl !== undefined) this.questioninURL = initParams.usequestionmarkinparentUrl; else this.questioninURL=false; 
	window.questioninURLGeneral=this.questioninURL;
		
	if(initParams.iframeBasicURL !== undefined)
		this.ifameBasicURL=initParams.iframeBasicURL;
	else
		this.ifameBasicURL=window.location.hostname;
if(!this.inIframe()) 
				{
					
					 if (initParams.parentURL !== undefined){
						var path=getParameterByName("path");
						//If the iframe was sent with a path - that means that it needs to open not in the homepage
						if (path == "") {
							path=window.location.href;
							var path = path.replace("https://" + this.ifameBasicURL,"");
							var path = path.replace("http://" + this.ifameBasicURL,"");
						}
						if (path != "") {
							//check if parent already has a query
								if (initParams.parentURL.indexOf('?')>0)
										path="&path="+path;
									else
										path="?path="+path;
						}
						window.location=initParams.parentURL+path;	
					}
				else
					console.log("Error: needs to update the ParentURL when iframeHelper object is created");
				}
	

	// set custom API proxy which will send events to upper frame - this will run only in child
	 // set custom API proxy which will send events to upper frame
 if (window !== window.parent) {
  window._nRepData = window._nRepData || {};
  window._nRepData['onApiProxyReady'] = function() {
   var widgetData = null;
   ISQ.Widget.APIProxyHandler = function(message, sender) {
    widgetData = sender; 
	if(initParams.nanoRepProdDomain== undefined) console.log ("missing ,nanoRepProdDomain:'<%Site.nanoRepDomain%>' in the iframeHelper function in the support center master page");
    message.domain = initParams.nanoRepProdDomain;
    window.parent.postMessage(message, '*');
   };
   addEventListener('message', function(e) {
    var data = e.data;
    if (data && data.type === 'APIProxy' && widgetData) {
     widgetData.cdcUser.sendMessage("subject=apiproxy&data=" + ISQ.Tools.Base64.encodeString(ISQ.Data.jsonToString(data)));
    }
   }, false);
  }
 }
	this.prevHeight1 = 0;
	this.prevHeight2 = 0;
	this.sendWindowSize=function (){
					if (window.self == window.top) return;
					var lastElementOnPage = document.getElementById('nrBottomOfPage');
					if (lastElementOnPage==null) {console.log("please add back the div with ID nrBottomOfPage to the bottom of support page iframe");  return;}
					var rec = lastElementOnPage.getBoundingClientRect();
					var height = lastElementOnPage.scrollHeight + rec.top;
					if (height === self.prevHeight1) return;
					self.prevHeight1 = height;
					document.body.style.height = height + "px";
					data={messageType:"changeIframeSize",height:height};
					window.top.postMessage(data, "*");
					
					// calculating window size
					setTimeout(function()
							   {
								   document.body.style.overflow = 'auto';
								var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
								//height = Math.max(height, document.body.parentNode.scrollHeight);
								document.body.style.height = 'auto'
								document.body.style.overflow = 'hidden';
								   
								if (height === self.prevHeight2) return;
								self.prevHeight2 = height;

								// sending post message
								//console.log('from iframe: ' + height)
								data={messageType:"changeIframeSize",height:height};
								window.top.postMessage(data, "*");
							   },100);
	}	;  
					
	 this.sendNewUrl= function(siteDomain){
					var newPath = document.location.href.toLowerCase();
					
					 var newstr="http://" + self.ifameBasicURL;
					 var pos= newstr.length;
					 if ( newPath.indexOf(newstr)<0) pos=pos+1;//if its not found, then its probably with https so we add 1 for the s 
					newPath= document.location.href.substr(pos,document.location.href.length);

					if(newPath=="/") newPath="";
					else if (newPath.substr(0,1)!="/") newPath="/"+newPath;
					
					data={messageType:"changeURL",
						location:newPath,
					useQuestionmark:self.questioninURL};
					if (self.dontchangeparentURL==false) {
						window.top.postMessage(JSON.parse(JSON.stringify(data)), "*");
					}
					
	};	
	//This function also serves as all functionality that is needed for when the page is loaded
	this.everyChild=[];
	this.notifyWidget= function(msgType,params){
		var iframe =document.querySelectorAll('button[id^="nanoRep_frame"]')[0].contentWindow;
		if (iframe !== undefined){
		
		data.assign({messageType:msgType},params);
								iframe.postMessage(data, "*");
							   };
	}
	this.InitiateResizeIframe=function(){
					if (window.addEventListener){
								  window.addEventListener("resize", self.sendWindowSize, false);
								window.addEventListener("load", self.sendNewUrl, false);
					}
					
					else if (window.attachEvent){
								 window.attachEvent("onresize", self.sendWindowSize);
								 window.attachEvent("onload", self.sendNewUrl);
					}
					setInterval(function(){self.sendWindowSize()}, 150);
					
					//All other functionality needed when page loads

						//This code takes care of clicking on an image in an article would open a Modal, there are 3 options:
						//1. magnify all, 2. magnify only images with class=magnify and 3. magnify only those that don't have class="no_magnify"
						everyChild=[];
						if(self.showSelectiveModal) 			self.everyChild = document.querySelectorAll("#articlePage img.magnify");
						else { if(self.dontshowSelectiveModal) 	self.everyChild = document.querySelectorAll("#articlePage img:not(.no_magnify)");
						
						else if(self.showModal) self.everyChild = document.querySelectorAll("#articlePage img");}
							var everyChild = self.everyChild;
							for (var i = 0; i<everyChild.length; i++) {
								if (everyChild[i].parentNode.tagName.toLowerCase()==="a") continue;
									everyChild[i].style.cursor="pointer";
									everyChild[i].onclick=function(e){
									//if image is used as a link then we don't want to magnify it
									data={messageType:"openModal",
										targetUrl:e.target.src};
										if(typeof show_modal_localy==='function') 	show_modal_localy(e.target.src); 
										else window.top.postMessage(JSON.parse(JSON.stringify(data)), "*");
								} 
							}
					
					//From here - functionality that is not related to non iframe solutions
					if (window.self == window.top) return;	
					self.everyChild = document.querySelectorAll("#articlePage a,.nr-answering-bodycontent a");
					//This code takes care of links that needs to be reloaded outside the iframe
					var everyChild = self.everyChild;
						for (var i = 0; i<everyChild.length; i++) {
							if((everyChild[i].getAttribute("nanoreplinkid") ==null) //if not an internal link to another article;
								&& (everyChild[i].getAttribute("target")==undefined))		//in target was not set yet
								{everyChild[i].setAttribute("target","_blank");}
							}
	
		if(self.questioninURL){
		//	self.notifyWidget("ChangeShareAddress",{type:"toQuestion"});
		}
	}
	//End section
	//This serve as communication with the search widget iframe
	this.receiveMessage = function(messageEvent){
            if (!(messageEvent.data)) return;
			switch (messageEvent.data.messageType){
				case 'openModal':
					if(typeof show_modal_localy==='function') 	show_modal_localy(messageEvent.data.targetUrl); else window.top.postMessage(messageEvent.data, "*");
					break;
				case 'goBack':
				if (self.dontchangeparentURL==false) history.back();
					break;
				default:
				break;
			}
	}
	//run this for the first time to start this operation otherwize the first time it would run it will not have time to load the files and will take a long time
	if (this.showModal &&  self.everyChild.length>0 ){
	data={messageType:"openModal",
					targetUrl:""};
					if(typeof show_modal_localy==='function') 	show_modal_localy(); else window.top.postMessage(JSON.parse(JSON.stringify(data)), "*");
	}
	if (window.addEventListener)
		  window.addEventListener("message", self.receiveMessage, false);
	else if (window.attachEvent)
		 window.attachEvent("onmessage", self.receiveMessage);
	};		


// (AD SDK) adapter which uses provider instance from the host page
if (window !== window.parent) {
(function() {

// do nothing if we don't have SDK
var sdkIsLoaded = window.nanoRep && window.nanoRep.SDK;
if (!sdkIsLoaded) {
	return;
}


////////////////////////////////////////////////////////////////////////////////////
// Proxy function which allows calling host window methods with support of callbacks
var nrAPIProxy = (function() {
	var _funcId = 0;
	var _funcMap = {};

	// if widget is running in its own page without the hosted page -> simply execute specified function
	if (window === window.top) {
		return function(functionName /*, args... */) {
			// variables
			var args = Array.prototype.slice.call(arguments, 1),
				pluckList = functionName.split('.'),
				pluckObject = window,
				pluckProperty = null;

			for (var i = 0; i < pluckList.length; i++) {
				// skip optional window statement
				pluckProperty = pluckList[i];
				if (i === 0 && pluckList[i] === 'window') {
					continue;
				}
				if (i < pluckList.length - 1) {
					pluckObject = pluckObject[pluckProperty];
				}
			}

			pluckObject[pluckProperty].apply(pluckObject, args);
		};
	}

	// ensure that Proxy on the parent frame is ready
	function waitForProxy(callback) {
		// save callback into queue
		if (waitForProxy.resolved) {
			callback();
			return;
		} else if (waitForProxy.loading) {
			waitForProxy.callbacks.push(callback);
			return;
		}

		waitForProxy.loading = true;
		waitForProxy.callbacks = [callback];

		// initiate loading
		waitForProxy.timer = setInterval(function() {
			window.parent.postMessage({type: 'APIProxyReady'}, '*');
		}, 500);
	}

	// TD: return cleanup function and support nested functions in arguments
	function executeFunctionInHostWindow(functionName /*, args... */) {
		var args = Array.prototype.slice.call(arguments, 1);

		waitForProxy(function() {
			// object which will be sent to parent frame
			var postMessageObject = {
				type: 'APIProxy',
				func: functionName,
				args: args
			};

			// replace functions with unique placeholders strings
			for (var i = 0; i < postMessageObject.args.length; i++) {
				if (typeof postMessageObject.args[i] === 'function') {
					var newFuncId = '_funcId' + _funcId++;
					_funcMap[newFuncId] = postMessageObject.args[i];
					postMessageObject.args[i] = newFuncId;
				}
			}

			// send message to parent window
			postMessageObject.domain = window.nanoRepProdDomain;
			window.parent.postMessage(postMessageObject, '*');
		});
	}

	// common callback handler
	executeFunctionInHostWindow.handleCallback = function(data) {
		if (data && data.type === 'APIProxy' && data.funcId) {
			_funcMap[data.funcId].apply(window, data.args);
		}
	};
	
	// add listener for the messages from the top frame
    addEventListener('message', function(e) {
        var data = e.data;
        if (data && data.type === 'APIProxyReadyConfirm') {
			waitForProxy.resolved = true;
			clearInterval(waitForProxy.timer);
			if (waitForProxy.callbacks && waitForProxy.callbacks.length) {
				for(var i = 0; i < waitForProxy.callbacks.length; i++) {
					waitForProxy.callbacks[i]();
				}
				waitForProxy.callbacks = null;
			}
        } else if (data && data.type === 'APIProxy') {
			executeFunctionInHostWindow.handleCallback(data);
        }
    });

	// expose function
	return executeFunctionInHostWindow;
}());

	
nanoRep.SDK.Channeling.Chat.getProvider = (function() {
    // cache created provider wrappers
    var providersMap = {};

    // returns public
    return function(channel) {
        // detect channel name (some providers might require multiple instances)
        var uniqueChannelName = nanoRep.SDK.Channeling.Chat.Providers[channel.chatProvider].prototype.getChannelId(channel);

        // return cached wrapper
        if (providersMap[uniqueChannelName]) return providersMap[uniqueChannelName];

        // initialize chat provider in host page
        var randomProviderName = '_hosted_' + uniqueChannelName + '_chat_adapter';
        nrAPIProxy('eval', 'window.' + randomProviderName + ' = nanoRep.SDK.Channeling.Chat.getProvider(' + JSON.stringify(channel) +  ')');

        // create adapter object
        var WrappedProvider = {};

        // save wrapped provider instance
        providersMap[uniqueChannelName] = WrappedProvider;

        // create func wrapper
        var createFunctionWrapper = function(methodName) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(randomProviderName + '.' + methodName);
                nrAPIProxy.apply(ISQ.Widget, args);
            }
        };

        // get chat provider prototype
        var providerPrototype = nanoRep.SDK.Channeling.Chat.Providers[channel.chatProvider].prototype;
        for(var prop in providerPrototype) {
            if (providerPrototype.hasOwnProperty(prop)) {
                if (typeof providerPrototype[prop] === 'function') {
                    WrappedProvider[prop] = createFunctionWrapper(prop);
                }
                else {
                    WrappedProvider[prop] = providerPrototype[prop];
                }
            }
        }

        // override event emitter methods
        WrappedProvider.on = function(event, handler) {
            // support short function call with two arguments: channel, eventMap
            if (typeof event === 'object') {
                for (var eventName in event) {
                    if (event.hasOwnProperty(eventName)) {
                        this.on(eventName, event[eventName]);
                    }
                }
                return;
            }

            // subscribe for events on host page
            if (typeof event === 'string' && typeof handler === 'function') {
                nrAPIProxy(randomProviderName + '.on', event, handler);
            }

            // save copy of event handlers to local wrapped object (to be in sync with hosted api)
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(handler);
        };
        WrappedProvider.off = function(event, handler) {
            // support short function call with two arguments: channel, eventMap
            if (typeof event === 'object') {
                for (var eventName in event) {
                    if (event.hasOwnProperty(eventName)) {
                        this.on(eventName, event[eventName]);
                    }
                }
                return;
            }

            // subscribe for events on host page
            if (typeof event === 'string' && typeof handler === 'function') {
                nrAPIProxy(randomProviderName + '.off', event, handler);
            }

            // remove local event handlers (to be in sync with hosted api)
            this._events = this._events || {};
            if (event in this._events === false) return;
            this._events[event].splice(this._events[event].indexOf(handler), 1);
        };

        // return wrapped provider
        return WrappedProvider;
    };
}());

// workaround for multiple Chat SDK includes
var origFunc = nanoRep.SDK.Channeling.Chat.getProvider;
setInterval(function() {
  if(nanoRep.SDK.Channeling.Chat.getProvider !== origFunc) {
    nanoRep.SDK.Channeling.Chat.getProvider = origFunc;
  }
}, 10);

}());
}