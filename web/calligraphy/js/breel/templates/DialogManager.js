(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Dialog = breelNS.getNamespace("generic.templates").Dialog;

	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.DialogManager) {

		var DialogManager = function() {

			this._element = null;	
			this._isMobile = false;

			this._dialogLayerActive = false;
			
			this._currentDialog = null;			
			this._backgroundTransparent = false;
			this._storeBackground = null;	

			this._dialogHideCompleteBound = null;
			this._dialogResponseBound = null;


			singletons = breelNS.getNamespace(breelNS.projectName).singletons;

		};

		namespace.DialogManager = DialogManager;
		var p = DialogManager.prototype = new EventDispatcher();

		DialogManager.DIALOG_CLOSED = "dialogManagerDialogClosed";

		p.setup = function(aElement) {
			this._element = aElement;

			siteManager = singletons.siteManager;	

			this._isMobile = siteManager.browserDetector.getIsMobileDevice();

			this._dialogHideCompleteBound = ListenerFunctions.createListenerFunction(this, this.dialogHideComplete);
			this._dialogResponseBound = ListenerFunctions.createListenerFunction(this, this._onDialogResponse);
		
		};

		p.setBackgroundTransparent = function(state) {

			this._backgroundTransparent = state;

			var dialogHolder = document.getElementById("dialogLayer");
			if(state) ElementUtils.addClass(dialogHolder, "transparent");
			else ElementUtils.removeClass(dialogHolder, "transparent");
		};

		p.getDialog = function(aDialogName){
			return this._dialogs[aDialogName];
		};

		p.getCurrentDialog = function(){
			return this._currentDialog;	
		};

		p.showDialog = function(aDialogObject) {
			// console.log( "SHOW DIALOG : ", aDialogObject );

			if(this._currentDialog) {
				if(this._currentDialog._pageId == aDialogObject._pageId) return;
			}

			this.setDialogLayerState(true);

			if (this._isMobile) siteManager.iframeInterface.parentPageScrollToTop();

			var hadDialog = false;
			if (this._currentDialog){
				hadDialog = true;
				this._currentDialog.hide();
			//	this._currentDialog.removeEventListener("DialogButtonResponse");
				if(this._dialogHideCompleteBound === undefined)	this._dialogHideCompleteBound = ListenerFunctions.createListenerFunction(this, this.dialogHideComplete);
				if(this._dialogHideCompleteBound === undefined) this._dialogResponseBound = ListenerFunctions.createListenerFunction(this, this._onDialogResponse);
				this._openingAnotherDialog = true;
			} 

			console.log("showing dialog..");

			ElementUtils.addClass(this._element, "active");

			if (this._currentDialog != aDialogObject)
				this._element.appendChild(aDialogObject.getElement());	

			this._currentDialog = aDialogObject;

			this._currentDialog.addEventListener(Dialog.RESPONSE, this._dialogResponseBound);
			this._currentDialog.addEventListener(Dialog.HIDE_FINISHED, this._dialogHideCompleteBound);

			if(!hadDialog) this._currentDialog.show(this._element);
		};

		p.closeDialog = function() {

			console.log("closeDialog called..");

			console.log('close dialog dialogmanager');
			if (this._currentDialog)  {
				if(this._backgroundTransparent) {
					var dialogHolder = document.getElementById("dialogLayer");
					dialogHolder.className = "";
					this._backgroundTransparent = false;
				}
				this._openingAnotherDialog = false;
				this._currentDialog.hide();	
			}
		};

		
		p.dialogHideComplete = function(aEvent) {

			if(!this._openingAnotherDialog) {
				console.log("dialogHideComplete..");
				this._currentDialog.removeEventListener(Dialog.RESPONSE, this._dialogResponseBound);
				ListenerFunctions.removeDOMListener(aEvent.detail, Dialog.HIDE_FINISHED, this._dialogHideCompleteBound);
			
				ElementUtils.removeClass(this._element, "active");
				this._currentDialog = null;

				this.setDialogLayerState(false);
				this._element.style.zIndex = 1;
				this.dispatchCustomEvent(DialogManager.DIALOG_CLOSED, null);	
			} else {
				ListenerFunctions.removeDOMListener(aEvent.detail, Dialog.HIDE_FINISHED, this._dialogHideCompleteBound);

				this._currentDialog.show();
			}
			
		};	

		p.setDialogLayerState = function(aActive) {

			if (aActive == this._dialogLayerActive) return;
			var dialogLayer = document.getElementById("dialogLayer");
			if (aActive){

				ElementUtils.addClass(dialogLayer, "active");

				// var dialogTween = new TWEEN.Tween({opacityEnvelope : 0}).to({opacityEnvelope : 1}, 500).onUpdate(function() {
				// 	dialogLayer.style.opacity = this.opacityEnvelope;
				// }).easing(TWEEN.Easing.Circular.InOut).start()

			}
			else {
				if(!this._openingAnotherDialog) {
					var dialogTween = new TWEEN.Tween({opacityEnvelope : 1}).to({opacityEnvelope : 0}, 500).onUpdate(function() {
						dialogLayer.style.opacity = this.opacityEnvelope;
					}).onComplete(function() {
						ElementUtils.removeClass(dialogLayer, "active");
					}).easing(TWEEN.Easing.Circular.InOut).start();
				}
			}
		};


		p._onDialogResponse = function(e) {

			console.log("_onDialogResponse..");

			if (e.detail == 'close'){
				this._currentDialog.hide();						
			}else if (e.detail == 'selectUrl'){
				var urlField = document.getElementById("urlTextBox");
				urlField.focus();
				urlField.setSelectionRange(0, 999);
			}
		}

	}

})();