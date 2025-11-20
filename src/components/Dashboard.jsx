import React from 'react'
import { FileSpreadsheet } from 'lucide-react'

const Dashboard = ({ datos }) => {
  
  // Lógica de exportación encapsulada aquí
  const exportarCSV = () => {
    if (datos.length === 0) return alert("No hay datos para exportar")
      
    const cabeceras = "Fecha,Hora,Producto,Madurez,Calidad,SensorID\n"
    const filas = datos.map(d => 
      `${d.fecha},${d.hora},${d.fruto},${d.analisis.madurez},${d.analisis.calidad},${d.sensor_id}`
    ).join("\n")
    
    const blob = new Blob([cabeceras + filas], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reporte_agro_${Date.now()}.csv`
    link.click()
  }

  return (
    <div className="dashboard-view">
      <div className="actions-bar">
        <h2>Reporte de Producción</h2>
        <button onClick={exportarCSV} className="export-btn">
          <FileSpreadsheet size={18} /> Descargar Excel/CSV
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Calidad</th>
              <th>Hora</th>
              <th>Sensor</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((d, i) => (
              <tr key={i}>
                <td>
                  <span className={`status-pill ${d.analisis.calidad === 'PRIMERA' ? 'ok' : 'warn'}`}>
                    {d.analisis.madurez}
                  </span>
                </td>
                <td>{d.analisis.calidad}</td>
                <td>{d.hora}</td>
                <td>{d.sensor_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {datos.length === 0 && <p className="no-data">Conectando con Azure...</p>}
      </div>
    </div>
  )
}

export default Dashboard