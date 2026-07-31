import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownDocument } from "@/domains/technical-docs/markdown-document";
import {
  getTechnicalDocumentHeadings,
  readTechnicalDocument,
} from "@/domains/technical-docs/technical-docs-content";
import {
  getTechnicalDocument,
  technicalDocuments,
} from "@/domains/technical-docs/technical-docs-registry";
import { DocsArticle } from "../docs-shell";

type TechnicalGuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return technicalDocuments.map((document) => ({
    slug: document.slug,
  }));
}

export async function generateMetadata({
  params,
}: TechnicalGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getTechnicalDocument(slug);

  if (!document) {
    return {};
  }

  return {
    title: document.title,
    description: document.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TechnicalGuidePage({
  params,
}: TechnicalGuidePageProps) {
  const { slug } = await params;
  const document = getTechnicalDocument(slug);

  if (!document) {
    notFound();
  }

  const markdown = readTechnicalDocument(document);
  const headings = getTechnicalDocumentHeadings(markdown);

  return (
    <DocsArticle document={document} headings={headings}>
      <MarkdownDocument markdown={markdown} />
    </DocsArticle>
  );
}
