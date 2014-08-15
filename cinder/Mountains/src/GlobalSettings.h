//
//  GlobalSettings.h
//  Mountains
//
//  Created by Yiwen on 23/07/2014.
//
//

#ifndef __Mountains__GlobalSettings__
#define __Mountains__GlobalSettings__

#include <iostream>

class GlobalSettings {
    public :
    static GlobalSettings& getInstance() {
        static GlobalSettings settings;
        return settings;
    };
    
    private :
    GlobalSettings() {};
};

#endif /* defined(__Mountains__GlobalSettings__) */
