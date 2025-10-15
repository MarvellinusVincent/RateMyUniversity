const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function loadUniversities() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Reading universities JSON file...');
    const data = JSON.parse(await fs.promises.readFile('./world_universities_and_domains.json', 'utf8'));
    
    console.log(`Found ${data.length} universities to load...`);
    
    let insertedCount = 0;
    
    for (const university of data) {
      const { name, country, web_pages, domains, alpha_two_code, 'state-province': stateProvince } = university;
      
      const formattedWebPages = web_pages || [];
      const formattedDomains = domains || [];
      
      const query = {
        text: 'INSERT INTO universities(name, country, web_pages, domains, alpha_two_code, state_province) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT(name) DO NOTHING',
        values: [name, country, formattedWebPages, formattedDomains, alpha_two_code, stateProvince],
      };
      
      const result = await client.query(query);
      if (result.rowCount > 0) {
        insertedCount++;
      }
    }
    
    console.log(`Successfully loaded ${insertedCount} new universities.`);
    console.log('University loading completed!');
    
  } catch (error) {
    console.error('Error loading universities:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setTimeout(() => {
  loadUniversities();
}, 3000);