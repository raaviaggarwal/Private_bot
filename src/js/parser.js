// ChatGPT-style Markdown & HTML rendering parser module

export function formatMarkdown(text) {
  if (!text) return "";

  let str = text.trim();

  // 1. Convert multiline/single line double asterisks **text** to <strong>text</strong>
  str = str.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');

  // 2. Convert single asterisk *text* to <em>text</em>
  str = str.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
  str = str.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

  // 3. Headings: ### Title, ## Title, # Title
  str = str.replace(/^### (.*$)/gim, '<h4 style="margin: 12px 0 6px 0; color: #3b82f6; font-size: 1rem; font-weight: 600;">$1</h4>');
  str = str.replace(/^## (.*$)/gim, '<h3 style="margin: 14px 0 6px 0; color: #3b82f6; font-size: 1.1rem; font-weight: 600;">$1</h3>');
  str = str.replace(/^# (.*$)/gim, '<h2 style="margin: 16px 0 8px 0; color: #3b82f6; font-size: 1.2rem; font-weight: 600;">$1</h2>');

  // 4. Parse Bullet Lists (lines starting with *, -, or •)
  const lines = str.split('\n');
  let inList = false;
  let resultLines = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^[\*\-\•]\s+(.*)/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\*\-\•]\s+/, '');
      if (!inList) {
        inList = true;
        resultLines.push('<ul style="margin: 6px 0 8px 18px; padding: 0; list-style-type: disc;">');
      }
      resultLines.push(`<li style="margin-bottom: 4px;">${itemText}</li>`);
    } else {
      if (inList) {
        inList = false;
        resultLines.push('</ul>');
      }
      resultLines.push(line);
    }
  });

  if (inList) {
    resultLines.push('</ul>');
  }

  str = resultLines.join('\n');

  // 5. Parse Numbered Lists (1. 2. 3.)
  str = str.replace(/^\d+\.\s+(.*$)/gim, '<div style="margin: 4px 0 4px 12px; display: flex; gap: 8px;"><span style="color: #3b82f6; font-weight: 600;">•</span><span>$1</span></div>');

  // 6. Absolute Guarantee: Strip ANY remaining raw asterisks anywhere in the text!
  str = str.replace(/\*/g, '');

  // 7. Convert double newlines to paragraph spacing, single newlines to <br>
  str = str.replace(/\n\n/g, '<br><br>');
  str = str.replace(/(?<!<\/ul>|<\/li>|<\/h2>|<\/h3>|<\/h4>)\n/g, '<br>');

  return str;
}
