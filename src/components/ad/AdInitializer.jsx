import React, { useEffect } from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { useLocation } from 'react-router';

const AdInitializer = () => {
    const config = useConfig();
    const location = useLocation();

    useEffect(() => {
        if(config.ads.display === true) {
            if(config.ads.googleAdManager) {
                const libScript = document.createElement("script");
                libScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
                libScript.async = true;
                if(config.consent?.didomi === true) {
                    libScript.type = "didomi/javascript";
                    libScript.setAttribute("data-vendor-raw", "didomi:google");
                    libScript.setAttribute("data-purposes", "cookies");
                }
                document.body.appendChild(libScript);
            }
        }
    }, []);

    useEffect(() => {
        if(config.ads.refresh) {
            if (typeof window !== 'undefined' && window.coreAds !== undefined) {
                coreAds.onInit();
            }
        }
    }, [location]);
  
    return null;
}

export default AdInitializer;