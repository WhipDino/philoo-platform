import type { ReactNode } from "react";
import Link from "next/link";
import {
  getTechnicalDocumentBySourcePath,
} from "./technical-docs-registry";
import { slugifyTechnicalHeading } from "./technical-docs-content";

type MarkdownDocumentProps = {
  markdown: string;
};

function renderInline(value: string, keyPrefix: string): ReactNode[] {
  const pattern =
    /(`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) {
      nodes.push(value.slice(cursor, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${index}`;

    if (token.startsWith("`")) {
      const code = token.slice(1, -1);
      const linkedDocument = getTechnicalDocumentBySourcePath(code);
      nodes.push(
        linkedDocument ? (
          <Link
            className="technical-doc-link"
            href={`/tecnico/guias/${linkedDocument.slug}`}
            key={key}
          >
            <code>{code}</code>
          </Link>
        ) : (
          <code key={key}>{code}</code>
        ),
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const internalDocument = getTechnicalDocumentBySourcePath(href);
        const resolvedHref = internalDocument
          ? `/tecnico/guias/${internalDocument.slug}`
          : href;
        const external = /^https?:\/\//.test(resolvedHref);
        nodes.push(
          <Link
            href={resolvedHref}
            key={key}
            rel={external ? "noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {label}
          </Link>,
        );
      }
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    cursor = pattern.lastIndex;
    index += 1;
  }

  if (cursor < value.length) {
    nodes.push(value.slice(cursor));
  }

  return nodes;
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function startsBlock(lines: string[], index: number) {
  const line = lines[index] ?? "";
  return (
    /^\s*$/.test(line) ||
    /^#{1,6}\s+/.test(line) ||
    /^```/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*+]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^---+$/.test(line.trim()) ||
    (line.includes("|") && isTableSeparator(lines[index + 1] ?? ""))
  );
}

export function MarkdownDocument({ markdown }: MarkdownDocumentProps) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  const headingCounts = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = /^```([\w-]+)?\s*$/.exec(line);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <div className="technical-code-block" key={`code-${index}`}>
          {fence[1] ? <span>{fence[1]}</span> : null}
          <pre>
            <code>{code.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].replace(/[`*_~]/g, "").trim();
      const base = slugifyTechnicalHeading(text) || "secao";
      const count = headingCounts.get(base) ?? 0;
      headingCounts.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      const content = renderInline(heading[2], `heading-${index}`);

      if (level === 1) {
        blocks.push(<h1 id={id} key={id}>{content}</h1>);
      } else if (level === 2) {
        blocks.push(<h2 id={id} key={id}>{content}</h2>);
      } else if (level === 3) {
        blocks.push(<h3 id={id} key={id}>{content}</h3>);
      } else if (level === 4) {
        blocks.push(<h4 id={id} key={id}>{content}</h4>);
      } else if (level === 5) {
        blocks.push(<h5 id={id} key={id}>{content}</h5>);
      } else {
        blocks.push(<h6 id={id} key={id}>{content}</h6>);
      }
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`}>
          {quote.map((item, quoteIndex) => (
            <p key={`quote-${index}-${quoteIndex}`}>
              {renderInline(item, `quote-${index}-${quoteIndex}`)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    const unordered = /^[-*+]\s+/.test(line);
    const ordered = /^\d+\.\s+/.test(line);
    if (unordered || ordered) {
      const items: string[] = [];
      const listPattern = unordered ? /^[-*+]\s+/ : /^\d+\.\s+/;
      while (index < lines.length) {
        const itemMatch = listPattern.exec(lines[index]);
        if (!itemMatch) {
          break;
        }
        const itemLines = [lines[index].slice(itemMatch[0].length).trim()];
        index += 1;

        while (
          index < lines.length &&
          lines[index].trim() &&
          !listPattern.test(lines[index]) &&
          !/^#{1,6}\s+/.test(lines[index]) &&
          !/^```/.test(lines[index]) &&
          !/^>\s?/.test(lines[index]) &&
          !/^---+$/.test(lines[index].trim()) &&
          !(
            lines[index].includes("|") &&
            isTableSeparator(lines[index + 1] ?? "")
          )
        ) {
          itemLines.push(lines[index].trim());
          index += 1;
        }

        items.push(itemLines.join(" "));
      }
      const children = items.map((item, itemIndex) => (
        <li key={`item-${index}-${itemIndex}`}>
          {renderInline(item, `item-${index}-${itemIndex}`)}
        </li>
      ));
      blocks.push(
        ordered ? (
          <ol key={`list-${index}`}>{children}</ol>
        ) : (
          <ul key={`list-${index}`}>{children}</ul>
        ),
      );
      continue;
    }

    if (line.includes("|") && isTableSeparator(lines[index + 1] ?? "")) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <div className="technical-table-wrap" key={`table-${index}`}>
          <table>
            <thead>
              <tr>
                {headers.map((header, cellIndex) => (
                  <th key={`head-${index}-${cellIndex}`}>
                    {renderInline(header, `head-${index}-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${index}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${index}-${rowIndex}-${cellIndex}`}>
                      {renderInline(
                        cell,
                        `cell-${index}-${rowIndex}-${cellIndex}`,
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={`rule-${index}`} />);
      index += 1;
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length && !startsBlock(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {renderInline(paragraph.join(" "), `paragraph-${index}`)}
      </p>,
    );
  }

  return <div className="technical-markdown">{blocks}</div>;
}
