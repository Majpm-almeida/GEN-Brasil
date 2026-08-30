CREATE TABLE `analyticalWorksheets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`worksheetLens` enum('guerra_hibrida','lawfare','seguranca_transnacional') NOT NULL,
	`classification` varchar(64),
	`selectedEventIds` text,
	`testEntries` text,
	`centralJudgment` text,
	`evidenceBasis` text,
	`limitsAndAlternatives` text,
	`clarificationNeeded` text,
	`integrationInput` text,
	`worksheetStatus` enum('rascunho','versao_final') NOT NULL DEFAULT 'rascunho',
	`updatedByUserId` int,
	`finalizedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analyticalWorksheets_id` PRIMARY KEY(`id`),
	CONSTRAINT `groupLensUnique` UNIQUE(`groupId`,`worksheetLens`)
);
--> statement-breakpoint
CREATE TABLE `deliverables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`deliverableType` enum('ficha_guerra_hibrida','ficha_lawfare','ficha_seguranca_transnacional','sintese_integrada','slides_finais') NOT NULL,
	`deliverableStatus` enum('pendente','rascunho','versao_final','submetido') NOT NULL DEFAULT 'pendente',
	`checklistConfirmed` boolean NOT NULL DEFAULT false,
	`submittedAt` timestamp,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliverables_id` PRIMARY KEY(`id`),
	CONSTRAINT `groupDeliverableUnique` UNIQUE(`groupId`,`deliverableType`)
);
--> statement-breakpoint
CREATE TABLE `exerciseSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coordinationNote` text,
	`finalSubmissionInstructions` text,
	`exerciseOpen` boolean NOT NULL DEFAULT true,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exerciseSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groupMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`userId` int NOT NULL,
	`groupRole` enum('dirigente','relator','integrante') NOT NULL DEFAULT 'integrante',
	`course` varchar(160),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groupMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `groupMemberUnique` UNIQUE(`groupId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `integratedSyntheses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`selectedEventIds` text,
	`connectionNotes` text,
	`strategicJudgment` text,
	`lensResults` text,
	`connectionsAndLimits` text,
	`missionResponse` text,
	`recommendations` text,
	`desiredEndState` text,
	`slideOne` text,
	`slideTwo` text,
	`slideThree` text,
	`slideFour` text,
	`synthesisStatus` enum('rascunho','versao_final') NOT NULL DEFAULT 'rascunho',
	`updatedByUserId` int,
	`finalizedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `integratedSyntheses_id` PRIMARY KEY(`id`),
	CONSTRAINT `integratedSyntheses_groupId_unique` UNIQUE(`groupId`)
);
--> statement-breakpoint
CREATE TABLE `workGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(16) NOT NULL,
	`missionAxis` varchar(80) NOT NULL,
	`missionText` text NOT NULL,
	`presentationSlot` varchar(80),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workGroups_id` PRIMARY KEY(`id`),
	CONSTRAINT `workGroups_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `analyticalWorksheets` ADD CONSTRAINT `analyticalWorksheets_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `analyticalWorksheets` ADD CONSTRAINT `analyticalWorksheets_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliverables` ADD CONSTRAINT `deliverables_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliverables` ADD CONSTRAINT `deliverables_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exerciseSettings` ADD CONSTRAINT `exerciseSettings_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupMembers` ADD CONSTRAINT `groupMembers_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupMembers` ADD CONSTRAINT `groupMembers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `integratedSyntheses` ADD CONSTRAINT `integratedSyntheses_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `integratedSyntheses` ADD CONSTRAINT `integratedSyntheses_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `groupMembersUserIndex` ON `groupMembers` (`userId`);