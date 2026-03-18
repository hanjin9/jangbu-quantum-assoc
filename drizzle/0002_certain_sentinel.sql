CREATE TABLE `live_stream_chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stream_id` int NOT NULL,
	`user_id` int NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`is_instructor_reply` int NOT NULL DEFAULT 0,
	`reply_to_message_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `live_stream_chats_id` PRIMARY KEY(`id`)
);
