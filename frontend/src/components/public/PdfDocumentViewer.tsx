"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PdfDocumentViewerProps {
  url: string;
  title?: string;
}

export function PdfDocumentViewer({ url, title = "Resume Document" }: PdfDocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Load PDF.js from CDN
  useEffect(() => {
    let isCancelled = false;

    const loadPdfJs = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF viewer engine"));
            document.head.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("PDF.js render error:", err);
          setError(err?.message || "Failed to render PDF document.");
          setLoading(false);
        }
      }
    };

    if (url) {
      loadPdfJs();
    }

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // Render pages when pdfDoc or zoomLevel or container size changes
  const renderAllPages = useCallback(async () => {
    if (!pdfDoc || !containerRef.current) return;

    const container = containerRef.current;
    const pagesContainer = container.querySelector("#pdf-pages-mount");
    if (!pagesContainer) return;

    pagesContainer.innerHTML = "";

    const availableWidth = Math.min(container.clientWidth - 32, 1100);
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = (availableWidth / unscaledViewport.width) * zoomLevel;
        const viewport = page.getViewport({ scale });

        const pageWrapper = document.createElement("div");
        pageWrapper.className =
          "relative mb-6 last:mb-0 w-full flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border-4 sm:border-8 border-white ring-1 ring-slate-200/70 overflow-hidden";

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) continue;

        // Render at high-DPI for crisp text
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        canvas.style.display = "block";
        canvas.style.maxWidth = "100%";

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;

        pageWrapper.appendChild(canvas);
        pagesContainer.appendChild(pageWrapper);

        await page.render({
          canvasContext: context,
          viewport,
          transform,
        }).promise;
      } catch (e) {
        console.warn(`Error rendering page ${pageNum}:`, e);
      }
    }
  }, [pdfDoc, zoomLevel]);

  useEffect(() => {
    renderAllPages();

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderAllPages();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [renderAllPages]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  if (error) {
    // Graceful fallback to pure iframe in a white border container
    return (
      <div className="w-full h-[85vh] sm:h-[92vh] rounded-2xl overflow-hidden shadow-xl bg-white border-4 sm:border-8 border-white ring-1 ring-slate-200">
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          className="w-full h-full border-0 bg-white"
          title={title}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-white p-3 sm:p-6 lg:p-8 shadow-xl border-4 sm:border-8 border-white ring-1 ring-slate-200/80 transition-all"
    >
      {/* Zoom / Page Counter Floating Bar */}
      {numPages > 0 && !loading && (
        <div className="sticky top-20 z-10 mb-4 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/80 shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Resume Preview</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              {numPages} {numPages === 1 ? "Page" : "Pages"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-600 px-1 min-w-[42px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
              title="Reset Zoom (Fit Page)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Placeholder */}
      {loading && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Rendering high-resolution document...
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Crisp vector presentation</p>
        </div>
      )}

      {/* Pages Container */}
      <div id="pdf-pages-mount" className="flex flex-col items-center w-full" />
    </div>
  );
}
