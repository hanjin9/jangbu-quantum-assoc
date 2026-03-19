CREATE TABLE `social_logins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`provider` varchar(50) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`provider_name` varchar(255),
	`provider_email` varchar(320),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_logins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`phone_number` varchar(20),
	`address` text,
	`city` varchar(100),
	`zip_code` varchar(20),
	`profile_image_url` text,
	`bio` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
