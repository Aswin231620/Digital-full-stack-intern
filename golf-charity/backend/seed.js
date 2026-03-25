const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const charities = [
  {
    name: 'Red Cross',
    description: 'The International Red Cross provides emergency assistance, disaster relief, and disaster preparedness education worldwide.',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png'
  },
  {
    name: 'WWF - World Wildlife Fund',
    description: 'WWF works to protect endangered species and wild places, tackle climate change, and promote more sustainable use of natural resources.',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/WWF_logo.svg/1200px-WWF_logo.svg.png'
  },
  {
    name: 'Save the Children',
    description: 'Save the Children gives children a healthy start in life, the opportunity to learn and protection from harm across 100+ countries.',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Save_the_Children_logo.svg/1200px-Save_the_Children_logo.svg.png'
  }
];

async function seed() {
  console.log('Fetching existing charities...');
  const { data: existing, error: fetchErr } = await supabase.from('charities').select('name');
  if (fetchErr) return console.error(fetchErr);

  const existingNames = existing.map(c => c.name);
  const toInsert = charities.filter(c => !existingNames.includes(c.name));

  if (toInsert.length > 0) {
    console.log(`Inserting ${toInsert.length} charities...`);
    const { error: insertErr } = await supabase.from('charities').insert(toInsert);
    if (insertErr) return console.error(insertErr);
    console.log('Seeded successfully!');
  } else {
    console.log('Charities already exist. Skipping seed.');
  }
}

seed();
