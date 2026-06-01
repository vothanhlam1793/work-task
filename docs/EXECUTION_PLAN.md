# EXECUTION PLAN — Dev Task List

## TASK A: Edge Reconnect (2 endpoint handles)

**File cần tạo/sửa:**

| Action | File |
|--------|------|
| SỬA | src/App.jsx |
| TẠO | src/components/edges/ReconnectHandle.jsx |
| TẠO | src/components/edges/ReconnectHandle.css |

**Chi tiết từng file:**

### A1. src/components/edges/ReconnectHandle.jsx (TẠO MỚI)

```jsx
// Component chấm xanh hiện ở 2 đầu edge khi hover
// Props: position (source|target), edgeId, onReconnect
// Khi kéo chấm -> tạo connection line tạm
// Khi thả vào handle node khác -> gọi onReconnect
```

**Acceptance:**
- [ ] Hover edge -> 2 chấm xanh (8x8px) hiện ở đầu source và cuối target
- [ ] Kéo chấm source -> line tạm xuất hiện như khi nối dây mới
- [ ] Thả vào handle hợp lệ -> edge đổi endpoint
- [ ] Thả ra ngoài -> hủy reconnect, giữ nguyên edge

### A2. src/App.jsx (SỬA)

Thêm 3 handler:
```js
onReconnectStart  -> (event, edge, handleType) => void
onReconnect       -> (oldEdge, newConnection) => setEdges(...)
onReconnectEnd    -> (event, edge, handleType, didDrop) => void
```

**Acceptance:**
- [ ] `onReconnect` validate: target handle phải khác type với source handle
- [ ] Sau reconnect, edge giữ nguyên style + arrow
- [ ] Console log rõ khi reconnect thành công

---

## TASK B: Custom Edge with Waypoint MVP

**File cần tạo/sửa:**

| Action | File |
|--------|------|
| TẠO | src/components/edges/WorkflowEdge.jsx |
| TẠO | src/components/edges/WorkflowEdge.css |
| SỬA | src/App.jsx |

### B1. src/components/edges/WorkflowEdge.jsx (TẠO MỚI)

Kế thừa `BaseEdge` từ @xyflow/react.

**Props nhận:**
- `id`, `source`, `target`, `sourceX`, `sourceY`, `targetX`, `targetY`
- `selected`, `data` (chứa `waypoints`)

**Logic:**
```
1. Build path từ waypoints (hoặc straight line nếu không có waypoint)
2. Render SVG path với style theo selected state
3. Khi selected && có waypoints -> render các circle nhỏ tại mỗi waypoint
4. Các circle này có thể kéo (onMouseDown + onMouseMove + onMouseUp)
5. Double-click vào path (giữa 2 waypoint) -> thêm waypoint mới
6. Right-click waypoint -> xóa
```

**Cấu trúc data:**
```js
edge.data = {
  waypoints: [
    { x: 150, y: 250 },
    { x: 300, y: 250 },
  ]
}
```

**Edge types trong App:**
```js
import { WorkflowEdge } from './components/edges/WorkflowEdge';
const edgeTypes = { workflowEdge: WorkflowEdge };
```

### B2. src/components/edges/WorkflowEdge.css (TẠO MỚI)

```css
.workflow-edge-path { transition: stroke 0.2s, stroke-width 0.2s; }
.workflow-edge-path.selected { stroke: #60a5fa; stroke-width: 3; }
.waypoint-dot { cursor: move; fill: #60a5fa; stroke: white; stroke-width: 2; }
.waypoint-dot:hover { fill: #3b82f6; r: 6; }
```

**Acceptance:**
- [ ] Edge path tính toán đúng từ source -> waypoints -> target
- [ ] Edge selected -> hiện waypoint dots
- [ ] Kéo waypoint dot -> reshape edge path real-time
- [ ] Double-click đoạn path -> thêm waypoint mới
- [ ] Right-click waypoint dot -> xóa waypoint đó
- [ ] Waypoint lưu vào `edge.data.waypoints`
- [ ] Export JSON giữ nguyên waypoint data
- [ ] Load JSON có waypoint -> hiển thị đúng

### B3. src/App.jsx (SỬA)

```diff
+ import { WorkflowEdge } from './components/edges/WorkflowEdge';

+ const edgeTypes = { workflowEdge: WorkflowEdge };

  const defaultEdgeOptions = {
-   type: 'smoothstep',
+   type: 'workflowEdge',
    ...
  };

  <ReactFlow
+   edgeTypes={edgeTypes}
    ...
  >
```

---

## TASK C: Rect Mode + Status Upgrade

**File cần sửa:**

| Action | File |
|--------|------|
| SỬA | src/components/nodes/RectNode.jsx |

**Các mode hiển thị:**

```js
getModeStyle(mode, status, priority) -> {
  bgColor, borderColor, textColor,
  icon: User | Calendar | AlertTriangle,
  animation: none | pulse | freeze
}
```

