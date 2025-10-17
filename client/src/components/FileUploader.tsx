import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileUploaderProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  allowedUsers?: string[];
  isPublic?: boolean;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  url?: string;
}

export function FileUploader({
  onUploadComplete,
  maxFiles = 5,
  acceptedFileTypes = ["image/*", "application/pdf", ".doc", ".docx"],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedUsers = [],
  isPublic = false,
}: FileUploaderProps) {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [completedFiles, setCompletedFiles] = useState<UploadedFile[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count
    if (completedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Start uploading files
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files one by one
    for (const uploadingFile of newUploadingFiles) {
      try {
        await uploadFile(uploadingFile);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const uploadFile = async (uploadingFile: UploadingFile) => {
    try {
      // Step 1: Get upload URL from backend
      const uploadData = await apiRequest("/api/objects/upload", {
        method: "POST",
        body: JSON.stringify({
          filename: uploadingFile.file.name,
          contentType: uploadingFile.file.type,
          allowedUsers,
          isPublic,
        }),
      });

      if (!uploadData.uploadUrl) {
        throw new Error("No upload URL received");
      }

      // Step 2: Upload file to object storage
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === uploadingFile.file ? { ...f, progress } : f
            )
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const uploadedFile: UploadedFile = {
            name: uploadingFile.file.name,
            url: uploadData.publicUrl,
            size: uploadingFile.file.size,
            type: uploadingFile.file.type,
          };

          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === uploadingFile.file
                ? { ...f, status: "complete" as const, url: uploadData.publicUrl }
                : f
            )
          );

          setCompletedFiles(prev => {
            const updated = [...prev, uploadedFile];
            onUploadComplete(updated);
            return updated;
          });
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
      });

      xhr.addEventListener("error", () => {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === uploadingFile.file ? { ...f, status: "error" as const } : f
          )
        );
        toast({
          title: "Upload failed",
          description: `Failed to upload ${uploadingFile.file.name}`,
          variant: "destructive",
        });
      });

      xhr.open("PUT", uploadData.uploadUrl);
      xhr.setRequestHeader("Content-Type", uploadingFile.file.type);
      xhr.send(uploadingFile.file);
    } catch (error: any) {
      setUploadingFiles(prev =>
        prev.map(f =>
          f.file === uploadingFile.file ? { ...f, status: "error" as const } : f
        )
      );
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setCompletedFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onUploadComplete(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileSelect}
          disabled={completedFiles.length >= maxFiles}
        />
        <label htmlFor="file-upload">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={completedFiles.length >= maxFiles}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-upload")?.click();
            }}
            data-testid="button-upload-files"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files ({completedFiles.length}/{maxFiles})
          </Button>
        </label>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{uploadingFile.file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(uploadingFile.file.size)}
                  </div>
                  {uploadingFile.status === "uploading" && (
                    <Progress value={uploadingFile.progress} className="h-1 mt-2" />
                  )}
                </div>
                {uploadingFile.status === "complete" && (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                )}
                {uploadingFile.status === "error" && (
                  <X className="h-5 w-5 text-destructive flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Files */}
      {completedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploaded Files</div>
          {completedFiles.map((file, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  data-testid={`button-remove-file-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
