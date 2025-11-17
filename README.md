# 1. Setup
### 1.1 Install package
  ```
  npm install
  ```

### 1.2 Run trên môi trường local
- Cần mở 2 tab cmd
  - Khởi tạo server, khi nào ghép theme không cần chạy cái này nữa
  ```
  npm run dev
  ```

  - Lệnh này để biên dịch file main.scss sang styles.min.css
  ```
  npm run watch
  ```

### 1.3 Run trên môi trường server (Ghép theme)
  - Chỉ cần chạy lệnh để biên dịch ra file scss (nếu cần):
  ```
  npm run watch
  ```
  - Trên `flycms-theme-developer` chạy lệnh sync lên server:
  ```
  php theme dev ../folder-theme
  ```

### 1.4 Build
  - Render ra file html thuần:
  ```
  npm run build
  ```

# 2. Structure
```
flycms-theme-base/
├── assets/                         # Thư mục chứa tài nguyên tĩnh (CSS, JS, images...)
│   ├── css/
│   │   ├── build.css
│   │   ├── build.css.map
│   │   ├── config.css
│   │   ├── styles.min.css
│   │   └── tailwind.css
│   ├── js/
│   │   └── main.js
│   ├── scss/
│   │   ├── main.scss
│   │   ├── _variables.scss
│   │   ├── _common.scss
│   │   └── components/
│   │       ├── _all.scss
│   └── images/
│
├── views/                          # Thư mục chứa tất cả các file HTML (page, component, element)
│   ├── index.html                  # Trang chủ
│   ├── tag.html                    # Trang tag
│   ├── page.html                   # Trang page
│   ├── post.html                   # Trang post
│   ├── error.html                  # Trang lỗi
│   ├── @pages/                     # Custom pages (url sẽ có dạng: `/pages/custom-page`)
│   ├── components/                 # Component HTML (navbar, card, section_1...)
│   │   ├── navbar.html
│   │   ├── card.html
│   │   └── section_1.html
│   ├── elements/                   # Element HTML nhỏ (tag, button, ...)
│   │   ├── tag.html
│   │   └── text_head.html
│   └── layouts/                    # Layout HTML (nếu có)
│       └── default.html
│
├── theme-designs/                  # Thư mục chứa các thiết kế (hình ảnh tham khảo cho UI)
│   ├── components/
│   │   ├── card.png
│   │   ├── navbar.png
│   │   └── section_1.png
│   └── elements/
│       ├── tag_1.png
│       └── text_head.png
│
├── vite.config.js                  # Cấu hình Vite + LiquidJS
├── package.json                    # Cấu hình npm và dependencies
├── README.md                       # Tài liệu hướng dẫn
```

