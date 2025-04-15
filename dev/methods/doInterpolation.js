import { resolveDataPath } from './help-functions.js'


export default function doInterpolation(tpl) {
    if (!tpl.includes('{{')) return tpl;
    return tpl.replace(/{{(.*?)}}/g, (_, path) => {
        const resolvedValue = resolveDataPath(this, path.trim());
        return resolvedValue !== undefined ? resolvedValue : '';
    });
}


