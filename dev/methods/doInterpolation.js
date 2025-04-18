import { resolveDataPath } from './help-functions.js'


export default function doInterpolation(tpl) {
    if (!tpl.includes('{{')) return tpl;
    return tpl.replace(/{{(.*?)}}/g, (_, path) => {
        //if function
        if (path.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/)) {
            return this.executeMethod(path);       
        }
        //if dynamic data
        const resolvedValue = resolveDataPath(this, path.trim());
        return resolvedValue !== undefined ? resolvedValue : '';
    });
}


