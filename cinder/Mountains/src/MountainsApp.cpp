#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"
#include "SceneMountain.h"
#include "GlobalSettings.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class MountainsApp : public AppNative {
  public:
	void setup();
	void mouseDown( MouseEvent event );	
	void update();
	void draw();
    
    SceneMountain*              _scene;
};

void MountainsApp::setup()
{
    setWindowPos(0, 0);
    setWindowSize(1280, 720);
    setFrameRate(60);
    
    gl::enable(GL_CULL_FACE);
    gl::enable(GL_DEPTH_TEST);
    gl::enableAlphaBlending();
    
    _scene                  = new SceneMountain(getWindow());
}

void MountainsApp::mouseDown( MouseEvent event )
{
}

void MountainsApp::update()
{
}

void MountainsApp::draw()
{
	// clear out the window with black
	gl::clear( Color( 0, 0, 0 ) );
    _scene->render();
}

CINDER_APP_NATIVE( MountainsApp, RendererGl )
