export default function filterConfig(config) {
    const allowedConfig = {};
    allowedConfig.shortname = config.shortname;
    if("synthesis" in config) {
        allowedConfig.synthesis = config.synthesis;
    }
    if("modules" in config) {
        allowedConfig.modules = config.modules;
    }
    if("ads" in config) {
        allowedConfig.ads = config.ads;
    }
    if("remote_auth" in config) {
        allowedConfig.remote_auth = config.remote_auth;
    }
    if("login_url" in config) {
        allowedConfig.login_url = config.login_url;
    }
    if("registration_url" in config) {
        allowedConfig.registration_url = config.registration_url;
    }
    if("auth" in config) {
        allowedConfig.auth = config.auth;
    }
    return allowedConfig;
}