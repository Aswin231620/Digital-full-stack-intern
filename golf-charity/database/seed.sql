-- Seed dummy charities (safe to re-run)
INSERT INTO charities (name, description, logo_url)
SELECT 'Red Cross', 'The International Red Cross provides emergency assistance, disaster relief, and disaster preparedness education worldwide.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png'
WHERE NOT EXISTS (SELECT 1 FROM charities WHERE name = 'Red Cross');

INSERT INTO charities (name, description, logo_url)
SELECT 'WWF - World Wildlife Fund', 'WWF works to protect endangered species and wild places, tackle climate change, and promote more sustainable use of natural resources.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/WWF_logo.svg/1200px-WWF_logo.svg.png'
WHERE NOT EXISTS (SELECT 1 FROM charities WHERE name = 'WWF - World Wildlife Fund');

INSERT INTO charities (name, description, logo_url)
SELECT 'Save the Children', 'Save the Children gives children a healthy start in life, the opportunity to learn and protection from harm across 100+ countries.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Save_the_Children_logo.svg/1200px-Save_the_Children_logo.svg.png'
WHERE NOT EXISTS (SELECT 1 FROM charities WHERE name = 'Save the Children');
