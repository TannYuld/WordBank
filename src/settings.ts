export interface Settings {    
	openWords: boolean;
    openWordsNewPage: boolean;
    autoInsertWordLink:boolean;

	addDateInFile: boolean;
	addTimeInFile: boolean;
	dateFormat: string;
	timeFormat: string;

	wordBankLocation: string;

	useCustomWordTemplate: boolean;
	customTemplateLocation: string;

	addTagInFile: boolean;
	customTag: string;
}