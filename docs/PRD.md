# PRD — MiniTask Workflow & Action Engine

## Tổng quan

Xây dựng module quản trị mục tiêu và giao việc trực quan hóa trên nền tảng Canvas (Infinite Board), áp dụng cơ chế **Gamification** để điều hành.

## Các thực thể cốt lõi

| Node | Ý nghĩa | Vai trò |
|------|---------|---------|
| **Circle** | Mục tiêu / Kết quả SMART | "Mỏ neo" của quy trình, không biến mất cho đến khi hoàn thành |
| **Rect** | Hành động / Trạm điều phối | Biến động cao, có thể thay thế, xóa bỏ, chuyển trạng thái |
| **Diamond** | Điểm rẽ nhánh / Quyết định | Logic phân luồng |

## Yêu cầu tính năng

### 1. Trải nghiệm vẽ Canvas (Draw.io Style)

- **Smart Handles:** 4 điểm neo ẩn/hiện khi hover chuột (Top, Right, Bottom, Left)
- **Orthogonal Routing:** Đường nối smoothstep, mũi tên ArrowClosed
- **Inline Editing:** Double-click node để sửa nội dung
- **Edge Reconnect:** Kéo đầu/cuối edge sang node khác
- **Waypoint:** Bẻ cong edge tự do, thêm/xóa điểm bẻ

### 2. Action Hub — Khối Rect

4 chế độ vận hành (mode) + 6 trạng thái (status):

| Mode | Ý nghĩa | UI |
|------|---------|-----|
| `solo` | Tự làm | Viền xanh, đếm ngược SLA |
| `delegate` | Giao việc | Tím, avatar người nhận, progress bar |
| `scheduled` | Chờ lịch | Xám, freeze, tự sáng khi tới giờ |

| Status | Ý nghĩa | Hiệu ứng |
|--------|---------|----------|
| `pending` | Chưa bắt đầu | Default |
| `running` | Đang thực hiện | Border animation |
| `waiting` | Đợi phản hồi | Pulse + downstream edges nét đứt |
| `done` | Hoàn thành | Green check |
| `failed` | Thất bại | Red + shake |
| `cancelled` | Đã hủy | Strike-through |

### 3. Quản lý Mục tiêu SMART — Khối Circle

- Form SMART: Specific, Measurable, Achievable, Relevant, Time-bound
- Deadline bắt buộc, thiếu -> viền đỏ
- Quá hạn -> viền đỏ + pulse

### 4. Quy trình lồng nhau (Nested Workflow)

- Node có `child_workflow_id` -> click để zoom-in vào sub-flow
- Breadcrumb để quay lại flow cha
- Input/Output contract cho tính toàn vẹn

### 5. Panic Button (Khách hàng đột xuất)

- Tạo node `CRITICAL`
- Chèn vào giữa edge hiện tại (tự động split)
- Đẩy lùi deadline downstream circles

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Canvas Engine | @xyflow/react v12 |
| Frontend | React 18 + Vite |
| Styling | TailwindCSS 3 |
| Icons | lucide-react |
| Backend | Supabase (PostgreSQL) |
| Animation | Framer Motion (Phase 4+) |
