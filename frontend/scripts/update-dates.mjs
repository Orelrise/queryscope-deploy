// Script to automatically update article dates
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(__dirname, '../src/blog/posts');

function updateDates() {
  const files = fs.readdirSync(postsDirectory);

  files.forEach((file) => {
    if (path.extname(file) === '.mdx') {
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const currentDate = new Date().toISOString().split('T')[0];

      if (!data.date || data.date !== currentDate) {
        data.date = currentDate;
        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(fullPath, updatedContent);
        console.log(`Updated date for ${file}`);
      }
    }
  });
}

updateDates(); 