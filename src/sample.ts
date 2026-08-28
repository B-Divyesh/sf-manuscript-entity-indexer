import type { ManuscriptDocument } from './types';

export const sampleDocuments: ManuscriptDocument[] = [
  {
    id: 'sample-01',
    title: '01 — The tide ledger',
    path: 'chapters/01-tide-ledger.md',
    text: `# The tide ledger

At dusk, Mara Venn stepped off the ferry at Glass Harbor. The harbor clock had stopped at six. Captain Venn told Ilya Chen that the north archive would open before dawn.

“Use the old name,” Ilya Chen said. “On the blue charts, Glass Harbor is called 白港.”

林梅は白港へ着いた。梅姐は古い鍵を持っていた。Mara Venn marked the key with red thread.`
  },
  {
    id: 'sample-02',
    title: '02 — North archive',
    path: 'chapters/02-north-archive.docx',
    text: `The next morning, Ilya Chen waited inside the North Archive. Mara Venn arrived after sunrise, although Captain Venn had promised to come before dawn.

林梅が北文庫で帳面を開いた。白港の地図には、梅姐の印が三つあった。

The brass key opened shelf nineteen. Ilya Chen wrote that the harbor clock was still stopped at six.`
  },
  {
    id: 'sample-03',
    title: '03 — The red crossing',
    path: 'chapters/03-red-crossing.md',
    text: `Three nights later, Mara Venn crossed Red Bridge alone. Ilya Chen remained at Glass Harbor. The ledger placed 林梅 at North Archive on the same night.

Before midnight, Captain Venn returned the brass key. 梅姐は赤橋を渡らなかった。The two accounts could not both be true.`
  }
];
