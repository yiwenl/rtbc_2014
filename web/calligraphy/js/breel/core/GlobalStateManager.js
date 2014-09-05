// GlobalStateManager.js

(function() {
	// IMPORTS
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var HistoryStateManager = breelNS.getNamespace("generic.core").HistoryStateManager;

	var AssetManager = breelNS.getNamespace("generic.core").AssetManager;
	var SoundManager = breelNS.getNamespace("generic.core").SoundManager;
	var namespace = breelNS.getNamespace("generic.core");
	var pageNamespace = breelNS.getNamespace(breelNS.projectName+".page");
	var core;

	if(!namespace.GlobalStateManager) {
		var GlobalStateManager = function() {
			this._currentState = "";
			this._nextState = "";
			this._preState = "";
			this._params = {};
			this._loader = null;
			this._isMainLoaded = false;
			this.pages = {};

			this._nClosed = 0;
			this._nToClose = 0;
			this._nOpened = 0;
			this._nToOpen = 0;
			this._toLoadID = "";
			this._blocker = null;
		}

		GlobalStateManager.END_PAGE_OPEN 		= "endPageOpen";
		GlobalStateManager.END_PAGE_CLOSE 	= "endPageClose";
	
		namespace.GlobalStateManager = GlobalStateManager;
		var p = GlobalStateManager.prototype;

		p.init = function() {
			core = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

			this.historyStateManager = HistoryStateManager.create();
			this.onHistoryStateChangedBound = ListenerFunctions.createListenerFunction(this, this.onHistoryStateChanged);
			this.historyStateManager.addEventListener(HistoryStateManager.STATE_CHANGED, this.onHistoryStateChangedBound);

			this._onPageOpenedBound = ListenerFunctions.createListenerFunction(this, this._onPageOpened);
			this._onPageClosedBound = ListenerFunctions.createListenerFunction(this, this._onPageClosed);

			this._onLoaderOpenedBound = ListenerFunctions.createListenerFunction(this, this._onLoaderOpened);
			this._onLoaderClosedBound = ListenerFunctions.createListenerFunction(this, this._onLoaderClosed);

			this._onAssetLoadedBound = ListenerFunctions.createListenerFunction(this, this._onAssetLoaded);
			this._onAssetProgressBound = ListenerFunctions.createListenerFunction(this, this._onAssetProgress);

			this._createBlocker();
		};

		p._createBlocker = function() {
			this._blocker = document.createElement("div");
			this._blocker.style.width = "100%";
			this._blocker.style.height = "100%";
			this._blocker.style.position = "absolute";
			this._blocker.style.top = "0px";
			this._blocker.style.left = "0px";
			this._blocker.style.zIndex = "99";
			this._blocker.style.display = "none";
			this._blocker.id = "siteBlocker";
			document.body.appendChild(this._blocker);
		};


		p.setDefaultState = function() {
			if(core.config.getVar("startParams") != "undefined") {
				this.setPage( core.config.getVar("page"), core.config.getVar("startParams"));
			} else {
				this.setPage( core.config.getVar("page") );
			}
		};
		p.preState = function() {	if(this._preState != "") this.setPage(this._preState);	};

		p.setPage = function(pageID, params) {
			if(!core.config.hasPage(pageID)) return;
			else if (pageID == this._currentState) return;

			this._params = params;
			this._nextState = pageID;

			if(!this._isMainLoaded) {
				this._loadPage(this._nextState, core.config.getMainLoader());
			} else {
				this._loadPage(this._nextState);
			}
		};


		p._loadPage = function(stateID, loaderPage) {
			//console.log('GlobalStateManager loadState: ');
			if(this._loader != undefined) {
				ListenerFunctions.removeDOMListener(this._loader, GlobalStateManager.END_PAGE_CLOSE, this._onLoaderClosedBound);
				this._loader.close();
			}

			if(loaderPage == undefined) loaderPage = core.config.getStateLoader(stateID); 
			this._loader = this._buildPage(loaderPage, false);
			this._toLoadID = stateID;
			//console.log('GlobalStateManager loadState: stateID', stateID);

			if(this._loader != undefined) {
				ListenerFunctions.addDOMListener(this._loader, GlobalStateManager.END_PAGE_OPEN, this._onLoaderOpenedBound);
				ListenerFunctions.addDOMListener(this._loader, GlobalStateManager.END_PAGE_CLOSE, this._onLoaderClosedBound);
				//console.log('GlobalStateManager loadState: if this._loader != undefined');
				this._loader.open();
				this._blocker.style.display = "block";
			}
		};


		p._buildPage = function(pageID, toListen) {
			// console.log("pageID : ", pageID);
			if(this.getPage(pageID) == null) {
				var className = core.config.getPageClass(pageID);
				if(pageNamespace[className]==undefined) {
	 				throw new Error("Page not exist : "+ pageID);
	 			}

	 			var pageDetails = core.config.getPage(pageID);
	 			// console.log("pageDetails : ", pageDetails);
	 			// var defaultState = core.config.getPageDefaultState(pageID);
	 			
 				var defaultState = (pageDetails !== null) ? pageDetails.page.attributes["default_state"].value : undefined;
 				var defaultSection = (pageDetails !== null) ? pageDetails.page.attributes["default_section"].value : undefined;
 				var states = (pageDetails !== null) ? pageDetails.states : undefined;
 				var sections = (pageDetails !== null) ? pageDetails.sections : undefined;
	 			
	 			if(pageDetails !== null) {
	 				if(defaultState == "") defaultState = undefined;
	 				if(defaultSection == "") defaultSection = undefined;
	 				if(states.length == 0) states = undefined;
	 				if(sections.length == 0) sections = undefined;
	 			}
	 			
	 			var parent = undefined;

	 			var page = new pageNamespace[className](className, defaultState, defaultSection ,states, sections, parent);
				
				this._listenPage(page, toListen);
				document.body.appendChild(page.getContainer());
				page.getContainer().id = pageID;
				this.pages[pageID] = page;
				if(this._params != undefined) page.setParams(this._params);
				page.initialize();
				return page;
			}

			return this.getPage(pageID);
		};


		p._listenPage = function(page, toListen) {
			if(toListen) {
				ListenerFunctions.addDOMListener(page, GlobalStateManager.END_PAGE_OPEN, this._onPageOpenedBound);
				ListenerFunctions.addDOMListener(page, GlobalStateManager.END_PAGE_CLOSE, this._onPageClosedBound);
			} else {
				ListenerFunctions.removeDOMListener(page, GlobalStateManager.END_PAGE_OPEN, this._onPageOpenedBound);
				ListenerFunctions.removeDOMListener(page, GlobalStateManager.END_PAGE_CLOSE, this._onPageClosedBound);
			}
		};


		p._onPageOpened = function(e) {
			if(e != null) {
				this._nOpened ++;
			}

			if(this._nToOpen == this._nOpened) {
				this._blocker.style.display = "none";
				this._params = null;
			}
		};


		p._onPageClosed = function(e) {
			if(e != null) {
				var page = e.detail.page;
				this._listenPage(page, false);
				document.body.removeChild(page.getContainer());
				this.pages[page.getContainer().id] = null;
				this._nClosed++;

				var assets = core.config.getPageAssetNodes(page.getContainer().id);

				for ( var i=0; i<assets.length; i++) {
					core.assetManager.removeAsset(assets[i]);
				}
			} 

			if(this._nToClose == this._nClosed) {
				this._openPages(core.config.getStatePagesToOpen(this._nextState));
			}
		};


		p._onLoaderOpened = function(e) {
			//console.log('GlobalStateManager onLoaderOpened: ', this._toLoadID);
			var stateID = this._toLoadID;
			var nodes = core.config.getStateAssetNodes(stateID, !this._isMainLoaded);

			ListenerFunctions.addDOMListener(core.assetManager, AssetManager.ALL_COMPLETE, this._onAssetLoadedBound);
			ListenerFunctions.addDOMListener(core.assetManager, AssetManager.PROGRESS, this._onAssetProgressBound);

			for ( var i=0; i<nodes.length; i++) {
				var node = nodes[i];
				var id = node.attributes["id"].value;
				if(!core.assetManager.hasAsset(id)) {
					var path = node.attributes["src"].value;
					var type = node.attributes["type"].value;
					core.assetManager.enqueue(id, type, path);
				}
			}

			core.scheduler.delay(core.assetManager, core.assetManager.startLoading, [], .5);
		};


		p._onAssetProgress = function(e) {
			//console.log( e.detail.loaded , e.detail.total );
			if(this._loader) {
				if(this._loader.setLoadingPercent) this._loader.setLoadingPercent(e.detail.loaded / e.detail.total);
			}
		};


		p._onAssetLoaded = function(e) {
			//console.log( "All assets loaded" );
			ListenerFunctions.removeDOMListener(core.assetManager, AssetManager.ALL_COMPLETE, this._onAssetLoadedBound);
			ListenerFunctions.removeDOMListener(core.assetManager, AssetManager.PROGRESS, this._onAssetProgressBound);
			if(this._loader) this._loader.close();
			else this._onLoaderClosed(null);
		};


		p._onLoaderClosed = function(e) {
			if(!this._isMainLoaded) this._isMainLoaded = true;
			if(this._loader) this._clearLoader(e.detail.page.getContainer().id);
			console.log("this._nextState : ", this._nextState);
			if(this._nextState !== null){
				this._closePages( core.config.getStatePagesToClose(this._nextState) );
			}
		};


		p._clearLoader = function(loaderID) {
			try {
				document.body.removeChild(this._loader.getContainer());	
			} catch(e) {
				//console.log( e );
			}
				
			ListenerFunctions.removeDOMListener(this._loader, GlobalStateManager.END_PAGE_OPEN, this._onLoaderOpenedBound);
			ListenerFunctions.removeDOMListener(this._loader, GlobalStateManager.END_PAGE_CLOSE, this._onLoaderClosedBound);
			this.pages[loaderID] = null;
			this._loader = null;
		};


		p._closePages = function(pages) {
			var i = 0;
			this._nClosed = 0;
			var pageToClose = [];
			for(i=0; i<pages.length; i++) {
				var page = this.getPage(pages[i]);
				if(page) pageToClose.push(page);
			}


			this._nToClose = pageToClose.length;
			if(this._nToClose == 0 ) this._onPageClosed(null);
			else {
				for(i=0; i<pageToClose.length; i++) {
					this._toClosePage(pageToClose[i]);
				}
			}
		};


		p._openPages = function(pages) {
			this._preState = this._currentState;
			this._currentState = this._nextState;
			this._nextState = null;

			var i = 0;
			this._nToOpen = 0;
			this._nOpened = 0;

			var pagesToOpen = [];
			for (i=0; i<pages.length; i++) {
				var page = this._buildPage(pages[i], true);
				if(page && !page.isOpened) pagesToOpen.push(page);
				else if(page && page.isOpened && this._params) page.setParams(this._params);
			}

			this._nToOpen = pagesToOpen.length;
			if(this._nToOpen == 0) this._onPageOpened(null);
			else {
				for(i=0; i<pagesToOpen.length; i++) {
					this._toOpenPage(pagesToOpen[i]);
				}
			}
		};

		p.onHistoryStateChanged = function(aState) {
			
		};


		p._toClosePage = function(page) {	page.close();	};
		p._toOpenPage = function(page) {	page.open();	};

		p.getPage = function(pageID) {	return this.pages[pageID];	};
		p.getPreState = function() {	return this._preState;	};
		p.getCurrentState = function() {	return this._currentState;	};
		p.getNextState = function() {	return this._nextState;	};

		p.getOpenedUIs = function() {
			var a = [];
			for ( var page in this.pages) {
				if(this.pages[page] != null ) a.push(this.pages[page]);
			}
			return a;
		}
	}
	
})();