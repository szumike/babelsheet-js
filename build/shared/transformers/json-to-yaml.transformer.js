"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToYamlTransformer {
    constructor() {
        this.supportedType = 'json-yml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.mergeLanguages) {
            return {
                ...source,
                result: {
                    merged: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                },
            };
        }
        else if (source.meta.langCode) {
            return {
                ...source,
                result: [
                    {
                        lang: source.meta.langCode,
                        content: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                    },
                ],
            };
        }
        else {
            return {
                ...source,
                result: Object.keys(source.result).map(lang => ({
                    lang,
                    content: this.generateYaml(source.result[lang], source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                })),
            };
        }
    }
    generateYaml(json, comments, locales) {
        const jsonToYaml = (current, source, upperKey = "", context = [], yaml = '', level = 0) => {
            // if its an object, go deeper
            if (typeof current === 'object') {
                return `${yaml}${'  '.repeat(Math.max(level - 1, 0))}${upperKey ? this.checkForKeywords(upperKey) ? `'${upperKey}':\n` : `${upperKey}:\n` : ''}${Object.keys(current).reduce((accumulator, key) => {
                    return jsonToYaml(current[key], source, key, [...context, key], accumulator, level + 1);
                }, '')}`;
            }
            // if its not an object, add it to yml. Check for comments existence first, if they were passed.
            else {
                let comment;
                if (comments) {
                    comment = context.reduce((previous, key, index) => {
                        // if first key is an locale, skip it
                        if (index === 0 && locales && locales.some(locale => locale === key)) {
                            return previous;
                        }
                        return previous && previous[key];
                    }, comments);
                }
                return `${yaml}${'  '.repeat(Math.max(level - 1, 0))}${this.checkForKeywords(upperKey) ? `'${upperKey}'` : upperKey}: ${this.checkForKeywords(current) ? `'${current}'` : current}${comment ? ` #${comment}` : ''}\n`;
            }
        };
        return jsonToYaml(json, json);
    }
    checkForKeywords(text) {
        // restricted words in yaml: http://yaml.org/type/bool.html
        const expression = /^(y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF)$/m;
        return expression.test(text);
    }
}
exports.default = JsonToYamlTransformer;
