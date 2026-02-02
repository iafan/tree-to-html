```
src/
├── engine/                 # Core event-driven execution engine
│   ├── EventBus.ts        # Pub/sub for port-based file events + UI callbacks
│   ├── WorkflowEngine.ts  # Orchestrator: creates runtimes & wires connections
│   ├── ScriptExecutor.ts  # Sandboxed JavaScript execution for processors
│   ├── events.ts          # Event type definitions (FileEvent, PortId)
│   └── runtime/           # Runtime node classes
│       ├── EntryNodeRuntime.ts      # Entry point injects files
│       ├── ProcessorNodeRuntime.ts  # Executes scripts, routes to ports
│       ├── ProjectNodeRuntime.ts    # Manages multi-step processing
│       ├── ExitNodeRuntime.ts       # Marks files complete
│       └── ConnectionRuntime.ts     # Forwards events between ports
├── workflowNodes/         # Pure node models (no rendering)
│   ├── types.ts           # WorkflowNode interface
│   ├── nodes/             # Node model creators
│   └── createNodesFromConfig.ts
├── components/            # React visualization components
│   ├── WorkflowCanvas.tsx # Main SVG canvas
│   ├── NodeRenderer.tsx   # Dispatches to node components
│   ├── ProjectNode.tsx    # Project visualization
│   ├── ProcessorNode.tsx  # Processor visualization
│   ├── EntryPointNode.tsx
│   ├── ExitPointNode.tsx
│   └── AnimatedPath.tsx   # SVG path animations
├── context/               # React context for state
│   └── WorkflowContext.tsx  # Bridges engine & UI
├── graph/                 # Graph topology analysis
│   └── WorkflowGraph.ts   # Query interface for workflow structure
├── pathfinding/           # A* path routing for connections
│   ├── GridManager.ts
│   ├── AStarSolver.ts
│   └── PathRenderer.ts
├── types/                 # Core type definitions
│   └── index.ts           # WorkflowFile, Project, EventProcessor, etc.
└── config/                # Configuration & initialization
    ├── workflowLoader.ts  # Transforms JSON -> runtime config
    └── nodeTypeRegistry.tsx # Node type registration & dispatch
```
