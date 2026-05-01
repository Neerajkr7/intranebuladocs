import { useState, useEffect, useRef } from "react";

const NAV = [
  { id: "bigpicture", label: "🗺️ Big Picture", icon: "🗺️" },
  { id: "prereqs", label: "📚 Prerequisites", icon: "📚" },
  { id: "docker", label: "🐋 Docker", icon: "🐋" },
  { id: "kubernetes", label: "☸️ Kubernetes", icon: "☸️" },
  { id: "alb", label: "⚖️ ALB", icon: "⚖️" },
  { id: "connection", label: "🔗 How They Connect", icon: "🔗" },
  { id: "setup", label: "🚀 Setup Guide", icon: "🚀" },
];

const COLORS = {
  docker: "#2496ED",
  k8s: "#326CE5",
  alb: "#FF9900",
  green: "#00D26A",
  red: "#FF4757",
  bg: "#0A0C10",
  surface: "#111318",
  card: "#161B22",
  border: "#21262D",
  text: "#E6EDF3",
  muted: "#8B949E",
  accent: "#58A6FF",
};

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        background: copied ? COLORS.green + "22" : "#ffffff11",
        border: `1px solid ${copied ? COLORS.green : "#ffffff22"}`,
        color: copied ? COLORS.green : COLORS.muted,
        borderRadius: 4,
        padding: "2px 10px",
        fontSize: 11,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "monospace",
      }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function CodeBlock({ code, lang = "bash", title }) {
  return (
    <div style={{
      background: "#0D1117",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      margin: "12px 0",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 14px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: "#161B22",
      }}>
        <span style={{ color: COLORS.muted, fontSize: 12, fontFamily: "monospace" }}>
          {title || lang}
        </span>
        <CopyButton code={code} />
      </div>
      <pre style={{
        margin: 0,
        padding: "14px 16px",
        overflow: "auto",
        fontSize: 13,
        lineHeight: 1.7,
        color: "#79C0FF",
        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      background: color + "22",
      border: `1px solid ${color}44`,
      color: color,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "monospace",
      letterSpacing: 1,
    }}>
      {text}
    </span>
  );
}

