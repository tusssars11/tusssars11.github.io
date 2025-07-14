document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post-card');

  posts.forEach(post => {
    const postId = post.dataset.postId;
    if (!postId) return;

    const likeBtn = post.querySelector('.like-btn');
    const commentBtn = post.querySelector('.comment-btn');
    const likeCountEl = post.querySelector('.like-count');
    const commentCountEl = post.querySelector('.comment-count');
    const commentsSection = post.querySelector('.comments-section');

    // Load state from localStorage
    let likeCount = parseInt(localStorage.getItem(`likes-${postId}`) || '0');
    let liked = localStorage.getItem(`liked-${postId}`) === 'true';
    let comments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');

    likeCountEl.textContent = likeCount;
    commentCountEl.textContent = comments.length;
    if (liked) {
      likeBtn.classList.add('liked');
    }
    renderComments();

    likeBtn.addEventListener('click', e => {
      e.preventDefault();
      liked = !liked;
      likeBtn.classList.toggle('liked', liked);
      likeCount = liked ? likeCount + 1 : Math.max(0, likeCount - 1);
      likeCountEl.textContent = likeCount;
      localStorage.setItem(`likes-${postId}`, likeCount);
      localStorage.setItem(`liked-${postId}`, liked);
    });

    commentBtn.addEventListener('click', e => {
      e.preventDefault();
      commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    });

    function renderComments() {
      commentsSection.innerHTML = '';
      const list = document.createElement('ul');
      list.className = 'comments-list';
      comments.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
      const form = document.createElement('form');
      form.className = 'comment-form';
      form.innerHTML = `<input type="text" class="comment-input" placeholder="Add a comment..." required><button type="submit">Post</button>`;
      form.addEventListener('submit', ev => {
        ev.preventDefault();
        const input = form.querySelector('.comment-input');
        const value = input.value.trim();
        if (value) {
          comments.push(value);
          localStorage.setItem(`comments-${postId}`, JSON.stringify(comments));
          commentCountEl.textContent = comments.length;
          renderComments();
          commentsSection.style.display = 'block';
        }
        input.value = '';
      });
      commentsSection.appendChild(list);
      commentsSection.appendChild(form);
    }
  });
});
