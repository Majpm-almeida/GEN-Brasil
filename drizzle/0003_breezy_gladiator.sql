CREATE TABLE `analysisVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`analysisArtifact` enum('worksheet','synthesis') NOT NULL,
	`lens` varchar(48),
	`status` varchar(32) NOT NULL,
	`snapshot` text NOT NULL,
	`savedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analysisVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`eventId` int NOT NULL,
	`authorUserId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `analysisVersions` ADD CONSTRAINT `analysisVersions_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `analysisVersions` ADD CONSTRAINT `analysisVersions_savedByUserId_users_id_fk` FOREIGN KEY (`savedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventComments` ADD CONSTRAINT `eventComments_groupId_workGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `workGroups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventComments` ADD CONSTRAINT `eventComments_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `analysisVersionsGroupArtifactIndex` ON `analysisVersions` (`groupId`,`analysisArtifact`,`lens`);--> statement-breakpoint
CREATE INDEX `analysisVersionsSavedByIndex` ON `analysisVersions` (`savedByUserId`);--> statement-breakpoint
CREATE INDEX `eventCommentsGroupEventIndex` ON `eventComments` (`groupId`,`eventId`);--> statement-breakpoint
CREATE INDEX `eventCommentsAuthorIndex` ON `eventComments` (`authorUserId`);