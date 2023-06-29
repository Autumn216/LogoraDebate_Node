import { useEffect } from 'react';

export const MatomoInitializer = (props) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.text = "var _mtm = window._mtm = window._mtm || []; \
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'}); \
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; \
        g.async=true; g.src='https://" + props.matomoUrl + "/js/container_" + props.matomoContainerTag + ".js'; s.parentNode.insertBefore(g,s);";
        document.body.appendChild(script);
    });

    return null;
}