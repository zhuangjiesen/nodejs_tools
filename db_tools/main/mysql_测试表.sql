

测试表结构
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `goods_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `goods_name` varchar(128) DEFAULT NULL,
  `goods_create_user` varchar(128) DEFAULT NULL,
  `goods_create_time` datetime DEFAULT NULL,
  `goods_qty` int(11) DEFAULT NULL,
  `goods_is_remain` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;




