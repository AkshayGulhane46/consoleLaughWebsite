const { useState, useEffect } = React;

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load Instagram embed script once
  useEffect(() => {
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const path = currentPath.replace('#/', '');

  // ── Home Page ────────────────────────────────────────────────────
  if (!path || path === '') {
    return React.createElement(React.Fragment, null,
      React.createElement(Components.Cursor),
      React.createElement(Components.Header),

      // Hero
      React.createElement('section', { className: 'page-hero' },
        React.createElement('div', { className: 'page-hero-eyebrow fade-up fade-up-1' },
          "Knowledge Archive"
        ),
        React.createElement('h1', { className: 'page-hero-title fade-up fade-up-2' },
          "Akshay's ", React.createElement('em', null, "Notes")
        ),
        React.createElement('p', { className: 'page-hero-desc fade-up fade-up-3' },
          "Instagram insights distilled into lasting, shareable knowledge. Each post, expanded."
        ),
      ),

      React.createElement('hr', { className: 'section-divider' }),

      // Grid
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'posts-grid' },
          window.posts.map((post, i) =>
            React.createElement(Components.PostCard, { key: post.id, post: post, index: i })
          )
        )
      ),

      // Footer
      React.createElement('footer', null,
        React.createElement('div', { className: 'site-footer' },
          React.createElement('span', { className: 'site-footer-copy' },
            "© " + new Date().getFullYear() + " Akshay's Notes"
          ),
          React.createElement('span', { className: 'site-footer-copy' },
            "Instagram → Insights"
          ),
        )
      )
    );
  }

  // ── Post Detail Page ─────────────────────────────────────────────
  const slug = path.replace('post/', '');
  const post = window.posts.find(p => p.slug === slug);

  if (!post) {
    return React.createElement(React.Fragment, null,
      React.createElement(Components.Cursor),
      React.createElement(Components.Header),
      React.createElement('div', { className: 'container', style: { padding: '120px 0', textAlign: 'center' } },
        React.createElement('p', { style: { fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)' } },
          "404 — Post not found"
        )
      )
    );
  }

  const pageUrl = window.location.href;

  return React.createElement(React.Fragment, null,
    React.createElement(Components.Cursor),
    React.createElement(Components.Header),

    React.createElement('div', { className: 'container post-detail' },

      // Back
      React.createElement('a', { href: '#/', className: 'post-back' }, "Back to all notes"),

      // Hero image
      React.createElement('img', {
        src: post.thumbnail,
        className: 'post-hero-image fade-up fade-up-1',
        alt: post.title
      }),

      // Header block
      React.createElement('div', { className: 'post-detail-header fade-up fade-up-2' },
        React.createElement('div', { className: 'post-detail-eyebrow' }, "Note"),
        React.createElement('h1', { className: 'post-detail-title' }, post.title),
        React.createElement('div', { className: 'meta' },
          new Date(post.date).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        ),
      ),

      // Instagram embed
      React.createElement('div', { className: 'instagram-embed-container fade-up fade-up-3' },
        React.createElement('h3', null, "Original Instagram Post"),
        React.createElement('div', {
          dangerouslySetInnerHTML: { __html: post.instagramEmbed || '' }
        })
      ),

      // Caption
      post.originalCaption && React.createElement('div', { className: 'caption-box' },
        React.createElement('strong', null, "Original Caption"),
        React.createElement('span', null, post.originalCaption)
      ),

      // Expanded article
      React.createElement('div', { className: 'article', style: { marginTop: '48px' } },
        post.content.paragraphs.map((para, i) =>
          React.createElement('p', { key: i }, para)
        )
      ),

      // Key Takeaways
      post.content.keyTakeaways && post.content.keyTakeaways.length > 0 &&
        React.createElement('div', { className: 'takeaways' },
          React.createElement('h3', null, "Key Takeaways"),
          React.createElement('ul', null,
            post.content.keyTakeaways.map((item, i) =>
              React.createElement('li', { key: i }, item)
            )
          )
        ),

      // Useful Links
      post.content.links && post.content.links.length > 0 &&
        React.createElement('div', { style: { marginTop: '72px' } },
          React.createElement('p', { className: 'links-section-title' }, "Useful Links"),
          post.content.links.map((link, i) =>
            React.createElement('div', { key: i, className: 'link-row' },
              React.createElement('a', {
                href: link.url, target: '_blank', rel: 'noreferrer'
              }, link.title),
              React.createElement('button', {
                onClick: () => window.utils.copyToClipboard(link.url),
                className: 'btn btn-outline'
              }, "Copy")
            )
          )
        ),

      // Documents
      post.content.docs && post.content.docs.length > 0 &&
        React.createElement('div', { style: { marginTop: '60px' } },
          React.createElement('p', { className: 'docs-section-title' }, "Documents"),
          post.content.docs.map((doc, i) =>
            React.createElement('a', {
              key: i, href: doc.url, target: '_blank', rel: 'noreferrer',
              className: 'link-row', style: { display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: 'var(--text)' }
            },
              React.createElement('span', null, doc.title),
              React.createElement('span', { style: { color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '0.75rem' } }, "↓ Download")
            )
          )
        ),

      // Share
      React.createElement('div', { className: 'share-block' },
        React.createElement('p', null, "Found this useful?"),
        React.createElement('button', {
          onClick: () => window.utils.sharePost(pageUrl, post.title),
          className: 'btn btn-primary'
        }, "Share this note ↗")
      )
    ),

    // Footer
    React.createElement('footer', null,
      React.createElement('div', { className: 'site-footer' },
        React.createElement('span', { className: 'site-footer-copy' },
          "© " + new Date().getFullYear() + " Akshay's Notes"
        ),
        React.createElement('span', { className: 'site-footer-copy' },
          "Instagram → Insights"
        ),
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));