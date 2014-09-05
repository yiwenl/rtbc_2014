(function() {

	var namespace = breelNS.getNamespace("generic.animation");

	if (!namespace.CssTransitionHelper) {

		var CssTransitionHelper = function CssTransitionHelper() {

		}

		namespace.CssTransitionHelper = CssTransitionHelper;

		var p = CssTransitionHelper.prototype;

		p._series = function(aMethods, fCallback) {

			var results = [];

			var next = function() {

				var method = aMethods.shift();
				if (method) {
					method(function() {
						results.push(Array.prototype.slice.call(aMethods));
						next();
					});
				} else {
					fCallback();
				}
			};

			next();
		};

		p.fromTo = function(element, from, to, settings, externalCallback) {

			// fallback for browsers lacking transition support.
			// _has_ issues and is a workauround, so only fot temp usage
			if (!this._supportsTransitions()) {

				Object.keys(from).forEach(function(key) {

					new TWEEN.Tween({ propEnvelope : from[key]}).to({ propEnvelope : to[key]}, settings.duration).easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(function() {

						element.style[key] = this.propEnvelope;

					}).onComplete(function() {}).start();

				}.bind(this));

				if (typeof externalCallback !== 'undefined') {

					setTimeout(function() {
						externalCallback();
					}, settings.duration);
				}

			} else {

				this._series([

					function(callback) {
						this.setFromProperties(element, from, callback);
					}.bind(this),

					function(callback) {
						this.setTween(element, settings, callback);
					}.bind(this),

					function(callback) {
						this.startAnimation(element, to, settings, callback);
					}.bind(this)

				], function() {

					if (typeof externalCallback !== 'undefined') {
						externalCallback()
					}
				});
			}
		};

		p.to = function(element, to, settings, externalCallback) {

			// fallback for browsers lacking transition support.
			// _has_ issues and is a workauround, so only fot temp usage
			if (!this._supportsTransitions()) {

				Object.keys(to).forEach(function(key) {

					var fromValue = element.style[key];

					new TWEEN.Tween({ propEnvelope : fromValue}).to({ propEnvelope : to[key]}, settings.duration).easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(function() {

						element.style[key] = this.propEnvelope;

					}).onComplete(function() {}).start();

				}.bind(this));

				if (typeof externalCallback !== 'undefined') {

					setTimeout(function() {
						externalCallback();
					}, settings.duration);
				}

			} else {

				this._series([

					function(callback) {
						this.setTween(element, settings, callback);
					}.bind(this),

					function(callback) {
						this.startAnimation(element, to, settings, callback);
					}.bind(this)

				], function() {
					if (typeof externalCallback !== 'undefined') {
						externalCallback()
					}
				});
			}
		};

		p.setFromProperties = function(element, from, callback) {

			Object.keys(from).forEach(function(key) {

				if (key === 'transform') {
					element.style.setProperty(this._getBrowserPrefix() + 'transform', from[key], '');
				} else {
					element.style.setProperty(key, from[key].toString(), '');
				}

			}.bind(this));

			callback();
		};

		p.setTween = function(element, settings, callback) {

			try {
				element.style[this._getBrowserPrefix() + 'transition'] = 'all ' + settings.duration + 'ms ' + this.easingLookupTable[settings.ease];
			} catch (e) {}

			callback();
		};

		p.startAnimation = function(element, to, settings, callback) {

			//if (typeof element.getAttribute('ntweencount') === 'undefined') {
			//	element.setAttribute('ntweencount', 1);
			//} else {


			element.setAttribute('ntweencount', element.getAttribute('ntweencount') + 1);
			//}

			setTimeout(function() {

				Object.keys(to).forEach(function(key) {

					if (key === 'transform') {
						element.style.setProperty(this._getBrowserPrefix() + 'transform', to[key], '');
					} else {
						element.style.setProperty(key, to[key].toString(), '');
					}

				}.bind(this));

			}.bind(this), settings.delay);

			// TODO: make this a bit more elegant
			// currently it uses a very rough counter to make sure _all_ properties have finished tweening
			// this makes sure we have a single callback instead of one per tweened property

			// unbind all events to make sure the next time the bind gets set on the same object it _actually_ replaces it

			onTransitionEnd =function () {//$(element).prop('ntweencount', ntweencount -= 1);

				element.setAttribute('ntweencount', element.getAttribute('ntweencount') - 1);

				if (element.getAttribute('ntweencount') < 0) {
					element.setAttribute('ntweencount', 0);
					element.style.transition = 'none';

					callback();
				}

			};

			element.removeEventListener(this._getTransitionEndName(), onTransitionEnd, false);
			element.addEventListener(this._getTransitionEndName(), onTransitionEnd, false);



		};

		p.removeTransition = function(element){

			element.style.setProperty(this._getBrowserPrefix() + "transition", "", "");
		}

		p._supportsTransitions = function() {

			var b = document.body || document.documentElement;
			var s = b.style;
			var p = 'transition';
			if(typeof s[p] == 'string') {return true; }

			// Tests for vendor specific prop
			v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
			p = p.charAt(0).toUpperCase() + p.substr(1);
			for(var i=0; i<v.length; i++) {
				if(typeof s[v[i] + p] == 'string') { return true; }
			}
			return false;
		};

		p._getSupportedTransformProperty = function() {

			if (this._supportedTransformProperty == null) {
				var supportedTransformProperty = this._getSupportedProperty(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
				this._supportedTransformProperty = supportedTransformProperty;
			}
			return this._supportedTransformProperty;
		};

		p._getSupportedProperty = function(proparray) {
			var root = document.documentElement //reference root element of document
			for (var i = 0; i < proparray.length; i++) { //loop through possible properties
				if (typeof root.style[proparray[i]] == "string") { //if the property value is a string (versus undefined)
					return proparray[i] //return that string
				}
			}
			return null;
		};

		p._getBrowserPrefix = function() {
			var oPrefix = {
				MozTransform: "-moz-",
				msTransform: "-ms-",
				WebkitTransform: "-webkit-",
				OTransform: "-o-",
				transform: "",
			}

			return oPrefix[this._getSupportedTransformProperty()];
		};

		p._getTransitionEndName = function() {
			var dummy = document.createElement('div'),
				eventNameHash = {
					webkit: 'webkitTransitionEnd',
					Moz: 'transitionend',
					O: 'oTransitionEnd',
					ms: 'MSTransitionEnd'
				},
				transitionEnd = (function _getTransitionEndEventName() {
					var retValue = 'transitionend';

					Object.keys(eventNameHash).some(function(vendor) {
						if (vendor + 'TransitionProperty' in dummy.style) {
							retValue = eventNameHash[vendor];
							return true;
						}
					});

					return retValue;
				}());

			return transitionEnd;
		};

		p.easingLookupTable = {

			// pulled from http://matthewlein.com/ceaser
			'linear': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
			'easeInSine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
			'easeInExpo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
			'easeInBack': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
			'easeOutSine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
			'easeOutExpo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
			'easeOutBack': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
			'easeInOutSine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
			'easeInOutExpo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
			'easeInOutBack': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
		};

		CssTransitionHelper.createSingleton = function() {

			var projectNamespace = breelNS.getNamespace(breelNS.projectName);

			if (!projectNamespace.singletons) projectNamespace.singletons = {};
			if (!projectNamespace.singletons.cssTransitionHelper) {
				projectNamespace.singletons.cssTransitionHelper = new CssTransitionHelper();
			}
			return projectNamespace.singletons.cssTransitionHelper;
		};

	}

})();