import { App, TFile } from "obsidian";
import { WordInfo } from "src/word-info";

export class WordFile extends TFile
{
    // readonly word:string;
    // readonly definition:string;

    // readonly info:WordInfo;

    // constructor(word?:string, definition?:string, wordInfo?:WordInfo)
    // {
    //     super();
    //     this.word = (word == '' || word == null) ? '' : word;
    //     this.definition = (definition == '' || definition == null) ? '' : definition;
    // }

    static createWordFile(app:App,location:string, name:string, initialContent?:string):Promise<TFile>
    {
        if(!initialContent){initialContent = "";}
        return app.vault.create(`${location}/${name}.md`, initialContent);
    }

    static copyWordFile(app:App, location:string, name:String, file:TFile):Promise<TFile>
    {
        return app.vault.copy(file, `${location}/${name}.md`)
    }

    static getErrorMessage(message:string):string
    {
        let result = '';

        return result;
    }
}