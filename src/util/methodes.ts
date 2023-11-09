import { Settings } from "src/settings";
import { WordInfo } from "src/word-info";

export function isSettings(object: any): object is Settings {
    return 'showWordCount' in object;
}

export function parseText(text:string, info:WordInfo, word:string, definition:string):string
{
    let newText = text;
    let templateVariables: [string] = [""];

    let findOne:boolean = false;
    let findEndOne:boolean = false;
    let startRead:boolean = false;

    let foundLetters:string[] = [];

    Array.from(text).forEach(selectedCh => {
        if(!startRead){
            if(findOne){
                if(selectedCh == '{')
                {
                    startRead = true;
                }
            }else if(selectedCh == '{'){
                findOne = true;
            }
        }else
        {
            if(findEndOne){
                if(selectedCh == '}')
                {
                    templateVariables.push(foundLetters.join(''));
                    foundLetters = [];
                    findOne = false;
                    findEndOne = false;
                    startRead = false;
                }
            }else if(selectedCh == '}'){
                findEndOne = true;
            }else
            {
                foundLetters.push(selectedCh);
            }
        }
    });

    templateVariables.splice(0, 1);

    templateVariables.forEach(variable => {
        switch(variable)
        {
            case 'time': newText = newText.replace("{{time}}",info.time); break;
            case 'date': newText = newText.replace("{{date}}",info.date); break;
            case 'tag': newText = newText.replace("{{tag}}","#"+info.tag); break;
            case 'word': newText = newText.replace("{{word}}",word); break;
            case 'definition': newText = newText.replace("{{definition}}",definition); break;
        }
    });

    return newText;
}