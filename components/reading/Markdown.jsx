import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const isExternal = (href = '') => /^https?:\/\//i.test(href);

// Section titles are H2s on the page, so headings inside a section start at H3.
const components = {
  h1: ({ node, ...p }) => <h3 {...p} />,
  h2: ({ node, ...p }) => <h3 {...p} />,
  h3: ({ node, ...p }) => <h4 {...p} />,
  h4: ({ node, ...p }) => <h4 {...p} />,
  h5: ({ node, ...p }) => <h4 {...p} />,
  h6: ({ node, ...p }) => <h4 {...p} />,
  a: ({ node, href, children, ...p }) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...p}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <a href={href} {...p}>
        {children}
      </a>
    ),
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ node, src, alt, ...p }) => <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" referrerPolicy="no-referrer" {...p} />,
  table: ({ node, ...p }) => <table {...p} />,
};

/** Markdown → React. Raw HTML is dropped (skipHtml); react-markdown also blocks unsafe URL schemes. */
export function Markdown({ children, className = 'prose' }) {
  if (!children?.trim()) return null;
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
