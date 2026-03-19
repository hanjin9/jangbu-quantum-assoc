CREATE TABLE `jwt_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` text NOT NULL,
	`refresh_token` text,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jwt_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`user_id` int NOT NULL,
	`stripe_refund_id` varchar(255),
	`stripe_charge_id` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`reason` varchar(255) NOT NULL,
	`status` enum('pending','succeeded','failed') NOT NULL DEFAULT 'pending',
	`admin_id` int NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refunds_id` PRIMARY KEY(`id`),
	CONSTRAINT `refunds_stripe_refund_id_unique` UNIQUE(`stripe_refund_id`)
);
--> statement-breakpoint
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
CREATE TABLE `subscription_cancellations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscription_id` int NOT NULL,
	`user_id` int NOT NULL,
	`stripe_subscription_id` varchar(255) NOT NULL,
	`reason` varchar(255) NOT NULL,
	`refund_amount` decimal(10,2),
	`refund_id` int,
	`cancelled_by` enum('user','admin') NOT NULL,
	`admin_id` int,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_cancellations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`phone_number` varchar(20),
	`address` text,
	`city` varchar(100),
	`zip_code` varchar(20),
	`avatar_url` text,
	`profile_image_url` text,
	`bio` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
