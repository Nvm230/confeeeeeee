// Utilidad para exportar datos a CSV

export function exportToCSV(data: any[], filename: string = 'export.csv') {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Obtener las cabeceras del primer objeto
  const headers = Object.keys(data[0]);
  
  // Crear fila de cabeceras
  const csvHeaders = headers.map(header => `"${header}"`).join(',');
  
  // Crear filas de datos
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escapar comillas y manejar valores nulos
      if (value === null || value === undefined) return '""';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  // Combinar todo
  const csvContent = [csvHeaders, ...csvRows].join('\n');
  
  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

