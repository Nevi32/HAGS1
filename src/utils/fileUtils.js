export function downloadFile(filename, content) {
  const element = document.createElement('a');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  element.setAttribute('href', url);

  // Open a file dialog to let the user choose where to save the file
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}

export async function uploadFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (file) {
        try {
          const content = await file.text();
          const data = JSON.parse(content);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('No file selected'));
      }
      document.body.removeChild(input);
    });

    input.click();
  });
}