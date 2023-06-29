// THEME FUNCTIONS
const Css = require('json-to-css');

exports.getThemeCss = function(config) {
    if(config && config.theme) {
        const themeCss = {"#logoraRoot": {}};
        Object.keys(config.theme).map((key) => {
            if(config.theme[key]) {
                themeCss["#logoraRoot"][toVariableName(key)] = config.theme[key];
            }
        });
        return Css.of(themeCss);
    }
}

exports.getFontHtml = function(config) {
    if(config && config.theme) {
        return "<link href=\"https://fonts.googleapis.com/css?family=" + config.theme.fontFamily + ":300,400,700:latin\" rel=\"stylesheet\">"
    }
}

const toVariableName = (str) => {
    return '--' + str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}` );
}