import { useRef } from "react";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  accept: string;
  label: string;
  onFileSelected: (file: File) => void;
}

const FileUploadButton = ({ accept, label, onFileSelected }: FileUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="studio-btn-ghost w-full flex items-center justify-center gap-2"
      >
        <Upload size={14} />
        {label}
      </button>
    </>
  );
};

export default FileUploadButton;
