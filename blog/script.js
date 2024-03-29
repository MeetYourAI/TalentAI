document.addEventListener('DOMContentLoaded', async () => {
    const blogPostsContainer = document.getElementById('blogPosts');
    const markdownFiles = [
      'chatgptWeakness20230828.md',
      'RevolutionizingSportsRecruitmentwithAI20230912.md',
      // Add other Markdown files here
    ];
  
    const getMetadata = (markdownText, field) => {
      const match = markdownText.match(new RegExp(`${field}:\\s*(\\S+)`));
      return match ? match[1] : '';
    };
  
    const processMarkdownFiles = async () => {
      const posts = [];
  
      for (const file of markdownFiles) {
        const response = await fetch(file);
        const markdownText = await response.text();
  
        const post = {
          file,
          markdownText,
          date: new Date(getMetadata(markdownText, 'date')),
        };
  
        posts.push(post);
      }
  
      const sortedPosts = posts.sort((a, b) => b.date - a.date);
  
      for (const post of sortedPosts) {
        const htmlText = marked(post.markdownText);
  
        const postContainer = document.createElement('div');
        postContainer.className = 'card mb-4';
        postContainer.innerHTML = `
          <div class="card-body">
            ${htmlText}
          </div>
        `;
  
        blogPostsContainer.appendChild(postContainer);
      }
    };
  
    await processMarkdownFiles();
  });
