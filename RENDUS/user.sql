CREATE TABLE `follow` (
  `id_followed` integer,
  `id_follower` integer
);

CREATE TABLE `user` (
  `id_user` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `photo` blob,
  `email` varchar(100),
  `password` varchar(73),
  `isActive` tinyint(1),
  `createdAt` datetime,
  `id_role` integer,
  `token` varchar(255)
);

CREATE TABLE `role` (
  `id_role` integer PRIMARY KEY NOT NULL,
  `name_role` varchar(5)
);

ALTER TABLE `user` ADD FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`);

ALTER TABLE `follow` ADD FOREIGN KEY (`id_followed`) REFERENCES `user` (`id_user`);

ALTER TABLE `follow` ADD FOREIGN KEY (`id_follower`) REFERENCES `user` (`id_user`);
