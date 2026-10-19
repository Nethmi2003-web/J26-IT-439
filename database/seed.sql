-- Minimal sample data so the dashboard has something to show.
INSERT INTO districts (name, province) VALUES
    ('Kurunegala', 'North Western'),
    ('Puttalam', 'North Western'),
    ('Gampaha', 'Western'),
    ('Matara', 'Southern')
ON CONFLICT (name) DO NOTHING;

INSERT INTO export_records (product, period_month, volume_mt, value_lkr, destination) VALUES
    ('Desiccated coconut', '2026-01-01', 4200, 3150000000, 'All'),
    ('Desiccated coconut', '2026-02-01', 3980, 3010000000, 'All'),
    ('Coconut oil',        '2026-01-01', 1800, 1720000000, 'All'),
    ('Coconut oil',        '2026-02-01', 1910, 1805000000, 'All')
ON CONFLICT (product, period_month, destination) DO NOTHING;