**Mapping:**

| mode | status | bg | border | icon | animation |
|------|--------|----|--------|------|-----------|
| solo | pending | sky-50 | sky-300 | — | — |
| solo | running | sky-100 | sky-400 | — | border anim |
| solo | waiting | amber-50 | amber-300 | AlertTriangle | pulse |
| delegate | pending | purple-50 | purple-300 | User | — |
| delegate | running | purple-100 | purple-400 | User | progress bar |
| scheduled | pending | slate-100 | slate-300 | Calendar | opacity-60 |
| scheduled | running | slate-200 | slate-400 | Calendar | opacity-100 |
| (any) | done | green-50 | green-300 | Check | opacity-80 |
| (any) | failed | red-50 | red-300 | XCircle | shake |
| (any) | cancelled | gray-100 | gray-200 | — | line-through |

**Footer hiển thị:**
- Deadline (nếu có)
- Assignee (nếu có, mode delegate)
- Progress bar (mode delegate, status running)

**Acceptance:**
- [ ] Rect có thể set mode qua `data.mode`
- [ ] Rect có thể set status qua `data.status`
- [ ] Rect có thể set priority qua `data.priority`
- [ ] Giao diện thay đổi theo mode/status
- [ ] Progress bar hiển thị khi delegate + running
- [ ] Pulse animation khi status waiting
- [ ] Downstream edge chuyển nét đứt khi status waiting (done in edge task)

---

## TASK D: Circle SMART + Deadline Validation

**File cần sửa:**

| Action | File |
|--------|------|
| SỬA | src/components/nodes/CircleNode.jsx |

**Hiển thị:**
- Deadline badge ở góc trên phải
- Nếu `data.deadline == null` -> viền đỏ cảnh báo
- Nếu deadline đã qua (past) -> viền đỏ + icon AlertTriangle

**Acceptance:**
- [ ] Circle có deadline hiển thị ngày
- [ ] Circle thiếu deadline -> viền đỏ + text "Cần hạn chót"
- [ ] Circle quá deadline -> viền đỏ + pulse

---

## TASK E: Node Editor Modal

**File cần tạo:**

| Action | File |
|--------|------|
| TẠO | src/components/NodeEditor.jsx |

**Nội dung form theo loại node:**

**Circle:**
- Label
- SMART fields: Specific, Measurable, Achievable, Relevant, Time-bound
- Deadline (date picker, required)
- Status

**Rect:**
- Label
- Mode dropdown (solo / delegate / scheduled)
- Status dropdown
- Priority dropdown
- Assignee selector (nếu mode = delegate)
- Deadline (optional)

**Diamond:**
- Label (điều kiện)
- Yes/No branch labels

**Acceptance:**
- [ ] Double-click node -> mở NodeEditor thay vì textarea đơn giản
- [ ] Form thay đổi theo loại node
- [ ] Save -> cập nhật node.data

---

## FILE STRUCTURE SAU KHI HOÀN THÀNH

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── types/
│   └── workflow.ts                    (Phase 2)
├── components/
│   ├── Sidebar.jsx
│   ├── NodeEditor.jsx                 (Task E)
│   ├── NodeContextMenu.jsx            (Phase 4)
│   ├── SubFlowView.jsx                (Phase 5)
│   ├── FlowBreadcrumb.jsx             (Phase 5)
│   ├── WorkflowList.jsx               (Phase 3)
│   ├── TeamSidebar.jsx                (Phase 4)
│   ├── nodes/
│   │   ├── CircleNode.jsx
│   │   ├── RectNode.jsx
│   │   └── DiamondNode.jsx
│   └── edges/
│       ├── WorkflowEdge.jsx           (Task B)
│       ├── WorkflowEdge.css           (Task B)
│       ├── ReconnectHandle.jsx        (Task A)
│       └── ReconnectHandle.css        (Task A)
├── hooks/
│   ├── useAutoSave.ts                 (Phase 3)
│   └── useRealtime.ts                 (Phase 4)
└── lib/
    ├── serializer.ts                  (Phase 3)
    ├── supabase.ts                    (Phase 3)
    ├── api.ts                         (Phase 3)
    ├── graph/
    │   ├── traversal.ts               (Phase 5)
    │   ├── insert.ts                  (Phase 5)
    │   └── propagate.ts               (Phase 5)
    └── workflow/
        └── contract.ts                (Phase 5)
```

---

## THỨ TỰ IMPLEMENT

```
Task A (Edge Reconnect)  ──┐
                            ├──> Có thể làm song song
Task B (Waypoint Edge)    ──┘

Sau A+B done:
Task C (Rect Mode) ──> Task D (Circle SMART) ──> Task E (NodeEditor)

Sau C+D+E done:
Phase 3 (Persistence)
Phase 4 (Gamification)
Phase 5 (Workflow Engine)
```
