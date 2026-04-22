CREATE TABLE `sms_login_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_token` varchar(255) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`user_id` int,
	`is_verified` int NOT NULL DEFAULT 0,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sms_login_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sms_login_sessions_session_token_unique` UNIQUE(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `sms_verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`otp_code` varchar(6) NOT NULL,
	`is_verified` int NOT NULL DEFAULT 0,
	`user_id` int,
	`expires_at` timestamp NOT NULL,
	`attempt_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sms_verifications_id` PRIMARY KEY(`id`)
);
