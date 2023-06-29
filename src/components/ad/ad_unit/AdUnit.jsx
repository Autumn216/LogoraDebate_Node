import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useConfig } from '@logora/debate.context.config_provider';
import styles from "./AdUnit.module.scss";

export const AdUnit = ({ type, sizes = [], index }) => {
    const config = useConfig();
    const AD_REFRESH_RATE = 8000;

    if(config.ads?.display !== true || !config.ads.googleAdManager || !(type in config.ads.googleAdManager) || !("id" in config.ads.googleAdManager[type])) {
        return null;
    }

    const adConfig = config.ads.googleAdManager[type];
    const slotId = index ? adConfig.id + "-" + index : adConfig.id;

    useEffect(() => {
        if(typeof window !== 'undefined') {
            window.googletag = window.googletag || {cmd: []};
            const targeting = adConfig.targeting || {};
            let slot = {};
            googletag.cmd.push(function() {
                slot = googletag.defineSlot(adConfig.path, sizes, slotId)
                    .setTargeting('origine', ['logora'])
                    .addService(googletag.pubads());
                for (const [key, value] of Object.entries(targeting)) {
                    slot = slot.setTargeting(key, value);
                }
                googletag.pubads().enableSingleRequest();
                googletag.pubads().disableInitialLoad();
                googletag.enableServices();
                googletag.display(slotId);
                googletag.pubads().refresh([slot]);

                googletag.pubads().addEventListener('impressionViewable', function(event) {
                    if(event.slot === slot) {
                        setTimeout(function () {
                            googletag.pubads().refresh([event.slot]);
                        }, AD_REFRESH_RATE);
                    }
                });
            });

            return () => {
                const googletag = window.googletag || {cmd: []};
                googletag.cmd.push(function() {
                    googletag.destroySlots();
                });
            }
        }
    });

    if(config.consent?.didomi === true) {
        return (
            <script type="didomi/html" data-vendor="didomi:google" data-purposes="cookies">
                <div className={styles.adContainer}>
                    <div className={styles.adUnit} id={slotId}></div>
                </div>
            </script>
        );
    } else {
        return (
            <div className={styles.adContainer}>
                <div className={styles.adUnit} id={slotId}></div>
            </div>
        );
    }
}

AdUnit.propTypes = {
    /** Type of slot used to get configuration */
    type: PropTypes.string,
    /** Sizes of slot */
    sizes: PropTypes.array,
    /** Slot index to define the ID */
    index: PropTypes.number
};

AdUnit.defaultProps = {
    sizes: []
};