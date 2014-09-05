// ConfigSite.js

(function() {
	//	IMPORTS
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var XmlLoader = breelNS.getNamespace("generic.loading").XmlLoader;

	var namespace = breelNS.getNamespace("generic.core");
	var core;

	if(!namespace.ConfigSite) {
		var ConfigSite = function() {
			this._configURL = null;
			this._configXML = null;
			this.config = null;
			this.pages = null;
			this.templates = null;
			this.assets = null;
		}

		ConfigSite.CONFIG_LOADED = "configLoaded";
		namespace.ConfigSite = ConfigSite;
		var p = ConfigSite.prototype = new EventDispatcher();

		p.setup = function(path) {
			this._configURL = path;

			this.onConfigLoadedBound = ListenerFunctions.createListenerFunction(this, this.onConfigLoaded);
			this.onConfigErrorBound = ListenerFunctions.createListenerFunction(this, this.onConfigError);

			this._xmlLoader = XmlLoader.create(path);
			ListenerFunctions.addDOMListener(this._xmlLoader, XmlLoader.LOADED, this.onConfigLoadedBound);
			ListenerFunctions.addDOMListener(this._xmlLoader, XmlLoader.ERROR, this.onConfigErrorBound);
			this._xmlLoader.load();
		};


		p.onConfigLoaded = function(aEvent) {
			var xmlDoc = aEvent.detail;
			var vars;
			try {
				// vars = xmlDoc.querySelector("vars");
				this._configXML = xmlDoc.querySelector("data");
				this.config = JSON.parse(xmlDoc.querySelector("var").childNodes[0].nodeValue);
			}
			catch(e) {
				xmlDoc = (new DOMParser() ).parseFromString(aEvent.detail.xml, "application/xml");
				// vars = xmlDoc.querySelector("vars");
				this._configXML = xmlDoc.querySelector("data");
				this.config = JSON.parse(xmlDoc.querySelector("var").childNodes[0].nodeValue);
			}

			this._getParametersFromURL();
			this._build();

			this.dispatchCustomEvent(ConfigSite.CONFIG_LOADED, this);
		};


		p._getParametersFromURL = function() {
			var url = window.location.href;
			if(url.indexOf("?") == -1) return;

			url = url.substring(url.indexOf("?"));
			var strParameters = url.split(/\?|&/);
			strParameters.shift();

			for ( var i=0; i<strParameters.length; i++) {
				var tmp = strParameters[i].split("=");
				this.config[tmp[0]] = tmp[1];
			}
		};


		p._build = function(parameters) {
			this.templates 		= this._configXML.querySelectorAll("template");
			this.assets		= this._configXML.querySelectorAll("asset");
			this.sections = this._configXML.querySelectorAll("section");
			this.states = this._configXML.querySelectorAll("state");
			var pages 	= this._configXML.querySelectorAll("page");

			this.pages = new Array(pages.length);

			for(var i=this.pages.length-1;i>=0;i--) {
				var p = pages[i];
				var sections = [];
				var pageSections = p.querySelectorAll("section");
				
				if(pageSections !== null) {
					
					
					for(var j=0;j<pageSections.length;j++) {
						var pageSectionDetails = pageSections[j];
						var section = {
							id : undefined,
							states : undefined,
							defaultState : undefined
						};

						var id = pageSectionDetails.attributes["id"].value;
						section.id = id;

						var defaultState = pageSectionDetails.attributes["default_state"].value;
						section.defaultState = defaultState;

						var statesQuery = pageSectionDetails.querySelector("states");
						if(statesQuery !== null) {
							statesQuery = statesQuery.attributes["id"].value.split(',');
							console.log("statesQuery : ", statesQuery);
							section.states = statesQuery;
						}
						
						sections.push(section);
					}

				}

				var states = [];

				this.pages[i] = {
					page : p,
					sections : sections,
					states : states
				};
			}

			console.log("this.pages : ", this.pages);

		};


		p.hasPage = function(pageID) {
			for ( var i=0; i<this.pages.length; i++) {
				if( this.pages[i].page.attributes["id"].value == pageID) {
					return true;
				}
			}

			return false;
		};


		p.getPage = function(pageID) {
			for ( var i=0; i<this.pages.length; i++) {
				if( this.pages[i].page.attributes["id"].value == pageID) {
					return this.pages[i];
				}
			}

			return null;
		};


		p.getPageClass = function(pageID) {
			for (var i = this.templates.length - 1; i >= 0; i--) {
				if( this.templates[i].attributes["id"].value == pageID) {
					return this.templates[i].attributes["className"].value ;
				}
			};

			return null;
		};
		
		p.getPageDefaultSection = function(pageID) {
			var defaultSection = undefined;
			for (var i = this.pages.length - 1; i >= 0; i--) {
				if( this.pages[i].page.attributes["id"].value == pageID) {
					if(this.pages[i].page.attributes["default_section"] !== undefined) {
						var defaultSection = this.pages[i].page.attributes["default_section"].value;
					}
				}
			}

			return defaultSection;
		};

		p.getSections = function(pageID) {
			var sections = [];
			for (var i = this.pages.length - 1; i >= 0; i--) {
				if( this.pages[i].page.attributes["id"].value == pageID) {
					for(var j=this.pages[i].sections.length-1; j>=0; j--){
						var sectionId = this.pages[i].sections[j].attributes["id"].value;
						var defaultState = this.pages[i].sections[j].attributes["default_state"].value;
						var sectionStateId = this.pages[i].page.attributes["id"].value+sectionId;
						var states = this.getStates(sectionStateId);
						var section = {
							id : sectionId,
							defaultState : defaultState,
							states : states
						}

						sections.push(section);
					}
					return sections;
				}
			};

			return undefined;
		};
		p.getStates = function(parentID) {
			var states = [];
			for (var i = this.states.length - 1; i >= 0; i--) {
				if( this.states[i].attributes["parent_name"].value == parentID) {
					states.push(this.states[i].attributes["id"].value);
				}
			};

			states = (states.length == 0) ? undefined : states;
			return states;
		};


		p.getMainLoader = function() {
			var pages = this._configXML.querySelector("pages");
			return pages.attributes["loader_page"].value;
		};


		p.getStateLoader = function(stateID) {
			var state = this.getPage(stateID);
			return state.page.attributes["loader_page"].value;
		};


		p.getStateAssetNodes = function(stateID, includeInitialAssets) {
			var uis = this.getStatePagesToOpen(stateID, includeInitialAssets);
			var list = [];
			if(includeInitialAssets) {
				for ( var i=0; i<this.assets.length; i++) {
					if(this.assets[i].attributes["loadfromStart"].value == "true") list.push(this.assets[i]);
				}
			}

			var assets = [];
			for ( var i=0; i<uis.length; i++ ) {
				assets = assets.concat(this.getPageAssetNodes(uis[i]));
			}

			for ( var i=0; i<assets.length; i++ ) {
				if(!this.hasAsset(list, assets[i])) {
					if( this.getAssetFromID(assets[i]) !== null) list.push( this.getAssetFromID(assets[i]) );
				}
			}

			return list;
		};


		p.getPageAssetNodes = function(pageID) {
			var ui = this.getPageFromID(pageID);
			var assets = ui.attributes["assets"].value.split(",");
			if(assets.length == 1 && assets[0] == '') assets = [];
			return assets;
		};


		p.getPageFromID = function(pageID) {
			for ( var i=0; i<this.templates.length; i++) {
				if(this.templates[i].attributes["id"].value == pageID) return this.templates[i];
			}

			return null;
		};


		p.getAssetFromID = function(id) {
			for ( var i=0; i<this.assets.length; i++) {
				if(this.assets[i].attributes["id"].value == id)	{
					return this.assets[i];
				}
			}
			return null;
		};


		p.hasAsset = function(list, assetID) {
			
		};


		p.getStatePagesToOpen = function(stateID, includeInitialAssets) {
			// LVNOTE:  FIX THIS FUNCTION AND EVERYWHERE THAT LINKS FROM IT.
			if(includeInitialAssets == undefined) includeInitialAssets = true;
			var state = this.getPage(stateID);
			var openUIs = state.page.attributes["open_pages"].value.split(",");
			if(includeInitialAssets) {
				var states = this._configXML.querySelector("pages");

				if(states.attributes["permanent_pages"].value != "") {
					var permantUIs = states.attributes["permanent_pages"].value.split(",");
					openUIs = openUIs.concat(permantUIs);
				}
			}

			return openUIs;
		};


		p.getStatePagesToClose = function(stateID) {
			var res = [];
			var all = this.getFullPagesList();
			var state = this.getPage(stateID);
			if(state.page.attributes["keep_pages"].value == "all") return res;
			var keep = state.page.attributes["keep_pages"].value.split(",");
			if(state.page.attributes["keep_pages"].value == '') keep = [];
			var open = this.getStatePagesToOpen(stateID);
			keep = keep.concat(open);
			for ( var i=0; i< all.length; i++) if(keep.indexOf(all[i]) == -1) res.push(all[i]);

			return res;
		};


		p.getFullPagesList = function() {
			var a = [];
			for ( var i=0; i<this.templates.length; i++) a.push( this.templates[i].attributes["id"].value );
			return a;
		};


		p.getDefaultState = function() {	return this.getVar("state");	};
		p.getVar = function(id) {	return this.config[id];	};

		p.onConfigError = function() { 	console.log( "Error Loading Config Data" );	};
	}

})();