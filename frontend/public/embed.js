(function() {
    // --- 1. INSTANT STYLE INJECTION (Fixes White Glitch before Iframe Loads) ---
    var styleId = 'tf-embed-css';
    if (!document.getElementById(styleId)) {
        var style = document.createElement('style');
        style.id = styleId;
        // Force iframe to be transparent and prevent layout shift
        style.innerHTML = `
            .trustflow-widget-container { width: 100%; position: relative; z-index: 1; min-height: 150px; display: block; }
            .trustflow-widget-iframe { width: 100%; border: none; display: block; background: transparent !important; }
        `;
        document.head.appendChild(style);
    }
  
    function initTrustFlow() {
      // Search for scripts that haven't been processed yet
      // We do NOT use a global flag here because in SPAs (Next.js), the global flag persists but the DOM changes.
      var scripts = document.querySelectorAll('script[data-space-id]');
      
      scripts.forEach(function(script) {
          // Safety Check: If we already injected the container next to this script, stop.
          if (script.nextElementSibling && script.nextElementSibling.classList.contains('trustflow-widget-container')) {
              return;
          }
          // If we are in "body" mode (floating), check if the launcher exists
          if (script.getAttribute('data-placement') === 'body' && document.getElementById('tf-floating-launcher')) {
              return;
          }
  
          var spaceId = script.getAttribute('data-space-id');
          var placement = script.getAttribute('data-placement') || 'section'; 
          
          // --- YOUR ORIGINAL ATTRIBUTE PARSING (PRESERVED) ---
          var theme = script.getAttribute('data-theme') || 'light';
          var layout = script.getAttribute('data-layout') || 'grid';
          var cardTheme = script.getAttribute('data-card-theme');
          var corners = script.getAttribute('data-corners');
          var shadow = script.getAttribute('data-shadow');
          var border = script.getAttribute('data-border');
          var hoverEffect = script.getAttribute('data-hover-effect');
          var nameSize = script.getAttribute('data-name-size');
          var testimonialStyle = script.getAttribute('data-testimonial-style');
          var animation = script.getAttribute('data-animation');
          var speed = script.getAttribute('data-animation-speed');
  
          // Construct Base Widget URL
          // Using dynamic detection for baseUrl to work in any env (localhost or prod)
          var src = script.src || '';
          var baseUrl = src.indexOf('/embed.js') > -1 ? src.replace('/embed.js', '') : 'https://trustflow-app.vercel.app'; 
          
          var params = new URLSearchParams();
          params.append('theme', theme);
          params.append('layout', layout);
          if (cardTheme) params.append('card-theme', cardTheme);
          if (corners) params.append('corners', corners);
          if (shadow) params.append('shadow', shadow);
          if (border) params.append('border', border);
          if (hoverEffect) params.append('hover-effect', hoverEffect);
          if (nameSize) params.append('name-size', nameSize);
          if (testimonialStyle) params.append('testimonial-style', testimonialStyle);
          if (animation) params.append('animation', animation);
          if (speed) params.append('speed', speed);
  
          var widgetUrl = baseUrl + '/widget/' + spaceId + '?' + params.toString();
  
          if (placement === 'body') {
              renderFloatingWidget(widgetUrl, theme);
          } else {
              renderInlineWidget(script, widgetUrl);
          }
      });
    }
  
    // --- RENDERING FUNCTIONS ---
  
    function renderInlineWidget(scriptNode, url) {
        var container = document.createElement('div');
        container.className = 'trustflow-widget-container';
        // Styles are handled by the injected CSS class above for cleaner DOM
        
        if (scriptNode.parentNode) {
            scriptNode.parentNode.insertBefore(container, scriptNode.nextSibling);
        }
  
        var iframe = createIframe(url);
        container.appendChild(iframe);
  
        // Smart Resize Listener
        window.addEventListener('message', function(event) {
            if (event.data.type === 'trustflow-resize') {
                iframe.style.height = event.data.height + 'px';
            }
        });
    }
  
    function renderFloatingWidget(url, theme) {
        var isDark = theme === 'dark';
        
        // Launcher Button
        var launcher = document.createElement('div');
        launcher.id = 'tf-floating-launcher'; // ID to prevent duplicates
        Object.assign(launcher.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px',
            borderRadius: '30px', backgroundColor: isDark ? '#1e293b' : '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: '2147483647',
            transition: 'transform 0.2s ease', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
        });
        launcher.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        
        // Overlay
        var overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '2147483647', display: 'none',
            alignItems: 'center', justifyContent: 'center', opacity: '0',
            transition: 'opacity 0.3s ease', backdropFilter: 'blur(4px)'
        });
  
        // Modal Content
        var modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            width: '90%', maxWidth: '1000px', maxHeight: '85vh',
            backgroundColor: isDark ? '#0f172a' : '#ffffff', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden',
            position: 'relative', display: 'flex', flexDirection: 'column'
        });
  
        var header = document.createElement('div');
        Object.assign(header.style, { padding: '16px 24px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
        
        var title = document.createElement('h3');
        title.innerText = "Wall of Love";
        Object.assign(title.style, { margin: '0', fontFamily: 'sans-serif', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' });
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#64748b' });
  
        var iframeContainer = document.createElement('div');
        Object.assign(iframeContainer.style, { flex: '1', overflowY: 'auto', padding: '0', WebkitOverflowScrolling: 'touch' });
  
        var iframe = createIframe(url);
        iframe.style.minHeight = '400px'; 
        iframe.style.height = '100%'; 
  
        // Assemble
        header.appendChild(title); header.appendChild(closeBtn);
        iframeContainer.appendChild(iframe);
        modalContent.appendChild(header); modalContent.appendChild(iframeContainer);
        overlay.appendChild(modalContent);
        document.body.appendChild(launcher);
        document.body.appendChild(overlay);
  
        // Interactions
        launcher.onclick = function() { overlay.style.display = 'flex'; setTimeout(function() { overlay.style.opacity = '1'; }, 10); };
        var closeAction = function() { overlay.style.opacity = '0'; setTimeout(function() { overlay.style.display = 'none'; }, 300); };
        closeBtn.onclick = closeAction;
        overlay.onclick = function(e) { if (e.target === overlay) closeAction(); };
    }
  
    function createIframe(url) {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.className = 'trustflow-widget-iframe'; // Uses the transparent CSS class
        iframe.allowTransparency = "true";
        return iframe;
    }
  
    // --- AUTO-INITIALIZATION & SELF-HEALING ---
    
    // 1. Run immediately (Standard HTML)
    initTrustFlow();
  
    // 2. Watch for DOM changes (React/Next.js/SPAs)
    // This is the "Magic" that makes it work everywhere. If React re-renders and adds the script again, we catch it.
    var observer = new MutationObserver(function(mutations) {
        initTrustFlow();
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
  
  })();