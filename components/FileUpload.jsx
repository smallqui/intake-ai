"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X, Camera, Files } from "lucide-react";

const MAX_FILES = 5;

/**
 * Document upload interface for Intake AI.
 *
 * Supports drag-and-drop, standard file selection, mobile camera capture,
 * image/PDF validation, and batches of up to five documents.
 */
export const FileUpload = ({
    onFileSelect,
    selectedFiles = [],
    onClearFile,
    disabled = false,
    onError,
    t,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const desktopInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    /**
     * Validates incoming files and appends them to the active batch.
     *
     * File validation is handled manually because MIME information can be
     * inconsistent across browsers, particularly for PDFs.
     *
     * @param {FileList|File[]} incomingFiles - Files selected or dropped.
     */
    const handleFiles = (incomingFiles) => {
        if (disabled || !incomingFiles) return;

        const files = Array.from(incomingFiles);

        const invalidFile = files.find((file) => {
            const isImage = file.type.startsWith("image/");
            const isPdf =
                file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf");

            return !isImage && !isPdf;
        });

        if (invalidFile){
            onError?.(
                "Invalid file. Please upload an Image or PDF.",
                "INVALID_FILE",
            );
            return;
        }

        const combinedFiles = [
            ...selectedFiles,
            ...files,
        ].slice(0, MAX_FILES);

        onFileSelect(combinedFiles);
    };

    /**
     * Handles files dropped onto the desktop upload surface.
     *
     * @param {React.DragEvent<HTMLDivElement>} event
     */
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(false);

        if (disabled) return;

        handleFiles(event.dataTransfer.files);
    };

    /**
     * Handles files selected from a native file picker.
     *
     * Resetting the input value allows the same file to be selected again
     * after the current selection has been cleared.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handleChange = (event) => {
        handleFiles(event.target.files);
        event.target.value = "";
    };

    const openDesktopPicker = () => {
        if (!disabled){
            desktopInputRef.current?.click();
        }
    };

    const openCamera = (event) => {
        event.stopPropagation();

        if (!disabled){
            cameraInputRef.current?.click();
        }
    };

    const clearSelection = (event) => {
        event.stopPropagation();

        if (!disabled){
            onClearFile();
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={openDesktopPicker}
                onDragEnter={(event) => {
                    event.preventDefault();

                    if (!disabled){
                        setIsDragging(true);
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();

                    if (!disabled){
                        setIsDragging(true);
                    }
                }}
                onDragLeave={(event) => {
                    event.preventDefault();

                    if (
                        event.currentTarget.contains(
                            event.relatedTarget,
                        )
                    ){
                        return;
                    }

                    setIsDragging(false);
                }}
                onDrop={handleDrop}
                className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    disabled
                        ? "cursor-not-allowed opacity-60 border-[#d8d9dc] dark:border-[#3f4147] bg-[#efeff1]/50 dark:bg-[#2b2d31]/50"
                        : isDragging
                          ? "cursor-copy border-[#e5484d] bg-[#fff5f5] dark:bg-[#e5484d]/10 shadow-lg shadow-[#e5484d]/10"
                          : "cursor-pointer border-[#d8d9dc] dark:border-[#3f4147] bg-white/70 dark:bg-[#2b2d31]/70 hover:border-[#e5484d]/60 hover:bg-[#fff5f5]/60 dark:hover:bg-[#313338]"
                }`}
            >
                <input
                    ref={desktopInputRef}
                    type="file"
                    multiple
                    disabled={disabled}
                    onChange={handleChange}
                    className="hidden"
                />

                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    disabled={disabled}
                    onChange={handleChange}
                    className="hidden"
                />

                {/*
                 * File type filtering for the standard picker is handled
                 * manually in handleFiles instead of relying solely on the
                 * input accept attribute.
                 */}

                <div className="p-6 sm:p-8">
                    {selectedFiles.length === 0 ? (
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                                    isDragging
                                        ? "bg-[#e5484d] text-white scale-110"
                                        : "bg-[#efeff1] dark:bg-[#313338] text-[#6d6f78] dark:text-[#b5bac1]"
                                }`}
                            >
                                <Upload className="w-6 h-6" />
                            </div>

                            <h3 className="text-sm font-bold text-[#313338] dark:text-[#f2f3f5]">
                                {t.dropZoneMain}
                            </h3>

                            <p className="mt-1.5 text-xs text-[#6d6f78] dark:text-[#949ba4]">
                                {t.dropZoneSub}
                            </p>

                            <div className="mt-5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#efeff1] dark:bg-[#313338] text-[10px] font-bold uppercase tracking-wider text-[#6d6f78] dark:text-[#b5bac1]">
                                    <FileText className="w-3 h-3" />
                                    PDF
                                </span>

                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#efeff1] dark:bg-[#313338] text-[10px] font-bold uppercase tracking-wider text-[#6d6f78] dark:text-[#b5bac1]">
                                    <FileText className="w-3 h-3" />
                                    Image
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={openCamera}
                                disabled={disabled}
                                className="mt-5 md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e5484d] hover:bg-[#d13f44] text-white text-xs font-bold rounded-lg shadow-md shadow-[#e5484d]/20 transition-all active:scale-[0.98]"
                            >
                                <Camera className="w-4 h-4" />
                                <span>{t.scanInvoice}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-[#e5484d]/10 flex items-center justify-center shrink-0">
                                        <Files className="w-5 h-5 text-[#e5484d]" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#313338] dark:text-[#f2f3f5]">
                                            {selectedFiles.length}{" "}
                                            {t.filesSelected}
                                        </p>

                                        <p className="text-[10px] text-[#6d6f78] dark:text-[#949ba4]">
                                            {selectedFiles.length}/
                                            {MAX_FILES}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    disabled={disabled}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#949ba4] hover:text-[#e5484d] hover:bg-[#e5484d]/10 transition-colors"
                                    title="Clear selected files"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {selectedFiles.map(
                                    (file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147] bg-[#f7f7f8] dark:bg-[#313338]"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#e5484d]/10 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-[#e5484d]" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className="text-xs font-semibold text-[#313338] dark:text-[#dbdee1] truncate"
                                                    title={file.name}
                                                >
                                                    {file.name}
                                                </p>

                                                <p className="text-[9px] text-[#6d6f78] dark:text-[#949ba4] uppercase font-medium">
                                                    {file.type ===
                                                    "application/pdf"
                                                        ? "PDF"
                                                        : "Image"}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>

                            {selectedFiles.length <
                                MAX_FILES && (
                                <p className="text-center text-[10px] text-[#6d6f78] dark:text-[#949ba4]">
                                    Click or drop more files to
                                    add to this batch
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};