// API URL (Change this to your deployed Firebase URL)
const API_URL = "https://image-board-5297f.web.app/api";

// Function to load posts from the server
function loadPosts() {
  fetch(`${API_URL}/api/posts`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      return response.json();
    })
    .then((posts) => {
      const postsContainer = document.getElementById("posts-container");
      postsContainer.innerHTML = ""; // Clear previous posts
      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Display the post title
        const postTitle = document.createElement("h2");
        postTitle.textContent = post.title;
        postDiv.appendChild(postTitle);

        // Display the post body
        const postBody = document.createElement("p");
        postBody.innerHTML = post.body.replace(/&gt;/g, "<span style='color:green;'>></span>");
        postDiv.appendChild(postBody);

        // Display the post image if it exists
        if (post.image) {
          const postImage = document.createElement("img");
          postImage.src = post.image;
          postImage.alt = "Post Image";
          postDiv.appendChild(postImage);
        }

        // Display comments if they exist
        if (post.comments && post.comments.length > 0) {
          const commentsDiv = document.createElement("div");
          commentsDiv.classList.add("comments");
          post.comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.textContent = comment;
            commentsDiv.appendChild(commentDiv);
          });
          postDiv.appendChild(commentsDiv);
        }

        postsContainer.appendChild(postDiv);
      });
    })
    .catch((error) => {
      console.error("Error loading posts:", error);
      alert("Error loading posts: " + error.message);
    });
}

// Function to submit a new post
document.getElementById("post-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const image = document.getElementById("post-image").value;
  const comments = []; // Initialize as empty array

  const newPost = {
    title,
    body,
    image,
    comments,
  };

  fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => { throw new Error(error.message); });
      }
      return response.json();
    })
    .then(() => {
      loadPosts(); // Reload posts after adding a new one
      alert("Post submitted successfully!");
    })
    .catch((error) => {
      console.error("Error creating post:", error);
      alert("There was an error submitting your post: " + error.message);
    });
});

// Load posts when the page is loaded
window.onload = loadPosts;
