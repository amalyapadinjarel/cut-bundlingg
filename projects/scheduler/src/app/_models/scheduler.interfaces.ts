export class Group {
	handle: string;
	title: string;
	count: number;

	constructor(group) {
		this.handle = group.application;
		this.title = group.applicationTitle ? group.applicationTitle : group.application;;
		this.count = group.count ? group.count : 1;
	}
}

export class Program {
	application: string;
	applicationTitle: string;
	description: string;
	exeId: number;
	isDurable: string;
	isNonconcurrent: string;
	isUpdateData: string;
	jobGroup: string;
	outputFileType: string;
	pgmId: number;
	pgmName: string;
	requestRecovery: string;
	runCount: number;
	shortCode: string;
	storeOpInFs: string;
	trgGroup: string;

	constructor(pgm) {
		this.application = pgm.application;
		this.applicationTitle = pgm.applicationTitle;
		this.description = pgm.description;
		this.exeId = pgm.exeId;
		this.isDurable = pgm.isDurable;
		this.isNonconcurrent = pgm.isNonconcurrent;
		this.isUpdateData = pgm.isUpdateData;
		this.jobGroup = pgm.jobGroup;
		this.outputFileType = pgm.outputFileType;
		this.pgmId = pgm.pgmId;
		this.pgmName = pgm.pgmName ? pgm.pgmName : "";
		this.requestRecovery = pgm.requestRecovery;
		this.runCount = pgm.runCount;
		this.shortCode = pgm.shortCode;
		this.storeOpInFs = pgm.storeOpInFs;
		this.trgGroup = pgm.trgGroup;
	}
}

export class Job {
	applicationShortCode:string;
	createdBy:number;
	creationDate:string;
	endTime:string;
	exePgmId: number;
	isDurable:string;
	isEmailOnlyMe:string;
	isIncludeLog:string;
	isNonconcurrent:string;
	isSendEmail:string;
	isUpdateData:string;
	outputFileName:string;
	datasource:string;
	outputFileType:string;
	parameterList:string;
	pgmName:string;
	priority:string;
	qrtzJobGrp:string;
	qrtzJobName:string;
	qrtzTrgGrp:string;
	qrtzTrgName:string;
	requestRecovery:string;
	startTime:string;
	storeOpInFs:string;
	submittedBy:string;
	tnzJobId: number;
	tnzJobInstncId: number;
	tnzJobName:string;
	tnzJobState:string;
	tnzJobStatus:string;
	constructor(job) {
		this.applicationShortCode = job.applicationShortCode;
		this.createdBy = job.createdBy;
		this.creationDate = job.creationDate;
		this.endTime = job.endTime;
		this.exePgmId = job.exePgmId;
		this.isDurable = job.isDurable;
		this.isEmailOnlyMe = job.isEmailOnlyMe;
		this.isIncludeLog = job.isIncludeLog;
		this.isNonconcurrent = job.isNonconcurrent;
		this.isSendEmail = job.isSendEmail;
		this.isUpdateData = job.isUpdateData;
		this.outputFileName = job.outputFileName;
		this.datasource = job.datasource;
		this.outputFileType = job.outputFileType;
		this.parameterList = job.parameterList;
		this.pgmName = job.pgmName;
		this.priority = job.priority;
		this.qrtzJobGrp = job.qrtzJobGrp;
		this.qrtzJobName = job.qrtzJobName;
		this.qrtzTrgGrp = job.qrtzTrgGrp;
		this.qrtzTrgName = job.qrtzTrgName;
		this.requestRecovery = job.requestRecovery;
		this.startTime = job.startTime;
		this.storeOpInFs = job.storeOpInFs;
		this.submittedBy = job.submittedBy;
		this.tnzJobId = job.tnzJobId;
		this.tnzJobInstncId = job.tnzJobInstncId;
		this.tnzJobName = job.tnzJobName;
		this.tnzJobState = job.tnzJobState;
		this.tnzJobStatus = job.tnzJobStatus;
	}
}

export class Schedule {
	constructor(schedule) {
	}
}

export  class JobState {
	static P:string = "Pending";
	static R:string = "Running";
	static S:string = "Suspended";
	static C:string = "Completed";
	static A:string = "Aborted";
	static U:string = "Unbegun";
}

export class JobStatus {
	static S:string = "Successfully";
	static W:string = "with Warning";
	static F:string = "due to Failure";
}