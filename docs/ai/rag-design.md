# Retrieval-Augmented Generation (RAG) Design

## Hybrid Implementation

InsightLoop utilizes a hybrid approach to Retrieval-Augmented Generation, combining deterministic data aggregation with semantic vector search, depending on what the LLM determines is necessary to answer the user's query.

### 1. Deterministic Retrieval (Tool Calling)
For queries related to strict metrics (e.g., "What were the biggest blockers for Project Alpha this week?"), the LLM invokes tools like `getProjectInsights` or `getTeamSummary`.
- These tools query MongoDB using standard filters (dates, project IDs).
- **Advantage**: 100% accurate for tabular/metric data. No hallucination risk.

### 2. Semantic Vector Search (RAG)
For broader, qualitative queries (e.g., "Has anyone struggled with React Native setup in the past 6 months?"), the LLM can invoke the `searchReportKnowledge` tool.

#### Vector Pipeline Workflow
1. **Embedding Generation**: The `embeddingService` translates the user's semantic query into a dense vector embedding.
2. **Vector Store**: A `vectorDocumentRepository` performs a cosine similarity search against pre-embedded report chunks (e.g., tasks, blockers) stored in the database.
3. **Filtering**: The vector search can be pre-filtered by `projectId` or `weekStart` to narrow down the context window.
4. **Augmentation**: The top-K most relevant chunks are returned to the LLM.
5. **Synthesis**: The LLM synthesizes this unstructured text context to formulate the final answer.

**Advantages of this Architecture:**
- By exposing both exact-match tools and fuzzy-search RAG tools, the agent can choose the optimal retrieval strategy based on the specific query intent, preventing token exhaustion and maximizing accuracy.
