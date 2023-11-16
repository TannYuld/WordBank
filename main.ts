import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting , Menu, TextComponent, PopoverSuggest, SuggestModal, AbstractInputSuggest, Vault, TFile, FuzzySuggestModal, TAbstractFile} from 'obsidian';
import { SearchModal } from 'src/ui/search-modal';
import { SettingModal } from 'src/ui/settings-modal';
import { WordAddingModal } from 'src/ui/word-adding-modal';
import { WordChoosingModal } from 'src/ui/word-choosing-modal';
import { Settings } from 'src/settings';
import { DEFAULT_SETTINGS } from 'src/util/constants'
import { WordHandler } from 'src/core/word';

export default class MyPlugin extends Plugin {
	settings: Settings;
	wordHandler:WordHandler

	async onload() {
		await this.loadSettings();
		this.wordHandler = WordHandler.getInstance(this.app, this.settings);

		this.app.vault.getMarkdownFiles().forEach(element => {
			console.log(element);
		});

		this.addRibbonIcon("landmark", "Word Bank", (event) => 
		{
			const menu = new Menu();
	  
			menu.addItem((item) =>
			  item
				.setTitle("Add new word")
				.setIcon("plus-circle")
				.onClick(() => {
				  new WordAddingModal(this.app, this.settings, (word, defToAdd) => {
					this.wordHandler.addNewWord(word, defToAdd);
				  }).open();
				})
			);
	  
			menu.addItem((item) =>
			  item
				.setTitle("Open word bank")
				.setIcon("book-open")
				.onClick(() => {
				  new WordChoosingModal(this.app, this.settings, file => {
						this.wordHandler.openWord(file, true);
				  }).open();
				})
			);
	  
			menu.showAtMouseEvent(event);
		  });

		this.addCommand({
		id: 'add-word-into-wordbank',
		name: 'Add word into wordbank',
		
		callback: () => {
			new WordAddingModal(this.app, this.settings,(wordToAdd, definition)=>{
				this.wordHandler.addNewWord(wordToAdd, definition);
			}).open();
		},
		});

		this.addCommand({
			id: 'insert-word',
			name: 'Insert word',

			editorCallback: (editor, view) => {
				if(editor)
		  		{
					if(view)
					{
						new WordChoosingModal(this.app, this.settings, file => {
							this.wordHandler.insertWordLink(file);
						}).open();
					}

					return true;
		  		}
		  		return false;
			}
		});

		this.addCommand({
			id: 'open-word',
			name: 'Open a word',

			callback: () => {
				new WordChoosingModal(this.app, this.settings, file => {
					this.wordHandler.openWord(file, true);
				}).open();
			}
		});

		this.addSettingTab(new SettingModal(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}