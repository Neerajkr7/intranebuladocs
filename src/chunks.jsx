import { useState } from "react";


const topics = [
  {
    id: "what-is-a-chunk",
    badge: "01",
    title: "What Is a Chunk?",
    subtitle: "The atom of modern JS delivery",
    icon: "⬡",
    color: "#00D4FF",
    sections: [
      {
        heading: "The Problem It Solves",
        body: `Before code splitting existed, your entire app — every page, every component, every utility — was bundled into ONE massive JavaScript file. A user visiting your homepage had to download code for the cart, checkout, admin panel, and everything else they'd never touch.

A chunk is a discrete JS file that contains a logical slice of your application. The bundler (Webpack/Turbopack) figures out what code belongs together and emits it as a named file. The browser only downloads chunks it actually needs.`,
      },
      {
        heading: "Types of Chunks in Next.js",
        code: `// 1. FRAMEWORK CHUNK — always loaded
//    Contains React runtime, Next.js router
//    Filename: _app-[hash].js, framework-[hash].js

// 2. COMMONS CHUNK — shared across pages
//    Code used by 2+ pages gets extracted here
//    Filename: commons-[hash].js

// 3. PAGE CHUNK — per-route bundle
//    Only loaded when user visits that page
//    Filename: pages/checkout-[hash].js

// 4. DYNAMIC CHUNK — on-demand
//    Created when you use dynamic imports
//    Filename: [id]-[hash].js

// How you create a dynamic chunk:
// Usage: import dynamic from next/dynamic (next.js built-in)

const HeavyChart = dynamic(() => import('../components/Chart'), {
  loading: () => <Spinner />,
  ssr: false, // don't render server-side
});`,
      },
      {
        heading: "Hash in Filenames — Why It Exists",
        body: `That random string after the dash (e.g., commons-a3f9bc12.js) is a content hash — an MD5/SHA fingerprint of the file's contents.

If you deploy a new version but the chunk hasn't changed, the filename stays the same → browser uses its cached copy. If you change a single line in that chunk, the hash changes → browser is forced to fetch the new file.

This is called cache-busting. It's why you can set CDN/S3 cache headers to "cache forever" without worrying about users seeing stale code.`,
      },
    ],
  },
  {
    id: "build-output",
    badge: "02",
    title: "Build Output & .next Folder",
    subtitle: "What next build actually produces",
    icon: "◈",
    color: "#FFB800",
    sections: [
      {
        heading: "Running next build",
        body: `When you run next build, Next.js does three things:
1. Compiles all TypeScript/JSX into optimized JS
2. Runs static analysis to determine which pages are static vs dynamic
3. Emits everything into the .next directory

This is not what you deploy directly. It's an intermediate build artifact used by the Next.js server (next start) or exported as static files.`,
      },
      {
        heading: ".next Folder Structure",
        code: `.next/
├── cache/               # Webpack build cache (speeds up incremental builds)
├── server/
│   ├── pages/           # SSR page bundles (run on Node.js server)
│   │   ├── _app.js
│   │   ├── index.js
│   │   └── checkout.js
│   ├── chunks/          # Shared server-side chunks
│   └── app/             # App Router RSC payloads (if using app dir)
├── static/
│   ├── chunks/          # ← THIS IS WHAT GOES TO S3/CDN
│   │   ├── pages/       # Client-side page bundles
│   │   ├── app/         # App dir client bundles
│   │   └── [hash].js    # Dynamic/shared chunks
│   ├── css/             # Extracted CSS files
│   └── media/           # Processed images/fonts
├── BUILD_ID             # Unique ID for this build (e.g., "abc123xyz")
└── build-manifest.json  # Maps pages → their required chunks`,
      },
      {
        heading: "BUILD_ID — The Critical File",
        body: `Every next build generates a unique BUILD_ID. Next.js uses this to namespace chunk URLs:

/_next/static/{BUILD_ID}/pages/checkout.js

When you redeploy, the BUILD_ID changes, so old chunk URLs become invalid. This is why you must keep the old chunks available on S3 for a grace period — users who loaded the HTML before your deploy are still referencing the old BUILD_ID chunks.

Your S3 deployment strategy must account for this: never delete old chunks immediately after deploy.`,
      },
    ],
  },
  {
    id: "mfe-architecture",
    badge: "03",
    title: "Your MFE Architecture",
    subtitle: "app-mfe (K8s) + remotes (S3)",
    icon: "◎",
    color: "#00FF88",
    sections: [
      {
        heading: "The Big Picture",
        body: `In your monorepo, you have two deployment targets:

• app-mfe (orchestrator) → Kubernetes Pod
  Serves the HTML shell, Next.js server, API routes
  Handles SSR, routing, authentication

• product-mfe, cart-mfe, etc. → S3 + CloudFront/CDN  
  These are statically exported chunk bundles
  No server needed — just files sitting in S3
  The orchestrator pulls these in at runtime`,
      },
      {
        heading: "Module Federation — How Apps Share Code",
        code: `// In remote app (e.g., cart-mfe) — next.config.js
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'cart_mfe',           // Remote's identity
        filename: 'static/chunks/remoteEntry.js', // Entry point on S3
        exposes: {
          './CartPage': './pages/cart',
          './CartWidget': './components/CartWidget',
        },
        shared: {
          react: { singleton: true },     // Only one React instance!
          'react-dom': { singleton: true },
        },
      })
    );
    return config;
  },
};

// In orchestrator app (app-mfe) — next.config.js
new NextFederationPlugin({
  name: 'app_mfe',
  remotes: {
    // Points to where cart-mfe deployed its remoteEntry.js
    cart_mfe: 'cart_mfe@https://cdn.yourstore.com/cart/remoteEntry.js',
    product_mfe: 'product_mfe@https://cdn.yourstore.com/product/remoteEntry.js',
  },
  shared: { react: { singleton: true } },
})`,
      },
      {
        heading: "remoteEntry.js — The Contract File",
        body: `Every remote MFE exposes a remoteEntry.js — think of it as the manifest/index of that app.

When a user navigates to a route that needs the cart, the orchestrator:
1. Fetches remoteEntry.js from S3/CDN
2. Reads which chunks it needs (e.g., CartPage, shared vendors)
3. Downloads only those chunks
4. Mounts the component into the shell

This is lazy loading at an architectural level. The user doesn't download cart code until they visit the cart.`,
      },
    ],
  },
  {
    id: "browser-loading",
    badge: "04",
    title: "How the Browser Loads It",
    subtitle: "From URL hit to interactive page",
    icon: "▷",
    color: "#FF6B6B",
    sections: [
      {
        heading: "The Full Request Journey",
        code: `STEP 1 — User hits https://yourstore.com/

  Browser → DNS → Load Balancer → Kubernetes Pod (app-mfe)
  Next.js server runs SSR for the page
  Sends back HTML with <script> tags injected

STEP 2 — Browser parses HTML, finds scripts

  <!-- Next.js injects these automatically -->
  <script src="/_next/static/abc123/chunks/framework.js" defer>
  <script src="/_next/static/abc123/chunks/main.js" defer>
  <script src="/_next/static/abc123/pages/index.js" defer>

STEP 3 — Browser downloads scripts in parallel
  
  framework.js  ████████░░  (from K8s pod or CDN)
  main.js       ██████░░░░  (commons chunk)
  index.js      ████░░░░░░  (page chunk)

STEP 4 — Hydration begins
  
  React reads the server-rendered HTML
  Attaches event listeners to existing DOM nodes
  Page becomes interactive (TTI = Time to Interactive)

STEP 5 — User navigates to /cart
  
  Next.js router intercepts the click (no full page reload)
  Fetches remoteEntry.js from cart-mfe S3 bucket
  Downloads cart page chunk
  Renders cart — feels instant`,
      },
      {
        heading: "defer vs async — The Script Loading Difference",
        body: `<script defer> — Downloads in parallel with HTML parsing, executes after HTML is fully parsed. Order is guaranteed. Next.js uses this.

<script async> — Downloads in parallel, executes immediately when downloaded. Order not guaranteed. Used for analytics, third-party scripts.

<script type="module"> — ES Module syntax. Automatically deferred. Supports import/export natively. Next.js uses this for modern browsers.

Next.js ships both: ESM bundles for modern browsers, legacy CJS bundles for old browsers. The browser picks the right one via the nomodule attribute.`,
      },
      {
        heading: "Critical Rendering Path in Your Stack",
        code: `HTML received → DOM constructed
      ↓
CSS chunks loaded → CSSOM constructed  
      ↓
DOM + CSSOM = Render Tree → Layout → Paint
      ↓
JS deferred scripts execute →
      ↓
React.hydrateRoot() called → 
      ↓  
Page is interactive ✓

// Measuring this in code:
// web-vitals library (Next.js includes this)
export function reportWebVitals(metric) {
  console.log(metric);
  // metric.name: 'FCP', 'LCP', 'CLS', 'FID', 'TTFB'
  // metric.value: milliseconds
}`,
      },
    ],
  },
  {
    id: "s3-deployment",
    badge: "05",
    title: "S3 Deployment Deep Dive",
    subtitle: "Deploying static chunks to object storage",
    icon: "▦",
    color: "#B388FF",
    sections: [
      {
        heading: "What Exactly Gets Uploaded to S3",
        code: `# After next build + next export (or custom script):

# Upload the entire static directory
aws s3 sync .next/static s3://your-bucket/_next/static \\
  --cache-control "public, max-age=31536000, immutable"
  # ↑ Cache forever — hashed filenames guarantee freshness

# Upload public directory (images, fonts, favicon)
aws s3 sync public s3://your-bucket/ \\
  --cache-control "public, max-age=86400"
  # ↑ Cache 1 day — these don't have hashes

# For Module Federation remote entry:
aws s3 cp .next/static/chunks/remoteEntry.js \\
  s3://your-bucket/remoteEntry.js \\
  --cache-control "no-cache"
  # ↑ NO cache — orchestrator must always get latest`,
      },
      {
        heading: "The S3 + CloudFront Pattern",
        body: `S3 alone is slow for global users. The standard pattern is:

S3 Bucket (origin) ← CloudFront CDN (edge) ← Browser

CloudFront caches your chunks at 400+ edge locations worldwide. A user in Mumbai gets chunks from the Mumbai edge node, not your S3 bucket in us-east-1.

Your CDN URL becomes the base path for all static assets. In Next.js you configure this via:

next.config.js → assetPrefix: 'https://cdn.yourstore.com'

This tells Next.js: "when you inject <script> tags, prefix them with the CDN URL instead of /"`,
      },
      {
        heading: "The Blue-Green Deployment Problem",
        code: `// Problem: User loaded HTML at 2:00 PM (BUILD_ID = "old123")
// You deployed at 2:05 PM (BUILD_ID = "new456")
// User navigates to /cart at 2:10 PM
// Browser requests: /_next/static/old123/pages/cart.js
// That file is GONE from S3 → 404 → App crashes!

// Solution: Keep old build files for a grace period
// deployment script:

const GRACE_PERIOD_BUILDS = 3; // keep last 3 build IDs

async function deploy() {
  const newBuildId = fs.readFileSync('.next/BUILD_ID', 'utf-8');
  
  // 1. Upload new build
  await uploadToS3('.next/static', \`_next/static\`);
  
  // 2. Read old build IDs from S3 metadata
  const oldBuilds = await getStoredBuildIds();
  
  // 3. Delete builds older than grace period
  const toDelete = oldBuilds.slice(GRACE_PERIOD_BUILDS);
  await deleteOldBuilds(toDelete);
  
  // 4. Store new build ID
  await storeBuildId(newBuildId);
}`,
      },
    ],
  },
  {
    id: "debugging",
    badge: "06",
    title: "Debugging & Mental Models",
    subtitle: "What to look at when things break",
    icon: "⌬",
    color: "#FF9A3C",
    sections: [
      {
        heading: "Reading the Network Tab Like a Pro",
        body: `Open DevTools → Network → Filter by JS. Reload the page. You'll see:

• framework-[hash].js — Should load once, be huge (~100KB). Cached on repeat visits.
• commons-[hash].js — Shared code. Also cached.  
• pages/index-[hash].js — Small, page-specific code.
• [number]-[hash].js — Dynamic chunks, loaded on demand.

Red flags to watch for:
• Same chunk loading multiple times → cache headers wrong
• 404 on a chunk → BUILD_ID mismatch, S3 out of sync
• remoteEntry.js loading slowly → put it closer to the user (CDN)
• Giant commons chunk → too much code shared, needs splitting`,
      },
      {
        heading: "Bundle Analyzer — See What's In Your Chunks",
        code: `// Install:
npm install @next-bundle-analyzer

// next.config.js:
const withBundleAnalyzer = require('@next-bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({ /* your config */ });

// Run:
ANALYZE=true next build

// Opens a treemap in browser showing:
// - Which packages are in which chunks
// - Size of each module
// - Duplicate modules across chunks

// Common findings:
// "Why is my chunk 500KB?" 
//   → moment.js in commons (use date-fns instead)
//   → lodash fully imported (use lodash-es with tree shaking)
//   → An icon library importing all icons`,
      },
      {
        heading: "Chunk Loading Errors in Production",
        code: `// ERROR: ChunkLoadError: Loading chunk 23 failed
// This means the browser tried to fetch a chunk and got 404/network error

// Where to look:
// 1. Check S3 bucket — is the chunk actually there?
//    aws s3 ls s3://your-bucket/_next/static/chunks/

// 2. Check CloudFront invalidation — did old cache clear?
//    aws cloudfront create-invalidation --paths "/_next/static/*"

// 3. Check CORS on S3 bucket — is your domain allowed?
//    S3 Bucket → Permissions → CORS Configuration

// 4. Handle it gracefully in app-mfe:
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.name === 'ChunkLoadError') {
      // Force full page reload to get fresh HTML + correct chunk URLs
      window.location.reload();
    }
  });
}`,
      },
    ],
  },
  {
    id: "learning-path",
    badge: "07",
    title: "Structured Learning Path",
    subtitle: "Go from confused to confident",
    icon: "→",
    color: "#00D4FF",
    isPath: true,
    steps: [
      {
        week: "Week 1",
        title: "JS Fundamentals of Bundling",
        color: "#00D4FF",
        items: [
          "How CommonJS (require) vs ESModules (import) work",
          "What Webpack does: entry, output, loaders, plugins",
          "Tree shaking — dead code elimination",
          "Static vs dynamic imports",
        ],
        resources: [
          "Webpack official docs: Concepts → Code Splitting",
          "JavaScript.info: Modules",
          "surma.dev: The cost of JavaScript",
        ],
      },
      {
        week: "Week 2",
        title: "Next.js Internals",
        color: "#FFB800",
        items: [
          "Pages Router vs App Router build output differences",
          "SSR vs SSG vs ISR — how each affects your .next folder",
          "How next start serves vs next export",
          "assetPrefix, basePath, and publicRuntimeConfig",
        ],
        resources: [
          "Next.js docs: Building Your Application → Deploying",
          "Next.js docs: next.config.js → assetPrefix",
          "leerob.io — Lee Rob's Next.js deep dives",
        ],
      },
      {
        week: "Week 3",
        title: "Module Federation",
        color: "#00FF88",
        items: [
          "Webpack 5 Module Federation core concepts",
          "@module-federation/nextjs-mf setup",
          "Shared dependencies and singleton pattern",
          "remoteEntry.js anatomy",
        ],
        resources: [
          "module-federation.io — Official docs",
          "Zack Jackson's Medium articles (creator of MF)",
          "GitHub: module-federation/module-federation-examples",
        ],
      },
      {
        week: "Week 4",
        title: "Browser Performance & CDN",
        color: "#FF6B6B",
        items: [
          "Critical rendering path",
          "Resource hints: preload, prefetch, preconnect",
          "HTTP/2 multiplexing and why many small chunks is fine",
          "CloudFront cache behaviors and invalidation",
        ],
        resources: [
          "web.dev: Performance",
          "Chrome DevTools: Performance & Network tabs",
          "AWS docs: CloudFront + S3 static website",
        ],
      },
      {
        week: "Week 5",
        title: "Your Architecture Hands-On",
        color: "#B388FF",
        items: [
          "Run ANALYZE=true next build on all your MFEs",
          "Map out which chunks load on each route",
          "Set up proper S3 cache headers in your deploy script",
          "Add ChunkLoadError recovery to app-mfe",
        ],
        resources: [
          "@next-bundle-analyzer",
          "next-bundle-analyzer on npm",
          "Your own DevTools Network tab 🔍",
        ],
      },
    ],
  },
];

