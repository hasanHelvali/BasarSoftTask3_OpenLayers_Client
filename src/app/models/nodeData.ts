export class NodeData{
    id:number;
    type:string;
    name:string;
    wkt:string;
}

export class NodeTreeData{
    key:number;
    label:string;//name
    type:string;
    data:string;//wkt
}

// key: '0',
// label: 'Documents',
// data: 'Documents Folder',
// icon: 'pi pi-fw pi-inbox',
// children: [
//     {
//         key: '0-0',
//         label: 'Work',
//         data: 'Work Folder',
//         icon: 'pi pi-fw pi-cog',
//         children: [
//             { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
//             { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
//         ]
//     },