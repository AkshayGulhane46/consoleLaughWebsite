function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copied to clipboard!");
    });
  }
  
  function sharePost(url, title) {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url
      });
    } else {
      copyToClipboard(url);
    }
  }
  
  window.utils = { copyToClipboard, sharePost };


  