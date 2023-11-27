import { TFile, Notice, App, EditorPosition, TAbstractFile, ViewState } from "obsidian";
import { Settings } from "src/settings";
import { getDefaultContent } from "src/util/default-word-page";
import { isSettings, parseText } from "src/util/methodes";
import { WordInfo } from "src/word-info";
import { WordFile } from "./word-file";


export class WordHandler
{
    private static instance:WordHandler;

    private constructor(app:App|undefined, settings:Settings|undefined)
    {
        if(app instanceof App){this.app = app;}
        if(isSettings(settings)){this.settings = settings;}
    }

    public static getInstance(app?:App, setting?:Settings):WordHandler
    {
        if (!WordHandler.instance) {
            WordHandler.instance = new WordHandler(app, setting);
        }

        return WordHandler.instance;
    }

    app:App;
    settings:Settings;

	private async makeWord(word:string, definition?:string, template?:TFile)
	{
		this.getWordInfo().then(async info => {
			if(definition == undefined || !definition){definition = "";}

			if(!template || template == undefined)
			{
				const initialContent = getDefaultContent(definition, 
					(this.settings.addDateInFile) ? info.date : '', 
					(this.settings.addTimeInFile) ? info.time : '', 
					(this.settings.addTagInFile) ? info.tag : '');
				WordFile.createWordFile(this.app,this.settings.wordBankLocation, word, initialContent).then(
					file => {
						this.onWordCreate(file);
					},
					errorMessage => {new Notice(WordFile.getErrorMessage(errorMessage));}
				);
			}else
			{
				WordFile.copyWordFile(this.app,this.settings.wordBankLocation, word, template).then(
					async file => {
						let currentText = await this.app.vault.read(file);
						if(definition == undefined || !definition){definition = "";}			
						this.app.vault.modify(file, parseText(currentText , info, word, definition));
						this.onWordCreate(file);
					},
					errorMessage => {new Notice(WordFile.getErrorMessage(errorMessage));}
				);
			}


		});	
	}

	private async onWordCreate(word:TFile)
	{
		if(this.settings.autoInsertWordLink && this.app.workspace.activeEditor)
		{
			this.insertWordLink(word);
		}

		if(this.settings.openWords)
		{
			this.openWord(word);
		}
	}

	private async getWordInfo():Promise<WordInfo>
	{
		const moment = require('moment');

		const currentDate = moment().format((this.settings.dateFormat != "") ? this.settings.dateFormat : "YYYY-MM-DD");
		const currentTime = moment().format((this.settings.timeFormat != "") ? this.settings.timeFormat : "HH:mm");

		const info:WordInfo = {
			date:currentDate,
			time:currentTime,
			tag:((this.settings.customTag == '') ? "WordBank" : this.settings.customTag)
			};

		return info
	}

    async openWord(file:TFile, forceToNewPage?:boolean)
    {
        if(this.settings.openWordsNewPage || forceToNewPage)
        {
            this.openWordFileInNewLeaf(file);
        }else
        {
            this.openWordFile(file);
        }
    }

	private async openWordFile(file:TFile)
	{
		const leaf = this.app.workspace.getLeaf(false);

		this.app.workspace.revealLeaf(leaf);
		this.app.workspace.setActiveLeaf(leaf);

		await leaf.openFile(file);

		const view = this.app.workspace.activeEditor;
			let lastLine = 0;

			if(view != undefined && view.editor != undefined){lastLine = view.editor.getDoc().lastLine();}

			view?.editor?.getDoc().setCursor(
				lastLine, view.editor.getDoc().getLine(lastLine).length
			);
	}

	private async openWordFileInNewLeaf(file:TFile)
	{
		const leaf = this.app.workspace.getLeaf(true);

		this.app.workspace.revealLeaf(leaf);
		this.app.workspace.setActiveLeaf(leaf);

		await leaf.openFile(file);

		const view = this.app.workspace.activeEditor;
		let lastLine = 0;

		if(view != undefined && view.editor != undefined){lastLine = view.editor.getDoc().lastLine();}

		await view?.editor?.getDoc().setCursor(
			lastLine, view.editor.getDoc().getLine(lastLine).length
		);
	}

	async addNewWord(word:string, definition:string)
	{
		if(this.settings.wordBankLocation.length > 0){
			if(this.bankContainsWord(word)){
				new Notice(`There is already a word like ${word}`);
			}else
			{
				if(this.settings.useCustomWordTemplate){
					if(this.settings.customTemplateLocation.length > 0){
						let templateFile;
						this.app.vault.getMarkdownFiles().forEach(file=>{
							if(file.path == this.settings.customTemplateLocation+".md")
							{
								templateFile = file;
								return;
							}
						});
	
						if(templateFile){
							this.makeWord(word, definition, templateFile);
						}else
						{
							new Notice("Template file could not be found!")
						}
					}else
					{
						new Notice("Template file is empty. You can set it in settings.");
					}
				}else
				{
					this.makeWord(word, definition);
				}
			}
		}else
		{
			new Notice("There are no wordbanks found, \nset a location in settings.");
		}
	}

	async insertWordLink(file:TFile)
	{
		const activeEditor = this.app.workspace.activeEditor;
        
		if(activeEditor)
		{
            let cursor = activeEditor.editor?.getCursor();
			const linkText = this.getWordLink(file);

            if(cursor)
            {
                const preSpace = (activeEditor.editor?.getLine(cursor.line).charAt(cursor.ch-1) == " ") ? "" : " ";
                activeEditor.editor?.replaceRange(`${preSpace}[[${linkText}]]`, cursor);

                activeEditor.editor?.setCursor(activeEditor.editor.getCursor().line, activeEditor.editor.getCursor().ch+(`${preSpace}[[${linkText}]]`.length));

                cursor = activeEditor.editor?.getCursor();
                if(cursor)
                {
                    const postSpace = (activeEditor.editor?.getLine(cursor.line).charAt(cursor.ch) == " ") ? "" : " ";
                    activeEditor.editor?.replaceRange(postSpace, cursor);

                    activeEditor.editor?.setCursor(activeEditor.editor.getCursor().line, activeEditor.editor.getCursor().ch+1);
                }
            }
		}
	}

	private getWordLink(fileToLink:TFile):string
	{
		let result = fileToLink.basename;

		let containsWordWithSameName = false;
		this.app.vault.getMarkdownFiles().forEach(file => {
			if(file.basename == fileToLink.basename && file.path !== fileToLink.path)
			{
				containsWordWithSameName = true;
			}
		});
		
		if(containsWordWithSameName)
		{
			result = fileToLink.path.slice(0,-3);
		}

		return result;
	}

	private bankContainsWord(baseName:string):boolean
	{
		let result = false;
		this.app.vault.getMarkdownFiles().forEach(file=>{
			if(baseName === file.basename && file.path.contains(this.settings.wordBankLocation))
			{
				result = true;
			}
		});
		return result;
	}
}