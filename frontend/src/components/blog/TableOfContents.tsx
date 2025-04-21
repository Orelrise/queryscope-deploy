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
    <div className="mb-8 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:underline transition-colors duration-150 text-sm"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents; 