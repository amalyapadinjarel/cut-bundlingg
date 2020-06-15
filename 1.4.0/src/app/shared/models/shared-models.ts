export class WorkflowVariableModel {
	name: string;
	value: string;
}

export interface ChoiceList {
	value: any;
	label: any;
}

export interface Lov {
	value: any;
	label: any;
	shortCode: any;
}

export class User {
	company: string;
	division: string;
	img: string;
	knownAs: string;
	message: string;
	token: string;
	userId: string;
	userName: string;
	email: string;
	BPMAuthentication: string;
	trendzBIAuthentication: string;
	resetToken: string;
	fleetManagementAuthentication: string;
	personId: string;
}

export interface AutocompleteConfig {
	URL: string;
	key: string;
	service: any;
	filterAttributes: string[];
	resultFilter: any;
	params: URLSearchParams;
	primaryFilters: any[];
}

export class Errors {
	errors: { [key: string]: string } = {};
}
