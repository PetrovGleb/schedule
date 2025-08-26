-- 07:30 = 450
ALTER TABLE "Sections"
    ADD CONSTRAINT sections_start_after_0730 CHECK ("start_time" >= 450);

-- 22:00 = 1320
ALTER TABLE "Sections"
    ADD CONSTRAINT sections_end_before_2200 CHECK ("end_time" <= 1320);

ALTER TABLE "Sections"
    ADD CONSTRAINT sections_duration_positive CHECK ("duration_minutes" > 0);

ALTER TABLE "Sections"
    ADD CONSTRAINT sections_duration_allowed CHECK ("duration_minutes" IN (50, 80));

ALTER TABLE "Sections"
    ADD CONSTRAINT sections_end_equals_start_plus_duration
        CHECK ("end_time" = "start_time" + "duration_minutes");
