import { formatTermList } from "@/lib/formatters";

type Props = {
  terms: string[];
};

export function VocabularyCard({ terms }: Props) {
  return (
    <section className="sidePanel">
      <p className="eyebrow">Vocabulary</p>
      <h3>New terms in rotation</h3>
      <p>{formatTermList(terms)}</p>
    </section>
  );
}

