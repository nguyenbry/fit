CREATE TABLE IF NOT EXISTS "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"tags" varchar(40)[] NOT NULL,
	CONSTRAINT "movements_name_key" UNIQUE("name")
);
