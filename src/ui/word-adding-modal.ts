import { Modal, App, Setting, TFile } from "obsidian";
import { Settings } from "src/settings";

export class WordAddingModal extends Modal {
	wordToAdd: string;
	defToAdd: string;
	onSubmit: (wordToAdd: string, defToAdd: String) => void;
	app:App;
	settings:Settings

	rememberSynonym:string[] = [''];

	constructor(app: App, settings:Settings,onSubmit: (wordToAdd: string, defToAdd: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.app = app;
		this.settings = settings;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl("h1", { text: "Add New Word"});
		new Setting(contentEl)
			.setName("Word:")
			.addText((text) => {
				text.setValue(this.wordToAdd);
				text.onChange((value) => {
					this.wordToAdd = value;
				});
			})
			.setClass("word-text-box");
			
		new Setting(contentEl)
			.setName("Definition:")
			.addTextArea((text) => {
				text.setValue(this.defToAdd);
				text.onChange((value) => {
					this.defToAdd = value;
				});
			})
			.setClass("definition-text-box");

		new Setting(contentEl)
			.addButton((addButton) => {
				addButton
					.setButtonText("Add")
					.setCta()
					.onClick(() => {
						console.log(`Recived word: ${this.wordToAdd}  Recived deifinition: ${this.defToAdd}`);
						this.onSubmit(this.wordToAdd, this.defToAdd);
						this.close();
					})
		});
	}
}