### Mô tả chi tiết:
- **assets/**: Chứa toàn bộ tài nguyên tĩnh (CSS, JS, images, SCSS...)
- **views/**: Chứa tất cả các file HTML (page, component, element, layout)
  - `index.html`, `tag.html`, ...: Các trang chính
  - `components/`, `elements/`: Component và element HTML tái sử dụng
  - `layouts/`: Layout HTML (nếu dùng)
- **theme-designs/**: Chứa hình ảnh thiết kế UI để tham khảo khi code

# 4. Các bước tiến hành
### 4.1. Chuẩn bị thiết kế
- Phân tích website để xác định các element, component cần thiết.
- Chụp ảnh từng element, component và đặt tên theo đúng file HTML sẽ tạo.
- Copy ảnh vào thư mục tương ứng trong `theme-designs/components` hoặc `theme-designs/elements`.

### 4.2. Khởi tạo file HTML
- Tạo các file `.html` (nếu chưa có) trong thư mục `views/components` và `views/elements` tương ứng với tên ảnh trong `theme-designs`.
- Có thể sử dụng AI với lệnh:
  ```
  Hãy tạo các file .html (nếu chưa có) trong folder views/components, views/elements tương ứng với tên ảnh trong folder theme-designs/components và theme-designs/elements
  ```

### 4.3. Chuyển đổi thiết kế sang code HTML/CSS
- Sử dụng AI (Copilot web: https://github.com/copilot) để chuyển hình ảnh sang code HTML/CSS:
  1. Đối với **element**:
      - Upload ảnh lên AI và yêu cầu:
        ```
        Hãy phân tích hình ảnh sau và chuyển sang html css sử dụng tailwind
        ```
      - Copy code vào file `.html` tương ứng trong `views/elements`, kiểm tra và chỉnh sửa nếu cần. Đảm bảo responsive.
  2. Đối với **component**:
      - Làm tương tự như element.
      - Nếu component có sử dụng element/component con đã có sẵn, thay thế phần đó bằng:
        ```html
        {% include 'elements/<element>.html' %}
        ```
      - Có thể yêu cầu AI trên IDE thực hiện thay thế hoặc tự thay thủ công.

### 4.4. Chuẩn hóa class và tách style SCSS
- Chuyển các class Tailwind trong file HTML sang file SCSS tương ứng sử dụng cú pháp @apply:
  1. Yêu cầu AI trên IDE:
      ```
      Hãy tạo file .scss tương ứng trong folder assets/scss và chỉ chuyển các class tailwind sang với các yêu cầu sau: sử dụng cú pháp @apply, đặt tên class theo quy tắc BEM và thay thế lại tên class trong file html cho phù hợp
      ```
  2. Review lại code, yêu cầu AI chỉnh sửa/xóa class thừa nếu cần.

### 4.5. Lưu ý khi thực hiện
- Thực hiện tuần tự từng element/component, không gộp nhiều bước để tránh sai sót.
- Luôn kiểm tra lại code, responsive và chuẩn hóa class/style sau mỗi bước.
- Ghi chú lại các vấn đề phát sinh để tối ưu quy trình.

# 5. Yêu cầu về SEO

### 5.1. Thẻ tiêu đề (Title tag):
- Phải có thẻ `<title>` duy nhất trong mỗi trang
- Độ dài tối ưu: 50-60 ký tự
- Nội dung ngắn gọn, mô tả đúng chủ đề trang
- Ví dụ: `<title>Crypto News - Tin tức tiền điện tử mới nhất</title>`

### 5.2. Thẻ mô tả meta (Meta Description):
- Sử dụng thẻ `<meta name="description" content="...">`
- Độ dài tối ưu: 150-160 ký tự
- Mô tả ngắn gọn nội dung trang, thu hút người dùng click
- Ví dụ: `<meta name="description" content="Cập nhật tin tức tiền điện tử mới nhất, giá Bitcoin, Ethereum và các altcoin. Phân tích thị trường crypto hàng ngày.">`

### 5.3. Thẻ Heading (H1, H2, H3...):
- Trong 1 trang phải 1 thẻ `<h1>` duy nhất mô tả trang
- Nếu thiết kế không có chỗ để add thẻ `<h1>` thì add như sau `<h1 class="hidden">Tin tức tiền điện tử mới nhất</h1>` để ngay sau thẻ `<body>`
- Sử dụng các thẻ `<h2>`, `<h3>`, `<h4>` để phân chia nội dung theo mức độ quan trọng
- Thẻ `h1` chỉ được xuất hiện 1 lần, còn các thẻ khác có thể xuất hiện nhiều lần
- Chứa từ khóa liên quan đến nội dung
- Ví dụ:
  ```html
  <h1>Tin tức tiền điện tử mới nhất</h1>
  <h2>Giá Bitcoin hôm nay</h2>
  <h3>Phân tích thị trường</h3>
  ```

### 5.4. Thuộc tính cho ảnh:
- Mỗi thẻ `<img>` cần có các thuộc tính:
  - `alt`: Mô tả hình ảnh (có thể bỏ trống giá trị nhưng bắt buộc phải có thuộc tính này)
  - `title`: Tiêu đề hình ảnh (có thể bỏ trống giá trị nhưng bắt buộc phải có thuộc tính này)
  - `loading="lazy"`: Lazy loading cho tất cả ảnh
  - `width` và `height`: Kích thước ảnh (khuyến nghị)
- Ví dụ:
  ```html
  <img src="/images/bitcoin-chart.png" 
       alt="Biểu đồ giá Bitcoin" 
       title="Biểu đồ giá Bitcoin hôm nay"
       loading="lazy" 
       width="800" 
       height="400">
  ```

### 5.5. Thuộc tính cho thẻ liên kết:
- Mỗi thẻ `<a>` cần có các thuộc tính:
  - `title`: Mô tả link (có thể bỏ trống giá trị nhưng bắt buộc phải có thuộc tính này)
  - `aria-label`: Mô tả cho screen readers (có thể bỏ trống giá trị nhưng bắt buộc phải có thuộc tính này)
  - `rel="nofollow"`: Cho link không tin cậy
  - `target="_blank"`: Cho link mở tab mới (nên sử dụng nếu trỏ sang website khác)
- Ví dụ:
  ```html
  <a href="https://example.com" 
     title="Xem chi tiết bài viết" 
     aria-label="Xem chi tiết bài viết về Bitcoin">
     Xem chi tiết
  </a>
  ```

### 5.6. Thẻ canonical:
- Sử dụng `<link rel="canonical" href="URL gốc">` để tránh trùng lặp nội dung
- Đặt trong thẻ `<head>`
- Ví dụ: `<link rel="canonical" href="https://example.com/tin-tuc-bitcoin">`

### 5.7. Ngôn ngữ trang:
- Khai báo thuộc tính `lang` ở thẻ `<html>`
- Ví dụ: `<html lang="vi">` cho tiếng Việt

### 5.8. Viewport và Mobile Friendly:
- Thêm `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Đảm bảo responsive design cho tất cả thiết bị

### 5.9. Open Graph Tags (Social Media):
- Thêm các thẻ Open Graph cho chia sẻ mạng xã hội:
  ```html
  <meta property="og:title" content="Tiêu đề trang">
  <meta property="og:description" content="Mô tả trang">
  <meta property="og:image" content="URL ảnh đại diện">
  <meta property="og:url" content="URL trang">
  <meta property="og:type" content="website">
  ```

### 5.10. Twitter Card Tags:
- Thêm thẻ Twitter Card:
  ```html
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tiêu đề trang">
  <meta name="twitter:description" content="Mô tả trang">
  <meta name="twitter:image" content="URL ảnh đại diện">
  ```

### 5.11. Robots Meta Tags:
- Kiểm soát cách search engines crawl trang:
  ```html
  <meta name="robots" content="index, follow">
  <!-- hoặc -->
  <meta name="robots" content="noindex, nofollow">
  ```

### 5.12. Sitemap:
- Tạo file `sitemap.xml` để Google index tất cả trang
- Submit sitemap qua Google Search Console

### 5.13. Kiểm tra điểm website:
- Vào tab lighthouse trên trình duyệt kiểm tra
