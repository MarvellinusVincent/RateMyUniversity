const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'check env',
  ssl: {
      rejectUnauthorized: false,
  },
});

async function loadUniversities() {
  try {
    await client.connect();
    const data = JSON.parse(await fs.promises.readFile('./world_universities_and_domains.json', 'utf8'));
    (data);
    for (const university of data) {
      const { name, country, web_pages, domains, alpha_two_code } = university;
      const formattedWebPages = `{ ${web_pages.map(page => `'${page}'`).join(', ')} }`;
      const formattedDomains = `{ ${domains.map(domain => `'${domain}'`).join(', ')} }`;
      const query = {
        text: 'INSERT INTO universities(name, country, web_pages, domains, alpha_two_code) VALUES($1, $2, $3, $4, $5) ON CONFLICT(name) DO NOTHING',
        values: [name, country, formattedWebPages, formattedDomains, alpha_two_code],
      };

      await client.query(query);
    }

  } catch (error) {
    console.error('Error loading universities:', error);
  } finally {
    await client.end();
  }
}

loadUniversities();
