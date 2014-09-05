(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Page = breelNS.getNamespace("generic.templates").Page;

	// LVNOTE : Include pages below here but before var namespace.
	var IntroPage = breelNS.getNamespace("allForThis.pages").IntroPage;
	var PreloadPage = breelNS.getNamespace("allForThis.pages").PreloadPage;
	var FallbackPage = breelNS.getNamespace("allForThis.pages").FallbackPage;
	var LandingPage = breelNS.getNamespace("allForThis.pages").LandingPage;
	var VisualiserPage = breelNS.getNamespace("allForThis.pages").VisualiserPage;
	var PredictionPage = breelNS.getNamespace("allForThis.pages").PredictionPage;
	var ShareBadgePage = breelNS.getNamespace("allForThis.pages").ShareBadgePage;
	var PolicesPage = breelNS.getNamespace("allForThis.pages").PolicesPage;
	
	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.PageManager) {

		var PageManager = function() {

			this._element = null;
			this._pages = {};

			this._isMobile = false;

			this._currentPage = null;
			this._currentPageName = null;

			// LVNOTE : not decided if we need to include this yet
			// probably do though. Until then though leave as null.
			this._gestureDetector = null;

			singletons = breelNS.getNamespace(breelNS.projectName).singletons;

		};

		namespace.PageManager = PageManager;
		var p = PageManager.prototype = new EventDispatcher();

		PageManager.SHOWING_PAGE = "PageManagerShowingPage";

		p.setup = function(aElement) {

			this._element = aElement;

			siteManager = singletons.siteManager;

			this._isMobile = siteManager.browserDetector.getIsMobileDevice();

			this.onPageHideFinish = ListenerFunctions.createListenerFunction(this, this.pageHideFinished);
			this.onPopStateEvent = ListenerFunctions.createListenerFunction(this, this.PopStateEvent);
			this.onWindowResize = ListenerFunctions.createListenerFunction(this, this.WindowResize);
			this.onPageRequestIFrameChangeSize = ListenerFunctions.createListenerFunction(this, this.pageRequestedChangeIFrameHeight);

			var newPreloadingPage = new PreloadPage();
			newPreloadingPage.setup(siteManager.templateManager.getTemplate("preload"));
			this._pages["preload"] = newPreloadingPage;

			// 	this.addPage("preload", )

			var newIntroPage = new IntroPage();
			this._pages["intro"] = newIntroPage;

			var newPolicesPage = new PolicesPage();
			this._pages["polices"] = newPolicesPage;

			var newShareBadgePage = new ShareBadgePage();
			this._pages["sharebadge"] = newShareBadgePage;

			var newFallbackPage = new FallbackPage();
			this._pages["fallback"] = newFallbackPage;

			var newLandingPage = new LandingPage();
			this._pages["landing"] = newLandingPage;

			var visualiserPage = new VisualiserPage();			
			this._pages["visualiser"] = visualiserPage;

			var predictionPage = new PredictionPage();
			this._pages["prediction"] = predictionPage;

			ListenerFunctions.addDOMListener(window,"popstate",this.onPopStateEvent);
			ListenerFunctions.addDOMListener(window, "resize", this.onWindowResize);
		};

		p.setupPage = function(aPageName) {
			var page;
			switch(aPageName) {
				case "intro" :
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("intro"));
					this.onIntroVideoFinsihed = ListenerFunctions.createListenerFunction(this, this._introVideoFinsihed);
					page.addEventListener(IntroPage.INTROVIDEOFINISHED, this.onIntroVideoFinsihed);

				break;
				case "sharebadge" :
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("ShareBadge"));
					page.initialize();

				break;
				case "polices" :
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("PolicesPage"));
					page.initialize();

				break;
				case "landing" :
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("landing"));

				break;
				case "visualiser" :
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("visualiser"));

				break;
				case "prediction" :
					page = this._pages[aPageName];
					var templateName = (this._isMobile) ? "predictionMobile" : "prediction";
					page.setup(siteManager.templateManager.getTemplate(templateName));
				break;
				case "fallback":
					page = this._pages[aPageName];
					page.setup(siteManager.templateManager.getTemplate("fallback"));
				break;
			}
		};

		p.storePage = function(aName, aPage) {
			this._pages[aName] = aPage;
		}

		p.getPage = function(aPageName) {
			return this._pages[aPageName];			
		};

		p.showPage = function(aPageName) {

			console.log("PageManager ** showing page ", aPageName);
			if (aPageName == this._currentPageName) {
				console.warn("tried to show the page that is currently showing");
				return;
			}

			var hasCurrentPage = false;
			if (this._currentPage){
				hasCurrentPage = true;
				// console.log("added : Page.HIDE_FINISHED");
				this._currentPage.addEventListener(Page.HIDE_FINISHED,this.onPageHideFinish);
				this._currentPage.removeEventListener(Page.REQUEST_IFRAME_CHANGE_HEIGHT, this.onPageRequestIFrameChangeSize);
				this._currentPage.hide();	
			}

			this._currentPage = this._pages[aPageName];
			this._currentPageName = aPageName;
			if (!this._currentPage) throw new Error ("ERROR: Could not find page named : " + aPageName);

			this._currentPage.addEventListener(Page.REQUEST_IFRAME_CHANGE_HEIGHT, this.onPageRequestIFrameChangeSize);
			this._currentPage.pageWillShow();

			
			// console.log( this._currentPage, this._currentPage.getElement() );

			if (this._isMobile) siteManager.iframeInterface.parentPageScrollToTop();


			this._element.appendChild(this._currentPage.getElement());

			if (!this._currentPage.loaded) this._currentPage.load();

			if(aPageName == "prediction") console.log("hasCurrentPage : ", hasCurrentPage);
			
			if (!hasCurrentPage)
				this._currentPage.show();

		};

		p.showPageWithName = function() {
			console.log("showLandingPage")
			this._currentPage.hide();
			// this.showPage("landing");
		};

		p.pageHideFinished = function(aEvent) {
			console.log("pageHideFinished :: aEvent : " + aEvent);
			
			ListenerFunctions.removeDOMListener(aEvent.detail, Page.HIDE_FINISHED, this.onPageHideFinish);

			this._currentPage.show();

			this.dispatchCustomEvent(PageManager.SHOWING_PAGE, this._currentPageName);
		};

		p._introVideoFinsihed = function() {
			console.log( "Intro Finished : " ,  siteManager.user.fromURL );
			if(siteManager.user.fromURL) this.showPage("visualiser");
			else this.showPage("landing");
		};

		p.pageRequestedChangeIFrameHeight = function(aEvent) {
			console.log("Page : ", this._currentPage, "  requested to change the iFrame height to : " + aEvent.detail);
			if (siteManager.iframeInterface)
				siteManager.iframeInterface.parentSetIframeHeight(aEvent.detail);
			else
				console.error("ERROR : could not change iFrame Height; iframeConnection does not exist");
					
		};

		p.WindowResize = function() {
			this.checkCurrentLayout();
		};

		p.checkCurrentLayout = function() {
			// LVNOTE : Update layout on resize.
		};

		p.PopStateEvent = function() {
			// LVNOTE : Handle popstate events if we include them.
		};

	}	

})();