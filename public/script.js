document.addEventListener('DOMContentLoaded', () => {
    const audioFileInput = document.getElementById('audioFile');
    const generateBtn = document.getElementById('generateBtn');
    const statusDiv = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');

    generateBtn.addEventListener('click', async () => {
        const file = audioFileInput.files[0];
        if (!file) {
            updateStatus('لطفاً یک فایل صوتی انتخاب کنید.', 'red');
            return;
        }

        generateBtn.disabled = true;
        downloadLink.style.display = 'none';
        updateStatus('در حال آپلود و پردازش... (این فرآیند ممکن است چند دقیقه طول بکشد)', '#ccc');

        try {
            const response = await fetch('/', { // درخواست به ریشه اصلی سایت ارسال می‌شود
                method: 'POST',
                body: file,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'خطایی در پردازش رخ داد.');
            }

            const srtContent = await response.text();
            if (!srtContent) {
                throw new Error('زیرنویس خالی است. ممکن است گفتاری تشخیص داده نشده باشد.');
            }
            
            const blob = new Blob([srtContent], { type: 'text/srt' });
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.style.display = 'block';
            updateStatus('✅ زیرنویس با موفقیت ساخته شد!', '#42b72a');

        } catch (error) {
            console.error('Frontend Error:', error);
            updateStatus(خطا: ${error.message}, 'red');
        } finally {
            generateBtn.disabled = false;
        }
    });

    function updateStatus(message, color) {
        statusDiv.textContent = message;
        statusDiv.style.color = color;
    }
});