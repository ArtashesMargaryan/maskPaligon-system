import { params } from '../../params';
import { hasOwnProperty } from '../../utils';

export const assignParamsCommand = (): void => {
    const urlParams = new URLSearchParams(location.search);
    Object.keys(params).forEach((key: keyof typeof params) => {
        if (urlParams.has(key)) {
            const paramType = typeof params[key].value;
            const urlParamsValue = urlParams.get(key);
            switch (paramType) {
                case 'number':
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    params[key].value = +urlParamsValue.replace(/\D+/g, ' ');
                    break;
                case 'string':
                    const param = params[key];
                    if (hasOwnProperty(param, 'options')) {
                        if (param.options.includes(urlParamsValue)) {
                            param.value = urlParamsValue;
                        }
                    }
                    break;
            }
        }
    });
};
