import renderAPI from "./utils/renderAPI";
import { isExpired } from "./synthesis";
import { extractSource } from "./synthesis";

if( document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
}

function init() {
    const shortcode_containers = document.querySelectorAll('.logora_container');
    for (let i = 0; i < shortcode_containers.length; ++i) {
        const objectId = shortcode_containers[i].getAttribute('data-object-id');
        const logoraConfig = window[objectId];

        if(logoraConfig?.shortname) {
            render(shortcode_containers[i], logoraConfig);
        }
    }
}

function removeDebateAndSource(config) {
    delete config.debate;
    delete config.source;
    delete config.consultation;
    return config;
}

function render(container, config, cache = true) {
    const api = new renderAPI(config.shortname, config.api_key);
    if(!config.debate.identifier) {
        console.log("[Logora] Cannot get page identifier. Check that 'debate.identifier' is set in the configuration.");
        return false;
    }
    const currentSource = extractSource(config);
    if("published_date" in currentSource && isExpired(currentSource.published_date, config.synthesis && config.synthesis.pageExpirationDate) && config.debate.insertType !== "amp") {
        return false;
    }
    api.renderWidget(config.debate.identifier, config.debate.insertType, currentSource, config.debate, cache, removeDebateAndSource(config)).then(response => {
        if (response.success) {
            container.innerHTML = response.content;
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        return false;
    });
}
