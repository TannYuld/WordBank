import { Settings } from "src/settings"

export const DEFAULT_SETTINGS: Settings = {

	openWords: true,
    openWordsNewPage: true,
    autoInsertWordLink: false,

	addDateInFile: true,
	addTimeInFile: false,
	dateFormat: '',
	timeFormat: '',

	wordBankLocation: '',
	useCustomWordTemplate: false,
	customTemplateLocation: '',

	addTagInFile: true,
	customTag: ''
}