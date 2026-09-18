-- Portfolio sample inventory for a fresh database. Replace prices and availability before launch.
INSERT INTO public.cars (brand, model, year, transmission, seats, price_per_day, images, status) VALUES
('Apex', 'V12', 2025, 'automatic', 2, 1250.00, '{"urls": ["/fleet/red-supercar.webp"]}', 'available'),
('Noir', 'GT S', 2025, 'automatic', 2, 680.00, '{"urls": ["/fleet/graphite-gt.webp"]}', 'available'),
('BMW', 'X5', 2024, 'automatic', 5, 290.00, '{"urls": ["/fleet/bmw-x5.jpg"]}', 'available'),
('Mercedes-Benz', 'E-Class', 2024, 'automatic', 5, 240.00, '{"urls": ["/fleet/mercedes-e-class.jpg"]}', 'available');
