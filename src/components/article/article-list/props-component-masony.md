Dưới đây là “bản dịch” ngắn gọn các props hay gặp của **`MasonryInfiniteGrid`** (thư viện `@egjs/react-infinitegrid`). Mình nhóm theo chủ đề để bạn dễ tra.

# Nhóm điều khiển bố cục (layout)

-   **`gap`**: khoảng cách (px) giữa các item.
-   **`align`**: căn lề hàng/cột: `"start" | "center" | "end" | "justify"`. (Bạn đang dùng `"center"`.)
-   **`horizontal`**: `true` để cuộn theo trục ngang (masonry dọc theo trục Y); mặc định là dọc (cuộn dọc).
-   **`column`**: số cột cố định. Nếu set, grid chia đều thành N cột.
-   **`columnSize`**: kích cỡ CHUẨN của cột (px). Thường dùng khi bạn quy định width item theo cột.
-   **`columnSizeRatio`**: tỉ lệ co giãn cột so với `columnSize` khi container thay đổi (giúp responsive).
-   **`maxStretchColumnSize`**: giới hạn cột kéo giãn tối đa khi dùng `columnSizeRatio`.
-   **`useFit`**: `true` thì sau khi tính toán sẽ “fit” lại để giảm khoảng trống (compact hơn).
-   **`useRoundedSize`**: làm tròn kích thước (tránh lẻ px gây rung giao diện).
-   **`defaultDirection`**: `"start" | "end"` – hướng xếp item mặc định khi chưa có dữ liệu layout trước đó.
-   **`percentage`**: cho phép dùng đơn vị `%` trong kích thước item (thay vì px).
-   **`contentAlign`**: căn nội dung trong item khi kích thước item > nội dung.

# Nhóm cuộn vô hạn & ảo hóa (infinite/virtualization)

-   **`scrollContainer`**: element/Ref dùng làm container cuộn (mặc định là `window`). Bạn đang trỏ `scrollerRef`.
-   **`threshold`**: ngưỡng (px) để kích hoạt nạp thêm khi gần chạm đáy/đầu. (Bạn đang set `10`.)
-   **`onRequestAppend`**: callback khi grid cần nạp thêm dữ liệu ở cuối (infinite scroll). (Bạn đang dùng `handleRequestAppend`.)
-   **`onRequestPrepend`**: callback yêu cầu nạp thêm ở đầu danh sách.
-   **`useRecycle`**: `true` thì tái sử dụng DOM node khi cuộn (giảm số lượng node -> mượt hơn). (Bạn đang bật.)
-   **`placeholder`**: phần tử “xương cá” hiển thị tạm thay item khi đang tải.
-   **`loading`**: đánh dấu trạng thái đang tải; có thể dùng để hiện spinner/placeholder.
-   **`onChangeScroll`**: callback khi vị trí cuộn/khung nhìn thay đổi (hữu ích cho analytics/lazy tasks).

# Nhóm tối ưu/hiệu năng

-   **`autoResize`**: tự lắng nghe thay đổi kích thước container và relayout.
-   **`useResizeObserver`**: dùng ResizeObserver (chính xác hơn `resize` event) để phát hiện thay đổi kích thước.
-   **`resizeDebounce`** / **`maxResizeDebounce`**: trì hoãn relayout khi resize (ms) để tránh reflow liên tục.
-   **`columnCalculationThreshold`**: ngưỡng thay đổi kích thước cần thiết trước khi tính lại số cột (giảm layout thrash).
-   **`renderOnPropertyChange`**: khi props liên quan layout đổi, có re-render/relayout ngay không.
-   **`preserveUIOnDestroy`**: giữ nguyên DOM hiện tại khi unmount (đôi khi hữu ích nếu chuyển trang mượt).

# Nhóm nhận dạng & kích thước item

-   **`isConstantSize`**: mọi item có kích thước giống nhau (grid bỏ qua đo đạc -> nhanh).
-   **`isEqualSize`**: mọi item có **cùng width** (hoặc height) theo trục chính; khác với `isConstantSize` (không bắt buộc diện tích bằng nhau).
-   **`itemBy` / `infoBy`**: cách lấy key/thông tin từ data để grid theo dõi từng item (khi bạn cung cấp data model).
-   **`appliedItemChecker`**: hàm kiểm tra item đã được áp layout hay chưa (tuỳ biến nâng cao).

# Nhóm sự kiện vòng đời render

-   **`onRenderComplete`**: gọi khi hoàn tất render & layout (biết lúc nào ảnh/DOM ổn định).
-   **`onContentError`**: lỗi khi tải nội dung (ví dụ ảnh fail) – có thể set size fallback & relayout.
-   **`externalItemRenderer`** / **`renderer`**: cơ chế render item từ ngoài (nâng cao, ít dùng trong React).
-   **`externalContainerManager`**: quản lý container từ ngoài (nâng cao).

# Nhóm DOM/thuộc tính

-   **`container`**: chỉ định container phần tử cụ thể (nếu không dùng mặc định wrapper của component).
-   **`containerTag` / `tag`**: thẻ HTML cho container (div, ul, …).
-   **`attributePrefix`**: prefix cho data-attributes do InfiniteGrid gắn (tránh xung đột).
-   **`observeChildren`**: quan sát thay đổi con DOM và relayout khi nội dung đổi.

# Nhóm grouping & status

-   **`groupBy`**: hàm/khóa để gán **groupKey** cho item (hữu ích khi append theo trang/nhóm).
-   **`outlineSize` / `outlineLength`**: kích thước/độ dài vùng “outline” ảo để tính toán vị trí khi prepend/append (tối ưu cuộn vô hạn).
-   **`status`**: snapshot trạng thái layout hiện tại (dùng để lưu/khôi phục vị trí grid khi rời trang/quay lại).
-   **`key`**: React key cho component (không phải key của item).

---

## Giải thích nhanh cho đoạn code của bạn

```tsx
<MasonryInfiniteGrid
    ref={gridRef}
    className="relative"
    gap={gapPx} // khoảng cách giữa item
    align="center" // căn các cột vào giữa container
    scrollContainer={scrollerRef} // cuộn trong div bọc, không dùng window
    threshold={10} // gần chạm đáy 10px sẽ gọi onRequestAppend
    onRequestAppend={handleRequestAppend} // load thêm bài viết
    useRecycle={true} // ảo hóa, tái sử dụng DOM node khi cuộn
>
    {articles.map((a) => (
        <div key={a.id} style={{ width: `${columnWidthPx}px` }}>
            {/* width item = columnWidthPx; chiều cao phụ thuộc ảnh -> masonry */}
        </div>
    ))}
</MasonryInfiniteGrid>
```

## Tips thực tế

-   Nếu mỗi thẻ có chiều cao khó đoán (ảnh lazy), hãy đảm bảo ảnh có `width/height` hoặc tỷ lệ (CSS `aspect-ratio`) để grid đo nhanh, tránh nhảy layout.
-   `scrollContainer`: luôn truyền đúng ref của phần tử cuộn; nếu không, sự kiện nạp thêm có thể không kích hoạt.
-   Infinite list mượt: bật `useRecycle`, dùng `placeholder` cho các batch mới, và debounce resize ~`100–200ms`.
-   Nếu bạn biết rõ mọi item cùng kích thước: bật `isConstantSize` để tăng tốc đáng kể.

Nếu bạn muốn, mình có thể đề xuất cấu hình tối ưu dựa trên số cột mong muốn, chiều rộng container và kích thước ảnh bạn đang dùng.
