| table_name        | column_name        | data_type                | is_nullable | column_default               | character_maximum_length |
| ----------------- | ------------------ | ------------------------ | ----------- | ---------------------------- | ------------------------ |
| ai_models         | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| ai_models         | title              | text                     | NO          | null                         | null                     |
| ai_models         | content            | text                     | NO          | null                         | null                     |
| ai_models         | image_urls         | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| ai_models         | category           | text                     | NO          | null                         | null                     |
| ai_models         | created_at         | timestamp with time zone | YES         | now()                        | null                     |
| ai_models         | updated_at         | timestamp with time zone | YES         | now()                        | null                     |
| ai_models         | user_id            | uuid                     | NO          | null                         | null                     |
| ai_models         | tags               | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| ai_models         | likes_count        | integer                  | YES         | 0                            | null                     |
| ai_models         | views_count        | integer                  | YES         | 0                            | null                     |
| ai_models         | comments_count     | integer                  | YES         | 0                            | null                     |
| ai_models         | status             | text                     | YES         | 'published'::text            | null                     |
| ai_models         | download_url       | text                     | YES         | null                         | null                     |
| ai_models         | model_type         | text                     | YES         | null                         | null                     |
| ai_models         | base_model         | text                     | YES         | null                         | null                     |
| ai_models         | version            | text                     | YES         | null                         | null                     |
| ai_models         | license            | text                     | YES         | null                         | null                     |
| challenges        | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| challenges        | title              | text                     | NO          | null                         | null                     |
| challenges        | content            | text                     | NO          | null                         | null                     |
| challenges        | image_urls         | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| challenges        | category           | text                     | NO          | null                         | null                     |
| challenges        | created_at         | timestamp with time zone | YES         | now()                        | null                     |
| challenges        | updated_at         | timestamp with time zone | YES         | now()                        | null                     |
| challenges        | user_id            | uuid                     | NO          | null                         | null                     |
| challenges        | tags               | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| challenges        | likes_count        | integer                  | YES         | 0                            | null                     |
| challenges        | views_count        | integer                  | YES         | 0                            | null                     |
| challenges        | comments_count     | integer                  | YES         | 0                            | null                     |
| challenges        | status             | text                     | YES         | 'published'::text            | null                     |
| challenges        | start_date         | timestamp with time zone | YES         | null                         | null                     |
| challenges        | end_date           | timestamp with time zone | YES         | null                         | null                     |
| challenges        | reward             | text                     | YES         | null                         | null                     |
| challenges        | participants_count | integer                  | YES         | 0                            | null                     |
| challenges        | is_featured        | boolean                  | YES         | false                        | null                     |
| development_posts | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| development_posts | title              | text                     | NO          | null                         | null                     |
| development_posts | content            | text                     | NO          | null                         | null                     |
| development_posts | image_urls         | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| development_posts | category           | text                     | NO          | null                         | null                     |
| development_posts | created_at         | timestamp with time zone | YES         | now()                        | null                     |
| development_posts | updated_at         | timestamp with time zone | YES         | now()                        | null                     |
| development_posts | user_id            | uuid                     | NO          | null                         | null                     |
| development_posts | tags               | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| development_posts | likes_count        | integer                  | YES         | 0                            | null                     |
| development_posts | views_count        | integer                  | YES         | 0                            | null                     |
| development_posts | comments_count     | integer                  | YES         | 0                            | null                     |
| development_posts | status             | text                     | YES         | 'published'::text            | null                     |
| development_posts | github_url         | text                     | YES         | null                         | null                     |
| development_posts | tech_stack         | ARRAY                    | YES         | null                         | null                     |
| drafts            | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| drafts            | title              | text                     | NO          | null                         | null                     |
| drafts            | content            | text                     | YES         | null                         | null                     |
| drafts            | category           | text                     | YES         | null                         | null                     |
| drafts            | tags               | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| drafts            | user_id            | uuid                     | NO          | null                         | null                     |
| drafts            | created_at         | timestamp with time zone | YES         | now()                        | null                     |
| drafts            | updated_at         | timestamp with time zone | YES         | now()                        | null                     |
| gallery_items     | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| gallery_items     | title              | text                     | NO          | null                         | null                     |
| gallery_items     | description        | text                     | YES         | null                         | null                     |
| gallery_items     | image_url          | text                     | NO          | null                         | null                     |
| gallery_items     | created_at         | timestamp with time zone | NO          | timezone('utc'::text, now()) | null                     |
| gallery_items     | category           | text                     | NO          | null                         | null                     |
| gallery_items     | likes              | integer                  | YES         | 0                            | null                     |
| gallery_items     | views              | integer                  | YES         | 0                            | null                     |
| gallery_items     | comments           | integer                  | YES         | 0                            | null                     |
| gallery_items     | user_id            | text                     | NO          | null                         | null                     |
| gallery_items     | user_name          | text                     | NO          | null                         | null                     |
| gallery_items     | user_avatar        | text                     | YES         | null                         | null                     |
| gallery_items     | video_url          | text                     | YES         | null                         | null                     |
| gallery_items     | media_type         | text                     | YES         | null                         | null                     |
| images            | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| images            | title              | text                     | NO          | null                         | null                     |
| images            | content            | text                     | NO          | null                         | null                     |
| images            | image_urls         | ARRAY                    | NO          | null                         | null                     |
| images            | category           | text                     | NO          | null                         | null                     |
| images            | created_at         | timestamp with time zone | YES         | now()                        | null                     |
| images            | updated_at         | timestamp with time zone | YES         | now()                        | null                     |
| images            | user_id            | uuid                     | NO          | null                         | null                     |
| images            | tags               | ARRAY                    | YES         | '{}'::text[]                 | null                     |
| images            | likes_count        | integer                  | YES         | 0                            | null                     |
| images            | views_count        | integer                  | YES         | 0                            | null                     |
| images            | comments_count     | integer                  | YES         | 0                            | null                     |
| images            | status             | text                     | YES         | 'published'::text            | null                     |
| images            | prompt             | text                     | YES         | null                         | null                     |
| images            | negative_prompt    | text                     | YES         | null                         | null                     |
| images            | model              | text                     | YES         | null                         | null                     |
| images            | seed               | bigint                   | YES         | null                         | null                     |
| images            | cfg_scale          | double precision         | YES         | null                         | null                     |
| images            | steps              | integer                  | YES         | null                         | null                     |
| images            | is_public          | boolean                  | YES         | true                         | null                     |
| model_files       | id                 | uuid                     | NO          | uuid_generate_v4()           | null                     |
| model_files       | model_id           | uuid                     | YES         | null                         | null                     |
| model_files       | name               | text                     | NO          | null                         | null                     |
| model_files       | size               | text                     | NO          | null                         | null                     |
| model_files       | verified           | boolean                  | YES         | false                        | null                     |
| model_files       | verified_days      | integer                  | YES         | null                         | null                     |
| model_files       | safe_tensor        | boolean                  | YES         | false                        | null                     |