import { PluginSettingTab, App, Setting } from "obsidian";
import MyPlugin from "main";
import { FolderSuggest, FileSuggest } from "./suggest-modal";

export class SettingModal extends PluginSettingTab{
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		let files: Record<string, string> = {
			"bok": "kaka",
			"naber": "mudur"
		};
		
		new Setting(containerEl)
			.setName("Open created words")
			.setDesc("Opens created words after their creation.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.openWords)
				.onChange(async (value) => {
					this.plugin.settings.openWords = value;
					containerEl.empty();
					this.display();
					if(value == false){this.plugin.settings.openWordsNewPage = false;}
					await this.plugin.saveSettings();
		}));

		if(this.plugin.settings.openWords)
		{
			new Setting(containerEl)
			.setName("Open created words in new tab")
			.setDesc("Opens created words in new tab.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.openWordsNewPage)
				.onChange(async (value) => {
					this.plugin.settings.openWordsNewPage = value;
					await this.plugin.saveSettings();
			}));
		}

		new Setting(containerEl)
		.setName("Auto insert created words")
		.setDesc("Automaticly inserts link for created words in current editor.")
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.autoInsertWordLink)
			.onChange(async (value) => {
				this.plugin.settings.autoInsertWordLink = value;
				await this.plugin.saveSettings();
		}));
		
		new Setting(containerEl)
			.setName("Add date into word files")
			.setDesc("Puts current date above the word file in wordbank.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.addDateInFile)
				.onChange(async (value) => {
					this.plugin.settings.addDateInFile = value;
					this.plugin.settings.dateFormat = "";
					containerEl.empty();
					this.display();
					await this.plugin.saveSettings();
				}))
		
		if(this.plugin.settings.addDateInFile)
		{
			const dateFormatSetting = new Setting(containerEl)
				.setName("Date format")
				.setDesc("Format of time in your words page.")
				.setClass("setting-format-sample-text-container");
		
			dateFormatSetting.descEl.createEl("p", {text: "This is how date will look in word cards:", cls:"positionless"})
			const dateSampleEl = dateFormatSetting.descEl.createEl("p", {cls: "setting-format-sample-text"});

			dateFormatSetting.addMomentFormat(text => text
				.setValue(this.plugin.settings.dateFormat)
				.setPlaceholder("YYYY-MM-DD")
				.setDefaultFormat("YYYY-MM-DD")
				.setSampleEl(dateSampleEl)
				.onChange(async (value) => {
					this.plugin.settings.dateFormat = value;
					text.updateSample();
					await this.plugin.saveSettings();
				}));
		}

		new Setting(containerEl)
		.setName("Add time into word files")
		.setDesc("It puts current time above the word file in wordbank.")
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.addTimeInFile)
			.onChange(async (value) => {
				this.plugin.settings.addTimeInFile = value;
				this.plugin.settings.timeFormat = "";
				containerEl.empty();
				this.display();
				await this.plugin.saveSettings();
			}));

		if(this.plugin.settings.addTimeInFile)
		{
			const timeFormatSetting = new Setting(containerEl)
				.setName("Time format")
				.setDesc("Format of time in your words page.")
				.setClass("setting-format-sample-text-container");
	
			timeFormatSetting.descEl.createEl("p", {text: "This is how time will look in word cards:", cls:"positionless"})
			const sampleEl = timeFormatSetting.descEl.createEl("p", {cls: "setting-format-sample-text"});
	
			timeFormatSetting.addMomentFormat(text => text
				.setValue(this.plugin.settings.timeFormat)
				.setPlaceholder("HH:mm")
				.setDefaultFormat("HH:mm")
				.setSampleEl(sampleEl)
				.onChange(async (value) => {
					this.plugin.settings.timeFormat = value;
					text.updateSample();
					await this.plugin.saveSettings();
				}));
		}
		
		/*
				let myArray: Array<{name:string, value:string}> = [];
				myArray.push({name:"firstEntry", value:"its valu"});
				myArray.push({name:"secondValue", value:"another value"});
		
				new NameValueSuggestModal(this.app, myArray, (item) => {
					new Notice(`Name is ${item.name} and its value is ${item.value}!`);
				}).open();
		*/

		new Setting(containerEl)
			.setName("Word bank location")
			.setDesc("This is placeholder text!")
			.addText(text => {
				new FolderSuggest(this.app, text.inputEl);

				text.setValue(this.plugin.settings.wordBankLocation);
				text.setPlaceholder("Example: folder1/folder2");

				text.onChange(async text => {
					this.plugin.settings.wordBankLocation = text;
				 	await this.plugin.saveSettings();
				});
			});
		
		new Setting(containerEl)
		.setName("Use custom word template")
		.setDesc("This is a placeholder text!")
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.useCustomWordTemplate)
			.onChange(async (value) => {
				this.plugin.settings.useCustomWordTemplate = value;
				this.plugin.settings.customTemplateLocation = "";
				containerEl.empty();
				this.display();
				await this.plugin.saveSettings();
			}));

		if(this.plugin.settings.useCustomWordTemplate)
		{
			new Setting(containerEl)
			.setName("Custom word template")
			.setDesc("This is a placeholder text!")
			.addText(text => {
				new FileSuggest(this.app, text.inputEl);

				text.setValue(this.plugin.settings.customTemplateLocation);
				text.setPlaceholder("Example: folder1/note1");

				text.onChange(async text => {
					this.plugin.settings.customTemplateLocation = text;
				 	await this.plugin.saveSettings();
				});
			});
		}

		new Setting(containerEl)
		.setName("Use tag in word files")
		.setDesc("Put a tag into your words for beter organisation.")
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.addTagInFile)
			.onChange(async (value) => {
				this.plugin.settings.addTagInFile = value;
				this.plugin.settings.customTag = "";
				containerEl.empty();
				this.display();
				await this.plugin.saveSettings();
			}));

		if(this.plugin.settings.addTagInFile)
		{
			new Setting(containerEl)
			.setName("Custom tag")
			.setDesc("This tag overrides the defualt #WordBank tag of plugin. (DON'T put '#' at the beginning.)")
			.addText(text => {
				text.setValue(this.plugin.settings.customTag);
				text.setPlaceholder("Example: MyWord");

				text.onChange(async text => {
					this.plugin.settings.customTag = text;
				 	await this.plugin.saveSettings();
				});
			});
		}
	}
}