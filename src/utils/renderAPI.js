class renderAPI {
    constructor(shortname) {
        this.apiURL = process.env.RENDER_API_URL;
        this.shortname = shortname;
    }

    renderSynthesis(uid, insertType, source, debate, cache, device, config) {
        let route = '/synthesis?shortname=' + this.shortname + "&uid=" + uid;
        if(insertType) {
            route = route + "&insertType=" + insertType;
        }
        if(cache === false) {
            route = route + "&cache=false";
        }
        if(device) {
            route = route + "&device=" + device;
        }
        return this.client_post(route, { source: source,  debate: debate, config: config });
    }

    renderWidget(uid, insertType, source, debate, cache, config) {
        let route = '/widget?shortname=' + this.shortname + "&uid=" + uid;
        if(insertType) {
            route = route + "&insertType=" + insertType;
        }
        if(cache === false) {
            route = route + "&cache=false";
        }
        return this.client_post(route, { source: source, debate: debate, config: config });
    }

    renderEmbed(ressourceName, id, source, cache, device) {
        let route = '/embed/' + ressourceName + "?shortname=" + this.shortname + "&id=" + id;
        if(cache === false) {
            route = route + "&cache=false";
        }
        route = route + "&insertType=iframe"; // Embed is also iframe
        if(device) {
            route = route + "&device=" + device;
        }
        return this.client_post(route, { source: source });
    }
    
    client_post(route, data) {
        let url = this.apiURL + route;
        const headers = new Headers(
            { 'Content-Type': 'application/x-www-form-urlencoded' }
        );
        return new Promise((resolve, reject) => {
            fetch(url, { method: "post", body: this.serialize(data), headers: headers })
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    serialize(obj, prefix) {
        let str = [],
            p;
        for (p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                let k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    this.serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
}

export default renderAPI;