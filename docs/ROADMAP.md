# ROADMAP — MiniTask Canvas

## Phase 1: Canvas Foundation (In Progress)

**Goal:** Solid interactive canvas experience.

| # | Task | File | Status |
|---|------|------|--------|
| 1.1 | React Flow + Vite setup | package.json, vite.config.js | done |
| 1.2 | 3 custom node types (Circle/Rect/Diamond) | src/components/nodes/*.jsx | done |
| 1.3 | 4 smart handles ẩn/hiện (group-hover) | src/components/nodes/*.jsx | done |
| 1.4 | Drag/drop from Sidebar | src/components/Sidebar.jsx | done |
| 1.5 | Smoothstep edges + arrow marker | src/App.jsx | done |
| 1.6 | Edge selection visible (CSS highlight) | src/App.jsx, src/index.css | done |
| 1.7 | Inline edit (double-click node) | src/App.jsx | done |
| 1.8 | Export/Import JSON | src/App.jsx | done |
| 1.9 | **Edge reconnect (2 endpoint handles)** | src/App.jsx, src/components/edges/ | **priority** |
| 1.10 | **Custom edge with waypoint MVP** | src/components/edges/WorkflowEdge.jsx | **priority** |

**Acceptance criteria Phase 1:**
- [ ] Drag & drop node mới từ sidebar vào canvas
- [ ] Hover node -> hiện 4 handle ở 4 hướng
- [ ] Kéo từ handle source -> handle target tạo edge smoothstep có mũi tên
- [ ] Click edge -> highlight xanh + animation dash
- [ ] Double-click node -> popup sửa label
- [ ] Kéo đầu/cuối edge -> reconnect sang node khác
- [ ] Kéo waypoint trên edge -> bẻ cong line
- [ ] Export JSON toàn bộ canvas (nodes + edges + waypoints)

---

## Phase 2: Node Domain Model

**Goal:** Nodes carry business meaning (mode/status/priority).

| # | Task | File | Status |
|---|------|------|--------|
| 2.1 | Define NodeData TypeScript interface | src/types/workflow.ts (new) | pending |
| 2.2 | Rect mode: solo / delegate / scheduled (UI) | src/components/nodes/RectNode.jsx | pending |
| 2.3 | Rect status: pending / running / waiting / done / failed / cancelled | src/components/nodes/RectNode.jsx | pending |
| 2.4 | Rect priority: badge color | src/components/nodes/RectNode.jsx | pending |
| 2.5 | Circle SMART data fields | src/components/nodes/CircleNode.jsx | pending |
| 2.6 | Circle deadline validation (red border) | src/components/nodes/CircleNode.jsx | pending |
| 2.7 | Node edit modal (SMART form for Circle, mode selector for Rect) | src/components/NodeEditor.jsx (new) | pending |
| 2.8 | Diamond: condition text + edge labels | src/components/nodes/DiamondNode.jsx | pending |

**Acceptance criteria Phase 2:**
- [ ] Rect hiển thị đúng màu theo mode (solo=blue, delegate=purple, scheduled=gray)
- [ ] Rect delegate có avatar + progress bar
- [ ] Rect waiting có pulse animation + downstream edges nét đứt
- [ ] Circle thiếu deadline -> viền đỏ cảnh báo
- [ ] Circle có form SMART trong node editor
- [ ] Diamond có text condition hiển thị trên node

---

## Phase 3: Persistence

**Goal:** Save/load workflows from local storage -> Supabase.

| # | Task | File | Status |
|---|------|------|--------|
| 3.1 | Serialize canvas state to Workflow JSON | src/lib/serializer.ts (new) | pending |
| 3.2 | Deserialize Workflow JSON to canvas state | src/lib/serializer.ts | pending |
| 3.3 | LocalStorage auto-save (debounce 2s) | src/hooks/useAutoSave.ts (new) | pending |
| 3.4 | Workflow list sidebar (load/save/delete) | src/components/WorkflowList.jsx (new) | pending |
| 3.5 | Supabase client setup | src/lib/supabase.ts (new) | pending |
| 3.6 | CRUD API: workflows, nodes, edges | src/lib/api.ts (new) | pending |
| 3.7 | Load workflow from Supabase | src/App.jsx | pending |

**Acceptance criteria Phase 3:**
- [ ] Tự động lưu canvas mỗi 2s khi có thay đổi
- [ ] Có danh sách workflow đã lưu
- [ ] Load được workflow đã lưu lên canvas
- [ ] Export/Import qua JSON file

---

## Phase 4: Business Node Behaviors

**Goal:** Gamification & real-world operation features.

| # | Task | File | Status |
|---|------|------|--------|
| 4.1 | Drag avatar -> Rect = gán delegate | src/components/TeamSidebar.jsx (new) | pending |
| 4.2 | Right-click context menu (Freeze/Unfreeze/Change mode) | src/components/NodeContextMenu.jsx (new) | pending |
| 4.3 | Fog of war (mờ hóa flow tương lai) | src/App.jsx | pending |
| 4.4 | Timer SLA countdown trên Rect solo | src/components/nodes/RectNode.jsx | pending |
| 4.5 | Supabase Realtime sync (team updates) | src/hooks/useRealtime.ts (new) | pending |

**Acceptance criteria Phase 4:**
- [ ] Kéo avatar vào Rect -> node chuyển mode `delegate`, gán assignee
- [ ] Right-click Rect -> menu Freeze/Unfreeze/Change mode
- [ ] Scheduled node mờ đi, tới giờ thì sáng lên
- [ ] Solo node có đồng hồ đếm ngược deadline

---

## Phase 5: Workflow Engine

**Goal:** Advanced workflow logic.

| # | Task | File | Status |
|---|------|------|--------|
| 5.1 | Graph traversal utility (find downstream nodes) | src/lib/graph/traversal.ts (new) | pending |
| 5.2 | Panic button: insert critical node between 2 nodes | src/lib/graph/insert.ts (new) | pending |
| 5.3 | Deadline propagation (push downstream deadlines) | src/lib/graph/propagate.ts (new) | pending |
| 5.4 | Nested workflow: click node -> dive into sub-flow | src/components/SubFlowView.jsx (new) | pending |
| 5.5 | Breadcrumb navigation (parent flow -> child flow) | src/components/FlowBreadcrumb.jsx (new) | pending |
| 5.6 | Input/Output contract validation for sub-flow | src/lib/workflow/contract.ts (new) | pending |

**Acceptance criteria Phase 5:**
- [ ] Nút "Sự cố" tạo node CRITICAL
- [ ] Kéo node CRITICAL vào giữa edge -> tự động split edge
- [ ] Circle downstream tự động lùi deadline
- [ ] Click node có child_workflow_id -> zoom-in vào sub-flow
- [ ] Breadcrumb cho phép quay lại flow cha

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Canvas | @xyflow/react v12 |
| Frontend | React 18 + Vite |
| Styling | TailwindCSS 3 |
| Icons | lucide-react |
| State | React state (local), Supabase Realtime (future) |
| Backend | Supabase (PostgreSQL) |
| Animation | Framer Motion (Phase 4+) |
