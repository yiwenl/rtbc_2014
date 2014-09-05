(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;

	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.TemplateManager) {
		var TemplateManager = function() {
			
			this.imageManager = null;

			this._templates = {};

			this._templateUrls = [];			
			this._isLoaded = false;
			this._isLoading = false;
			this._requiresLoad = false;
			this._currentlyLoadingTemplate = null;

			this._parser = new DOMParser();

			this._requestOnReadyStateChangeBound = this._requestOnReadyStateChange.bind(this);

			this._rq = null;

		};

		namespace.TemplateManager = TemplateManager;

		var p = TemplateManager.prototype = new EventDispatcher();

		TemplateManager.ERROR = "templateManagerError";
		TemplateManager.LOADED = "templateManagerLoaded";

		TemplateManager.TEMPLATE_IMAGES = "templateManagerImageLoading";

		p.storeImageManager = function() {
			singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			siteManager = singletons.siteManager;
			this.imageManager = siteManager.imageManager;
		};

		p.getTemplateAsync = function(aTemplateUrl, aCallback) {


		};

		p.getTemplate = function(aTemplateName) {
			console.log( "getTemplate :" + aTemplateName );
			return this._templates[aTemplateName].cloneNode(true);			
		}

		p.addTemplateUrl = function(aTemplateUrl) {
			console.log("addTemplateUrl : ", aTemplateUrl);
			this._requiresLoad = true;
			this._isLoaded = false;
			this._templateUrls.push(aTemplateUrl);
		};

		p.loadTemplates = function() {
			if (!this._isLoading && !this._isLoaded && this._requiresLoad)
			{
				this._isLoading = true;
				this._loadNextTemplate();	
			}
			else console.warn("Warning: attempted to load templates twice : ", this._templateUrls);
		};

		p._loadNextTemplate = function() {	

			if (this._templateUrls.length == 0)
			{
				console.log("TemplateManager ** Template load complete");
				this._isLoaded = true;
				this._isLoading = false;
				this._requiresLoad = false;

				this.dispatchCustomEvent(TemplateManager.LOADED, null);
				return;
			}

			this._rq = new XMLHttpRequest();
			this._rq.onreadystatechange = this._requestOnReadyStateChangeBound;

			this._currentlyLoadingTemplate = this._templateUrls.shift();

			this._rq.open("GET", this._currentlyLoadingTemplate, true);
			this._rq.send(null);
		};

		p._requestOnReadyStateChange = function() {
			switch(this._rq.readyState) {
			case 0: //Uninitialized
				case 1: //Set up
				case 2: //Sent
				case 3: //Partly done
					// DO NOTHING
					break;
				case 4: //Done
					if(this._rq.status < 400) {						
							this._templateLoadCallback(this._rq.responseText);
					}
					else 
					{
						this.dispatchCustomEvent(TemplateManager.ERROR, "Error loading template from ", this._currentlyLoadingTemplate,  " status : ", this._rq.status);	
					}
					break;


			}

		};

		p._templateLoadCallback = function(aTemplateXML) {

			// console.log("parsing template : ", aTemplateXML);
			
			var templateDoc = this._parser.parseFromString(aTemplateXML, "text/xml");

			var templatesInXML = templateDoc.querySelectorAll("*[data-type='template']");

			for (var i = 0; i < templatesInXML.length; i++){
				var templateNode = templatesInXML[i];
				var templateId = templateNode.getAttribute("id");
				console.log("templateId : ", templateId);
				templateNode = this._updateImagesInTemplate(templateNode);

				this._getAllImagesInTemplate(templateNode);
				this._updateCopyInTemplate(templateNode);

				this._templates[templateId] = document.importNode(templateNode);			
			}


			this._loadNextTemplate();
		};

		p._updateImagesInTemplate = function(aTemplate) {

			var imageCollection = aTemplate.querySelectorAll("img");

			for (var i= 0; i < imageCollection.length; i++)
			{
				var img = imageCollection[i];
				var imgSrc = img.getAttribute('src');
				if (imgSrc)
					img.setAttribute('src', this.imageManager.getImageSrc(imgSrc));
			}

			return aTemplate;

		};

		p._getAllImagesInTemplate = function(aTemplate) {
			var childNodes = aTemplate.querySelectorAll("*");
			var imagesInTemplate = [];
			for (var i=0;i<childNodes.length;i++){
				var childNode = childNodes[i];
				for (var j = 0; j < childNode.attributes.length; j++)
				{
					var attributeValue = childNode.attributes[j].value;
					if (attributeValue.match(/(.png)/))
					{
						imagesInTemplate.push(attributeValue);	
					}
						

				}
				// if (childNode.hasAttribute('src'))
				// 	imagesInTemplate.push(childNode.getAttribute('src'));
				
			}
			if (imagesInTemplate.length > 0)
				this.dispatchCustomEvent(TemplateManager.TEMPLATE_IMAGES, imagesInTemplate);

		};

		p._updateCopyInTemplate = function(aTemplate) {
			
			var copyCollection = aTemplate.querySelectorAll("*[data-type='copy']");

			for (var i = 0; i < copyCollection.length; i++){
				var copyNode = copyCollection[i];
				var copyId = copyNode.getAttribute("data-copyId");
				// console.log(copyId);

				copyNode.innerHTML = siteManager.getCopy(copyId);
			}

		};
	}

})();