# PostgreSQL Naming Conventions & Best Practices Guide

An enforcement-ready standard for database architects & developers to ensure consistency, eliminate syntax bugs, and guarantee seamless cross-tool compatibility in **PostgreSQL**.

---

## 1. Core Structural Rules (Non-Negotiable)

### Lowercase Only (`snake_case`)
PostgreSQL automatically folds unquoted identifiers to lowercase. To avoid mandatory double quotes (`"MyTable"`), **all identifiers must be strictly lowercase**.
* **Good:** `user_accounts`, `order_items`, `created_at`
* **Bad:** `UserAccounts`, `OrderItems`, `createdAt`

> **Using Prisma?** Keep `PascalCase` models and `camelCase` fields in your schema, and use `@map` / `@@map` to map them to `snake_case` in the database. See [Section 5](#5-orm-mapping-prisma).

### Use Safe Characters
Limit identifiers to alphanumeric characters and underscores.
* **Allowed:** `a-z`, `0-9`, and `_`
* **Prohibited:** Spaces, hyphens, periods, or special characters (`user-account`, `first name`).

### Avoid Reserved Keywords
Never use SQL standard or PostgreSQL specific reserved keywords. If a keyword must be used, contextually expand it.
* **Bad:** `user`, `order`, `group`, `table`, `select`, `join`, `where`
* **Good:** `accounts`, `customer_orders`, `access_groups`, `log_date`

### Strict Character Limits
PostgreSQL has a hard identifier limit of **63 bytes** by default. Keep names concise to ensure safety when PostgreSQL appends suffixes automatically (e.g., auto-generated index names).
* Keep table names under **40 characters**.
* Keep column names under **40 characters**.

---

## 2. Table Naming Conventions

### The Plurality Rule
Tables represent collections of entities. Use **plural nouns** consistently, unless downstream application frameworks (like Django or Active Record) explicitly mandate singular forms.
* **Good:** `customers`, `products`, `invoices`
* **Bad:** `customer`, `product_list`, `tbl_invoices`

### Ban Prefixes
Do not prefix tables with meta-identifiers like `tbl_`, `t_`, or `vw_`. PostgreSQL natively tracks object types.
* **Good:** `employees`
* **Bad:** `tbl_employees`, `t_employees`

### Junction (Many-to-Many) Tables
Name many-to-many mapping tables by joining the two related table names, ordered by contextual importance or alphabetically. Use singular or plural forms consistently.
* **Good:** `student_courses` (maps `students` and `courses`)
* **Good:** `post_tags` (maps `posts` and `tags`)

---

## 3. Column Naming Conventions

### Primary Keys
Always use `id` for the primary surrogate key of a table. It keeps query joins intuitive and uniform.
* **Good:** `id`
* **Bad:** `user_id` (inside the `users` table itself), `pk_id`, `id_users`

### Foreign Keys
Foreign keys must strictly reference the target table name in its **singular form**, suffixed with `_id`.
* **Good:** `user_id` (points to `users.id`)
* **Good:** `order_id` (points to `orders.id`)
* **Bad:** `user`, `customer_fk`, `id_user`

### Boolean Columns
Prefix boolean flags with indicator verbs like `is_`, `has_`, or `can_` to clearly distinguish them from states or categories.
* **Good:** `is_active`, `has_verified_email`, `can_login`
* **Bad:** `active`, `status`, `email_verified`

### Date and Time Fields
Suffix timestamp columns with `_at` and pure date columns with `_date`. Avoid naming columns generic terms like `date` or `time`.
* **Good:** `created_at`, `updated_at`, `shipped_date`, `birth_date`
* **Bad:** `create_time`, `date`, `timestamp`

---

## 4. Constraints & Indexes (System Objects)

While PostgreSQL generates default names, manual definitions should follow a predictable format using abbreviations to stay within the 63-character limit:

| Object Type | Suffix / Prefix | Pattern Template | Example |
| :--- | :--- | :--- | :--- |
| **Primary Key** | `_pkey` | `{table}_pkey` | `users_pkey` |
| **Foreign Key** | `_fkey` | `{table}_{column}_fkey` | `orders_user_id_fkey` |
| **Unique Constraint** | `_key` | `{table}_{column}_key` | `users_email_key` |
| **Check Constraint** | `_chk` | `{table}_{column}_chk` | `products_price_chk` |
| **Standard Index** | `_idx` | `{table}_{column}_idx` | `users_last_name_idx` |

---

## 5. ORM Mapping (Prisma)

> This project has not picked an ORM yet (see AGENTS.md: TypeORM/Drizzle/etc.). Whatever is chosen, the **database** must follow this guide, and code keeps idiomatic TypeScript names (`camelCase` fields, `PascalCase` classes) mapped to `snake_case` columns/tables via that ORM's naming-strategy or column-name options. The Prisma example below illustrates the principle.

Application code and the database follow different conventions. Rather than compromising either side, use Prisma's mapping attributes to keep idiomatic names in code while the database stays strictly `snake_case`.

| Attribute | Applies To | Purpose |
| :--- | :--- | :--- |
| `@@map("...")` | Model / Enum | Maps a `PascalCase` model name to a plural `snake_case` table name |
| `@map("...")` | Field / Enum value | Maps a `camelCase` field to a `snake_case` column name |
| `map: "..."` | `@id`, `@@id`, `@unique`, `@@unique`, `@@index`, `@relation` | Sets explicit constraint and index names (see [Section 4](#4-constraints--indexes-system-objects)) |

```prisma
model UserAccount {
  id           Int       @id @default(autoincrement())
  emailAddress String    @unique(map: "user_accounts_email_address_key") @map("email_address")
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  orders       CustomerOrder[]

  @@map("user_accounts")
}

model CustomerOrder {
  id            Int         @id @default(autoincrement())
  userAccountId Int         @map("user_account_id")
  userAccount   UserAccount @relation(fields: [userAccountId], references: [id], map: "customer_orders_user_account_id_fkey")
  shippedDate   DateTime?   @db.Date @map("shipped_date")

  @@index([userAccountId], map: "customer_orders_user_account_id_idx")
  @@map("customer_orders")
}
```

* **Do:** Add `@@map` to every model and `@map` to every multi-word field.
* **Don't:** Name Prisma models/fields in `snake_case` just to match the database — it breaks client ergonomics (`prisma.user_accounts.findMany()`).
* **Note:** Relation fields (e.g. `orders`, `userAccount`) are virtual and never need `@map`.

---

## 6. Summary Cheat Sheet

| Object | Standard Pattern | Example |
| :--- | :--- | :--- |
| **Schema** | `{domain}` | `billing`, `inventory` |
| **Table** | `{plural_noun}` | `subscriptions`, `transactions` |
| **Junction Table** | `{table1}_{table2}` | `user_roles` |
| **Primary Key** | `id` | `id` |
| **Foreign Key** | `{singular_table}_id` | `subscription_id` |
| **Standard Column** | `{noun}` | `first_name`, `price` |
| **Boolean** | `is_{adjective}` / `has_{noun}` | `is_published`, `has_discount` |
| **Timestamp** | `{past_tense_verb}_at` | `deleted_at`, `completed_at` |
| **Date** | `{action}_date` | `due_date`, `hire_date` |