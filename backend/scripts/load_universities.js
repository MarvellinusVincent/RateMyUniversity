const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
    user: 'check env file',
    host: 'check env file',
    database: 'check env file',
    password: 'check env file',
    port: 5432,
});

async function loadUniversities() {
  try {
    await client.connect();
    const data = JSON.parse(await fs.promises.readFile('./world_universities_and_domains.json', 'utf8'));
    console.log(data);
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

    console.log('Universities loaded successfully.');
  } catch (error) {
    console.error('Error loading universities:', error);
  } finally {
    await client.end();
  }
}

loadUniversities();
