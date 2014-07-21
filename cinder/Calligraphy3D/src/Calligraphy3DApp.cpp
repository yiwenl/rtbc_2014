#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"
#include "SceneRibbon.h"
#include "cinder/BSpline.h"
#include "MathUtils.h"
#include "Cinder-LeapMotion.h"
#include "GlobalSettings.h"
#include "cinder/params/Params.h"


using namespace ci;
using namespace ci::app;
using namespace std;
using namespace bongiovi::utils;
using namespace Leap;

class Calligraphy3DApp : public AppNative {
public:
	void setup();
	void mouseDown( MouseEvent event );
    void keyDown( KeyEvent event );
    void keyUp( KeyEvent event );
	void update();
	void draw();
    void reset();
    void clear();
    void clearAll();
    void onFrame(Leap::Frame frame);
    
    
    private :
    SceneRibbon*                    _scene;
    vector<Vec3f>                   _points;
    vector<Vec3f>                   _pointDir;
    vector<Vec3f>                   _pointSpline;
    BSpline3f                       _spline;
    vector<Matrix44f>               _frames;		// Coordinate frame at each b-spline sample
    LeapMotion::DeviceRef           _device;
    Leap::Frame                     _frame;
    bool                            _isRecording    = false;
    bool                            _needReset      = true;
    params::InterfaceGlRef          _params;
    
    
    float                           _camX = 0;
    float                           _camY = 0;
    float                           _camZ = 0;
    Vec3f                           _lastPoint;
};

void Calligraphy3DApp::setup() {
    setWindowSize(1920, 1080);
    setWindowPos(0, 0);
    setFrameRate(60);
    srand (time(NULL));
    
    gl::enableAlphaBlending();
    gl::disable(GL_DEPTH_TEST);
    gl::enable(GL_TEXTURE_2D);
    gl::disable(GL_CULL_FACE);
    
    _device         = LeapMotion::Device::create();
    _device->connectEventHandler(&Calligraphy3DApp::onFrame, this);
    
    _scene          = new SceneRibbon(getWindow());
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
    
}


void Calligraphy3DApp::onFrame(Leap::Frame frame) {
    if(!_isRecording) return;
    const HandList& hands = frame.hands();
    
    if(hands.count() > 0) {
        const Hand& _hand0              = hands[0];
        const Leap::Vector posHand0     = _hand0.stabilizedPalmPosition();
        float scale                     = GlobalSettings::getInstance().leapMotionOffset;
        Vec3f pos                       = Vec3f(posHand0.x*scale, (posHand0.y - 200)*scale, posHand0.z*scale);
        if(GlobalSettings::getInstance().isFlatten) pos.z = 0;
        
        if(_points.size() == 0) {
            _points.push_back(pos);
        } else {
            Vec3f lastPoint = _points[_points.size()-1];
            if( ( pos - lastPoint).length() > GlobalSettings::getInstance().minPointDistance ) {
                _points.push_back(pos);
                _needReset = true;
                
                if(rand()%100 > 95) {
                    cout << " Add Ink Drop : " << endl;
                    InkDrop* ink = new InkDrop(pos, rand()%6, MathUtils::random(50, 100) );
                    GlobalSettings::getInstance().inkDrops.push_back(ink);
                }
            }
        }
    }
}


void Calligraphy3DApp::update()
{
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


void Calligraphy3DApp::reset() {
    if(_points.size() < 5) return;
    _pointSpline.empty();
    _pointSpline.clear();
    _pointDir.empty();
    _pointDir.clear();
    while(_points.size() > GlobalSettings::getInstance().maxPoints) {
        _points.erase(_points.begin());
    }
    
    _spline = BSpline3f( _points, 3, false, true );
    
    for( float p = 0.1f; p < 0.9f; p += GlobalSettings::getInstance().splineGap ) {
        Vec3f pp = _spline.getPosition( p );
        Vec3f pd = _spline.getDerivative( p );
        _pointSpline.push_back(pp);
        _pointDir.push_back(pd);
    }
    
    
    int n = _pointSpline.size();
    _frames.clear();
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


void Calligraphy3DApp::draw() {
	// clear out the window with black
	gl::clear( Color( 0, 0, 0 ) );
    _scene->render();
    _params->draw();
}


void Calligraphy3DApp::clear() {
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


void Calligraphy3DApp::mouseDown( MouseEvent event ) { }

void Calligraphy3DApp::keyDown( KeyEvent event ) {
    if(event.getChar() == 'c' ) {
        clear();
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
    }
}


void Calligraphy3DApp::keyUp( KeyEvent event ) {
    if(event.getChar() == ' ' ) {
        _isRecording = false;
        _scene->saveRibbon();
        clear();
    }
}

CINDER_APP_NATIVE( Calligraphy3DApp, RendererGl )
