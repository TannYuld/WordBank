/*
*   Original code by Liam Cain.
*   https://github.com/liamcain
*/

import { AbstractInputSuggest, TFile, TAbstractFile, Notice, TFolder, Vault} from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFile> {
	textInputEl: HTMLInputElement;
	
	getSuggestions(inputStr: string): TFolder[] {
        const files = this.app.vault.getAllLoadedFiles();
        const folders = removeFiles(files);

		const inputLower = inputStr.toLowerCase();

        const suggestions: TFolder[] = [];

		folders.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFolder &&
				file.path.toLowerCase().contains(inputLower)
			) {
				suggestions.push(file);
			}
		});
        
		return suggestions;
	}

	renderSuggestion(file: TAbstractFile, el: HTMLElement) {
        
		el.setText((file as TFolder).path);
	}

	selectSuggestion(file: TAbstractFile) {
		this.textInputEl.value = (file as TFolder).path;
		this.textInputEl.trigger("input");
		this.close();
	}
}

export class FileSuggest extends AbstractInputSuggest<TFile> {
	textInputEl: HTMLInputElement;
	
	getSuggestions(inputStr: string): TFile[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const files: TFile[] = [];
		const inputLower = inputStr.toLowerCase();

		abstractFiles.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile && ["md"].contains(file.extension) &&
				file.path.toLowerCase().contains(inputLower)
			) {
				files.push(file);
			}
		});

		return files;
	}

	renderSuggestion(file: TFile, el: HTMLElement) {
		if (file.extension == "md") {
			el.setText(trimFile(file));
		}
		// else {
		// 	el.setText(file.path.slice(0, -7));
		// 	el.createDiv({cls:"nav-file-tag", text:"canvas"});
		// }
	}

	selectSuggestion(file: TFile) {
		this.textInputEl.value = trimFile(file);
		this.textInputEl.trigger("input");
		this.close();
	}
}

function trimFile(file: TFile): string {
	if (!file) return "";
	return file.extension == "md" ? file.path.slice(0, -3): file.path;
}

function removeFiles(files:TAbstractFile[]): TAbstractFile[]
{
    let newFiles:TAbstractFile[] = [];

    files.forEach(file => {
        if(file.name.contains("."))
        {
            if(!["md","canvas","svg","css","html","png","jpg"].contains(file.name.split(".")[file.name.split(".").length-1]))
            {
                newFiles.push(file);
            }
        }else
        {
            newFiles.push(file);
        }
    })

    newFiles.remove(newFiles[0]);
    return newFiles;
}