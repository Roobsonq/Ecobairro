CREATE TABLE `disposal_points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`materialTypes` json NOT NULL,
	`address` text NOT NULL,
	`neighborhood` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL DEFAULT '0',
	`longitude` decimal(11,8) NOT NULL DEFAULT '0',
	`phone` varchar(20),
	`operatingHours` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disposal_points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`materialType` varchar(100),
	`content` text NOT NULL,
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `education_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`month` varchar(7) NOT NULL,
	`totalVolumeCollected` decimal(10,2) NOT NULL DEFAULT '0',
	`baselineVolume` decimal(10,2) NOT NULL DEFAULT '0',
	`percentageIncrease` decimal(5,2) NOT NULL DEFAULT '0',
	`totalSchedules` int NOT NULL DEFAULT 0,
	`completedSchedules` int NOT NULL DEFAULT 0,
	`activeUsers` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('agendamento','coleta','educacao','sistema') NOT NULL DEFAULT 'sistema',
	`relatedScheduleId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`materialType` varchar(100) NOT NULL,
	`estimatedVolume` varchar(50) NOT NULL,
	`address` text NOT NULL,
	`neighborhood` varchar(255) NOT NULL,
	`latitude` decimal(10,8) DEFAULT '0',
	`longitude` decimal(11,8) DEFAULT '0',
	`status` enum('pendente','confirmado','concluído') NOT NULL DEFAULT 'pendente',
	`notes` text,
	`scheduledDate` datetime,
	`completedDate` datetime,
	`collectedVolume` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('morador','prefeitura','cooperativa','admin') NOT NULL DEFAULT 'morador';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;--> statement-breakpoint
ALTER TABLE `users` ADD `neighborhood` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `latitude` decimal(10,8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `users` ADD `longitude` decimal(11,8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `users` ADD `engagementScore` int DEFAULT 0 NOT NULL;