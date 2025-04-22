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
      text: match[2].trim(), // Trim potential whitespace
    });
  }

  if (headings.length === 0) {
    return null; // Don't render ToC if no headings found
  }

  return (
    <div className="mb-10 p-1 rounded-lg bg-gradient-to-r from-primary to-secondary shadow-md">
      <div className="bg-white dark:bg-neutral-900 rounded-md p-6">
        <h3 className="text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary border-b border-neutral-200 dark:border-neutral-700 pb-3">
          In this Article
        </h3>
        <ul className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id} className="flex items-start group">
              <span className="mr-3 mt-[0.3rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary group-hover:scale-125 transition-transform duration-150"></span>
              <a
                href={`#${heading.id}`}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-secondary transition-colors duration-150"
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