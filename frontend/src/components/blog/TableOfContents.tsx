import React from 'react';

interface Heading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const headings: Heading[] = [];
  // Simple regex to find h2 tags with ids and their content
  // WARNING: This regex is basic and might break with more complex HTML structures.
  const regex = /<h2 id="([^"]+)">([^<]+)<\/h2>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    headings.push({
      id: match[1],
      text: match[2],
    });
  }

  if (headings.length === 0) {
    return null; // Don't render ToC if no headings found
  }

  return (
    <div className="mb-10 p-1 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-md">
      <div className="bg-white dark:bg-neutral-900 rounded-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700 pb-2">In this Article</h3>
        <ul className="space-y-2.5 mt-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="text-sm text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 hover:underline transition-colors duration-150"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents; 