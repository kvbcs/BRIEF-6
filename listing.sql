CREATE TABLE `comment` (
  `id_comment` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `message` varchar(255),
  `id_listing` integer,
  `id_user` integer
);

CREATE TABLE `users` (
  `id_user` integer PRIMARY KEY NOT NULL
);

CREATE TABLE `listing` (
  `id_listing` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(50),
  `text` varchar(255),
  `like_number` integer,
  `id_user` integer,
  `id_like` integer
);

CREATE TABLE `like` (
  `id_like` integer,
  `id_user` integer,
  `id_listing` integer
);

ALTER TABLE `comment` ADD FOREIGN KEY (`id_listing`) REFERENCES `listing` (`id_listing`);

ALTER TABLE `comment` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

ALTER TABLE `listing` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

CREATE TABLE `listing_like` (
  `listing_id_like` integer,
  `like_id_like` integer,
  PRIMARY KEY (`listing_id_like`, `like_id_like`)
);

ALTER TABLE `listing_like` ADD FOREIGN KEY (`listing_id_like`) REFERENCES `listing` (`id_like`);

ALTER TABLE `listing_like` ADD FOREIGN KEY (`like_id_like`) REFERENCES `like` (`id_like`);


CREATE TABLE `like_users` (
  `like_id_user` integer,
  `users_id_user` integer,
  PRIMARY KEY (`like_id_user`, `users_id_user`)
);

ALTER TABLE `like_users` ADD FOREIGN KEY (`like_id_user`) REFERENCES `like` (`id_user`);

ALTER TABLE `like_users` ADD FOREIGN KEY (`users_id_user`) REFERENCES `users` (`id_user`);

