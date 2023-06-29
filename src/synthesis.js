import renderAPI from "./utils/renderAPI";
import { getArticleMetadata } from "./utils/article-metadata-parser";
import filterConfig from './utils/filterConfig';

if( document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
}

// Lowercase tags, get unique values & limit to 10
function formatTags(tag_objects) {
    tag_objects.filter(t => {
        if(t.uid) { t.uid = t.uid.toLowerCase() }
        if(t.name) { t.name = t.name.toLowerCase() }
    });
    let newElements = [];
    tag_objects.filter((object) => {
        let objectIndex = newElements.findIndex(element => object.uid ? (element.uid == object.uid) : (element.name == object.name));
        if (objectIndex <= -1) { newElements.push(object); }
        return null;
    });
    return newElements.slice(0, 10);
}

function init() {
    const shortcode_containers = document.querySelectorAll('.logora_synthese');
    for (let i = 0; i < shortcode_containers.length; ++i) {
        const objectId = shortcode_containers[i].getAttribute('data-object-id');
        const logoraConfig = window[objectId];
        if(window["logoraDisplayAds"] === false) {
            logoraConfig.ads = { display: false };
        }

        if(logoraConfig?.shortname) {
            render(shortcode_containers[i], logoraConfig);
        }
    }
}

export function isExpired(published_date, pageExpirationDate) {
    let expirationDate = new Date(new Date().setMonth(new Date().getMonth() - 18));
    if (pageExpirationDate) { expirationDate = new Date(pageExpirationDate); }
    const currentDate = new Date();
    if(published_date) {
        const date = new Date(published_date);
        return date < expirationDate || date > currentDate;
    } else {
        return true;
    }
}

function render(container, config, cache = true) {
    const api = new renderAPI(config.shortname, config.api_key);
    const containerWidth = container.getBoundingClientRect().width.toFixed(2);
    const deviceType = getDeviceFromSize(containerWidth);
    
    if(!config.debate.identifier) {
        console.log("[Logora] Cannot get page identifier. Check that 'debate.identifier' is set in the configuration variables.");
        return false;
    }
    const currentSource = extractSource(config);
    if("published_date" in currentSource && isExpired(currentSource.published_date, config.synthesis && config.synthesis.pageExpirationDate) && config.debate.insertType !== "amp") {
        return false;
    }
    api.renderSynthesis(config.debate.identifier, config.debate.insertType, currentSource, config.debate, cache, deviceType, filterConfig(config)).then(response => {
        if (response.success) {
            setInnerHTML(container, response.content);
            dispatchLoadEvent(response.debate || response.source);
            document.querySelectorAll('.open_drawer a').forEach(item => {
                item.setAttribute("data-url", item.href);
                item.href = "#";
                item.addEventListener('click', event => {
                    function getURL () {
                        const attr = item.getAttribute("data-url");
                        if (attr) {
                            return attr
                        } else {
                            return "/"
                        }
                    }
                    import("./index-drawer").then(module => {
                        module.default(config.shortname, getURL());
                    })
                })
            });
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

function dispatchLoadEvent(resource) {
    window.dispatchEvent(
        new CustomEvent("logoraContentLoaded", {
            detail: {
                debate: resource
            }
        })
    );
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

function setInnerHTML(element, html) {
    element.innerHTML = html;
    Array.from(element.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

export function extractSource(config) {
    const extractedSource = getArticleMetadata();
    if("source" in config && "tag_objects" in config.source) {
        if(config.source.tag_objects) {
            config.source.tag_objects = formatTags(config.source.tag_objects);
        }
        return Object.assign(extractedSource, config.source);
    } else {
        return extractedSource;
    }
}