const CodeBlock = ({ code }) => (
  <pre
    style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderLeft: "3px solid #333",
      borderRadius: "6px",
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: "12px",
      lineHeight: "1.7",
      color: "#b0c4de",
      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      margin: "16px 0 0",
      whiteSpace: "pre",
    }}
  >
    {code.trim().split("\n").map((line, i) => {
      const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
      const isKeyword = /^(const|let|var|import|export|function|async|await|return|if|module\.exports|new)\b/.test(line.trim());
      return (
        <div key={i} style={{ color: isComment ? "#5a7a5a" : isKeyword ? "#9ecbff" : "#b0c4de" }}>
          {line}
        </div>
      );
    })}
  </pre>
);

export default function App() {
  const [activeTopic, setActiveTopic] = useState(topics[0].id);
  const [expandedSection, setExpandedSection] = useState(null);

  const currentTopic = topics.find((t) => t.id === activeTopic);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c10",
        color: "#c9d1d9",
        fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #161b22",
          padding: "20px 28px",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div style={{ fontSize: "20px" }}>⬡</div>
        <div>
          <div style={{ fontSize: "13px", color: "#58a6ff", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Next.js MFE — Build & Chunk Architecture
          </div>
          <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>
            app-mfe (K8s) + remotes (S3) · Monorepo · TypeScript
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            minWidth: "230px",
            background: "#0d1117",
            borderRight: "1px solid #161b22",
            padding: "16px 0",
            overflowY: "auto",
          }}
        >
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => { setActiveTopic(topic.id); setExpandedSection(null); }}
              style={{
                width: "100%",
                textAlign: "left",
                background: activeTopic === topic.id ? "#161b22" : "transparent",
                border: "none",
                borderLeft: activeTopic === topic.id ? `3px solid ${topic.color}` : "3px solid transparent",
                padding: "12px 18px",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: activeTopic === topic.id ? topic.color : "#484f58",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  marginTop: "1px",
                  minWidth: "22px",
                }}
              >
                {topic.badge}
              </span>
              <div>
                <div style={{ fontSize: "12px", color: activeTopic === topic.id ? "#e6edf3" : "#8b949e", fontWeight: "500" }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: "10px", color: "#484f58", marginTop: "2px" }}>{topic.subtitle}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* Topic Header */}
          <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "28px" }}>{currentTopic.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "10px", background: currentTopic.color + "22", color: currentTopic.color, padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.1em" }}>
                  MODULE {currentTopic.badge}
                </span>
              </div>
              <h2 style={{ fontSize: "20px", color: "#e6edf3", margin: "6px 0 2px", fontWeight: "600", fontFamily: "inherit" }}>
                {currentTopic.title}
              </h2>
              <p style={{ fontSize: "12px", color: "#484f58", margin: 0 }}>{currentTopic.subtitle}</p>
            </div>
          </div>

          {/* Learning Path (special render) */}
          {currentTopic.isPath ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {currentTopic.steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0d1117",
                    border: "1px solid #161b22",
                    borderLeft: `4px solid ${step.color}`,
                    borderRadius: "8px",
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "10px", background: step.color + "22", color: step.color, padding: "2px 10px", borderRadius: "3px", letterSpacing: "0.1em", fontWeight: "700" }}>
                      {step.week}
                    </span>
                    <span style={{ fontSize: "14px", color: "#e6edf3", fontWeight: "600" }}>{step.title}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "8px", letterSpacing: "0.08em" }}>TOPICS</div>
                      {step.items.map((item, j) => (
                        <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px", color: "#8b949e" }}>
                          <span style={{ color: step.color }}>▸</span> {item}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "8px", letterSpacing: "0.08em" }}>RESOURCES</div>
                      {step.resources.map((res, j) => (
                        <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "11px", color: "#58a6ff" }}>
                          <span style={{ color: "#484f58" }}>→</span> {res}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Regular topic sections */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {currentTopic.sections.map((section, i) => {
                const key = `${activeTopic}-${i}`;
                const isOpen = expandedSection === key || expandedSection === null;
                return (
                  <div
                    key={i}
                    style={{
                      background: "#0d1117",
                      border: "1px solid #161b22",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "all 0.2s",
                    }}
                  >
                    <button
                      onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        padding: "16px 20px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "10px", color: currentTopic.color, fontWeight: "700" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: "13px", color: "#e6edf3", fontWeight: "500" }}>
                          {section.heading}
                        </span>
                      </div>
                      <span style={{ color: "#484f58", fontSize: "12px" }}>
                        {expandedSection === key ? "▲" : "▼"}
                      </span>
                    </button>
                    {expandedSection === key && (
                      <div style={{ padding: "0 20px 20px", borderTop: "1px solid #161b22", paddingTop: "16px" }}>
                        {section.body && (
                          <p
                            style={{
                              fontSize: "13px",
                              lineHeight: "1.8",
                              color: "#8b949e",
                              margin: 0,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {section.body}
                          </p>
                        )}
                        {section.code && <CodeBlock code={section.code} />}
                      </div>
                    )}
                    {expandedSection === null && (
                      <div style={{ padding: "0 20px 20px", borderTop: "1px solid #161b22", paddingTop: "16px" }}>
                        {section.body && (
                          <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#8b949e", margin: 0, whiteSpace: "pre-line" }}>
                            {section.body}
                          </p>
                        )}
                        {section.code && <CodeBlock code={section.code} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom nav */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #161b22" }}>
            {topics.findIndex((t) => t.id === activeTopic) > 0 ? (
              <button
                onClick={() => { setActiveTopic(topics[topics.findIndex((t) => t.id === activeTopic) - 1].id); setExpandedSection(null); }}
                style={{ background: "#161b22", border: "1px solid #30363d", color: "#8b949e", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
              >
                ← Previous
              </button>
            ) : <div />}
            {topics.findIndex((t) => t.id === activeTopic) < topics.length - 1 ? (
              <button
                onClick={() => { setActiveTopic(topics[topics.findIndex((t) => t.id === activeTopic) + 1].id); setExpandedSection(null); }}
                style={{ background: "#161b22", border: "1px solid #30363d", color: "#58a6ff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
              >
                Next →
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}