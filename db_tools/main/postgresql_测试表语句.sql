--- 表中的id 序列需要创建

DROP TABLE IF EXISTS "public"."resource_crossing_info";
CREATE TABLE "public"."resource_crossing_info" (
"i_id" int8 NOT NULL,
"c_index_code" varchar(64),
"c_name" varchar(64) NOT NULL,
"i_org_id" int8 NOT NULL,
"i_crossing_mode" int4 NOT NULL,
"i_front_type" int4 NOT NULL,
"i_intercity" int4 NOT NULL,
"i_lane_num" int8 NOT NULL,
"c_longitude" float8,
"c_latitude" float8,
"c_create_time" timestamp(6) NOT NULL,
"c_update_time" timestamp(6) NOT NULL,
"c_camera_name" varchar(128),
"c_camera_path" varchar(128),
"c_tda_index_code" varchar(64),
"i_status" int8 NOT NULL,
"i_res_type" int4 NOT NULL,
"c_ip" varchar(512),
"i_port" int4,
"i_manufacturer" int4,
"i_device_type" int4,
"i_device_detail_type" int4,
"i_crossing_type" int4
)
WITH (OIDS=FALSE)

;





DROP TABLE IF EXISTS "public"."resource_crossing_lane_info";
CREATE TABLE "public"."resource_crossing_lane_info" (
"i_id" int8 NOT NULL,
"c_index_code" varchar(64),
"c_name" varchar(64) NOT NULL,
"i_lane_number" int8,
"c_crossing_index_code" varchar(64),
"i_speed_limit" int8 NOT NULL,
"c_direction_name" varchar(64) NOT NULL,
"i_direction_no" int4,
"i_trigger_type" int4,
"i_enable_relate" int4,
"c_related_camera_index_code" varchar(255),
"c_related_camera_name" varchar(64),
"c_related_camera_path" varchar(64),
"i_direct_type" int8,
"i_jalaneno" int8,
"i_cascade_id" int8,
"i_lane_type" int4,
"i_crossing_camera_id" int8,
"c_create_time" timestamp(6) NOT NULL,
"c_update_time" timestamp(6) NOT NULL,
"c_creator" varchar(64) NOT NULL,
"i_res_type" int4 NOT NULL,
"i_org_id" int8,
"i_device_res_type" int4,
"i_enable" int4,
"i_status" int8 NOT NULL
)
WITH (OIDS=FALSE)

;













DROP TABLE IF EXISTS "public"."vehicle_record";
CREATE TABLE "public"."vehicle_record" (
"i_id" int8 DEFAULT nextval('s_vehicle_record'::regclass) NOT NULL,
"c_camera_index_code" varchar(64) NOT NULL,
"c_cross_index_code" varchar(64) NOT NULL,
"c_plate_info" varchar(64),
"i_lane_id" int4,
"i_plate_type" int4,
"c_pass_time" timestamp(6),
"i_vehicle_speed" int4,
"i_vehicle_type" int4,
"i_vehicle_color_depth" int4,
"i_vehicle_color" int4,
"c_pic_plate" varchar(512),
"c_pic_vehicle" varchar(512),
"i_vehicle_state" int4,
"i_vehicle_logo" int4,
"i_vehicle_sublogo" int4,
"i_vehicle_model" int4,
"i_vehicle_sunvisor" int4,
"c_device_ip" varchar(32),
"i_limit_speed" int4,
"i_cross_event_type" int4,
"c_update_time" timestamp(6),
"c_log_txt" varchar(128),
"i_cross_status" int4,
"i_plate_color" int4
)
WITH (OIDS=FALSE)

;



-- 序列添加

CREATE SEQUENCE "public"."s_vehicle_record"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 411997
 CACHE 1
 OWNED BY "public"."vehicle_record"."i_id";

 CREATE SEQUENCE "public"."s_resource_crossing_lane_info"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 130
 CACHE 1
 OWNED BY "public"."resource_crossing_lane_info"."i_id";


 CREATE SEQUENCE "public"."s_resource_crossing_info"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 11
 CACHE 1
 OWNED BY "public"."resource_crossing_info"."i_id";