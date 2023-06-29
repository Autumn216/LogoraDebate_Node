import renderAPI from "./utils/renderAPI";

if( document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
}

function init() {
    const shortcode_containers = document.querySelectorAll('.logora_embed');
    for (let i = 0; i < shortcode_containers.length; ++i) {
        const objectId = shortcode_containers[i].getAttribute('data-object-id');
        const logoraConfig = window[objectId];
        
        if (logoraConfig?.shortname) {
            render(shortcode_containers[i], logoraConfig);
        }
    }
}

function render(container, config, cache = true) {
    const api = new renderAPI(config.shortname, config.api_key);
    const containerWidth = container.getBoundingClientRect().width.toFixed(2);
    const deviceType = getDeviceFromSize(containerWidth);

    if(!config.resource.id) {
        console.log("[Logora] Cannot get resource identifier.");
        return false;
    }
    api.renderEmbed(config.resource.name, config.resource.id, null, cache, deviceType).then(response => {
        if (response.success) {
            if (typeof response.html === "string") {
                container.innerHTML = response.html;
            }
            dispatchLoadEvent(response.resource);
            return true;
        } else {
            dispatchLoadEvent(null);
            return false;
        }
    }).catch(error => {
        dispatchLoadEvent(null);
        return false;
    });
}

function getDeviceFromSize(size) {
    if(size) {
        if(size >= 769) {
            return "desktop";
        } else if(size < 769 && size >= 577) {
            return "tablet";
        } else {
            return "mobile";
        }
    } else {
        return false;
    }
}

function dispatchLoadEvent(resource) {
    window.dispatchEvent(
        new CustomEvent("logoraContentLoaded", {
            detail: {
                resource: resource
            }
        })
    );
}