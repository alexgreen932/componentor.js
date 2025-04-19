import { parseArgs, isStaticOrDynamic } from './help-functions.js'

//execute method function on component event
export default function executeMethod(methodKey) {
    let methodName, args = null, argArray = [];
    const match = methodKey.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
    if (match) {
        methodName = match[1];
        let args = null;
        if (match[2]) {
            args = match[2];
            console.log('args: ', args);
            if (args) {
                if (args.includes(',')) {
                    args.split(',').forEach(arg => {
                        arg = arg.trim();
                        argArray.push(isStaticOrDynamic(this, arg));                      
                    });
                } else {
                    argArray.push(isStaticOrDynamic(this, args));  
                    console.log('isStaticOrDynamic(this, args) single ----- ', isStaticOrDynamic(this, args));
                }
            }
        }

        if (methodName) {
            if (typeof this[methodName] === 'function') {

                let parsedArguments = parseArgs(argArray, this);//todo to return correct datae
                return this[methodName](...parsedArguments); // Execute function with arguments
                //    this[methodName](...argArray); // Execute function with arguments
            } else {
                console.warn(` [${this.tagName}] ${methodName} is not a function`);
            }
        }
    } else {
        app.pushLog('detect_function_error', ` [${this.tagName}] ${methodName} is not a function`);
    }
}




