export function getDefaultContent(definition:string, date?:string, time?:string, tag?:string):string
{
    let content:string = "";
    
    if(date != '')
    {
        content+= `<span class="formatted-label">Create date:</span>`;
        content+= `<span class="formatted-text">`;
        content += " "+date;
        content+= `</span>`;

        content += 
`
`;
    }
    
    if(time != '')
    {
        content+= `<span class="formatted-label formatted-bottom-text">Create time:</span>`;
        content+= ` <span class="formatted-text formatted-bottom-text">`;
        content += time;
        content+= `</span>`;

        content += 
`
`;
    }

    if(tag != ''){content += `#`;}
    content += tag;
    if(tag != '')
    {
        content += 
`
`;
    }

    content += definition;
    return content;
}