import React, { useState, useEffect, useRef } from 'react'

const MobileScanner = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [analisis, setAnalisis] = useState("Esperando...")

  useEffect(() => {
    // Solicitar acceso a la cámara trasera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(err => console.error("Error de cámara:", err))

    const intervalo = setInterval(procesarFrame, 500)
    return () => clearInterval(intervalo)
  }, [])

  const procesarFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = frame.data
    
    let rojoCount = 0
    let verdeCount = 0

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i]
      const g = data[i + 1]
      
      if (r > 100 && r > g * 1.5) rojoCount++
      if (g > 60 && g > r * 1.2) verdeCount++
    }

    if (rojoCount > verdeCount && rojoCount > 100) setAnalisis("🍅 MADURO (PRIMERA)")
    else if (verdeCount > rojoCount && verdeCount > 100) setAnalisis("🍏 INMADURO (SEGUNDA)")
    else setAnalisis("🔍 Buscando fruto...")
  }

  return (
    <div className="scanner-container">
      <h3>Escáner IA Local</h3>
      <div className="camera-box">
        <video ref={videoRef} autoPlay playsInline muted></video>
        <canvas ref={canvasRef} width="300" height="300" style={{display:'none'}}></canvas>
        <div className="overlay-result">{analisis}</div>
      </div>
      <p>Este módulo usa la CPU de tu celular para analizar el video en tiempo real.</p>
    </div>
  )
}

export default MobileScanner