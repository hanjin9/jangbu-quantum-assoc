CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`order_id` int,
	`course_id` varchar(100) NOT NULL,
	`course_name` varchar(255) NOT NULL,
	`certificate_number` varchar(255) NOT NULL,
	`verification_code` varchar(64) NOT NULL,
	`certificate_pdf_url` text,
	`issue_date` timestamp NOT NULL DEFAULT (now()),
	`expiry_date` timestamp,
	`status` enum('active','revoked','expired') NOT NULL DEFAULT 'active',
	`revoke_reason` text,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificate_number_unique` UNIQUE(`certificate_number`),
	CONSTRAINT `certificates_verification_code_unique` UNIQUE(`verification_code`)
);
--> statement-breakpoint
CREATE TABLE `course_lectures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`course_id` varchar(100) NOT NULL,
	`course_name` varchar(255) NOT NULL,
	`course_level` varchar(50) NOT NULL,
	`course_description` text,
	`instructor_name` varchar(255),
	`instructor_email` varchar(320),
	`duration_minutes` int NOT NULL,
	`minimum_passing_minutes` int NOT NULL,
	`video_url` text,
	`course_image_url` text,
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_lectures_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_lectures_course_id_unique` UNIQUE(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `lecture_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`course_id` varchar(100) NOT NULL,
	`watched_minutes` int NOT NULL DEFAULT 0,
	`progress_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
	`is_completed` int NOT NULL DEFAULT 0,
	`completed_at` timestamp,
	`certificate_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lecture_progress_id` PRIMARY KEY(`id`)
);
