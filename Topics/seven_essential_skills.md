# The Essential Skills for Building Functional AI Agents

The video discusses a significant evolution in the role traditionally known as "prompt engineering" and redefines the skill set required to build AI agents that operate reliably in real-world production environments. The speaker argues that prompt engineering—once focused on crafting clever prompts for large language models (LLMs)—is no longer sufficient. Instead, the discipline has expanded into **agent engineering**, which involves complex system design and engineering practices to create agents capable of performing real actions beyond simple text generation.

---

### Key Insights and Core Concepts

- **Agent Engineering vs. Prompt Engineering**  
  Prompt engineering focused on writing effective instructions for LLMs. In contrast, agent engineering treats the AI system as a complex orchestration of components that interact with the outside world via APIs, tools, databases, and sub-agents.

- **Seven Essential Skills for Agent Engineers:**  
  These skills represent the multidisciplinary expertise needed to build robust, reliable AI agents:
  1. **System Design**
     - Design the agent as an integrated system or orchestra of components, including LLMs, tools, databases, and sub-agents.
     - Focus on data flow, fault tolerance, and coordination between components.
     - Similar to backend system architecture in traditional software engineering.

  2. **Tool and Contract Design**
     - Define strict, unambiguous interfaces ("contracts") for every tool the agent uses.
     - Example: Schema validation for inputs like user IDs prevents erroneous or imaginative inputs by the LLM.
     - Prevents the agent from making unsafe assumptions.

  3. **Retrieval Engineering**
     - Most agents use Retrieval Augmented Generation (RAG) to query relevant context dynamically.
     - Challenges include chunk sizing, embedding quality, and re-ranking retrieved documents.
     - The quality of retrieval sets the upper bound on agent performance.

  4. **Reliability Engineering**
     - Handle real-world issues such as API failures, timeouts, and cascading errors.
     - Techniques include retry logic with exponential backoff, timeouts, fallback paths, and circuit breakers.
     - Borrowed from decades of backend engineering practice.

  5. **Security and Safety**
     - Agents are vulnerable to attacks like prompt injection, where malicious inputs override system instructions.
     - Requires input validation, output filtering, and strict permission boundaries to prevent abuse or dangerous actions.
     - Applies traditional security principles to novel AI agent threat models.

  6. **Evaluation and Observability**
     - "You cannot improve what you cannot measure."
     - Instrument tracing of decisions, API calls, retrieval results, and model reasoning for debugging.
     - Use automated tests, metrics (success rate, latency, cost), and evaluation pipelines to monitor and improve agent behavior.

  7. **Product Thinking**
     - Design with the human user in mind: clear communication of agent capabilities, confidence levels, and failure modes.
     - Ensure graceful error handling, escalation paths to humans, and user trust.
     - Balances unpredictability of AI with good user experience (UX) design.

---

### Skill Stack Summary Table

| Skill Number | Skill Name                 | Key Focus Areas                                                                      | Analogous Discipline            |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- |
| 1            | System Design              | Architecture, data flow, fault tolerance, coordination of components                 | Backend system architecture     |
| 2            | Tool and Contract Design   | Defining strict input-output schemas, preventing ambiguity                           | API design, schema validation   |
| 3            | Retrieval Engineering      | Document chunking, embedding quality, re-ranking retrieved documents                 | Information retrieval, NLP      |
| 4            | Reliability Engineering    | Retry logic, timeouts, fallback mechanisms, circuit breakers                         | Backend reliability engineering |
| 5            | Security and Safety        | Input validation, output filtering, permission boundaries, prompt injection defenses | Security engineering            |
| 6            | Evaluation & Observability | Tracing, logging, metrics, automated testing                                         | Software observability, QA      |
| 7            | Product Thinking           | UX design, user trust, communication of uncertainty, graceful failure handling       | Product management, UX design   |

---

### Practical Recommendations for Current Prompt Engineers

- **Start by reviewing and tightening tool schemas:**  
  Read tool interface definitions aloud. Add strict types and examples to remove ambiguity and improve agent reliability.

- **Trace and debug failures beyond just prompt tweaking:**  
  Investigate retrieval quality, tool selection, and schema correctness first, as most errors stem from system issues rather than prompt wording.

- **Incremental improvements:**  
  One schema refinement and one failure trace per week can yield more learning than passive reading or prompt adjustments.

---

### Conclusion

- The job title "prompt engineer" is becoming outdated; the role is evolving into **agent engineering**, which demands a broad and deep set of skills encompassing software architecture, security, reliability, evaluation, and product design.
- **Building real-world AI agents requires system engineering disciplines, not just prompt crafting.**
- Those who adapt to this new skill stack will lead the development of functional, trustworthy AI agents, while those who remain focused on prompts alone will struggle to improve performance.

---

**Bold takeaway:**  
_The prompt engineer got us here; the agent engineer will take us forward._
