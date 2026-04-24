import api from './client';

export const converterService = {
    async convert(file: File): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('options', JSON.stringify({
            source_format: 'my_crypto_funding',
            target_format: 'tradesviz',
        }));

        const { data } = await api.post<Blob>('/conversions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });

        return data;
    },
};
