import { FuzzySuggestModal, TFile, App } from "obsidian";
import { Settings } from "src/settings";

export class WordChoosingModal extends FuzzySuggestModal<TFile>
{
	settings:Settings
    performAction:(file:TFile) => void;

	constructor(app: App, settings:Settings, performAction?:(file:TFile) => void)
	{
		super(app);
		this.settings = settings;
        if(performAction) this.performAction = performAction;
	}

	getItems(): TFile[] {
		const files = this.app.vault.getFiles();
		const result:TFile[] = [];

		files.forEach(file => {
			if(file.path.toLowerCase().includes(this.settings.wordBankLocation.toLowerCase()))
			{
				result.push(file);
			}
		})

		return result;
	}

	getItemText(file: TFile): string {
		return file.basename;
	}


	onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent) {
		this.performAction(file);
	}
}