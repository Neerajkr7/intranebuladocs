import { useState } from "react";

const theme = {
  bg: "#0a0e1a",
  surface: "#111827",
  surface2: "#1a2235",
  border: "#1e2d45",
  accent: "#00d4aa",
  accentDim: "#00d4aa22",
  accentBorder: "#00d4aa44",
  blue: "#3b82f6",
  blueDim: "#3b82f622",
  amber: "#f59e0b",
  amberDim: "#f59e0b22",
  purple: "#8b5cf6",
  purpleDim: "#8b5cf622",
  red: "#ef4444",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#334155",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const modules = ["Overview", "Docker", "Kubernetes", "Jenkins", "DNS", "Full Flow", "Quiz"];

function Code({ children }) {
  const lines = children.trim().split("\n");
  return (
    <div style={{
      background: "#060d1a", borderRadius: 10, padding: "1.2rem",
      fontFamily: theme.mono, fontSize: 12, lineHeight: 1.8,
      border: `1px solid ${theme.border}`, overflowX: "auto",
      marginTop: 12, marginBottom: 4,
    }}>
      {lines.map((line, i) => {
        const parts = line.split(/(#.*$|'[^']*'|"[^"]*"|\b\d+\b|(?:^|\s)(FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|ENV|apiVersion|kind|metadata|spec|replicas|image|ports|env|resources)(?=\s|:))/g);
        return (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <span style={{ color: theme.textDim, userSelect: "none", minWidth: 20, textAlign: "right" }}>{i + 1}</span>
            <span>
              {parts.map((p, j) => {
                if (!p) return null;
                if (p.startsWith("#")) return <span key={j} style={{ color: "#475569", fontStyle: "italic" }}>{p}</span>;
                if ((p.startsWith("'") && p.endsWith("'")) || (p.startsWith('"') && p.endsWith('"'))) return <span key={j} style={{ color: "#86efac" }}>{p}</span>;
                if (/^\d+$/.test(p)) return <span key={j} style={{ color: "#fb923c" }}>{p}</span>;
                if (/^(FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|ENV|apiVersion|kind|metadata|spec|replicas|image|ports|env|resources)$/.test(p.trim())) return <span key={j} style={{ color: "#38bdf8" }}>{p}</span>;
                return <span key={j} style={{ color: "#cbd5e1" }}>{p}</span>;
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Callout({ icon, color, children }) {
  return (
    <div style={{
      background: color + "18", border: `1px solid ${color}44`,
      borderRadius: 8, padding: "10px 14px", margin: "12px 0",
      fontSize: 13, color: theme.text, lineHeight: 1.7,
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Steps({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 14, padding: "10px 0",
          borderBottom: i < items.length - 1 ? `1px solid ${theme.border}` : "none",
        }}>
          <div style={{
            minWidth: 26, height: 26, borderRadius: "50%",
            background: theme.accentDim, border: `1px solid ${theme.accentBorder}`,
            color: theme.accent, fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.mono, flexShrink: 0,
          }}>{i + 1}</div>
          <div>
            <div style={{ color: theme.text, fontSize: 13, fontWeight: 500 }}>{item.title}</div>
            {item.sub && <div style={{ color: theme.textMuted, fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{item.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            background: active === i ? theme.accent : theme.surface2,
            color: active === i ? "#000" : theme.textMuted,
            fontSize: 12, fontWeight: active === i ? 700 : 400,
            fontFamily: theme.mono, transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      <div key={active} style={{ animation: "fadeIn 0.2s ease" }}>{tabs[active].content}</div>
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: color + "22", border: `1px solid ${color}44`,
      color: color, fontSize: 10, fontWeight: 700, padding: "2px 8px",
      borderRadius: 4, fontFamily: theme.mono, letterSpacing: 1, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function FlowRow({ steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            background: s.accent ? theme.accentDim : theme.surface2,
            border: `1px solid ${s.accent ? theme.accent : theme.border}`,
            borderRadius: 8, padding: "8px 14px", fontSize: 12,
            color: s.accent ? theme.accent : theme.text, textAlign: "center", lineHeight: 1.4,
          }}>{s.label}</div>
          {i < steps.length - 1 && <span style={{ color: theme.textDim, fontSize: 18 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

function OverviewModule() {
  const [open, setOpen] = useState(null);
  const cards = [
    {
      id: "vercel", icon: "⚡", title: "Vercel / Amplify", sub: "What you already know", color: theme.amber,
      content: (
        <>
          <Callout icon="💡" color={theme.amber}>When Vercel deploys your app, it secretly does everything you're about to learn — just hidden behind a nice UI.</Callout>
          <Steps items={[
            { title: "git push detected", sub: "Same as Jenkins picking up a webhook trigger" },
            { title: "Vercel builds your app", sub: "Same as Docker building an image inside a CI pipeline" },
            { title: "Deploys to edge servers", sub: "Same as Kubernetes scheduling your pod across nodes" },
            { title: "your-app.vercel.app resolves", sub: "Same as DNS A record pointing to a load balancer IP" },
          ]} />
          <Callout icon="🎯" color={theme.accent}>In production, YOU control each step. More control = more resilience, more responsibility.</Callout>
        </>
      )
    },
    {
      id: "docker", icon: "📦", title: "Docker", sub: "Package the app", color: theme.blue,
      content: (
        <>
          <Callout icon="🚢" color={theme.blue}>Think of your Node app as furniture. Docker is the shipping container. No matter which ship (server) carries it, the furniture arrives intact — same Node version, same dependencies, same OS.</Callout>
          <FlowRow steps={[{ label: "Your code + package.json" }, { label: "Dockerfile", accent: true }, { label: "Image (snapshot)", accent: true }, { label: "Container (running)" }]} />
        </>
      )
    },
    {
      id: "k8s", icon: "⚙️", title: "Kubernetes", sub: "Orchestrate containers", color: theme.purple,
      content: (
        <>
          <Callout icon="🏢" color={theme.purple}>If Docker containers are workers, Kubernetes is the operations manager. It decides how many workers to hire, fires crashed ones, and distributes work across servers automatically.</Callout>
          <Steps items={[
            { title: "Runs N copies of your app", sub: "You say: I want 3 replicas. K8s keeps 3 running always." },
            { title: "Self-heals crashed pods", sub: "App crash? K8s restarts it within seconds automatically." },
            { title: "Scales on demand", sub: "High traffic? HPA spins up more pods. Traffic drops? Scales down." },
          ]} />
        </>
      )
    },
    {
      id: "jenkins", icon: "🔁", title: "Jenkins", sub: "Automate the pipeline", color: theme.accent,
      content: (
        <>
          <Callout icon="🤖" color={theme.accent}>Jenkins is a robot that follows your exact checklist every time code is pushed. No human needed, no missed steps, no "works on my machine."</Callout>
          <FlowRow steps={[{ label: "git push" }, { label: "test", accent: true }, { label: "docker build", accent: true }, { label: "push image", accent: true }, { label: "deploy to K8s" }]} />
        </>
      )
    },
    {
      id: "dns", icon: "🌐", title: "DNS", sub: "Route traffic to your app", color: theme.red,
      content: (
        <>
          <Callout icon="📖" color={theme.red}>DNS is the phone book of the internet. yourdomain.com is a human name. DNS translates it to an actual IP address so browsers can find your server.</Callout>
          <Steps items={[
            { title: "User types api.yourdomain.com", sub: "Browser has no idea where this lives" },
            { title: "DNS lookup returns IP", sub: "e.g. 52.14.200.10 — your load balancer" },
            { title: "Browser connects to IP:443", sub: "TLS handshake, your app responds" },
          ]} />
        </>
      )
    },
  ];

  return (
    <div>
      <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
        Vercel and Amplify hide all of this from you. In production, you own the whole stack. Click any concept to understand what's really happening under the hood.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => setOpen(open === card.id ? null : card.id)} style={{
            background: open === card.id ? card.color + "18" : theme.surface2,
            border: `1px solid ${open === card.id ? card.color : theme.border}`,
            borderRadius: 10, padding: "1rem", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{card.title}</div>
            <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{card.sub}</div>
          </button>
        ))}
      </div>
      {open && (() => {
        const card = cards.find(c => c.id === open);
        return (
          <div style={{
            background: theme.surface2, border: `1px solid ${card.color}44`,
            borderRadius: 12, padding: "1.2rem", animation: "fadeIn 0.2s ease",
          }}>
            <div style={{ color: card.color, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{card.icon} {card.title}</div>
            {card.content}
          </div>
        );
      })()}
    </div>
  );
}

function DockerModule() {
  return (
    <Tabs tabs={[
      {
        label: "Dockerfile", content: (
          <>
            <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>Every production Node.js app starts here. Learn what every single line actually does.</p>
            <Code>{`FROM node:20-alpine
# alpine = minimal Linux, 5MB vs 900MB full image
# Smaller = faster pulls, less attack surface

WORKDIR /app
# Set working directory inside the container

COPY package*.json ./
# Copy package files FIRST — layer caching trick!
# If source code changes but packages don't,
# Docker skips npm install on next build (saves 2-3 min)

RUN npm ci --only=production
# npm ci = clean install, exact versions from lockfile

COPY . .
# Now copy the rest of your source code

EXPOSE 3000
# Documentation only — doesn't actually open port
# Real port binding: docker run -p 3000:3000

CMD ["node", "server.js"]
# Start command when container runs`}</Code>
            <Callout icon="🔑" color={theme.blue}>Layer order matters. Layers that change less go first. If a layer hasn't changed, Docker reuses the cached version — skipping all steps below it.</Callout>
          </>
        )
      },
      {
        label: "CLI Commands", content: (
          <>
            <Code>{`# Build image from Dockerfile
docker build -t myapp:v1.0 .

# Run container locally (host:container port mapping)
docker run -p 3000:3000 myapp:v1.0

# Run with env variables
docker run -p 3000:3000 -e NODE_ENV=production myapp:v1.0

# See all running containers
docker ps

# See logs
docker logs <container-id>

# Shell inside container — your #1 debug tool
docker exec -it <container-id> sh

# Tag image for a registry
docker tag myapp:v1.0 ghcr.io/yourorg/myapp:v1.0

# Push to registry
docker push ghcr.io/yourorg/myapp:v1.0`}</Code>
            <Callout icon="🛠️" color={theme.accent}>docker exec -it is like SSH into a running container. Check: node_modules exist? Env vars set? File paths correct? This is your primary container debug tool.</Callout>
          </>
        )
      },
      {
        label: "Docker Compose", content: (
          <>
            <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 8 }}>Run multiple containers together — Node API + Postgres + Redis with one command.</p>
            <Code>{`# docker-compose.yml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:`}</Code>
            <Callout icon="🌐" color={theme.purple}>Containers talk by service name. DB_HOST=postgres works because Compose creates a private Docker network where "postgres" resolves to that container's internal IP automatically.</Callout>
          </>
        )
      },
      {
        label: "Image Registry", content: (
          <>
            <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 12 }}>A registry is like GitHub but for Docker images. CI builds and pushes. Kubernetes pulls and runs.</p>
            <Steps items={[
              { title: "Docker Hub (docker.io)", sub: "Public, free tier. Great for open source. Simple to get started." },
              { title: "GitHub Container Registry (ghcr.io)", sub: "Best if code is already on GitHub. Integrates natively with GitHub Actions." },
              { title: "AWS ECR", sub: "Private registry on AWS. Best choice when deploying to EKS (AWS Kubernetes)." },
              { title: "Self-hosted (Harbor)", sub: "Full control. Used in enterprises with strict data residency or compliance requirements." },
            ]} />
            <FlowRow steps={[{ label: "CI builds image" }, { label: "Push to Registry", accent: true }, { label: "K8s pulls image" }, { label: "Pod runs container", accent: true }]} />
          </>
        )
      },
    ]} />
  );
}

function K8sModule() {
  const concepts = [
    { label: "Pod", color: theme.blue, desc: "Smallest unit. One or more containers running together. One instance of your app. K8s restarts it if it crashes." },
    { label: "Deployment", color: theme.purple, desc: "Manages N replicas of your pod. Declares desired state. K8s constantly reconciles actual state to match what you declared." },
    { label: "Service", color: theme.amber, desc: "Stable internal address for pods. Pods have random IPs that change — Service gives a fixed virtual IP. Also load-balances across pods." },
    { label: "Ingress", color: theme.accent, desc: "Entry point from outside the cluster. Routes HTTP traffic to the right Service based on domain name or URL path rules." },
    { label: "Node", color: theme.red, desc: "An actual server (EC2 instance, GCP VM). A cluster = multiple nodes. You don't SSH into nodes — K8s manages scheduling." },
    { label: "Secret", color: theme.textMuted, desc: "Env variables stored in K8s, base64-encoded. Injected into pods at runtime. Never bake DB passwords into Docker images." },
  ];

  return (
    <Tabs tabs={[
      {
        label: "Core Concepts", content: (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {concepts.map(c => (
              <div key={c.label} style={{ background: theme.surface2, border: `1px solid ${c.color}33`, borderRadius: 10, padding: "0.9rem" }}>
                <span style={{ background: c.color + "22", border: `1px solid ${c.color}55`, color: c.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, fontFamily: theme.mono, display: "inline-block", marginBottom: 8 }}>{c.label}</span>
                <p style={{ color: theme.textMuted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        )
      },
      {
        label: "Deployment YAML", content: (
          <>
            <Code>{`# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: ghcr.io/org/myapp:v1.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: db-password
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"`}</Code>
            <Callout icon="⚡" color={theme.amber}>requests = guaranteed (used for scheduling). limits = max allowed. If your app exceeds memory limit, K8s kills the container (OOMKilled) and restarts it.</Callout>
          </>
        )
      },
      {
        label: "Service + Ingress", content: (
          <>
            <Code>{`# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: myapp-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80`}</Code>
            <Callout icon="🔀" color={theme.accent}>Ingress Controller (nginx/traefik) is a pod that reads these rules and routes traffic. It has a LoadBalancer Service with a real public IP — that IP is what DNS points to.</Callout>
          </>
        )
      },
      {
        label: "kubectl", content: (
          <>
            <Code>{`# Apply config files
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check what's running
kubectl get pods
kubectl get deployments
kubectl get services

# Debug a crashing pod
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Shell inside a running pod
kubectl exec -it <pod-name> -- sh

# Scale replicas
kubectl scale deployment myapp --replicas=5

# Rolling update — zero downtime
kubectl set image deployment/myapp myapp=ghcr.io/org/myapp:v1.1
kubectl rollout status deployment/myapp

# Instant rollback
kubectl rollout undo deployment/myapp`}</Code>
            <Callout icon="🔁" color={theme.purple}>kubectl rollout undo is your emergency brake. K8s switches back to the previous ReplicaSet — under 30 seconds. Rollback to a specific version: --to-revision=138</Callout>
          </>
        )
      },
    ]} />
  );
}

function JenkinsModule() {
  return (
    <Tabs tabs={[
      {
        label: "How it works", content: (
          <>
            <Callout icon="🤖" color={theme.accent}>Jenkins watches your Git repo. When code is pushed, it reads your Jenkinsfile and runs it top to bottom — same steps every single time, zero human error.</Callout>
            <Steps items={[
              { title: "Developer pushes to GitHub", sub: "GitHub webhook fires — tells Jenkins: new push on main branch." },
              { title: "Jenkins triggers pipeline", sub: "Reads Jenkinsfile from repo root. Runs stages sequentially." },
              { title: "Install + Test", sub: "npm ci + npm test. If tests fail, pipeline stops here. No broken code proceeds." },
              { title: "Docker build + push", sub: "Creates immutable image tagged with build number. e.g. myapp:142. Pushed to registry." },
              { title: "Deploy to Kubernetes", sub: "kubectl set image — K8s pulls new image, does rolling update across replicas." },
              { title: "Notify team", sub: "Slack message with build status and deploy link. Pass or fail, every time." },
            ]} />
          </>
        )
      },
      {
        label: "Jenkinsfile", content: (
          <>
            <Code>{[
  '// Jenkinsfile — lives in your repo root',
  'pipeline {',
  '  agent any',
  '',
  '  environment {',
  '    REGISTRY   = "ghcr.io/yourorg/myapp"',
  '    IMAGE_TAG  = "${BUILD_NUMBER}"   // auto-increments',
  '    KUBECONFIG = credentials("k8s-kubeconfig")',
  '  }',
  '',
  '  stages {',
  '    stage("Install") {',
  '      steps { sh "npm ci" }',
  '    }',
  '',
  '    stage("Test") {',
  '      steps { sh "npm test" }',
  '    }',
  '',
  '    stage("Docker Build") {',
  '      steps {',
  '        sh "docker build -t $REGISTRY:$IMAGE_TAG ."',
  '      }',
  '    }',
  '',
  '    stage("Push to Registry") {',
  '      steps {',
  '        withCredentials([usernamePassword(',
  '          credentialsId: "registry-creds",',
  '          usernameVariable: "USER",',
  '          passwordVariable: "PASS"',
  '        )]) {',
  '          sh "docker login ghcr.io -u $USER -p $PASS"',
  '          sh "docker push $REGISTRY:$IMAGE_TAG"',
  '        }',
  '      }',
  '    }',
  '',
  '    stage("Deploy to K8s") {',
  '      steps {',
  '        sh """',
  '          kubectl set image deployment/myapp \\\\',
  '            myapp=$REGISTRY:$IMAGE_TAG',
  '          kubectl rollout status deployment/myapp',
  '        """',
  '      }',
  '    }',
  '  }',
  '',
  '  post {',
  '    failure { slackSend message: "Build FAILED" }',
  '    success { slackSend message: "Deployed v${BUILD_NUMBER}" }',
  '  }',
  '}',
].join('\n')}</Code>
            <Callout icon="🔐" color={theme.amber}>Secrets (registry passwords, kubeconfig) are stored in Jenkins Credentials — never in the Jenkinsfile. withCredentials injects them as env vars at runtime only, never logged.</Callout>
          </>
        )
      },
      {
        label: "Pipeline stages", content: (
          <>
            {[
              { label: "1. Checkout", color: theme.blue, desc: "Jenkins clones your repo at the exact commit that triggered the build. Clean slate every time." },
              { label: "2. Install + Test", color: theme.accent, desc: "npm ci + npm test. Failure = pipeline stops. Broken code never reaches Docker or K8s." },
              { label: "3. Docker Build", color: theme.accent, desc: "Creates immutable image: myapp:142. Each build = unique tag. Never overwrite existing tags." },
              { label: "4. Push to Registry", color: theme.accent, desc: "Image uploaded so every K8s node can pull it. The tag is now permanently stored." },
              { label: "5. K8s Rollout", color: theme.purple, desc: "kubectl updates deployment. K8s replaces old pods one-by-one — zero downtime rolling update." },
              { label: "6. Notify", color: theme.amber, desc: "Slack/email with result. Team always knows what's live and whether deployment passed." },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none", alignItems: "flex-start" }}>
                <span style={{ background: s.color + "22", border: `1px solid ${s.color}44`, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, fontFamily: theme.mono, whiteSpace: "nowrap", flexShrink: 0 }}>{s.label}</span>
                <span style={{ color: theme.textMuted, fontSize: 12, lineHeight: 1.6 }}>{s.desc}</span>
              </div>
            ))}
            <Callout icon="💡" color={theme.blue}>Each build gets a unique numeric tag. You can rollback to any previous version: kubectl rollout undo deployment/myapp --to-revision=138</Callout>
          </>
        )
      },
    ]} />
  );
}

function DNSModule() {
  return (
    <Tabs tabs={[
      {
        label: "How DNS works", content: (
          <>
            <Callout icon="📖" color={theme.red}>User types api.tradeease.in → Browser asks resolver → resolver asks root → root asks .in TLD → .in says ask Cloudflare → Cloudflare returns 52.14.xx.xx → Browser hits Load Balancer → Ingress routes to pod.</Callout>
            <Steps items={[
              { title: "Browser checks local cache", sub: "Recently visited? Use cached IP. TTL controls how long before it re-checks." },
              { title: "Asks Recursive Resolver (8.8.8.8)", sub: "Your ISP or Google DNS — does the full chain lookup on your behalf." },
              { title: "Root → TLD nameserver", sub: "Finds who's authoritative for .in or .com domains." },
              { title: "Your nameserver answers", sub: "Cloudflare / Route53 returns the A record — the actual IP." },
              { title: "Browser connects to IP:443", sub: "TLS handshake, then your app responds." },
            ]} />
            <Callout icon="⚠️" color={theme.amber}>DNS must point to your Load Balancer IP — not a pod IP. Pods are ephemeral and change IPs constantly. The LB IP is stable.</Callout>
          </>
        )
      },
      {
        label: "Record Types", content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { type: "A", color: theme.blue, desc: "domain → IPv4 address. Most common. api.yourdomain.com → 52.14.200.10. Points to load balancer.", use: "App" },
              { type: "CNAME", color: theme.purple, desc: "domain → another domain (alias). www.yourdomain.com → yourdomain.com. Cannot be used on root domain.", use: "Aliases" },
              { type: "AAAA", color: theme.accent, desc: "domain → IPv6 address. Same as A but IPv6. Set both A + AAAA for dual-stack.", use: "IPv6" },
              { type: "MX", color: theme.amber, desc: "Tells mail servers where to deliver email. Unrelated to your Node app.", use: "Email" },
              { type: "TXT", color: theme.textMuted, desc: "Arbitrary text. Used for domain verification (Google), SPF anti-spam, SSL cert challenges.", use: "Verify" },
            ].map((r, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", alignItems: "flex-start", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", minWidth: 90, flexShrink: 0 }}>
                  <span style={{ background: r.color + "22", border: `1px solid ${r.color}55`, color: r.color, fontFamily: theme.mono, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>{r.type}</span>
                  <span style={{ fontSize: 10, color: theme.textDim, fontFamily: theme.mono }}>{r.use}</span>
                </div>
                <span style={{ color: theme.textMuted, fontSize: 12, lineHeight: 1.6 }}>{r.desc}</span>
              </div>
            ))}
          </div>
        )
      },
      {
        label: "Full Setup", content: (
          <>
            <Steps items={[
              { title: "Get Load Balancer IP from K8s", sub: "kubectl get service ingress-nginx-controller -n ingress-nginx → EXTERNAL-IP column" },
              { title: "Create A record in DNS provider", sub: "Cloudflare/Route53: Name=api, Type=A, Value=<LB-IP>, TTL=300" },
              { title: "Verify propagation", sub: "dig api.yourdomain.com — should return your LB IP. Takes up to TTL seconds." },
              { title: "Install cert-manager + Let's Encrypt", sub: "Auto-provisions TLS certificates for your domain. Free SSL, auto-renews." },
              { title: "Update Ingress for TLS", sub: "Add tls section in ingress.yaml with secretName. cert-manager fills it automatically." },
            ]} />
            <Code>{`# Verify DNS
dig api.yourdomain.com

# Check cert-manager SSL cert
kubectl get certificates -A
kubectl describe certificate myapp-tls

# Ingress with TLS
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: myapp-tls
  rules:
  - host: api.yourdomain.com`}</Code>
          </>
        )
      },
    ]} />
  );
}

function FullFlowModule() {
  const [active, setActive] = useState(null);
  const steps = [
    { n: 1, label: "git push main", color: theme.blue, actor: "Developer", detail: "Developer pushes a feature to GitHub main branch. GitHub checks for registered webhooks on this repo." },
    { n: 2, label: "Webhook fires", color: theme.blue, actor: "GitHub → Jenkins", detail: "GitHub sends a POST request to your Jenkins server URL. Jenkins receives it and kicks off the pipeline defined in Jenkinsfile." },
    { n: 3, label: "npm ci + npm test", color: theme.amber, actor: "Jenkins", detail: "Jenkins runs install and test stages. If tests FAIL — pipeline stops here. Slack notification sent. Broken code never reaches Docker." },
    { n: 4, label: "docker build :142", color: theme.accent, actor: "Jenkins", detail: "Jenkins builds a Docker image tagged with the build number — e.g. ghcr.io/org/myapp:142. Immutable snapshot of this exact commit." },
    { n: 5, label: "push to registry", color: theme.accent, actor: "Jenkins → Registry", detail: "Image uploaded to ghcr.io or ECR. Now every K8s node can pull it. Permanently versioned. You can deploy any old tag anytime." },
    { n: 6, label: "kubectl set image", color: theme.purple, actor: "Jenkins → K8s", detail: "Jenkins runs kubectl set image deployment/myapp myapp=ghcr.io/org/myapp:142. K8s API server receives the desired state update." },
    { n: 7, label: "Rolling update", color: theme.purple, actor: "Kubernetes", detail: "K8s terminates old pods one-by-one while spinning up new ones. At no point are ALL pods down. Zero downtime guaranteed by default." },
    { n: 8, label: "DNS lookup", color: theme.red, actor: "User's browser", detail: "User types api.tradeease.in. Browser queries DNS → gets Load Balancer IP → establishes TCP connection to port 443." },
    { n: 9, label: "Ingress routes", color: theme.red, actor: "nginx Ingress", detail: "nginx Ingress Controller receives the request, matches the host rule, forwards to myapp-service, which load-balances to one of the 3 healthy pods." },
    { n: 10, label: "Response served", color: theme.accent, actor: "Pod → User", detail: "The new v142 pod processes the request and returns the response. User sees updated code. Full deployment complete — zero downtime." },
  ];

  return (
    <div>
      <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>End-to-end: from git push to user getting a response. Click any step to see what's happening internally.</p>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 1, background: theme.border }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setActive(active === i ? null : i)} style={{ display: "flex", gap: 14, padding: "8px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ zIndex: 1, flexShrink: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: active === i ? s.color : theme.surface2, border: `1px solid ${active === i ? s.color : theme.border}`, color: active === i ? "#000" : s.color, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.mono, transition: "all 0.2s" }}>{s.n}</div>
              </div>
              <div style={{ paddingTop: 6, flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: theme.text, fontSize: 13, fontWeight: 600, fontFamily: theme.mono }}>{s.label}</span>
                  <Badge label={s.actor} color={s.color} />
                </div>
                {active === i && (
                  <div style={{ background: theme.surface2, border: `1px solid ${s.color}33`, borderRadius: 8, padding: "10px 12px", marginTop: 8, color: theme.textMuted, fontSize: 12, lineHeight: 1.7, animation: "fadeIn 0.15s ease" }}>{s.detail}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <Callout icon="🎯" color={theme.accent}>The full flow from git push to live deploy takes 3–8 minutes typically. The user never sees downtime because K8s does rolling updates — pods swap out one at a time.</Callout>
    </div>
  );
}

const quizData = [
  { q: "Your app works locally but crashes inside Docker. What's your FIRST move?", opts: ["Rebuild K8s deployment", "docker exec -it <id> sh and inspect inside", "Check DNS A records", "Restart Jenkins"], correct: 1, why: "docker exec -it gives you a shell inside the running container. Check: node_modules exist? Env vars set? Ports match? This is your primary debug tool for container-specific issues." },
  { q: "Jenkins pipeline passes but K8s pods show CrashLoopBackOff. What do you run?", opts: ["kubectl get deployments", "docker build again", "kubectl logs <pod> AND kubectl describe pod <pod>", "Check DNS TTL"], correct: 2, why: "kubectl logs shows your Node app's stdout/stderr before crashing. kubectl describe pod shows K8s events — like OOMKilled (out of memory) or ImagePullBackOff (can't pull from registry)." },
  { q: "You deploy v2 and it breaks production. How do you recover in under 30 seconds?", opts: ["Re-run Jenkins with old code", "kubectl rollout undo deployment/myapp", "Delete all pods and redeploy", "Update DNS to old server IP"], correct: 1, why: "kubectl rollout undo is instant — K8s switches back to the previous ReplicaSet. That's why numeric image tags matter. You can pick any version: --to-revision=138" },
  { q: "yourdomain.com shows 'connection refused' after a DNS change. Most likely cause?", opts: ["All K8s pods crashed", "DNS hasn't propagated yet (TTL) or A record has wrong IP", "Jenkins build failed", "Docker image is corrupt"], correct: 1, why: "DNS propagation takes TTL seconds (300 = 5 min). Verify with: dig api.yourdomain.com — check if the returned IP matches kubectl get service ingress-nginx-controller EXTERNAL-IP." },
  { q: "Where do you store DB passwords for a K8s deployment?", opts: ["Hardcode in Dockerfile ENV", ".env file COPY'd into the image", "K8s Secret, referenced via secretKeyRef in deployment YAML", "Jenkinsfile plain text variable"], correct: 2, why: "K8s Secrets inject at runtime — the Docker image has zero secrets baked in. If someone steals your image, they get nothing. Jenkins Credentials store is for pipeline secrets (registry login, kubeconfig)." },
  { q: "What's the difference between EXPOSE 3000 in Dockerfile and docker run -p 3000:3000?", opts: ["No difference, both open port 3000", "EXPOSE opens the port; -p is optional documentation", "EXPOSE is documentation only; -p actually maps host port to container port", "EXPOSE is for K8s, -p is for local Docker only"], correct: 2, why: "EXPOSE is documentation only — tells humans which port the app uses, but does nothing at runtime. The real port binding is -p 3000:3000 which maps host port 3000 to container port 3000." },
];

function QuizModule() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = quizData[idx];
  const answered = picked !== null;

  function pick(i) {
    if (answered) return;
    setPicked(i);
    if (i === q.correct) setScore(s => s + 1);
  }

  function next() {
    if (idx < quizData.length - 1) { setIdx(i => i + 1); setPicked(null); }
    else setDone(true);
  }

  function restart() { setIdx(0); setPicked(null); setScore(0); setDone(false); }

  if (done) {
    const pct = Math.round((score / quizData.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{pct >= 80 ? "🎯" : pct >= 60 ? "💪" : "📚"}</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: pct >= 80 ? theme.accent : theme.amber, fontFamily: theme.mono }}>{score}/{quizData.length}</div>
        <div style={{ color: theme.textMuted, fontSize: 14, margin: "8px 0 20px", lineHeight: 1.7 }}>{pct >= 80 ? "Production-ready mindset. You've genuinely got this 🔥" : pct >= 60 ? "Good foundation. Re-read the weaker sections." : "Go through the modules again — it'll click soon."}</div>
        <div style={{ background: theme.surface2, borderRadius: 8, height: 6, marginBottom: 20 }}>
          <div style={{ background: pct >= 80 ? theme.accent : theme.amber, width: `${pct}%`, height: 6, borderRadius: 8, transition: "width 0.6s ease" }} />
        </div>
        <button onClick={restart} style={{ background: theme.accent, color: "#000", border: "none", borderRadius: 8, padding: "10px 28px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: theme.mono }}>Retry Quiz</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: theme.textMuted, fontSize: 12, fontFamily: theme.mono }}>Q{idx + 1} of {quizData.length}</span>
        <span style={{ color: theme.accent, fontSize: 12, fontFamily: theme.mono }}>{score} correct</span>
      </div>
      <div style={{ background: theme.surface2, borderRadius: 6, height: 4, marginBottom: 20 }}>
        <div style={{ background: theme.accent, width: `${(idx / quizData.length) * 100}%`, height: 4, borderRadius: 6, transition: "width 0.3s" }} />
      </div>
      <div style={{ color: theme.text, fontSize: 14, fontWeight: 600, lineHeight: 1.65, marginBottom: 16 }} key={idx}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.opts.map((opt, i) => {
          let bg = theme.surface2, border = theme.border, color = theme.text;
          if (answered) {
            if (i === q.correct) { bg = theme.accent + "22"; border = theme.accent; color = theme.accent; }
            else if (i === picked) { bg = theme.red + "22"; border = theme.red; color = theme.red; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "11px 14px", color, fontSize: 13, cursor: answered ? "default" : "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", lineHeight: 1.5 }}>{opt}</button>
          );
        })}
      </div>
      {answered && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: picked === q.correct ? theme.accent + "18" : theme.red + "18", border: `1px solid ${picked === q.correct ? theme.accent : theme.red}44`, borderRadius: 8, padding: "12px 14px", marginTop: 14, color: theme.text, fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: picked === q.correct ? theme.accent : theme.red }}>{picked === q.correct ? "Correct! " : "Not quite. "}</strong>{q.why}
          </div>
          <button onClick={next} style={{ marginTop: 14, background: theme.accent, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: theme.mono }}>
            {idx < quizData.length - 1 ? "Next →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const icons = ["🗺", "📦", "⚙️", "🔁", "🌐", "🔗", "🧠"];
  const moduleComponents = [<OverviewModule />, <DockerModule />, <K8sModule />, <JenkinsModule />, <DNSModule />, <FullFlowModule />, <QuizModule />];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 4px; }
        button:focus { outline: none; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: theme.accentDim, border: `1px solid ${theme.accentBorder}`, borderRadius: 6, padding: "5px 10px", fontFamily: theme.mono, fontSize: 10, color: theme.accent, fontWeight: 700, letterSpacing: 1 }}>DEVOPS</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Production Deployment Masterclass</div>
          <div style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>Docker · Kubernetes · Jenkins · DNS — Node.js</div>
        </div>
      </div>

      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: "0 1.5rem", display: "flex", gap: 0, overflowX: "auto" }}>
        {modules.map((m, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ padding: "12px 14px", border: "none", background: "transparent", cursor: "pointer", color: active === i ? theme.accent : theme.textMuted, fontSize: 13, whiteSpace: "nowrap", borderBottom: active === i ? `2px solid ${theme.accent}` : "2px solid transparent", transition: "all 0.2s", fontFamily: "inherit", fontWeight: active === i ? 600 : 400 }}>
            <span style={{ marginRight: 6 }}>{icons[i]}</span>{m}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem" }}>
        <div key={active} style={{ animation: "fadeIn 0.25s ease" }}>
          {moduleComponents[active]}
        </div>
      </div>
    </div>
  );
}