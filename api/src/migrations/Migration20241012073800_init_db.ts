import { Migration } from '@mikro-orm/migrations'

export class Migration20241012073800_init_db extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "documents" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "abstract" text not null, "deleted_by" int null, "deleted_at" timestamptz null);'
    )

    this.addSql(
      'create table "blocks" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "width" text check ("width" in (\'s\', \'m\', \'l\', \'xl\')) not null default \'xl\', "order" int not null, "document_id" int not null, "deleted_by" int null, "deleted_at" timestamptz null);'
    )

    this.addSql(
      'create table "groups" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null);'
    )

    this.addSql(
      'create table "documents_groups" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "group_id" int not null, "document_id" int not null);'
    )

    this.addSql(
      'create table "paragraphs" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "text" text not null, "type" text check ("type" in (\'basic\', \'additional\', \'revealing\')) not null default \'basic\', "width" text check ("width" in (\'s\', \'m\', \'l\', \'xl\')) not null default \'xl\', "order" int not null, "block_id" int not null, "deleted_by" int null, "deleted_at" timestamptz null);'
    )

    this.addSql(
      'create table "paragraph_attachments" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "filename" varchar(255) not null, "type" text check ("type" in (\'image\', \'file\')) not null default \'image\', "title" varchar(255) null, "description" text null, "order" int not null, "paragraph_id" int not null, "deleted_by" int null, "deleted_at" timestamptz null);'
    )

    this.addSql(
      "create table \"permissions\" (\"id\" serial primary key, \"created_by\" int not null default 1, \"updated_by\" int null, \"created_at\" timestamptz not null, \"updated_at\" timestamptz not null, \"entity\" text check (\"entity\" in ('USER', 'ROLE', 'GROUP', 'DOCUMENT', 'BLOCK', 'PARAGRAPH', 'ATTACHMENT', 'TERM', 'TERM_RELATION', 'TERM_ANALYSIS', 'RECORD', 'USER_ROLE', 'USER_GROUP', 'ROLE_PERMISSION', 'DOCUMENT_GROUP')) not null, \"action\" text check (\"action\" in ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LIST')) not null);"
    )

    this.addSql(
      'create table "roles" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(50) not null, "type" text check ("type" in (\'basic\', \'custom\')) not null default \'custom\');'
    )

    this.addSql(
      'create table "roles_permissions" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "role_id" int not null, "permission_id" int not null);'
    )

    this.addSql(
      'create table "terms" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "term" varchar(255) not null, "definition" varchar(255) null, "is_active" boolean not null default true, "deleted_by" int null, "deleted_at" timestamptz null);'
    )

    this.addSql(
      'create table "term_analyzes" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "finished" boolean not null);'
    )

    this.addSql(
      'create table "term_analyzes_terms" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "term_analysis_id" int not null, "term_id" int not null, "document_id" int not null, "frequency" real not null);'
    )

    this.addSql(
      'create table "terms_relations" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "term_id" int not null, "related_term_id" int not null, "type" text check ("type" in (\'has-a\', \'part-of\', \'class-of\', \'instance-of\', \'eq-to\')) not null);'
    )

    this.addSql(
      'create table "users" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "middle_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(100) not null, "active" boolean not null default true, "deleted_by" int null, "deleted_at" timestamptz null, "refresh_token" varchar(255) null);'
    )

    this.addSql(
      'create table "records" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "document_id" int not null, "filename" varchar(255) not null);'
    )

    this.addSql(
      'create table "users_groups" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "group_id" int not null, "user_id" int not null);'
    )

    this.addSql(
      'create table "users_roles" ("id" serial primary key, "created_by" int not null default 1, "updated_by" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "role_id" int not null, "user_id" int not null);'
    )

    this.addSql(
      'alter table "blocks" add constraint "blocks_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "documents_groups" add constraint "documents_groups_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "documents_groups" add constraint "documents_groups_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "paragraphs" add constraint "paragraphs_block_id_foreign" foreign key ("block_id") references "blocks" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "paragraph_attachments" add constraint "paragraph_attachments_paragraph_id_foreign" foreign key ("paragraph_id") references "paragraphs" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "roles_permissions" add constraint "roles_permissions_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "roles_permissions" add constraint "roles_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "term_analyzes_terms" add constraint "term_analyzes_terms_term_analysis_id_foreign" foreign key ("term_analysis_id") references "term_analyzes" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "term_analyzes_terms" add constraint "term_analyzes_terms_term_id_foreign" foreign key ("term_id") references "terms" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "term_analyzes_terms" add constraint "term_analyzes_terms_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "terms_relations" add constraint "terms_relations_term_id_foreign" foreign key ("term_id") references "terms" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "terms_relations" add constraint "terms_relations_related_term_id_foreign" foreign key ("related_term_id") references "terms" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "records" add constraint "records_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "records" add constraint "records_document_id_foreign" foreign key ("document_id") references "documents" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "users_groups" add constraint "users_groups_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "users_groups" add constraint "users_groups_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "users_roles" add constraint "users_roles_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "users_roles" add constraint "users_roles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;'
    )
  }
}
