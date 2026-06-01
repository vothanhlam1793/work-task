# TEST PLAN — Playwright

## Mục tiêu

Thiết lập sẵn bộ test Playwright để:

- kiểm tra các hành vi đang tồn tại trong canvas hiện tại
- giữ chỗ chi tiết cho các acceptance criteria trong `docs/ROADMAP.md` và `docs/EXECUTION_PLAN.md`
- giúp bắt đầu test ngay khi từng feature được code xong, chỉ cần bỏ `test.skip` hoặc cập nhật selector nhỏ

## Phạm vi hiện tại

### Test đang chạy được ngay

File: `tests/playwright/smoke/current-workflow.spec.js`

- render dashboard shell, sidebar, sample nodes
- double-click node để mở popup sửa nội dung
- lưu nhãn mới cho node
- hủy sửa không làm đổi dữ liệu
- export workflow bằng alert + console log + `window.parent.postMessage`
- reset về luồng mẫu sau khi chỉnh sửa

### Test spec đã dựng sẵn nhưng đang `skip`

Các file dưới `tests/playwright/specs/` là acceptance spec cho roadmap:

- `foundation-roadmap.spec.js`: edge create, edge reconnect, waypoint
- `domain-roadmap.spec.js`: rect mode/status/priority, circle deadline, node editor typed form
- `persistence-roadmap.spec.js`: autosave, workflow list, load saved data
- `advanced-roadmap.spec.js`: delegate drag-drop, panic button, workflow engine

Các test này cố ý `skip` vì code hiện tại chưa có implementation tương ứng.

## Cấu trúc thư mục

```text
tests/playwright/
├── fixtures/
│   └── workflow-helpers.js
├── smoke/
│   └── current-workflow.spec.js
└── specs/
    ├── advanced-roadmap.spec.js
    ├── domain-roadmap.spec.js
    ├── foundation-roadmap.spec.js
    └── persistence-roadmap.spec.js
```

## Cài đặt

1. Cài dependency:

```bash
npm install
```

2. Cài browser cho Playwright:

```bash
npx playwright install chromium
```

## Cách chạy

```bash
npm run test:e2e
```

Chạy giao diện Playwright UI:

```bash
npm run test:e2e:ui
```

Chạy có mở browser:

```bash
npm run test:e2e:headed
```

Debug từng bước:

```bash
npm run test:e2e:debug
```

## Cách bộ test hoạt động

- `playwright.config.js` tự chạy Vite dev server ở `127.0.0.1:4173`
- smoke suite dùng các selector ổn định như `data-testid` thay vì phụ thuộc class Tailwind
- helper `stubParentPostMessage()` thay `window.parent.postMessage` bằng bộ nhớ tạm để assert payload export
- helper `stubAlerts()` tự accept `alert()` để test không bị treo

## Gợi ý khi code feature mới

### 1. Giữ selector ổn định

Ưu tiên thêm `data-testid` cho các phần tử có tương tác mạnh:

- node wrapper
- edge reconnect handle
- waypoint dot
- progress bar
- autosave status
- workflow list item

Ví dụ:

```jsx
<div data-testid={`node-${id}`} data-mode={data.mode} data-status={data.status}>
```

### 2. Bỏ `skip` theo từng feature

Khi xong Task A hoặc B trong `docs/EXECUTION_PLAN.md`, bỏ `skip` tương ứng trong:

- `tests/playwright/specs/foundation-roadmap.spec.js`

Khi xong Task C, D, E, bỏ `skip` trong:

- `tests/playwright/specs/domain-roadmap.spec.js`

### 3. Thêm assertion vào export payload

Khi edge waypoint hoặc node domain data đã có, mở rộng assertion ở smoke/export test:

```js
expect(messages[0].payload.edges[0].data.waypoints).toEqual([
  { x: 150, y: 250 },
]);
```

## Mapping với docs hiện có

- `docs/PRD.md`: hành vi nghiệp vụ mức sản phẩm
- `docs/ROADMAP.md`: roadmap phase-based
- `docs/EXECUTION_PLAN.md`: acceptance chi tiết theo task
- `tests/playwright/specs/*.spec.js`: chuyển acceptance trong docs thành executable spec skeleton

## Lưu ý quan trọng

- Playwright mạnh nhất cho flow UI/integration. Với các utility thuần dữ liệu về sau như serializer, graph traversal, deadline propagation, vẫn nên bổ sung unit test runner riêng như Vitest.
- Hiện tại repo chưa có Vitest/Jest, nên bộ này được dựng để test hành vi người dùng trên canvas trước.

## Unit Test Bổ Sung

Repo hiện đã có thêm lớp unit/component test bằng Vitest tại `tests/unit/`.

### Chạy unit test

```bash
npm run test:unit
```

### Watch mode

```bash
npm run test:unit:watch
```

### Các key unit test hiện có

- `tests/unit/lib/serializer.test.js`
  kiểm tra serialize/deserialize workflow data
- `tests/unit/lib/traversal.test.js`
  kiểm tra downstream/upstream traversal và chống loop
- `tests/unit/lib/propagate.test.js`
  kiểm tra propagate/reset deadline
- `tests/unit/lib/insert.test.js`
  kiểm tra split edge khi insert node vào giữa flow
- `tests/unit/components/NodeEditor.test.jsx`
  kiểm tra save payload cho Circle/Rect/Diamond editor
- `tests/unit/components/Nodes.test.jsx`
  kiểm tra render quan trọng của `CircleNode` và `RectNode`
