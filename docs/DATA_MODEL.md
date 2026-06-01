# DATA MODEL — MiniTask Canvas Core

## Node Data Structure

```ts
type NodeType = 'circle' | 'rect' | 'diamond';

type NodeMode = 'solo' | 'delegate' | 'scheduled';
type NodeStatus = 'pending' | 'running' | 'waiting' | 'done' | 'failed' | 'cancelled';
type NodePriority = 'low' | 'normal' | 'high' | 'critical';

type CanvasNode = {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    mode?: NodeMode;
    status?: NodeStatus;
    priority?: NodePriority;
    assignee?: string;
    assigneeId?: string;
    progress?: number;
    deadline?: string | null;
    childWorkflowId?: string | null;
    metadata?: Record<string, unknown>;
  };
};
```

## Edge Data Structure

```ts
type EdgeData = {
  label?: string;
  condition?: string;
  waypoints?: Array<{ x: number; y: number }>;
};

type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  selected?: boolean;
  animated?: boolean;
  style?: Record<string, unknown>;
  markerEnd?: {
    type: string;
    width: number;
    height: number;
    color: string;
  };
  data?: EdgeData;
};
```

## Workflow Data Structure

```ts
type Workflow = {
  id: string;
  name: string;
  is_template: boolean;
  parent_node_id: string | null;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  created_at?: string;
  updated_at?: string;
};
```

## Rect Mode → UI Mapping

| mode | background | border | icon | animation |
|------|-----------|--------|------|-----------|
| `solo` | sky-50 | sky-300 | (none) | none |
| `delegate` | purple-50 | purple-300 | User avatar | progress bar |
| `scheduled` | slate-100 | slate-300 | Calendar | freeze / fade |
| (combined with status `waiting`) | amber-50 | amber-300 | AlertTriangle | pulse |

## Rect Status → UI Mapping

| status | effect |
|--------|--------|
| `pending` | default |
| `running` | border animation |
| `waiting` | pulse + downstream edges dashed |
| `done` | green check + opacity 0.8 |
| `failed` | red border + shake |
| `cancelled` | strike-through + opacity 0.5 |

## Circle SMART Fields

```ts
type CircleData = CanvasNode['data'] & {
  smart_specific?: string;
  smart_measurable?: string;
  smart_achievable?: string;
  smart_relevant?: string;
  smart_timebound?: string;
  deadline: string; // required for Circle
};
```

Validation rule: Circle without `deadline` -> red border warning.

## Database Schema (PostgreSQL / Supabase)

### Table `workflows`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto |
| name | varchar | workflow name |
| is_template | boolean | reusable template flag |
| parent_node_id | uuid FK | if this is a sub-workflow |
| nodes | jsonb | normalized node array |
| edges | jsonb | normalized edge array |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |

### Table `nodes`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | maps to CanvasNode.id |
| workflow_id | uuid FK | |
| type | varchar | circle / rect / diamond |
| label | varchar | display text |
| position_x | float | |
| position_y | float | |
| mode | varchar | solo / delegate / scheduled |
| status | varchar | pending / running / waiting / done / failed / cancelled |
| priority | varchar | low / normal / high / critical |
| assignee_id | uuid FK | user id |
| deadline | timestamptz | |
| child_workflow_id | uuid FK | nested workflow ref |
| metadata | jsonb | SMART fields, form data |

### Table `edges`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | maps to CanvasEdge.id |
| workflow_id | uuid FK | |
| source_node_id | uuid FK | |
| target_node_id | uuid FK | |
| source_handle | varchar | top / right / bottom / left |
| target_handle | varchar | top / right / bottom / left |
| data | jsonb | waypoints, label, condition |
