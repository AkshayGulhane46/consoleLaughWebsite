const { useState, useEffect, useRef } = React;

// ── Custom Cursor ──────────────────────────────────────────────────
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) {
        dot.current.style.left  = mx + 'px';
        dot.current.style.top   = my + 'px';
      }
    };

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      if (ring.current) {
        ring.current.style.left = rx + 'px';
        ring.current.style.top  = ry + 'px';
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'cursor-dot',  ref: dot }),
    React.createElement('div', { className: 'cursor-ring', ref: ring }),
  );
}

// ── Header ─────────────────────────────────────────────────────────
function Header() {
  return React.createElement('header', { className: 'header' },
    React.createElement('div', { className: 'header-content' },
      React.createElement('a', { href: '#/', className: 'header-logo' }, "Akshay's Notes"),
      React.createElement('span', { className: 'header-tag' }, "Instagram → Insights"),
    )
  );
}

// ── Post Card ──────────────────────────────────────────────────────
function PostCard({ post, index }) {
  const num = String(index + 1).padStart(3, '0');

  return React.createElement('a', {
    href: '#/post/' + post.slug,
    className: 'post-card fade-up fade-up-' + Math.min(index + 1, 4),
    style: { display: 'grid' }
  },
    React.createElement('div', { className: 'post-card-img' },
      React.createElement('img', { src: post.thumbnail, alt: post.title })
    ),
    React.createElement('div', { className: 'post-card-content' },
      React.createElement('div', null,
        React.createElement('div', { className: 'post-card-number' }, num),
        React.createElement('h2', { className: 'post-card-title' }, post.title),
        React.createElement('p', { className: 'post-card-excerpt' }, post.excerpt),
      ),
      React.createElement('div', { className: 'post-card-footer' },
        React.createElement('span', { className: 'post-card-date' },
          new Date(post.date).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
          })
        ),
        React.createElement('div', { className: 'post-card-arrow' }, '↗'),
      )
    )
  );
}

window.Components = { Header, PostCard, Cursor };