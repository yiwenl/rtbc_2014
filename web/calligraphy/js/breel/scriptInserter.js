(function() {
	breelNS.addFavicon();
	/* DEV START */
	breelNS.addJS("js/breel/abstract/InitObject.js");
	breelNS.addJS("js/breel/events/ListenerFunctions.js");
	breelNS.addJS("js/breel/events/EventDispatcher.js");
	breelNS.addJS("js/breel/math/MathUtils.js");
	breelNS.addJS("js/breel/math/SimpleTrig.js");
	breelNS.addJS("js/breel/math/BinaryTree.js");	
	breelNS.addJS("js/breel/utils/UrlFunctions.js");		
	breelNS.addJS("js/breel/utils/ComplexKeyDictionary.js");
	breelNS.addJS("js/breel/utils/GestureDetector.js");
	breelNS.addJS("js/breel/utils/FullscreenAPI.js");
	breelNS.addJS("js/breel/utils/Scheduler.js");
	breelNS.addJS("js/breel/utils/Utils.js");
	breelNS.addJS("js/breel/utils/FormValidation.js");
	breelNS.addJS("js/breel/utils/NumberFunctions.js");
	breelNS.addJS("js/breel/utils/LevenshteinDistance.js");
	breelNS.addJS("js/breel/utils/ColorBlender.js");
	breelNS.addJS("js/breel/utils/MultipleCallLock.js");
	breelNS.addJS("js/breel/utils/StringFormat.js");
	breelNS.addJS("js/breel/utils/ProfanityCheck.js");
	breelNS.addJS("js/breel/htmldom/DomElementCreator.js");
	breelNS.addJS("js/breel/htmldom/ElementUtils.js");
	breelNS.addJS("js/breel/htmldom/PositionFunctions.js");
	breelNS.addJS("js/breel/svg/SvgFactory.js");
	breelNS.addJS("js/breel/canvas/CanvasFactory.js");
	breelNS.addJS("js/breel/canvas/Drawing.js");
	breelNS.addJS("js/breel/canvas/CanvasRenderer.js");
	breelNS.addJS("js/breel/animation/AnimationManager.js");
	breelNS.addJS("js/breel/animation/TweenDelay.js");
	breelNS.addJS("js/breel/animation/DomElementOpacityTween.js");
	breelNS.addJS("js/breel/animation/DomElementPositionTween.js");
	breelNS.addJS("js/breel/animation/DomElementScaleTween.js");
	breelNS.addJS("js/breel/animation/TweenHelper.js");
	breelNS.addJS("js/breel/animation/EaseFunctions.js");
	breelNS.addJS("js/breel/copy/XmlNodeTypes.js");
	breelNS.addJS("js/breel/copy/XmlChildRetreiver.js");
	breelNS.addJS("js/breel/copy/XmlCreator.js");
	breelNS.addJS("js/breel/copy/XmlModifier.js");
	breelNS.addJS("js/breel/copy/ExportedXmlCopyDocument.js");
	breelNS.addJS("js/breel/copy/TextConverterChain.js");
	breelNS.addJS("js/breel/copy/CopyManager.js");
	breelNS.addJS("js/breel/loading/JsonLoader.js");
	breelNS.addJS("js/breel/loading/XmlLoader.js");
	breelNS.addJS("js/breel/analytics/AnalyticsManager.js");
	breelNS.addJS("js/breel/analytics/AdriverTracking.js");
	breelNS.addJS("js/breel/sound/SoundLogger.js");
	breelNS.addJS("js/breel/music/Metronome.js");
	breelNS.addJS("js/breel/music/MusicalSound.js");
	breelNS.addJS("js/breel/sound/SoundObject.js");
	breelNS.addJS("js/breel/sound/SoundLoader.js");
	breelNS.addJS("js/breel/sound/flash/SoundPlayerFlashLink.js");
	breelNS.addJS("js/breel/sound/flash/FlashSoundObject.js");
	breelNS.addJS("js/breel/sound/flash/FlashSoundLoader.js");
	breelNS.addJS("js/breel/sound/html5/Html5SoundObject.js");
	breelNS.addJS("js/breel/sound/html5/Html5SoundLoader.js");	
	breelNS.addJS("js/breel/sound/webAudio/WebAudioSoundObject.js");
	breelNS.addJS("js/breel/sound/webAudio/WebAudioSoundLoader.js");
	breelNS.addJS("js/breel/sound/SoundLibrary.js");
	breelNS.addJS("js/breel/video/VideoPlayer.js");
	breelNS.addJS("js/breel/core/AssetManager.js");
	breelNS.addJS("js/breel/core/HistoryStateManager.js");
	breelNS.addJS("js/breel/core/GlobalStateManager.js");
	breelNS.addJS("js/breel/core/StateManager.js");
	breelNS.addJS("js/breel/core/StateManagerGenerator.js");
	breelNS.addJS("js/breel/core/ConfigSite.js");
	breelNS.addJS("js/breel/core/Core.js");
	breelNS.addJS("js/breel/templates/ButtonGenerator.js");
	breelNS.addJS("js/breel/templates/ButtonAttacher.js");
	breelNS.addJS("js/breel/templates/BasicPage.js");
	breelNS.addJS("js/breel/templates/BasicState.js");
	breelNS.addJS("js/breel/templates/LoaderPage.js");
	breelNS.addJS("js/breel/controllers/MouseMoveController.js");
	breelNS.addJS("js/breel/sharing/SharingManager.js");
	breelNS.addJS("js/breel/backend/BackendHttpRequest.js");
	breelNS.addJS("js/breel/controllers/KeyboardController.js");
	breelNS.addJS("js/breel/controllers/MicrophoneController.js");

	breelNS.addJS("js/noiseAttractor/objects/ForceDisplayObject.js");
	breelNS.addJS("js/noiseAttractor/objects/Particle.js");

	breelNS.addJS("js/noiseAttractor/objects/RepellerOne.js");
	breelNS.addJS("js/noiseAttractor/objects/AttracterOne.js");

	breelNS.addJS("js/noiseAttractor/ParticleGenerator.js");
	breelNS.addJS("js/noiseAttractor/World.js");

	breelNS.addJS("js/noiseAttractor/Settings.js");
	breelNS.addJS("js/noiseAttractor/Project.js");

	/* DEV END */

	/* LIVE START   
	breelNS.addJS("js/compiled/projectNameCompiled.js");
	   LIVE END */

	breelNS.loadJS();

})();