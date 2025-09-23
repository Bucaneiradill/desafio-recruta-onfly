import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestOptions ,
} from 'n8n-workflow';

export class FriendGrid implements INodeType{
    description: INodeTypeDescription = {
        displayName: 'FriendGrid',
        name: 'FriendGrid',
        icon: 'file:friendGrid.svg',
        group: ['transform'],
        version: 1,
        description: 'Consume SendGrid API',
        defaults: {
            name: 'FriendGrid',
        },
        inputs:['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'friendGridApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    {
                        name: 'Contact',
                        value: 'contact',
                    }
                ],
                default: 'contact',
                noDataExpression: true,
                required: true,
                description: 'Create a new contact',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: [
                            'contact',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: "Create a contact",
                        action: 'Create a contact',
                    },
                ],
                default: 'create',
                noDataExpression: true,
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                required: true,
                disabledOptions: {
                    show: {
                        operation: [
                            'create',
                        ],
                        resource: [
                            'contact',
                        ],
                    },
                },
                default: '',
                placeholder: 'name@email.com',
                description: 'Primary email for the contact',
            },
            {
                displayName: 'Additiomal Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            'contact',
                        ],
                        operation: [
                            'create',
                        ],
                    },
                },
                options: [
                    {
                        displayName: 'FirstName',
                        name: 'firsctName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    };
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        let responseData;
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0 ; i < items.length; i++) {
            if(resource === 'contact') {
                if(operation === 'create'){
                    const email = this.getNodeParameter('email', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
                    const data: IDataObject = {
                        email,
                    };
                    Object.assign(data, additionalFields);
                    const options: IHttpRequestOptions = {
                        headers: {
                            'Accept': 'application/json',
                        },
                        method: 'PUT',
                        body: {
                            contacts: [
                                data,
                            ],
                        },
                        url: `https://api.sendgrid.com/v3/marketing/contacts`,
                        json: true,
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
                    returnData.push(responseData);
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}