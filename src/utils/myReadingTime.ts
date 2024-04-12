import { JSDOM } from 'jsdom';

function myReadingTime(htmlContent: string, wordsPerMinute: number = 300): number {
  console.log('Original HTML Content Length:', htmlContent.length);

  // Filter out import statements from the content using regex to match lines starting with "import" and ending with ";"
  // const filteredContent = htmlContent.split('\n').filter(line => !/^import .*;$/i.test(line.trim())).join('\n');

  // const dom = new JSDOM(filteredContent);

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Logging before removal
  console.log('Content before removal:', document.body.textContent.slice(0, 200)); // Log first 200 chars

  // // Remove <summary> and <div> tags within <details>
  // document.querySelectorAll('details summary, details div').forEach(element => {
  //   element.remove(); // This removes each <summary> and <div> within <details>
  // });

  // // Handle <Figure> tags
  // document.querySelectorAll('Figure').forEach(figure => {
  //   // Remove attributes that should not contribute to text content
  //   figure.removeAttribute('image');
  //   figure.removeAttribute('alt');

  //   // Optionally remove entire <Figure> if no relevant content should remain
  //   // figure.remove(); // Uncomment if you want to remove entire Figure tags
  // });

  // Logging after removal
  console.log('Content after removal:', document.body.textContent.slice(0, 200)); // Log first 200 chars

  const text = document.body.textContent || '';
  console.log('Processed Text:', text.slice(0, 200)); // Log first 200 chars of processed text

  const wordCount = text.trim().split(/\s+/).length;
  console.log('Word Count:', wordCount);

  if (wordsPerMinute === 0) {
    console.error('Words per minute should not be zero.');
    return 0; // Return 0 minutes if wordsPerMinute is zero to avoid division by zero
  }

  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  console.log('Reading Time (minutes):', readingTimeMinutes);

  return readingTimeMinutes; // Directly return the number of minutes
}

export default myReadingTime;
