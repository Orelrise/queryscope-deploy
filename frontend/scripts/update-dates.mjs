import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'frontend/src/blog/posts');

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