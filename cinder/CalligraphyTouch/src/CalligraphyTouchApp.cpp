#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"
#include "SceneRibbon.h"
#include "cinder/BSpline.h"
#include "MathUtils.h"
#include "GlobalSettings.h"
#include "TouchFinder.h"
#include "cinder/params/Params.h"

using namespace ci;
using namespace ci::app;
using namespace std;
using namespace bongiovi::utils;

class CalligraphyTouchApp : public AppNative {
  public:
	void setup();
	void mouseDown( MouseEvent event );
    void mouseUp( MouseEvent event );
    void mouseDrag( MouseEvent event );
    void keyDown( KeyEvent event );
    void keyUp( KeyEvent event );
	void update();
	void draw();
    void reset();
    void clear();
    void clearAll();
    void shutdown();
    
    private :
    SceneRibbon*                    _scene;
    vector<Vec3f>                   _points;
    vector<Vec3f>                   _pointDir;
    vector<Vec3f>                   _pointSpline;
    BSpline3f                       _spline;
    vector<Matrix44f>               _frames;		// Coordinate frame at each b-spline sample
    bool                            _isRecording    = false;
    bool                            _needReset      = true;
    params::InterfaceGlRef          _params;
    
    
    float                           _camX = 0;
    float                           _camY = 0;
    float                           _camZ = 0;
    Vec3f                           _lastPoint;
    
    TouchFinder*                    _touchFinder;
};

void CalligraphyTouchApp::setup() {
    setWindowSize(1280, 720);
    setWindowPos(0, 0);
    setFrameRate(60);
    srand (time(NULL));
    
    gl::enableAlphaBlending();
    gl::enable( GL_TEXTURE_2D );
    gl::enable( GL_TEXTURE_RECTANGLE_ARB );
    gl::disable( GL_DEPTH_TEST );
    gl::disable( GL_CULL_FACE );
    
    
    //  MIP MAPPING
//    glTexGeni(GL_S, GL_TEXTURE_GEN_MODE, GL_SPHERE_MAP);
//    glTexGeni(GL_T, GL_TEXTURE_GEN_MODE, GL_SPHERE_MAP);
//    glEnable(GL_TEXTURE_GEN_S);
//    glEnable(GL_TEXTURE_GEN_T);
    
    gl::Texture::Format format;
    format.enableMipmapping( true );
    
    _scene          = new SceneRibbon(getWindow());
    _touchFinder    = new TouchFinder(_scene);
    
    
    _params         = params::InterfaceGl::create( "Ribbon", Vec2i( 300, getWindowHeight()-30 ) );
    _params->addParam( "FPS",                       &GlobalSettings::getInstance().fps);
    _params->addSeparator();
    _params->addParam( "Camera Easing",             &GlobalSettings::getInstance().cameraEasing, "min=0.0 max=0.1 step=.01");
    _params->addSeparator();
    _params->addText("Spline Settings : ");
    _params->addParam( "Max Number of Points",      &GlobalSettings::getInstance().maxPoints, "min=0.0 max=50.0 step=1.0");
    _params->addParam( "Min point distance",        &GlobalSettings::getInstance().minPointDistance, "min=20.0 max=150.0 step=1.0");
    _params->addParam( "Spline gap",                &GlobalSettings::getInstance().splineGap, "min=0.0 max=0.1 step=.001");
    _params->addParam( "Ribbon Width",              &GlobalSettings::getInstance().ribbonWidth, "min=0.0 max=100. step=1.0");
    _params->addParam( "Leap Motion Offset",        &GlobalSettings::getInstance().leapMotionOffset, "min=0.0 max=5.0. step=0.1");
    _params->addParam( "Is Flatten",                &GlobalSettings::getInstance().isFlatten);
    _params->addParam( "Is In Dark",                &GlobalSettings::getInstance().isInDark);
    
    _params->addSeparator();
    _params->addText("Kincet");
    _params->addParam( "Min Detect Depth", &GlobalSettings::getInstance().minDepth, "min=0.0 max=1.0 step=.001");
    _params->addParam( "Contrast", &GlobalSettings::getInstance().contrastOffset, "min=0.0 max=20.0 step=.1");
    
}


void CalligraphyTouchApp::update() {
    float easing = GlobalSettings::getInstance().cameraEasing;
    if(_pointSpline.size() > 0) {
        _lastPoint.set(_pointSpline[_pointSpline.size()-1]);
    }
    
    _camX += ( _lastPoint.x - _camX) * easing;
    _camY += ( _lastPoint.y - _camY) * easing;
    _camZ += ( _lastPoint.z - _camZ) * easing;
    
    _scene->_eye.x = _camX;
    _scene->_eye.y = _camY;
    _scene->_center.x = _camX;
    _scene->_center.y = _camY;
    _scene->cameraDistance = 500 + _camZ;
    
    if(_needReset) reset();
    
    GlobalSettings::getInstance().fps = getAverageFps();

}



