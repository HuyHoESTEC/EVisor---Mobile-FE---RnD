import jsQR from 'jsqr';

/**
 * Read and decoder QR code from a File object (screenshot)
 * @param file File object (image) from input[type="file"]
 * @returns Promise<string> - Return value of QR code to decoder
 */

export const readQRCodeFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check if lost connect internet
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            return reject(new Error("Mất kết nối Internet!"));
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(new Error("Không thể tạo context cho canvas"));
                }
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                // Get pixel data from image to transmitted into jsQR
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    resolve(code.data);
                } else {
                    reject(new Error("Không tìm thấy mã QR/Barcode hợp lệ trong ảnh"));
                }
            };
            img.onerror = () => {
                reject(new Error("Không thể tải hình ảnh. Đảm bảo file là ảnh hợp lệ."));
            };

            if (e.target?.result) {
                img.src = e.target.result as string;
            } else {
                reject(new Error("Không có dữ liệu hình ảnh."));
            }
        };

        reader.onerror = () => {
            reject(new Error("Lỗi đọc file."));
        };
        // Read file to Data URL
        reader.readAsDataURL(file);
    })
}