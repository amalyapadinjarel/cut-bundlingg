    export var CopyFromUsersLovConfig: any = {
        title: 'Select Users',
        url: 'lovs/users',
        dataHeader: 'data',
        returnKey:'userName',
        filterAttributes: [
            ''
        ],
        displayFields: [
            {
                title: 'Username',
                key: 'userName'
            },
            {
                title: 'Known As',
                key: 'knownAs'
            },
            {
                title: 'Name',
                key: 'name'
            }
    
        ],
        allowMultiple: true,
        preFetchPages: 10,
        primaryKey: ['userId']
    }

    export const LocationLOVConfig: any = {
        title: 'Select Location',
        url: 'lovs/embeddedUrlLocation?lookupType=TNZ_EMBED_URL_LOCATION',
        dataHeader: 'data',
        returnKey: 'meaning',
        displayKey: 'meaning',
        filterAttributes: ['meaning'],
        displayFields: [{
            key: 'meaning',
            title: 'Location'
        }]
    };

    export const BIVendorLOVConfig: any = {
        title: 'Select BI Vendor',
        url: 'lovs/BIVendor?lookupType=TNZ_EMBED_URL_BI_VENDOR',
        dataHeader: 'data',
        returnKey: 'meaning',
        displayKey: 'meaning',
        filterAttributes: ['meaning'],
        displayFields: [{
            key: 'meaning',
            title: 'BI Vendor'
        }]
    };
    export var TaskFlowLOVConfig: any = {
        title: 'Select TaskFlow',
        url: 'lovs/taskflows',
        dataHeader: 'data',
        returnKey:'taskFlowId',
        displayKey:'taskFlowName',
        filterAttributes: [
            ''
        ],
        displayFields: [
            {
                title: 'Menu',
                key: 'taskFlowName'
            },
            {
                title: 'Description',
                key: 'description'
            },
            {
                title: 'Application',
                key: 'applicationCode'
            }
            
    
        ],
        allowMultiple: false,
        preFetchPages: 10,
        primaryKey: ['taskFlowId']
    }
