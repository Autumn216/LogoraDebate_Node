import React from 'react';
import { withConfig } from '@logora/debate.context.config_provider';

const EmbedAdInitializer = (props) => {
    if(props.config.ads.display === true) {
        if(props.config.ads.googleAdManager && "article" in props.config.ads.googleAdManager && (props.config.ads.googleAdManager["article"].id)) {
            let slotType = "article";
            let providerConfig = props.config.ads.googleAdManager;
            let id = providerConfig[slotType].id;
            const path = providerConfig[slotType].path;
            const targeting = providerConfig[slotType].targeting || {};
            const sizes = providerConfig[slotType].sizes || ['[300, 250]'];
            const hasRefresh = (props.config.ads.refresh === true);
            const didomiConsent = (props.config.consent && props.config.consent.didomi && props.config.consent.didomi == true) ? 'type="didomi/javascript" data-vendor="didomi:google" data-purposes="cookies"' : "";
            const scriptContent = `<script ${didomiConsent}> \
                const libScript = document.createElement("script"); \
                libScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js"; \
                libScript.async = true; \
                document.body.appendChild(libScript); \
                window.googletag = window.googletag || {cmd: []}; \
                googletag.cmd.push(function() { \
                    slot = googletag.defineSlot('${path}', [${sizes}], '${id}').setTargeting('origine', ['logora']); \
                    for (const [key, value] of Object.entries(${JSON.stringify(targeting)})) { \
                        slot = slot.setTargeting(key, value); \
                    } \
                    slot = slot.addService(googletag.pubads()); \
                    googletag.pubads().enableSingleRequest(); \
                    if(${hasRefresh}) { \
                        googletag.pubads().disableInitialLoad(); \
                    } \
                    googletag.pubads().collapseEmptyDivs(); \
                    googletag.enableServices(); \
                    googletag.display('${id}'); \
                    if(${hasRefresh}) { \
                        googletag.pubads().refresh([slot]); \
                        googletag.pubads().addEventListener('impressionViewable', function(event) { \
                            let viewableSlot = event.slot; \
                            if(viewableSlot === slot) { \
                                setTimeout(function () { \
                                    if(viewableSlot) { \
                                        googletag.pubads().refresh([viewableSlot]); \
                                    } \
                                }, 15000); \
                            } \
                        }); \
                    } \
                }); \
            </script>`;
            return <div dangerouslySetInnerHTML={{ __html: scriptContent }} />;
        }
    }
    return null;
}

export default withConfig(EmbedAdInitializer);