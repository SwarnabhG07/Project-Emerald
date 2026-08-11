"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, CheckCircle2, Download } from "lucide-react";
import { generateKey, encryptFile, exportKey, arrayBufferToBase64 } from "@/lib/crypto/encryption";

const DOC_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "category_cert", label: "Category Certificate (SC/ST/OBC/EWS)" },
  { value: "land_record", label: "Land Record (Khasra/Khatauni)" },
  { value: "bank_passbook", label: "Bank Passbook" },
  { value: "photo", label: "Passport Photo" },
];

interface UploadedDoc {
  id: string;
  type: string;
  filename: string;
  uploadedAt: string;
}

interface DocumentUploaderProps {
  onUploadSuccess?: () => void;
}

export function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadExisting() {
    try {
      const res = await fetch("/api/documents/list");
      const data = await res.json();
      if (res.ok) setUploaded(data.documents);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadExisting();
  }, []);

  async function handleUpload() {
    if (!selectedType || !file) {
      setError("Select a document type and file");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Generate a random DEK per file
      const dek = await generateKey();
      const { ciphertext, iv } = await encryptFile(file, dek);
      const dekBase64 = await exportKey(dek);
      const ivBase64 = arrayBufferToBase64(iv.buffer as ArrayBuffer);

      // Build form data with encrypted file + wrapped key material
      const formData = new FormData();
      formData.append("file", new Blob([ciphertext], { type: file.type }), file.name + ".enc");
      formData.append("type", selectedType);
      formData.append("dek", dekBase64);
      formData.append("iv", ivBase64);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUploaded((prev) => [
        { id: data.document.id, type: data.document.type, filename: file.name, uploadedAt: data.document.uploadedAt },
        ...prev,
      ]);

      setFile(null);
      setSelectedType("");
      if (inputRef.current) inputRef.current.value = "";
      onUploadSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">Select type</option>
              {DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Photo / Scan</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {file && <p className="text-xs text-gray-600">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={handleUpload}
            disabled={!selectedType || !file || uploading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {uploading ? "Encrypting & Uploading..." : "Upload Securely"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            🔒 Files are encrypted with AES-256-GCM before being stored on our servers
          </p>
        </CardContent>
      </Card>

      {uploaded.length > 0 && (
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-900 text-base">Your Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploaded.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-2 bg-slate-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {DOC_TYPES.find((t) => t.value === d.type)?.label || d.type}
                    </p>
                    <p className="text-xs text-gray-500">{d.filename}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`/api/documents/${d.id}`}
                    download
                    className="rounded-md p-1.5 text-gray-500 hover:bg-green-100 hover:text-green-700"
                    title="Download (decrypted)"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}