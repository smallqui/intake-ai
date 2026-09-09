'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Files, Aperture } from 'lucide-react';

export const FileUpload = ({ onFileSelect, selectedFiles, onClearFile, disabled, onError, t }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const MAX_FILES = 5;

  const handleFiles = useCallback((files) => {
    if (!files || files.length === 0) return;
    const validFiles = [];
    let hasInvalid = false;

    Array.from(files).forEach((file) => {
        // PARANOID CHECK: Allow PDF via MIME or Extension (Fixes Windows bug)
        if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            validFiles.push(file);
        } else {
            hasInvalid = true;
        }
    });

    if (hasInvalid) onError("Invalid file. Please upload an Image or PDF.", 'INVALID_FILE');
    if (validFiles.length === 0) return;

    const remainingSlots = MAX_FILES - selectedFiles.length;
    if (remainingSlots <= 0) return;
    onFileSelect([...selectedFiles, ...validFiles.slice(0, remainingSlots)]);
  }, [selectedFiles, onFileSelect, onError]);

  const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); if (disabled) return; handleFiles(e.dataTransfer.files); }, [handleFiles, disabled]);
  const handleChange = (e) => { handleFiles(e.target.files); e.target.value = ''; };

  return (
    <div className="w-full space-y-4">
      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="w-full p-4 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-4"><div className="p-2.5 bg-indigo-500/10 rounded-xl"><Files className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedFiles.length} files selected</p></div>
          {!disabled && <button onClick={onClearFile} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button>}
        </div>
      )}
      {/* Drop Zone - REMOVED ACCEPT ATTRIBUTE TO FORCE WINDOWS TO SHOW ALL FILES */}
      {(MAX_FILES - selectedFiles.length > 0) && (
        <div onDragOver={(e)=>{e.preventDefault();if(!disabled)setIsDragging(true)}} onDragLeave={(e)=>{e.preventDefault();if(!disabled)setIsDragging(false)}} onDrop={handleDrop} onClick={() => !disabled && fileInputRef.current?.click()} className={`hidden md:flex w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer flex-col items-center justify-center space-y-3 ${isDragging ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700/50 hover:border-indigo-500/30'}`}>
            <input type="file" ref={fileInputRef} onChange={handleChange} multiple className="hidden" disabled={disabled} />
            <Upload className="w-6 h-6 text-slate-400" />
            <div className="text-center"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.dropZoneMain}</p><p className="text-[10px] text-slate-500 mt-1">Support for PDF, PNG, JPG</p></div>
        </div>
      )}
      {/* Mobile Input */}
      <div className="md:hidden"><input type="file" ref={cameraInputRef} onChange={handleChange} className="hidden" /><button onClick={() => cameraInputRef.current?.click()} className="w-full py-4 bg-slate-900 text-cyan-400 rounded-xl font-bold border border-cyan-500/30 flex items-center justify-center space-x-2"><Aperture className="w-5 h-5" /><span>UPLOAD / SCAN</span></button></div>
    </div>
  );
};