function SectionHeader({ title, sub, color, icon }) {
  return (
    <div style={{ marginBottom: 28, borderBottom: `1px solid ${color}33`, paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2 style={{
          color: color,
          fontFamily: "'Space Mono', monospace",
          fontSize: 26,
          fontWeight: 700,
          margin: 0,
          letterSpacing: -1,
        }}>{title}</h2>
      </div>
      {sub && <p style={{ color: COLORS.muted, margin: 0, fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

function InfoBox({ type, children }) {
  const configs = {
    info: { color: COLORS.accent, icon: "💡", label: "NOTE" },
    warn: { color: COLORS.alb, icon: "⚠️", label: "IMPORTANT" },
    tip: { color: COLORS.green, icon: "✅", label: "PRO TIP" },
    danger: { color: COLORS.red, icon: "🚨", label: "GOTCHA" },
  };
  const c = configs[type] || configs.info;
  return (
    <div style={{
      background: c.color + "11",
      border: `1px solid ${c.color}33`,
      borderLeft: `3px solid ${c.color}`,
      borderRadius: 6,
      padding: "12px 16px",
      margin: "14px 0",
      display: "flex",
      gap: 10,
    }}>
      <span>{c.icon}</span>
      <div>
        <span style={{ color: c.color, fontWeight: 700, fontSize: 11, fontFamily: "monospace", letterSpacing: 1 }}>{c.label} </span>
        <span style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.6 }}>{children}</span>
      </div>
    </div>
  );
}

function Card({ children, color, title, emoji }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${color || COLORS.border}33`,
      borderTop: `3px solid ${color || COLORS.accent}`,
      borderRadius: 8,
      padding: "16px 18px",
      marginBottom: 14,
    }}>
      {title && (
        <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          {emoji && <span>{emoji}</span>}
          <span style={{ color: color || COLORS.accent, fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── ARCHITECTURE DIAGRAM ───────────────────────────────────────────────────

function ArchDiagram() {
  const [hovered, setHovered] = useState(null);
  const tooltips = {
    user: "Users hit your domain — e.g. tradeease.in",
    alb: "ALB receives traffic and routes based on path rules",
    ingress: "K8s Ingress Controller translates ALB rules to internal routing",
    svc: "K8s Services expose pods via stable internal IPs",
    pod: "Pods run Docker containers — your actual app code",
  };
  const Box = ({ id, label, color, sub, style: s }) => (
    <div
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        background: hovered === id ? color + "22" : color + "11",
        border: `2px solid ${hovered === id ? color : color + "66"}`,
        borderRadius: 8,
        padding: "10px 18px",
        textAlign: "center",
        cursor: "default",
        transition: "all 0.2s",
        transform: hovered === id ? "scale(1.04)" : "scale(1)",
        minWidth: 130,
        ...s,
      }}
    >
      <div style={{ color, fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{label}</div>
      {sub && <div style={{ color: color + "aa", fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );
  const Arrow = ({ label }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ color: COLORS.muted, fontSize: 10 }}>{label}</div>
      <div style={{ color: COLORS.muted, fontSize: 20, lineHeight: 1 }}>↓</div>
    </div>
  );

  return (
    <div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "20px 10px",
        background: "#0D1117",
        borderRadius: 10,
        border: `1px solid ${COLORS.border}`,
        position: "relative",
      }}>
        <Box id="user" label="🌐 Users / Internet" color="#8B949E" sub="HTTPS :443" />
        <Arrow label="DNS → domain" />
        <Box id="alb" label="⚖️ AWS ALB" color={COLORS.alb} sub="Application Load Balancer" />
        <Arrow label="Target Group → Node Port" />
        <Box id="ingress" label="☸️ Ingress Controller" color={COLORS.k8s} sub="nginx / AWS Load Balancer Controller" />
        <Arrow label="ClusterIP route" />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Box id="svc" label="Service A" color={COLORS.k8s} sub="port 3000" />
          <Box id="svc" label="Service B" color={COLORS.k8s} sub="port 4000" />
          <Box id="svc" label="Service C" color={COLORS.k8s} sub="port 5000" />
        </div>
        <Arrow label="selector → pods" />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {["Pod 1 🐋", "Pod 2 🐋", "Pod 3 🐋", "Pod 4 🐋"].map((p, i) => (
            <Box key={i} id="pod" label={p} color={COLORS.docker} sub="container" />
          ))}
        </div>
      </div>
      {hovered && (
        <div style={{
          marginTop: 10,
          background: "#161B22",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          padding: "10px 14px",
          color: COLORS.text,
          fontSize: 13,
          fontStyle: "italic",
        }}>
          💬 {tooltips[hovered] || "Hover components to learn more"}
        </div>
      )}
      {!hovered && (
        <p style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 8 }}>
          Hover any component to learn its role ↑
        </p>
      )}
    </div>
  );
}

// ─── SECTION CONTENT ────────────────────────────────────────────────────────

function BigPicture() {
  return (
    <div>
      <SectionHeader title="The Big Picture" sub="Why do these three exist together?" icon="🗺️" color={COLORS.accent} />
      <p style={{ color: COLORS.text, lineHeight: 1.8, fontSize: 15 }}>
        When you build a real product, you need to answer three questions:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "16px 0" }}>
        <Card color={COLORS.docker} title="HOW do I ship my app?" emoji="🐋">
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            <strong style={{ color: COLORS.docker }}>Docker</strong> packages your app + all its dependencies into a portable image. Run anywhere — dev, staging, prod.
          </p>
        </Card>
        <Card color={COLORS.k8s} title="HOW do I run many containers?" emoji="☸️">
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            <strong style={{ color: COLORS.k8s }}>Kubernetes</strong> orchestrates those containers — scaling, healing, rolling updates. Think of it as your container ops team.
          </p>
        </Card>
        <Card color={COLORS.alb} title="HOW does traffic reach them?" emoji="⚖️">
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            <strong style={{ color: COLORS.alb }}>ALB</strong> is the front door. It takes internet traffic and intelligently routes it to the right container group.
          </p>
        </Card>
      </div>

      <InfoBox type="info">
        <strong>Mental model:</strong> Docker = your shipping container. Kubernetes = the port that manages thousands of containers. ALB = the truck that decides which port to send cargo to.
      </InfoBox>

      <h3 style={{ color: COLORS.text, fontFamily: "monospace", marginTop: 24 }}>Full Traffic Flow</h3>
      <ArchDiagram />

      <h3 style={{ color: COLORS.text, fontFamily: "monospace", marginTop: 24 }}>Real-world analogy for TradeEase</h3>
      <CodeBlock lang="plaintext" title="how a request flows" code={`User hits: https://tradeease.in/api/hs-code/search

  1. DNS resolves → ALB IP
  2. ALB checks path rule: /api/* → forward to K8s NodePort
  3. Ingress Controller routes /api/hs-code/* → hs-code-service
  4. hs-code-service picks a healthy pod (round robin)
  5. Pod (Docker container) handles the request
  6. Response travels back the same path`} />
    </div>
  );
}

function Prerequisites() {
  const [open, setOpen] = useState({});
  const toggle = (k) => setOpen(p => ({ ...p, [k]: !p[k] }));
  const topics = [
    {
      id: "networking",
      title: "🌐 Basic Networking",
      must: true,
      items: [
        { term: "IP Address", def: "Unique address for a machine. 192.168.1.5 (private), 54.23.100.2 (public)" },
        { term: "Port", def: "Door on a machine. 3000 = your Node app, 80 = HTTP, 443 = HTTPS, 5432 = Postgres" },
        { term: "DNS", def: "Phonebook of the internet. tradeease.in → resolves to ALB's IP" },
        { term: "Load Balancing", def: "Spread traffic across multiple servers so no one crashes" },
        { term: "HTTPS / TLS", def: "Encrypted HTTP. ALB terminates TLS — your internal pods can use plain HTTP" },
        { term: "Reverse Proxy", def: "A server that sits in front and forwards requests. Nginx, Traefik, ALB are all reverse proxies" },
      ]
    },
    {
      id: "os",
      title: "🐧 Linux Basics",
      must: true,
      items: [
        { term: "Process", def: "A running program. Each container is essentially an isolated process" },
        { term: "File System", def: "Know /etc, /var, /tmp. K8s mounts volumes at paths like /data" },
        { term: "Environment Variables", def: "Config passed to processes. NODE_ENV=production is how you configure containers" },
        { term: "cgroups & namespaces", def: "Linux features Docker uses internally — isolate CPU, memory, processes" },
        { term: "Shell commands", def: "cd, ls, cat, grep, curl, ps aux. You'll use these to debug pods" },
      ]
    },
    {
      id: "cloud",
      title: "☁️ Cloud / AWS Basics",
      must: false,
      items: [
        { term: "VPC", def: "Virtual Private Cloud — your isolated network on AWS. Pods and ALBs live inside" },
        { term: "Subnets", def: "Segments inside VPC. Public subnets for ALB, private for pods" },
        { term: "Security Groups", def: "Firewall rules. ALB needs inbound 80/443. Pods need inbound from ALB only" },
        { term: "ECR", def: "Elastic Container Registry — AWS's Docker Hub. Store your images here" },
        { term: "IAM", def: "Identity & Access Management. K8s pods need IAM roles to access S3, SES, etc." },
        { term: "EKS", def: "Elastic Kubernetes Service — managed K8s on AWS. Handles the control plane for you" },
      ]
    },
    {
      id: "devtools",
      title: "🛠️ Dev Tools",
      must: false,
      items: [
        { term: "Git", def: "You know this. CI/CD pipelines trigger Docker builds on git push" },
        { term: "YAML", def: "CRITICAL. All K8s configs are YAML. Indentation matters like Python" },
        { term: "JSON", def: "API responses, K8s also uses internally" },
        { term: "REST APIs", def: "kubectl talks to K8s API server. ALB health checks are HTTP GET endpoints" },
      ]
    },
  ];

  return (
    <div>
      <SectionHeader title="Prerequisites" sub="Concepts to lock in before you start" icon="📚" color="#A371F7" />
      <InfoBox type="warn">Don't skip this section. Most K8s/Docker confusion comes from shaky networking fundamentals, not the tools themselves.</InfoBox>

      {topics.map(t => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          <button
            onClick={() => toggle(t.id)}
            style={{
              width: "100%",
              background: open[t.id] ? "#161B22" : "#0D1117",
              border: `1px solid ${COLORS.border}`,
              borderRadius: open[t.id] ? "8px 8px 0 0" : 8,
              padding: "12px 16px",
              color: COLORS.text,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>{t.title}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {t.must && <Badge text="MUST KNOW" color={COLORS.red} />}
              <span style={{ color: COLORS.muted }}>{open[t.id] ? "▲" : "▼"}</span>
            </div>
          </button>
          {open[t.id] && (
            <div style={{
              background: "#0D1117",
              border: `1px solid ${COLORS.border}`,
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "14px 16px",
            }}>
              {t.items.map((item, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: i < t.items.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <span style={{ color: COLORS.accent, fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{item.term}</span>
                  <span style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{item.def}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <InfoBox type="tip">YAML gotcha: use spaces, never tabs. 2-space indent is the K8s standard. Install the YAML extension in VS Code — it saves hours.</InfoBox>
    </div>
  );
}

function DockerSection() {
  const [tab, setTab] = useState("concepts");
  const tabs = ["concepts", "dockerfile", "compose", "commands"];

  return (
    <div>
      <SectionHeader title="Docker" sub="Package once, run anywhere" icon="🐋" color={COLORS.docker} />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? COLORS.docker + "22" : "transparent",
            border: `1px solid ${tab === t ? COLORS.docker : COLORS.border}`,
            color: tab === t ? COLORS.docker : COLORS.muted,
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: tab === t ? 700 : 400,
          }}>{t}</button>
        ))}
      </div>

      {tab === "concepts" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
            <Card color={COLORS.docker} title="Image" emoji="📦">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                A blueprint. Read-only snapshot of your app + OS + dependencies. Lives in a registry (Docker Hub / ECR).
              </p>
            </Card>
            <Card color={COLORS.docker} title="Container" emoji="🏃">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                A running instance of an image. Isolated, ephemeral. Kill it, spin a new one. State is lost unless you use volumes.
              </p>
            </Card>
            <Card color={COLORS.docker} title="Dockerfile" emoji="📝">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Recipe to build an image. Layer by layer instructions — FROM, RUN, COPY, CMD.
              </p>
            </Card>
            <Card color={COLORS.docker} title="Registry" emoji="🏪">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Store and distribute images. Docker Hub is public. AWS ECR is private (use this for prod).
              </p>
            </Card>
            <Card color={COLORS.docker} title="Volume" emoji="💾">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Persistent storage. Mount a host dir inside a container so data survives restarts. Use for DB files, uploads.
              </p>
            </Card>
            <Card color={COLORS.docker} title="Network" emoji="🔗">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Containers talk to each other via Docker networks. In compose, service names become hostnames.
              </p>
            </Card>
          </div>
          <InfoBox type="info">
            <strong>Key insight:</strong> A container is NOT a VM. It shares the host kernel. It's just a process with isolated filesystem, network, and resource limits via Linux namespaces + cgroups.
          </InfoBox>
          <InfoBox type="danger">
            Containers are ephemeral by default. Never store DB data inside a container — always use volumes. When K8s kills and restarts a pod, everything inside the container is gone.
          </InfoBox>
        </div>
      )}

      {tab === "dockerfile" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            A Dockerfile defines how to build your image. Each instruction creates a layer — layers are cached, so order matters for build speed.
          </p>
          <CodeBlock title="Dockerfile — Next.js (TradeEase style)" lang="dockerfile" code={`# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files first (Docker caches this layer if unchanged)
COPY package*.json ./
RUN npm ci --only=production

# Copy rest of app
COPY . .
RUN npm run build

# Stage 2: Production image (smaller!)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy what we need
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]`} />

          <CodeBlock title="Dockerfile — Fastify API" lang="dockerfile" code={`FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Non-root user for security (important for prod!)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4000
CMD ["node", "src/index.js"]`} />

          <InfoBox type="tip">Multi-stage builds = smaller images. Your Next.js dev image might be 1.2GB. Production image with multi-stage can be ~150MB. K8s pulls images on each new node — smaller = faster startup.</InfoBox>

          <CodeBlock title="Build & push to AWS ECR" lang="bash" code={`# Build the image
docker build -t tradeease-api .

# Tag for ECR
docker tag tradeease-api:latest \\
  123456789.dkr.ecr.ap-south-1.amazonaws.com/tradeease-api:latest

# Login to ECR
aws ecr get-login-password --region ap-south-1 | \\
  docker login --username AWS --password-stdin \\
  123456789.dkr.ecr.ap-south-1.amazonaws.com

# Push
docker push 123456789.dkr.ecr.ap-south-1.amazonaws.com/tradeease-api:latest`} />
        </div>
      )}

      {tab === "compose" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            Docker Compose runs multiple containers together locally. Perfect for dev — spin up your app + postgres + redis in one command.
          </p>
          <CodeBlock title="docker-compose.yml — full dev stack" lang="yaml" code={`version: "3.9"

services:
  # Next.js frontend
  frontend:
    build:
      context: ./frontend
      target: builder        # uses the build stage
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    volumes:
      - ./frontend:/app      # hot reload
      - /app/node_modules    # don't overwrite container's node_modules
    depends_on:
      - api

  # Fastify API
  api:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/tradeease
      - REDIS_URL=redis://cache:6379
      - NODE_ENV=development
    volumes:
      - ./api:/app
    depends_on:
      db:
        condition: service_healthy  # wait for DB to be ready
      cache:
        condition: service_started

  # PostgreSQL
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: tradeease
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pg_data:/var/lib/postgresql/data   # persistent!
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      retries: 5

  # Redis
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data:           # named volume — survives docker-compose down`} />

          <CodeBlock title="Compose commands" lang="bash" code={`docker-compose up -d           # start all in background
docker-compose logs -f api     # tail logs of api service
docker-compose exec api sh     # shell into running api container
docker-compose down            # stop and remove containers
docker-compose down -v         # also delete volumes (fresh DB)`} />
        </div>
      )}

      {tab === "commands" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 14 }}>Essential Docker commands you'll use daily:</p>
          {[
            { category: "Images", cmds: [
              ["docker build -t myapp:v1 .", "Build image from Dockerfile in current dir"],
              ["docker images", "List all local images"],
              ["docker pull nginx:alpine", "Pull image from registry"],
              ["docker rmi myapp:v1", "Delete an image"],
              ["docker image prune", "Delete unused images (free up space)"],
            ]},
            { category: "Containers", cmds: [
              ["docker run -d -p 3000:3000 myapp:v1", "Run container detached, map port"],
              ["docker ps", "List running containers"],
              ["docker ps -a", "List all containers (including stopped)"],
              ["docker stop <id>", "Gracefully stop a container"],
              ["docker rm <id>", "Delete a stopped container"],
              ["docker exec -it <id> sh", "Shell into a running container"],
            ]},
            { category: "Debugging", cmds: [
              ["docker logs -f <id>", "Tail container logs"],
              ["docker inspect <id>", "Full JSON details (networking, mounts, env)"],
              ["docker stats", "Live CPU/memory per container"],
              ["docker top <id>", "Processes inside container"],
            ]},
          ].map(g => (
            <div key={g.category} style={{ marginBottom: 16 }}>
              <Badge text={g.category} color={COLORS.docker} />
              <div style={{ background: "#0D1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, marginTop: 8, overflow: "hidden" }}>
                {g.cmds.map(([cmd, desc], i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    padding: "10px 14px",
                    borderBottom: i < g.cmds.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    alignItems: "start",
                  }}>
                    <div>
                      <code style={{ color: "#79C0FF", fontFamily: "monospace", fontSize: 13 }}>{cmd}</code>
                      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>{desc}</div>
                    </div>
                    <CopyButton code={cmd} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function K8sSection() {
  const [tab, setTab] = useState("concepts");
  const tabs = ["concepts", "pod", "deployment", "service", "ingress", "configmap", "commands"];

  return (
    <div>
      <SectionHeader title="Kubernetes" sub="Orchestrate containers at scale" icon="☸️" color={COLORS.k8s} />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? COLORS.k8s + "22" : "transparent",
            border: `1px solid ${tab === t ? COLORS.k8s : COLORS.border}`,
            color: tab === t ? COLORS.k8s : COLORS.muted,
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: tab === t ? 700 : 400,
          }}>{t}</button>
        ))}
      </div>

      {tab === "concepts" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            K8s (Kubernetes) is a container orchestrator. It manages where containers run, restarts failed ones, scales up/down on demand, and handles rolling deployments — so you don't have to SSH into servers.
          </p>
          <h3 style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, marginTop: 18 }}>K8s Architecture</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Card color={COLORS.k8s} title="Control Plane (Master)" emoji="🧠">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                The brain. API Server, Scheduler, etcd (state DB), Controller Manager. On EKS, AWS manages this for you.
              </p>
            </Card>
            <Card color={COLORS.k8s} title="Worker Nodes" emoji="⚙️">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                EC2 instances that actually run your pods. Each node runs kubelet (agent) + container runtime (containerd).
              </p>
            </Card>
          </div>

          <h3 style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, marginTop: 18 }}>Core Objects (know these cold)</h3>
          {[
            { name: "Pod", desc: "Smallest unit. 1+ containers sharing network and storage. Usually 1 container per pod.", icon: "🔵" },
            { name: "Deployment", desc: "Manages a set of identical pods. Handles rolling updates, rollbacks, desired replica count.", icon: "🟢" },
            { name: "Service", desc: "Stable network endpoint for a pod group. Gives you a fixed IP/DNS even as pods restart.", icon: "🟡" },
            { name: "Ingress", desc: "HTTP routing rules. Route /api/* to service-a, /dashboard to service-b.", icon: "🟠" },
            { name: "ConfigMap", desc: "Non-sensitive config (env vars, config files). Injected into pods at runtime.", icon: "🔷" },
            { name: "Secret", desc: "Sensitive config (passwords, API keys). Base64 encoded (not encrypted by default — use Sealed Secrets or AWS Secrets Manager in prod).", icon: "🔐" },
            { name: "Namespace", desc: "Virtual cluster inside K8s. Isolate teams/envs: default, staging, production.", icon: "📁" },
            { name: "PersistentVolume", desc: "Storage that outlives pods. Use for DB data. Backed by EBS, EFS in AWS.", icon: "💾" },
          ].map((o, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "auto 130px 1fr",
              gap: 12,
              padding: "10px 14px",
              background: "#0D1117",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              marginBottom: 6,
              alignItems: "start",
            }}>
              <span style={{ fontSize: 16 }}>{o.icon}</span>
              <span style={{ color: COLORS.k8s, fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{o.name}</span>
              <span style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{o.desc}</span>
            </div>
          ))}
          <InfoBox type="info">
            <strong>Namespace tip:</strong> Use namespaces to separate environments. <code>kubectl apply -f k8s/ -n production</code>. Same cluster, total isolation.
          </InfoBox>
        </div>
      )}

      {tab === "pod" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            Pods are ephemeral — they get created and destroyed. Never access a Pod directly in production; always go through a Service.
          </p>
          <CodeBlock title="pod.yaml — basic pod (for learning only, use Deployment in prod)" lang="yaml" code={`apiVersion: v1
kind: Pod
metadata:
  name: tradeease-api
  namespace: production
  labels:
    app: tradeease-api       # IMPORTANT: Services use these labels to find pods
    version: "1.0"
spec:
  containers:
    - name: api
      image: 123456789.dkr.ecr.ap-south-1.amazonaws.com/tradeease-api:latest
      ports:
        - containerPort: 4000
      
      # Environment variables from ConfigMap and Secret
      envFrom:
        - configMapRef:
            name: tradeease-config
        - secretRef:
            name: tradeease-secrets
      
      # Resource limits (ALWAYS set these in prod)
      resources:
        requests:
          memory: "128Mi"
          cpu: "100m"          # 100 millicores = 0.1 CPU
        limits:
          memory: "512Mi"
          cpu: "500m"
      
      # Health checks (K8s uses these to know if pod is OK)
      livenessProbe:           # if this fails, restart the pod
        httpGet:
          path: /health
          port: 4000
        initialDelaySeconds: 30
        periodSeconds: 10
      
      readinessProbe:          # if this fails, remove from Service (no traffic)
        httpGet:
          path: /ready
          port: 4000
        initialDelaySeconds: 5
        periodSeconds: 5`} />
          <InfoBox type="danger">
            <strong>Always set resource requests/limits.</strong> Without them, a memory leak in one pod can starve other pods on the same node. K8s can't schedule pods properly either.
          </InfoBox>
        </div>
      )}

      {tab === "deployment" && (
        <div>
          <CodeBlock title="deployment.yaml — production-ready" lang="yaml" code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: tradeease-api
  namespace: production
spec:
  replicas: 3                  # run 3 pods always
  
  selector:
    matchLabels:
      app: tradeease-api       # manages pods with this label
  
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1        # at most 1 pod down during update
      maxSurge: 1              # at most 1 extra pod during update
  
  template:                    # pod template (same as a pod spec)
    metadata:
      labels:
        app: tradeease-api
    spec:
      # Spread pods across AZs for HA
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: tradeease-api
      
      containers:
        - name: api
          image: 123456789.dkr.ecr.ap-south-1.amazonaws.com/tradeease-api:v1.2.3
          ports:
            - containerPort: 4000
          envFrom:
            - configMapRef:
                name: tradeease-config
            - secretRef:
                name: tradeease-secrets
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 4000
            periodSeconds: 5`} />
          <InfoBox type="tip">Use exact image tags (v1.2.3), never <code>:latest</code> in prod. If K8s needs to restart a pod, <code>:latest</code> might pull a different version than what's running.</InfoBox>
          <CodeBlock title="HorizontalPodAutoscaler — auto-scale on CPU" lang="yaml" code={`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: tradeease-api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tradeease-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70    # scale up if avg CPU > 70%`} />
        </div>
      )}

      {tab === "service" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            Services give pods a stable DNS name and IP. Pods restart constantly, IPs change — Services abstract that away.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 16 }}>
            {[
              { type: "ClusterIP", desc: "Internal only. Default. Pod-to-pod comms. api.production.svc.cluster.local", color: COLORS.k8s },
              { type: "NodePort", desc: "Exposes on each node's IP + port 30000-32767. Used for ALB target groups.", color: COLORS.alb },
              { type: "LoadBalancer", desc: "Creates a cloud LB per service. Expensive. Use Ingress + ALB instead.", color: COLORS.muted },
            ].map(s => (
              <Card key={s.type} color={s.color} title={s.type}>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </Card>
            ))}
          </div>
          <CodeBlock title="service.yaml — ClusterIP for internal, NodePort for ALB" lang="yaml" code={`# ClusterIP — for internal pod-to-pod communication
apiVersion: v1
kind: Service
metadata:
  name: tradeease-api
  namespace: production
spec:
  type: ClusterIP            # default, internal only
  selector:
    app: tradeease-api       # routes to pods with this label
  ports:
    - port: 4000             # service port (other pods use this)
      targetPort: 4000       # pod's actual port

---

# NodePort — expose to ALB (alternative: use Ingress)
apiVersion: v1
kind: Service
metadata:
  name: tradeease-api-nodeport
  namespace: production
spec:
  type: NodePort
  selector:
    app: tradeease-api
  ports:
    - port: 4000
      targetPort: 4000
      nodePort: 31000        # fixed port on every node (ALB target)`} />
        </div>
      )}

      {tab === "ingress" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            Ingress is the HTTP routing layer inside K8s. An Ingress Controller (like Nginx or AWS Load Balancer Controller) reads these rules and configures the actual proxy.
          </p>
          <CodeBlock title="ingress.yaml — path-based routing" lang="yaml" code={`apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tradeease-ingress
  namespace: production
  annotations:
    # If using NGINX Ingress Controller:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /
    
    # If using AWS Load Balancer Controller (recommended with EKS):
    kubernetes.io/ingress.class: "alb"
    alb.ingress.kubernetes.io/scheme: "internet-facing"
    alb.ingress.kubernetes.io/target-type: "ip"
    alb.ingress.kubernetes.io/certificate-arn: "arn:aws:acm:..."
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS": 443}]'

spec:
  tls:
    - hosts:
        - tradeease.in
        - api.tradeease.in
      secretName: tradeease-tls        # or handled by ALB cert

  rules:
    - host: api.tradeease.in
      http:
        paths:
          - path: /api/hs-code
            pathType: Prefix
            backend:
              service:
                name: hs-code-service
                port:
                  number: 3001
          
          - path: /api/shipment
            pathType: Prefix
            backend:
              service:
                name: shipment-service
                port:
                  number: 3002
          
          - path: /api/documents
            pathType: Prefix
            backend:
              service:
                name: document-service
                port:
                  number: 3003`} />
          <InfoBox type="info">
            With AWS Load Balancer Controller, each Ingress object <em>becomes</em> an ALB rule. You don't manage the ALB manually — the controller creates/updates it from your YAML.
          </InfoBox>
        </div>
      )}

      {tab === "configmap" && (
        <div>
          <CodeBlock title="configmap.yaml — non-sensitive config" lang="yaml" code={`apiVersion: v1
kind: ConfigMap
metadata:
  name: tradeease-config
  namespace: production
data:
  NODE_ENV: "production"
  PORT: "4000"
  LOG_LEVEL: "info"
  ICEGATE_BASE_URL: "https://icegate.gov.in/api"
  ULIP_BASE_URL: "https://ulip.dpiit.gov.in"
  CORS_ORIGIN: "https://tradeease.in"`} />

          <CodeBlock title="secret.yaml — sensitive config (base64 encoded)" lang="yaml" code={`apiVersion: v1
kind: Secret
metadata:
  name: tradeease-secrets
  namespace: production
type: Opaque
data:
  # echo -n "your-value" | base64
  DATABASE_URL: cG9zdGdyZXM6Ly91c2VyOnBhc3NAZGIuZXhhbXBsZS5jb20=
  JWT_SECRET: c3VwZXItc2VjcmV0LWtleQ==
  ICEGATE_API_KEY: aWNlZ2F0ZS1rZXktaGVyZQ==`} />

          <InfoBox type="danger">
            <strong>K8s Secrets are NOT encrypted by default</strong> — they're just base64 encoded. For production, use AWS Secrets Manager + External Secrets Operator, or Sealed Secrets. Never commit secret YAMLs to git.
          </InfoBox>
          <CodeBlock title="Inject ConfigMap as file (for config files)" lang="yaml" code={`# In pod spec:
volumes:
  - name: config-volume
    configMap:
      name: tradeease-config

containers:
  - name: api
    volumeMounts:
      - name: config-volume
        mountPath: /app/config   # files appear here`} />
        </div>
      )}

      {tab === "commands" && (
        <div>
          {[
            { category: "Cluster Info", cmds: [
              ["kubectl cluster-info", "Show cluster endpoints"],
              ["kubectl get nodes", "List worker nodes"],
              ["kubectl top nodes", "Node CPU/memory usage"],
              ["kubectl get namespaces", "List all namespaces"],
            ]},
            { category: "Apply & Manage", cmds: [
              ["kubectl apply -f deployment.yaml", "Create or update resource from file"],
              ["kubectl apply -f k8s/ -n production", "Apply all files in dir to namespace"],
              ["kubectl delete -f deployment.yaml", "Delete resource"],
              ["kubectl rollout restart deploy/tradeease-api", "Rolling restart (zero downtime)"],
              ["kubectl rollout undo deploy/tradeease-api", "Rollback last deployment"],
              ["kubectl scale deploy/tradeease-api --replicas=5", "Scale manually"],
            ]},
            { category: "Inspect", cmds: [
              ["kubectl get pods -n production", "List pods in namespace"],
              ["kubectl get pods -n production -w", "Watch pods (live)"],
              ["kubectl describe pod <name> -n production", "Detailed pod info + events"],
              ["kubectl get events -n production --sort-by=.lastTimestamp", "Recent events"],
              ["kubectl get all -n production", "All resources in namespace"],
            ]},
            { category: "Debug", cmds: [
              ["kubectl logs <pod> -n production", "Pod logs"],
              ["kubectl logs <pod> -n production -f", "Tail logs"],
              ["kubectl logs <pod> -n production --previous", "Logs from crashed container"],
              ["kubectl exec -it <pod> -n production -- sh", "Shell into pod"],
              ["kubectl port-forward svc/tradeease-api 4000:4000 -n production", "Local tunnel to service"],
            ]},
          ].map(g => (
            <div key={g.category} style={{ marginBottom: 16 }}>
              <Badge text={g.category} color={COLORS.k8s} />
              <div style={{ background: "#0D1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, marginTop: 8, overflow: "hidden" }}>
                {g.cmds.map(([cmd, desc], i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    padding: "10px 14px",
                    borderBottom: i < g.cmds.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    alignItems: "start",
                  }}>
                    <div>
                      <code style={{ color: "#79C0FF", fontFamily: "monospace", fontSize: 12 }}>{cmd}</code>
                      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>{desc}</div>
                    </div>
                    <CopyButton code={cmd} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ALBSection() {
  const [tab, setTab] = useState("concepts");
  const tabs = ["concepts", "routing", "terraform", "healthchecks"];

  return (
    <div>
      <SectionHeader title="Application Load Balancer" sub="AWS ALB — the front door to your infrastructure" icon="⚖️" color={COLORS.alb} />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? COLORS.alb + "22" : "transparent",
            border: `1px solid ${tab === t ? COLORS.alb : COLORS.border}`,
            color: tab === t ? COLORS.alb : COLORS.muted,
            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
            fontFamily: "monospace", fontSize: 13, fontWeight: tab === t ? 700 : 400,
          }}>{t}</button>
        ))}
      </div>

      {tab === "concepts" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            An ALB (Application Load Balancer) operates at Layer 7 (HTTP/HTTPS). It's smarter than a basic TCP load balancer — it can route based on URL paths, hostnames, headers, and query strings.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
            <Card color={COLORS.alb} title="Listeners" emoji="👂">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                ALB listens on ports (80, 443). HTTPS listener terminates TLS using ACM certificate.
              </p>
            </Card>
            <Card color={COLORS.alb} title="Rules" emoji="📋">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                IF path is /api/* THEN forward to backend-target-group. Rules evaluated top to bottom.
              </p>
            </Card>
            <Card color={COLORS.alb} title="Target Groups" emoji="🎯">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                A group of backends (EC2 instances, ECS tasks, K8s pods, Lambda). ALB health checks each target.
              </p>
            </Card>
            <Card color={COLORS.alb} title="ACM Certificate" emoji="🔒">
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                Free SSL cert from AWS Certificate Manager. ALB attaches it — your app serves plain HTTP internally.
              </p>
            </Card>
          </div>
          <InfoBox type="info">
            <strong>ALB vs NLB vs CLB:</strong> Use ALB for HTTP/HTTPS web apps (it's L7, path-aware). NLB for TCP/UDP (L4, ultra-low latency). CLB is legacy — avoid it.
          </InfoBox>
        </div>
      )}

      {tab === "routing" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>ALB routing examples — all these happen before traffic ever hits K8s:</p>
          <CodeBlock title="ALB routing scenarios" lang="plaintext" code={`Listener: HTTPS :443

Rule 1: Host = tradeease.in, Path = /api/*
  → Forward → target-group: k8s-api-service (port 31000)

Rule 2: Host = tradeease.in, Path = /dashboard*
  → Forward → target-group: k8s-frontend-service (port 31001)

Rule 3: Host = admin.tradeease.in
  → Forward → target-group: k8s-admin-service (port 31002)

Rule 4: Path = /health
  → Fixed response: 200 "healthy"  (no backend needed)

Rule 5 (default): *
  → Redirect → https://tradeease.in/ (catch-all)`} />

          <InfoBox type="tip">
            Set up an HTTP→HTTPS redirect rule on port 80. One ALB listener rule: IF port 80, THEN redirect to HTTPS. Free, zero-code HTTPS enforcement.
          </InfoBox>

          <CodeBlock title="Sticky sessions (for stateful apps)" lang="plaintext" code={`Target Group → Attributes → Stickiness
  Type: Load balancer generated cookie
  Duration: 1 day

Note: Try to be stateless (use Redis for sessions). 
Sticky sessions are a crutch — pods restart, you lose stickiness.`} />
        </div>
      )}

      {tab === "terraform" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>Define ALB as code with Terraform (preferred for reproducibility):</p>
          <CodeBlock title="alb.tf — ALB + HTTPS setup" lang="hcl" code={`# ALB
resource "aws_lb" "tradeease" {
  name               = "tradeease-alb"
  internal           = false        # internet-facing
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.public_subnet_ids   # must be in 2+ AZs

  enable_deletion_protection = true  # prevent accidental delete
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.tradeease.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "not found"
      status_code  = "404"
    }
  }
}

# HTTP → HTTPS redirect
resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.tradeease.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Target Group pointing to K8s NodePort
resource "aws_lb_target_group" "api" {
  name        = "tradeease-api-tg"
  port        = 31000              # K8s NodePort
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"        # EC2 instances (K8s worker nodes)

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
  }
}

# Routing rule
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}`} />
        </div>
      )}

      {tab === "healthchecks" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>
            ALB health checks determine if a target gets traffic. Failing health check = no traffic sent. You must implement these endpoints.
          </p>
          <CodeBlock title="/health endpoint — Node.js API server" lang="typescript" code={`// src/routes/health.ts
// Works with Express, Hono, or any Node HTTP framework

export async function healthRoutes(app) {
  // Liveness — is the process up?
  app.get('/health', async (req, reply) => {
    return reply.code(200).send({ status: 'ok', ts: Date.now() })
  })

  // Readiness — is the app ready to serve traffic?
  app.get('/ready', async (req, reply) => {
    try {
      // Check DB connection
      await app.db.raw('SELECT 1')
      
      // Check Redis
      await app.redis.ping()
      
      return reply.code(200).send({ status: 'ready' })
    } catch (err) {
      return reply.code(503).send({ status: 'not ready', error: err.message })
    }
  })
}`} />
          <InfoBox type="warn">
            <strong>ALB health check path must return 200.</strong> If your /health returns 404, ALL traffic stops going to that target. Build these routes before you set up ALB. Test with <code>curl http://localhost:4000/health</code>.
          </InfoBox>
          <CodeBlock title="ALB health check settings (console / Terraform)" lang="plaintext" code={`Path:                    /health
Protocol:                HTTP
Port:                    traffic port (auto)
Healthy threshold:       2 (2 consecutive 200s = healthy)
Unhealthy threshold:     3 (3 consecutive failures = unhealthy)
Timeout:                 5 seconds
Interval:                30 seconds
Success codes:           200`} />
        </div>
      )}
    </div>
  );
}

function ConnectionSection() {
  return (
    <div>
      <SectionHeader title="How They Connect" sub="The complete production wiring" icon="🔗" color={COLORS.green} />

      <h3 style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, marginBottom: 12 }}>Two integration patterns</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <Card color={COLORS.alb} title="Pattern 1: ALB → NodePort → Service" emoji="🔀">
          <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            ALB targets K8s worker node EC2 instances on a NodePort (30000+). Any node receives traffic, K8s routes to correct pod. Simple, no extra controller needed.
          </p>
        </Card>
        <Card color={COLORS.k8s} title="Pattern 2: AWS LB Controller (recommended)" emoji="☸️">
          <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Install AWS Load Balancer Controller in K8s. An IngressClass annotation tells it to create/manage an ALB automatically. Your Ingress YAML = ALB config.
          </p>
        </Card>
      </div>

      <h3 style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, marginBottom: 12 }}>Pattern 2 — Full flow (recommended for EKS)</h3>
      <CodeBlock title="complete EKS + ALB flow" lang="plaintext" code={`1. Developer pushes code to GitHub
   └─ GitHub Actions triggers

2. CI pipeline:
   ├─ docker build -t tradeease-api:v1.2.3 .
   ├─ docker push ECR
   └─ kubectl set image deploy/tradeease-api api=ECR_IMAGE:v1.2.3

3. K8s Rolling Update:
   ├─ Spin up new pod (new image)
   ├─ Wait for readinessProbe to pass
   ├─ Add to Service endpoints
   ├─ Remove old pod from Service
   └─ Terminate old pod (zero downtime ✅)

4. AWS LB Controller watches K8s Ingress objects
   └─ Auto-creates/updates ALB rules when Ingress changes

5. Traffic flow:
   User → DNS → ALB (HTTPS 443)
     → Listener Rule matches path
     → Target Group (K8s nodes)
     → NodePort → kube-proxy
     → Service (ClusterIP)
     → Pod (Docker container)
     → Your Fastify/Next.js app`} />

      <h3 style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, marginTop: 20, marginBottom: 12 }}>Service discovery inside K8s</h3>
      <CodeBlock title="how pods talk to each other (internal DNS)" lang="bash" code={`# Format: <service-name>.<namespace>.svc.cluster.local:<port>

# Frontend calling API (same namespace):
http://tradeease-api:4000/api/hs-code

# Cross-namespace:
http://tradeease-api.production.svc.cluster.local:4000

# Postgres (from api pod):
DATABASE_URL=postgres://user:pass@postgres.production.svc.cluster.local:5432/db`} />

      <InfoBox type="info">
        No hardcoded IPs needed inside K8s. CoreDNS (built-in) resolves service names to ClusterIPs automatically. Just use the service name as the hostname.
      </InfoBox>
    </div>
  );
}

function SetupSection() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Install Tools",
      desc: "Get all CLI tools on your machine",
      content: (
        <div>
          <CodeBlock title="macOS (Homebrew)" lang="bash" code={`# Docker Desktop (includes Docker + compose)
brew install --cask docker

# kubectl — K8s CLI
brew install kubectl

# AWS CLI
brew install awscli

# eksctl — create/manage EKS clusters
brew install eksctl

# Helm — K8s package manager (optional but useful)
brew install helm

# Verify
docker --version
kubectl version --client
aws --version
eksctl version`} />
          <CodeBlock title="Ubuntu / Debian" lang="bash" code={`# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER  # no sudo for docker

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# eksctl
curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_Linux_amd64.tar.gz"
tar -xzf eksctl_Linux_amd64.tar.gz && sudo mv eksctl /usr/local/bin/`} />
        </div>
      )
    },
    {
      title: "Docker Locally",
      desc: "Build and test your app in Docker",
      content: (
        <div>
          <CodeBlock title="Step 1: Write Dockerfile" lang="bash" code={`# In your project root:
touch Dockerfile .dockerignore

# .dockerignore (don't copy these into image)
echo "node_modules
.git
.env
*.log
dist
.next/cache" > .dockerignore`} />
          <CodeBlock title="Step 2: Build and test" lang="bash" code={`# Build
docker build -t myapp:dev .

# Run locally with env file
docker run -p 3000:3000 --env-file .env myapp:dev

# Test
curl http://localhost:3000/health

# Interactive debug shell
docker run -it --entrypoint sh myapp:dev`} />
          <CodeBlock title="Step 3: docker-compose for full stack" lang="bash" code={`docker-compose up -d          # start everything
docker-compose logs -f         # watch logs
docker-compose exec api sh     # debug API container
docker-compose down            # stop`} />
          <InfoBox type="tip">Get docker-compose working perfectly locally before touching K8s. It mirrors the multi-container setup and is far easier to debug.</InfoBox>
        </div>
      )
    },
    {
      title: "Push to ECR",
      desc: "Store your images in AWS",
      content: (
        <div>
          <CodeBlock title="Setup ECR" lang="bash" code={`# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Key, region (ap-south-1 for Mumbai), json

# Create ECR repository
aws ecr create-repository \\
  --repository-name tradeease-api \\
  --region ap-south-1

# Get the registry URL (save this)
aws ecr describe-repositories --region ap-south-1 \\
  --query 'repositories[].repositoryUri'`} />
          <CodeBlock title="Build → Tag → Push" lang="bash" code={`REGISTRY=123456789.dkr.ecr.ap-south-1.amazonaws.com
REPO=tradeease-api
TAG=v1.0.0

# Login
aws ecr get-login-password --region ap-south-1 | \\
  docker login --username AWS --password-stdin $REGISTRY

# Build with specific tag
docker build -t $REGISTRY/$REPO:$TAG .

# Push
docker push $REGISTRY/$REPO:$TAG

# Tip: also tag as latest
docker tag $REGISTRY/$REPO:$TAG $REGISTRY/$REPO:latest
docker push $REGISTRY/$REPO:latest`} />
        </div>
      )
    },
    {
      title: "Create EKS Cluster",
      desc: "Spin up managed Kubernetes on AWS",
      content: (
        <div>
          <InfoBox type="warn">EKS costs ~$0.10/hour for control plane + EC2 node costs. Use t3.medium (2 vCPU, 4GB) nodes for dev. Estimated: ~$60-80/month for a small 2-node cluster.</InfoBox>
          <CodeBlock title="cluster.yaml — EKS cluster config" lang="yaml" code={`apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: tradeease-cluster
  region: ap-south-1
  version: "1.29"

# Spread across 3 AZs for HA
availabilityZones: ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

managedNodeGroups:
  - name: ng-general
    instanceType: t3.medium
    minSize: 2
    maxSize: 5
    desiredCapacity: 2
    volumeSize: 30
    iam:
      withAddonPolicies:
        albIngress: true      # needed for AWS LB Controller
        ebs: true             # for persistent volumes`} />
          <CodeBlock title="Create cluster (takes ~15 mins)" lang="bash" code={`eksctl create cluster -f cluster.yaml

# Verify
kubectl get nodes
# NAME                          STATUS   ROLES    AGE
# ip-10-0-1-5.ec2.internal      Ready    <none>   2m

# Save kubeconfig
aws eks update-kubeconfig \\
  --region ap-south-1 \\
  --name tradeease-cluster`} />
        </div>
      )
    },
    {
      title: "Install AWS LB Controller",
      desc: "Connect K8s Ingress to ALB",
      content: (
        <div>
          <CodeBlock title="Install via Helm" lang="bash" code={`# Add EKS chart repo
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Create IAM service account (so K8s can manage ALB)
eksctl create iamserviceaccount \\
  --cluster tradeease-cluster \\
  --namespace kube-system \\
  --name aws-load-balancer-controller \\
  --attach-policy-arn arn:aws:iam::aws:policy/AWSLoadBalancerControllerIAMPolicy \\
  --approve

# Install controller
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \\
  -n kube-system \\
  --set clusterName=tradeease-cluster \\
  --set serviceAccount.create=false \\
  --set serviceAccount.name=aws-load-balancer-controller

# Verify
kubectl get deployment -n kube-system aws-load-balancer-controller`} />
          <InfoBox type="tip">After this, any Ingress with annotation <code>kubernetes.io/ingress.class: alb</code> will automatically create an ALB in your AWS account.</InfoBox>
        </div>
      )
    },
    {
      title: "Deploy Your App",
      desc: "Apply K8s manifests and go live",
      content: (
        <div>
          <CodeBlock title="k8s/ directory structure" lang="bash" code={`k8s/
├── namespace.yaml
├── configmap.yaml
├── secret.yaml          # (don't commit! use sealed-secrets)
├── deployment.yaml
├── service.yaml
└── ingress.yaml`} />
          <CodeBlock title="Deploy everything" lang="bash" code={`# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply all manifests
kubectl apply -f k8s/ -n production

# Watch rollout
kubectl rollout status deploy/tradeease-api -n production

# Check ingress (get ALB URL)
kubectl get ingress -n production
# NAME                HOSTS            ADDRESS
# tradeease-ingress   tradeease.in     k8s-xxx.ap-south-1.elb.amazonaws.com

# Map your domain to ALB in Route 53 (CNAME or Alias record)
# tradeease.in → k8s-xxx.ap-south-1.elb.amazonaws.com`} />
          <CodeBlock title="Update deployment (new image)" lang="bash" code={`# After building and pushing new image v1.1.0:
kubectl set image deployment/tradeease-api \\
  api=123456789.dkr.ecr.ap-south-1.amazonaws.com/tradeease-api:v1.1.0 \\
  -n production

# Or update deployment.yaml and re-apply
kubectl apply -f k8s/deployment.yaml -n production

# Rollback if something goes wrong
kubectl rollout undo deployment/tradeease-api -n production`} />
          <InfoBox type="tip">Set up a GitHub Actions pipeline to automate: build → push ECR → update deployment. Commit → live in ~3 minutes.</InfoBox>
        </div>
      )
    },
  ];

  return (
    <div>
      <SectionHeader title="Setup Guide" sub="Step-by-step from zero to production" icon="🚀" color={COLORS.green} />

      <div style={{ display: "flex", gap: 0, marginBottom: 20, overflowX: "auto" }}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              background: step === i ? COLORS.green + "22" : "transparent",
              border: `1px solid ${step === i ? COLORS.green : COLORS.border}`,
              borderRight: i < steps.length - 1 ? "none" : undefined,
              borderRadius: i === 0 ? "6px 0 0 6px" : i === steps.length - 1 ? "0 6px 6px 0" : 0,
              color: step === i ? COLORS.green : COLORS.muted,
              padding: "8px 14px",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 12,
              whiteSpace: "nowrap",
              fontWeight: step === i ? 700 : 400,
            }}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div style={{
        background: "#161B22",
        border: `1px solid ${COLORS.green}33`,
        borderTop: `3px solid ${COLORS.green}`,
        borderRadius: 8,
        padding: "16px 20px",
        marginBottom: 14,
      }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ color: COLORS.green, fontFamily: "monospace", fontWeight: 700, fontSize: 16 }}>
            Step {step + 1}: {steps[step].title}
          </span>
          <p style={{ color: COLORS.muted, margin: "4px 0 0", fontSize: 13 }}>{steps[step].desc}</p>
        </div>
        {steps[step].content}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            color: step === 0 ? COLORS.border : COLORS.text,
            borderRadius: 6, padding: "8px 18px",
            cursor: step === 0 ? "default" : "pointer",
            fontFamily: "monospace", fontSize: 13,
          }}
        >← Previous</button>
        <span style={{ color: COLORS.muted, fontSize: 12, alignSelf: "center" }}>
          {step + 1} / {steps.length}
        </span>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          style={{
            background: step === steps.length - 1 ? "transparent" : COLORS.green + "22",
            border: `1px solid ${step === steps.length - 1 ? COLORS.border : COLORS.green}`,
            color: step === steps.length - 1 ? COLORS.border : COLORS.green,
            borderRadius: 6, padding: "8px 18px",
            cursor: step === steps.length - 1 ? "default" : "pointer",
            fontFamily: "monospace", fontSize: 13, fontWeight: 700,
          }}
        >Next →</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function CicdPage() {
  const [active, setActive] = useState("bigpicture");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = {
    bigpicture: <BigPicture />,
    prereqs: <Prerequisites />,
    docker: <DockerSection />,
    kubernetes: <K8sSection />,
    alb: <ALBSection />,
    connection: <ConnectionSection />,
    setup: <SetupSection />,
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 18, padding: 4 }}
        >☰</button>
        <div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 16, color: COLORS.text }}>
            🐋 Docker × ☸️ K8s × ⚖️ ALB
          </span>
          <span style={{ color: COLORS.muted, fontSize: 12, marginLeft: 10 }}>Interactive Docs</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Badge text="DOCKER" color={COLORS.docker} />
          <Badge text="K8S" color={COLORS.k8s} />
          <Badge text="ALB" color={COLORS.alb} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 220,
            background: COLORS.surface,
            borderRight: `1px solid ${COLORS.border}`,
            padding: "16px 0",
            flexShrink: 0,
            overflowY: "auto",
          }}>
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  width: "100%",
                  background: active === item.id ? "#58A6FF11" : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${active === item.id ? COLORS.accent : "transparent"}`,
                  color: active === item.id ? COLORS.text : COLORS.muted,
                  padding: "10px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: active === item.id ? 700 : 400,
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </button>
            ))}
            <div style={{ marginTop: 24, padding: "0 16px" }}>
              <p style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.6 }}>
                Built for devs setting up production-grade infra. All configs are production-ready.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 860 }}>
          {sections[active]}
        </div>
      </div>
    </div>
  );
}