void CalligraphyTouchApp::reset() {
    if(_points.size() < 5) return;
    _pointSpline.empty();
    _pointSpline.clear();
    _pointDir.empty();
    _pointDir.clear();        while(_points.size() > GlobalSettings::getInstance().maxPoints) {
        _points.erase(_points.begin());
    }
    
    _spline = BSpline3f( _points, 3, false, true );
    
    for( float p = 0.0f; p < 1.0f; p += GlobalSettings::getInstance().splineGap ) {
        Vec3f pp = _spline.getPosition( p );
        Vec3f pd = _spline.getDerivative( p );
        _pointSpline.push_back(pp);
        _pointDir.push_back(pd);
    }
    
    
    int n = _pointSpline.size();
    _frames.clear();
    _frames.resize( n );
    // Make the parallel transport frame
    
    _frames[0] = firstFrame( _pointSpline[0], _pointSpline[1],  _pointSpline[2] );
    // Make the remaining frames - saving the last
    for( int i = 1; i < n - 1; ++i ) {
        Vec3f prevT = _pointDir[i - 1];
        Vec3f curT  = _pointDir[i];
        _frames[i] = nextFrame( _frames[i - 1], _pointSpline[i - 1], _pointSpline[i], prevT, curT );
    }
    // Make the last frame
    _frames[n - 1] = lastFrame( _frames[n - 2], _pointSpline[n - 2], _pointSpline[n - 1] );
    
    _needReset = false;
    
    GlobalSettings::getInstance().points.empty();
    GlobalSettings::getInstance().points.clear();
    GlobalSettings::getInstance().pointsSpline.empty();
    GlobalSettings::getInstance().pointsSpline.clear();
    
    GlobalSettings::getInstance().pointsSpline = _pointSpline;
    for(int i=0; i<_pointSpline.size(); i++) {
        Vec3f yAxis0 = _frames[i].transformVec( Vec3f::xAxis() );
        GlobalSettings::getInstance().points.push_back(yAxis0);
    }
    
    _scene->updateRibbon();
}


void CalligraphyTouchApp::draw()
{
	// clear out the window with black
/*
    Vec2f posKinect = _touchFinder->update();
    if(posKinect.x > 10000) {
        _params->draw();
        return;
    }
    
    
    if(posKinect.x > 0) {
        Vec3f pos(posKinect.x, posKinect.y, 0.0);
        if(!_isRecording) {
            _isRecording = true;
            clear();
            _scene->createRibbon();
//            cout << "TOUCH DOWN " << endl;
        } else {
//            cout << " TOUCH MOVE " << endl;
            if(_points.size() == 0) {
                _points.push_back(pos);
            } else {
                Vec3f lastPoint = _points[_points.size()-1];
                if( ( pos - lastPoint).length() > GlobalSettings::getInstance().minPointDistance ) {
                    _points.push_back(pos);
                    _needReset = true;
                    
                    if(rand()%100 > 90) {
                        InkDrop* ink = new InkDrop(pos, rand()%6, MathUtils::random(150, 250) );
                        GlobalSettings::getInstance().inkDrops.push_back(ink);
                    }
                }
            }
        }
    } else {
        if(_isRecording) {
           _isRecording = false;
            _scene->saveRibbon();
            clear();
            
//            cout << "TOUCH UP " << endl;
        }
    }
    
    */
    _scene->render();
    _params->draw();
}



void CalligraphyTouchApp::clear() {
    _pointSpline.empty();
    _pointSpline.clear();
    _pointDir.empty();
    _pointDir.clear();
    _points.empty();
    _points.clear();
    
    GlobalSettings::getInstance().points.empty();
    GlobalSettings::getInstance().points.clear();
    GlobalSettings::getInstance().pointsSpline.empty();
    GlobalSettings::getInstance().pointsSpline.clear();
}


void CalligraphyTouchApp::mouseDown( MouseEvent event ) {
    if(!_isRecording) {
        _isRecording = true;
        clear();
        _scene->createRibbon();
    }
}

void CalligraphyTouchApp::mouseUp( MouseEvent event ) {
    _isRecording = false;
    _scene->saveRibbon();
    clear();
}


void CalligraphyTouchApp::mouseDrag( MouseEvent event ) {

    Vec3f pos   = Vec3f(0, 0, 0);
    pos.x       = event.getPos().x;
    pos.y       = -event.getPos().y;
    
//    cout << pos << endl;
    
    if(_points.size() == 0) {
        _points.push_back(pos);
    } else {
        Vec3f lastPoint = _points[_points.size()-1];
        if( ( pos - lastPoint).length() > GlobalSettings::getInstance().minPointDistance ) {
            _points.push_back(pos);
            _needReset = true;
            
            if(rand()%100 > 90) {
                InkDrop* ink = new InkDrop(pos, rand()%6, MathUtils::random(150, 250) );
                GlobalSettings::getInstance().inkDrops.push_back(ink);
            }
        }
    }

}

void CalligraphyTouchApp::keyDown( KeyEvent event ) {
    if(event.getChar() == 'c' ) {
        clear();
        _scene->clearAll();
        GlobalSettings::getInstance().inkDrops.empty();
        GlobalSettings::getInstance().inkDrops.clear();
    } else if(event.getChar() == ' ') {
        if(!_isRecording) {
            _isRecording = true;
            clear();
            _scene->createRibbon();
        }
    } else if(event.getChar() == 'n') {
        _scene->updateBrush();
    } else if(event.getChar() == 'f') {
        setFullScreen(!isFullScreen());
    } else if(event.getChar() == 'h') {
        if(_params->isVisible()) _params->hide();
        else _params->show();
        
        if(_params->isVisible()) showCursor();
        else hideCursor();
    } else if(event.getChar() == 's') {
        GlobalSettings::getInstance().isInDark = !GlobalSettings::getInstance().isInDark;
    } else if(event.getChar() == 'k') {
        GlobalSettings::getInstance().debugKinect = !GlobalSettings::getInstance().debugKinect;
    }
}


void CalligraphyTouchApp::keyUp( KeyEvent event ) {
    if(event.getChar() == ' ' ) {
        _isRecording = false;
        _scene->saveRibbon();
        clear();
    }
}

void CalligraphyTouchApp::shutdown() {
    cout << "SHUT DOWN" << endl;
}


CINDER_APP_NATIVE( CalligraphyTouchApp, RendererGl )
