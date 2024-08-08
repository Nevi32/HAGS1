export function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
  export async function uploadFile(filename) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';
      document.body.appendChild(input);
  
      input.addEventListener('change', async () => {
        const file = input.files[0];
        if (file && file.name === filename) {
          try {
            const content = await file.text();
            const data = JSON.parse(content);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Invalid file selected'));
        }
        document.body.removeChild(input);
      });
  
      input.click();
    });
  }