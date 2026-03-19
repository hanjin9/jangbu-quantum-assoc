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
