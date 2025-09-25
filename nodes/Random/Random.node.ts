import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestOptions ,
} from 'n8n-workflow';

export class Random implements INodeType{
    description: INodeTypeDescription = {
        displayName: 'True Random Number Generator',
        name: 'random',
        icon: 'file:random.svg',
        group: ['transform'],
        version: 1,
        description: 'Gera um número aleatório usando a API da Random.org',
        defaults: {
            name: 'Random Number',
        },
        inputs:['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Mínimo',
                name: 'min',
                type: 'number',
                default: 1,
                required: true,
                description: 'Mínimo valor do número aleatório',
            },
            {
                displayName: 'Máximo',
                name: 'max',
                type: 'number',
                default: 100,
                required: true,
                description: 'Máximo valor do número aleatório',
            },
        ],
    };
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const min = this.getNodeParameter('min', 0) as number;
        const max = this.getNodeParameter('max', 0) as number;
        const returnData = [];
        const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

        const data: IDataObject = {
            min,
            max,
        };
        Object.assign(data);
        const options: IHttpRequestOptions = {
            method: 'GET',
            url: url,
            json: false,
        };
        const responseData = await this.helpers.httpRequest(options);
        returnData.push(responseData);
        return [this.helpers.returnJsonArray(returnData)];
    }
}