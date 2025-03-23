import { useRef, useCallback, memo } from 'react';
import { FiUpload, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';

const ImagePreview = memo(({ src, alt, onRemove }) => (
  <div className="relative group">
    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <img
        src={src || '/placeholder.svg?height=100&width=100'}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <FiX className="w-4 h-4" />
    </button>
    {alt && <p className="text-xs text-gray-500 truncate mt-1">{alt}</p>}
  </div>
));

const UploadFile = ({
  selectedFiles = [],
  setSelectedFiles,
  previewUrls = [],
  setPreviewUrls,
  existingImages = [],
  setExistingImages,
  imagesToDelete = [],
  setImagesToDelete,
  isEditMode = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback(
    (event) => {
      if (!event.target.files || !setSelectedFiles || !setPreviewUrls) return;

      const files = Array.from(event.target.files);
      if (!files.length) return;

      const validFileTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      const validFiles = files.filter((file) => {
        const isValidType = validFileTypes.includes(file.type);
        const isValidSize = file.size <= maxFileSize;
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        alert(
          "Bazı dosyalar geçersiz format veya boyutta. Sadece 5MB'dan küçük JPG, PNG, GIF ve WEBP dosyaları kabul edilir."
        );
      }

      if (!validFiles.length) return;

      setSelectedFiles((prev) => [...prev, ...validFiles]);

      const newUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    },
    [setSelectedFiles, setPreviewUrls]
  );

  const handleRemoveFile = useCallback(
    (index) => {
      if (
        index === undefined ||
        index === null ||
        !setSelectedFiles ||
        !setPreviewUrls
      )
        return;

      setSelectedFiles((prev) => {
        if (!Array.isArray(prev)) return [];
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });

      setPreviewUrls((prev) => {
        if (!Array.isArray(prev)) return [];
        const newUrls = [...prev];
        if (prev[index]) {
          URL.revokeObjectURL(prev[index]);
        }
        newUrls.splice(index, 1);
        return newUrls;
      });
    },
    [setSelectedFiles, setPreviewUrls]
  );

  const handleRemoveExistingImage = useCallback(
    (imageUrl) => {
      if (!imageUrl || !setImagesToDelete) return;

      setImagesToDelete((prev) => {
        if (!Array.isArray(prev)) return [imageUrl];
        return [...prev, imageUrl];
      });

      if (setExistingImages) {
        setExistingImages((prev) => {
          if (!Array.isArray(prev)) return [];
          return prev.filter((img) => img !== imageUrl);
        });
      }
    },
    [setImagesToDelete, setExistingImages]
  );

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const totalImagesCount =
    (Array.isArray(selectedFiles) ? selectedFiles.length : 0) +
    (Array.isArray(existingImages)
      ? existingImages.filter((img) =>
          Array.isArray(imagesToDelete) ? !imagesToDelete.includes(img) : true
        ).length
      : 0);

  const remainingExistingImages = Array.isArray(existingImages)
    ? existingImages.filter(
        (img) => !Array.isArray(imagesToDelete) || !imagesToDelete.includes(img)
      )
    : [];

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Dosyaları seçmek için tıklayın veya sürükleyip bırakın
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF veya WEBP (maks. 5MB)
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Toplam {totalImagesCount} resim
          {totalImagesCount === 0 && (
            <span className="text-red-500 ml-2 flex items-center">
              <FiAlertCircle className="mr-1" /> En az bir resim gerekli
            </span>
          )}
        </p>
      </div>

      {Array.isArray(selectedFiles) && selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Yeni Yüklenen Resimler
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, index) => (
              <ImagePreview
                key={`new-${index}`}
                src={index < previewUrls.length ? previewUrls[index] : null}
                alt={file && file.name ? file.name : `Yeni Resim ${index + 1}`}
                onRemove={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {isEditMode && remainingExistingImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Mevcut Resimler
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {remainingExistingImages.map((imageUrl, index) => (
              <ImagePreview
                key={`existing-${index}`}
                src={imageUrl || '/placeholder.svg'}
                alt={`Mevcut Resim ${index + 1}`}
                onRemove={(e) => {
                  e.stopPropagation();
                  handleRemoveExistingImage(imageUrl);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 flex items-start">
        <FiImage className="mr-1 mt-0.5 flex-shrink-0" />
        <span>
          Yüksek kaliteli ve net görseller kullanmak, ilanınızın daha fazla ilgi
          görmesini sağlar. Yatay (landscape) formatta resimler tercih edilir.
        </span>
      </div>
    </div>
  );
};

export default memo(UploadFile);
