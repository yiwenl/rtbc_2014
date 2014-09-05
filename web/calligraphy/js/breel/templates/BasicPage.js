// BasicPage.js

(function() {
	// IMPORTS
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var GlobalStateManager = breelNS.getNamespace("generic.core").GlobalStateManager;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var StateManager = breelNS.getNamespace("generic.core").StateManager;
	var ButtonAttacher = breelNS.getNamespace("generic.templates").ButtonAttacher;
	
	var namespace = breelNS.getNamespace("generic.templates"); 
	var siteManager;

	if(!namespace.BasicPage) {
		var BasicPage = function(aId, aDefaultState, aDefaultSection, aStates, aSections, aParentId) {
			// console.log("aId : "+aId +" aDefaultState : "+aDefaultState+" aDefaultSection : "+aDefaultSection+" aStates : ",aStates+" aSections : ",aSections);
			this.id = aId;
			this.parentId = aParentId;
			this.container = document.createElement("div");
			this.isOpened = false;

			this.sections = {};
			this.sectionsIds = [];
			this.defaultSection = aDefaultSection;
			
			this.aSections = aSections;
			
			this.states = undefined;
			
			this.aStates = aStates;
			this.aDefaultState = aDefaultState;
		}

		namespace.BasicPage = BasicPage;
		var p = BasicPage.prototype = new ButtonAttacher();

		p.initialize = function(aTemplateName) {
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			this.parseStatesAndSections();

			if(aTemplateName !== undefined) this.addTemplate(aTemplateName);
			this.getDomElements();
			this.handleButtons();

			this._onResizeBound = ListenerFunctions.createListenerFunction(this, this._onResize);
			ListenerFunctions.addDOMListener(window, "resize", this._onResizeBound);

			this._onOrientationChangeBound = ListenerFunctions.createListenerFunction(this, this._onOrientationChange);
			ListenerFunctions.addDOMListener(window, "orientationchange", this._onOrientationChangeBound);

			this._onWindowFocusBound = ListenerFunctions.createListenerFunction(this, this._onWindowFocus);
			ListenerFunctions.addDOMListener(window, "focus", this._onWindowFocusBound);
		};

		p._onWindowFocus = function(){

			
		};

		p.getDomElements = function() {

		};

		p.handleButtons = function() {
			this.setupButtons();
			this.defineEvents();
			this.addButtonListeners();
		};

		p.setParams = function(params) {
			
		};
		p.setHistoryData = function(aParams) {
			console.log("setHistoryData :: Page, aParams : ", this.id , aParams);
		};

		p.addTemplate = function(aTemplateName) {
			this.template = siteManager.assetManager.getAsset(aTemplateName);
			if(this.template === undefined || this.template === null) {
				console.log("BasicPage :: addTemplate :: Unable to find template : name : ", aTemplateName);
			} else {
				this.container.appendChild(this.template); 
			}

		};

		p.parseStatesAndSections = function() {
			console.log("parseStatesAndSections");
			// console.log("this : ", this);			
			if(this.aSections !== undefined) {
				this.getSections(this.aSections, this.aSections);
			}

			if(this.aStates !== undefined) {
				this.setupStates(this.aDefaultState, this.aStates);
			}
		};


		p.open = function() {
			if(siteManager.analyticsManager !== undefined) siteManager.analyticsManager.gaTrackPage(this.id, "/"+this.id);

			this.setOpened();
		};


		p.close = function() {
			this.setClosed();
		};


		p.setOpened = function() {
			this.isOpened = true;
			console.log("this.id, this.isOpened :: ", this.id, this.isOpened)
			this.dispatchCustomEvent( GlobalStateManager.END_PAGE_OPEN, {page:this} );
		};


		p.setClosed = function() {
			this.isOpened = false;
			console.log("this.id, this.isOpened :: ", this.id, this.isOpened)
			this.dispatchCustomEvent( GlobalStateManager.END_PAGE_CLOSE, {page:this} );
			this.destroy();
		};


		p.destroy = function() {
			ListenerFunctions.removeDOMListener(window, "resize", this._onResizeBound);
			this.removeButtonListeners();

			if(this.sections) {
				for(var section in this.sections) { 
					this.sections[section].destroy();
				}
			}
			
		};

		p.checkNodePosition = function(aShouldBeFirstNode, aShouldBeNodeAfter) {
			if(aShouldBeFirstNode.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_PRECEDING) {
				// LVNOTE : Here the container is in the DOM above what 
				// should be the first node.
				this.insertNodeAfter(aShouldBeFirstNode, this.container);
			} else if(aShouldBeFirstNode.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_FOLLOWING) {
				if(aShouldBeNodeAfter.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_PRECEDING) {
					// LVNOTE : This is the correct state
				} else {
					// LVNOTE : Here the container is in the DOM below what should 
					// be the first node, but also below what should be the last node.
					this.insertNodeAfter(aShouldBeFirstNode, this.container);
				}
			}
		};
		p.insertNodeAfter = function(aReferenceNode, aNewNode) {
			aReferenceNode.parentNode.insertBefore(aNewNode, aReferenceNode.nextSibling);
		}

		p.getSections = function(aSections, aSectionDetails){
			// console.log("getSections");
			this.numSections = aSections.length-1;
			for(var i=0;i<aSections.length;i++) {
				var sectionDetails = aSections[i];
				this.sectionsIds.push(sectionDetails.id);
				this.createSection(sectionDetails, i);
			}
		};

		p.createSection = function() {
			console.warn("create section function has not been overwritten for this page.");
		};

		p.initSections = function(aParams) {
			for(var section in this.sections) {
				var obj = this.sections[section];
				// LVNOTE : initialize sections.
				obj.setParams(aParams);
				obj.initialize();
			};
		};

		p.setupStates = function(aDefault, aStates) {
			var parent;
			if(this.parentId === undefined)
				parent = this.parentId+"."+this.id;
			else
				parent = this.parentId+"."+this.id;
			
			this.stateManager = StateManager.create(aStates, aDefault, this.container, parent);
			this._onStateChangedBound = ListenerFunctions.createListenerFunction(this, this._onStateChanged);
			this._onStateScrollBound = ListenerFunctions.createListenerFunction(this, this._onStateScroll);
			this.stateManager.addEventListener(StateManager.STATE_OPEN, this._onStateChangedBound);
			this.stateManager.addEventListener(StateManager.STATE_MANAGER_CALLED_SCROLL, this._onStateScrollBound);
			this.stateManager.beginStateManager();
		}
		p._onStateChanged = function(aEvent) {
			var stateOpening = aEvent.detail;
			// console.log("stateOpening : ", stateOpening);
		};

		p._onStateScroll = function(aEvent) {
			var target = aEvent.detail;
			// console.log("BasicPage :: _onStateScroll : ", target);

			this.scrollToSection(target);
		};

		p.setContainerId = function(str){

			this.container.id = str;
		};

		p._onOrientationChange = function(){	
		};


		p._onResize = function(e) {
		};


		p.getContainer = function() {	return this.container;	};
	}
	
})();