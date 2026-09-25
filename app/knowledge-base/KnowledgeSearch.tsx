"use client";

import { useEffect, useMemo, useState } from "react";

type DocType = "knowledge" | "case" | "script";
type FilterType = "all" | DocType;

type Doc = {
  path: string;
  title: string;
  type: DocType;
  content?: string;
  snippet?: string;
  url?: string;
};

const PAGE_SIZE = 5;

const filters: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "knowledge", label: "Tài liệu" },
  { value: "case", label: "Tình huống xử lý" },
  { value: "script", label: "Công cụ / Script" },
];

const typeLabel: Record<DocType, string> = {
  knowledge: "Tài liệu",
  case: "Tình huống xử lý",
  script: "Công cụ / Script",
};

function getDocIcon(type: DocType) {
  if (type === "script") return "S";
  if (type === "case") return "✓";
  return "≡";
}

export default function KnowledgeSearch() {
  const [q, setQ] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "/api/knowledge/search?q=" + encodeURIComponent(q)
        );
        const data = await response.json();
        setDocs(Array.isArray(data.documents) ? data.documents : []);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [q, filter]);

  const visibleDocs = useMemo(() => {
    if (filter === "all") return docs;
    return docs.filter((doc) => doc.type === filter);
  }, [docs, filter]);

  const browsing = q.trim().length > 0 || filter !== "all" || showAll;
  const totalPages = Math.max(1, Math.ceil(visibleDocs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageDocs = browsing
    ? visibleDocs.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      )
    : visibleDocs.slice(0, 3);

  return (
    <section className="panel knowledge-search-panel">
      <div className="knowledge-search-box">
        <span className="knowledge-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          className="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Tìm tài liệu: WiFi, máy in, Outlook, mật khẩu..."
          aria-label="Tìm trong Kho kiến thức"
        />
        {q.length > 0 ? (
          <button
            className="kb-clear"
            type="button"
            onClick={() => setQ("")}
          >
            Xóa
          </button>
        ) : null}
      </div>

      <div className="kb-toolbar">
        <div
          className="kb-filters"
          role="tablist"
          aria-label="Lọc loại tài liệu"
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? "kb-filter active" : "kb-filter"}
              onClick={() => {
                setFilter(item.value);
                if (item.value !== "all") setShowAll(true);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="result-meta">
          {loading ? "Đang tải..." : `${visibleDocs.length} tài liệu`}
        </div>
      </div>

      {!browsing && visibleDocs.length > 0 ? (
        <div className="kb-compact-note">
          <div>
            <strong>Tài liệu nổi bật</strong>
            <span>
              Hiển thị 3 tài liệu đầu tiên. Dùng ô tìm kiếm hoặc bộ lọc để tra cứu nhanh.
            </span>
          </div>
          {visibleDocs.length > 3 ? (
            <button
              type="button"
              className="kb-show-all"
              onClick={() => setShowAll(true)}
            >
              Xem tất cả ({visibleDocs.length})
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="knowledge-results">
        {pageDocs.map((doc) => {
          const description = (
            doc.snippet ||
            doc.content ||
            doc.path
          ).slice(0, 150);

          return (
            <article className="knowledge-result-card" key={doc.path}>
              <div className="knowledge-doc-icon">{getDocIcon(doc.type)}</div>
              <div className="kb-result-body">
                <span className={`badge badge-${doc.type}`}>
                  {typeLabel[doc.type]}
                </span>
                <h3>{doc.title}</h3>
                <p>{description}</p>
              </div>
              <a
                className="kb-open"
                href={
                  "/knowledge-base/document?path=" + encodeURIComponent(doc.path)
                }
              >
                Xem →
              </a>
            </article>
          );
        })}

        {!loading && visibleDocs.length === 0 ? (
          <div className="kb-empty">
            <strong>
              {q
                ? "Không tìm thấy tài liệu phù hợp"
                : "Kho kiến thức chưa có tài liệu"}
            </strong>
            <p>
              {q
                ? "Thử từ khóa ngắn hơn, ví dụ: WiFi, DNS, máy in, Outlook, mật khẩu."
                : "Các tài liệu kỹ thuật sẽ được hiển thị tại đây."}
            </p>
          </div>
        ) : null}
      </div>

      {browsing && visibleDocs.length > PAGE_SIZE ? (
        <div className="kb-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            ← Trước
          </button>
          <span>
            Trang <strong>{currentPage}</strong> / {totalPages} · {visibleDocs.length} tài liệu
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
          >
            Sau →
          </button>
        </div>
      ) : null}

      {showAll && q.trim() === "" && filter === "all" ? (
        <div className="kb-collapse-row">
          <button
            type="button"
            className="kb-show-all"
            onClick={() => {
              setShowAll(false);
              setPage(1);
            }}
          >
            Thu gọn danh sách ↑
          </button>
        </div>
      ) : null}
    </section>
  );
}
