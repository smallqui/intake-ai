export const extractInvoiceData = async (file, isDemoMode) => {
  const formData = new FormData();
  formData.append('isDemoMode', String(isDemoMode));
  if (!isDemoMode) {
    formData.append('file', file);
  }

  const res = await fetch('/api/extract', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const e = new Error(body.error || 'Extraction failed');
    e.code = body.code || 'GENERIC';
    throw e;
  }

  return res.json();
};
