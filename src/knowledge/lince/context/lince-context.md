# Contexto LINCE - Copilot Integration

## ⚡ Filosofía de Desarrollo LINCE

**LINCE** se basa en principios de **máximo rendimiento**, **velocidad extrema** y **eficiencia computacional**. Cuando trabajes con esta línea de negocio, siempre prioriza:

### 🎯 Principios Fundamentales

1. **Performance Máximo**
   - Optimización a nivel de código para velocidad
   - Uso agresivo de cache y memoria
   - Algoritmos de alta performance

2. **Velocidad de Ejecución**
   - Minimización de tiempo de respuesta
   - Paralelización cuando sea posible
   - Eliminación de overhead innecesario

3. **Eficiencia Computacional**
   - Aprovechamiento máximo de recursos de hardware
   - Benchmarking continuo de performance
   - Escalabilidad horizontal y vertical

## 🔧 Directrices de Implementación FoxPro

### **Estructura de Clases LINCE**
```foxpro
* Siempre incluir métricas de performance
Define Class MiClaseLince as Custom
    * Propiedades para seguimiento de performance
    TiempoInicioOperacion = 0
    ContadorOperacionesRapidas = 0
    ThroughputActual = 0
    LatenciaMaxima = 0
    
    Function Init
        * Inicializar métricas de performance
        This.TiempoInicioOperacion = Sys(2)
        This.ConfigurarModoAltaVelocidad()
    EndFunc
    
    Function ConfigurarModoAltaVelocidad
        * Configuraciones LINCE estándar
        goParametros.Lince.Performance.OptimizacionConsultas = 1
        goParametros.Lince.Cache.HabilitarCacheRapido = .T.
        goParametros.Lince.Velocidad.ModoAltaVelocidad = .T.
    EndFunc
EndDefine
```

### **Patrones de Cache Agresivo**
- Cache en memoria para datos frecuentes
- Pre-compilación de queries y operaciones
- Índices optimizados para velocidad máxima

### **Métricas Obligatorias de Performance**
- Tiempo de ejecución en microsegundos
- Throughput (operaciones por segundo)
- Latencia P95 y P99
- Utilización de CPU y memoria

## 📁 Estructura de Directorios FoxPro

### **Nucleo/ - Motor de Alta Performance**
- Clases optimizadas para velocidad extrema
- Configuraciones de performance críticas
- Pool de conexiones ultra-rápidas
- Cache agresivo de objetos

### **Felino/ - Agilidad Máxima**
- Componentes de respuesta ultra-rápida
- Algoritmos optimizados para velocidad
- Procesamiento en paralelo cuando sea posible
- Eliminación de validaciones no críticas

### **Dibujante/ - UI de Alto Rendimiento**
- Forms (.scx) con renderizado optimizado
- Reports (.frx) con generación ultra-rápida
- Controles (.vcx) con respuesta inmediata

### **Generadores/ - Generación Veloz**
- Generadores de código de alta velocidad
- Templates pre-compilados
- Automatización ultra-rápida

### **ColorYTalle/ - Configuración Rápida**
- Temas optimizados para renderizado veloz
- Configuraciones visuales sin overhead
- Aplicación instantánea de cambios

## 💡 Patrones de Código Recomendados

### **1. Inicialización de Alta Velocidad**
```foxpro
Function Setup
    * LINCE: Configuración de máximo rendimiento
    goParametros.Lince.Performance.OptimizacionConsultas = 1
    goParametros.Lince.Cache.HabilitarCacheRapido = .T.
    goParametros.Lince.Velocidad.ModoAltaVelocidad = .T.
    
    * Pre-cargar datos en memoria para máxima velocidad
    This.PrecargarDatosEnMemoria()
    This.InicializarMetricasPerformance()
EndFunc
```

### **2. Cleanup Ultra-Rápido**
```foxpro
Function TearDown
    * LINCE: Cleanup optimizado para velocidad
    This.LimpiezaRapida()
    This.ReportarMetricasPerformance()
    Close Databases All Force  && Force para máxima velocidad
EndFunc
```

### **3. Validaciones de Performance**
```foxpro
Function ValidarPerformance(tnTiempoEjecucion, tnThroughput)
    * Validar que cumple con SLAs de performance LINCE
    If tnTiempoEjecucion > This.SLATiempoLince
        This.EscalarAumentarRecursos()
    EndIf
    
    If tnThroughput < This.SLAThroughputLince
        This.OptimizarAlgoritmo()
    EndIf
EndFunc
```

## 🧪 Testing LINCE

### **Estructura de Tests de Performance**
- Usar FxuTestCase con extensiones LINCE
- Benchmark de cada operación crítica
- Stress testing automático
- Validación de SLAs de performance

### **Validaciones Obligatorias**
- Tiempo de ejecución < SLA definido
- Throughput > mínimo requerido
- Latencia P99 dentro de límites
- Escalabilidad lineal validada

## ⚡ Variables de Entorno LINCE

```
BUSINESS_LINE=lince
LINCE_MAX_EXECUTION_TIME=10ms
LINCE_MIN_THROUGHPUT=10000ops/sec
LINCE_CACHE_SIZE=10MB
LINCE_PARALLEL_THREADS=8
```

## 📊 Métricas y KPIs

### **Métricas de Performance**
- **Throughput**: Operaciones procesadas por segundo
- **Latencia P95/P99**: Percentiles de tiempo de respuesta
- **CPU Utilization**: % de uso de procesador
- **Memory Throughput**: MB/s de transferencia de memoria

### **Reportes de Performance en Tiempo Real**
```foxpro
Function GenerarReportePerformance
    ? "=== LINCE Performance Report ==="
    ? "Throughput actual:", This.CalcularThroughput(), "ops/sec"
    ? "Latencia P99:", This.CalcularLatenciaP99(), "ms"
    ? "CPU Utilization:", This.ObtenerUsoCPU(), "%"
    ? "Memory Throughput:", This.ObtenerThroughputMemoria(), "MB/s"
    ? "================================="
EndFunc
```

## 🎨 Estilo de Código LINCE

### **Naming Conventions**
- Prefijos: `fast_`, `turbo_`, `ultra_` para funciones de alta velocidad
- Sufijos: `_rapid`, `_speed`, `_performance` para métodos optimizados
- Variables: lnTiempo, llRapido, lcConfigVelocidad

### **Comentarios Requeridos**
- `* LINCE:` para explicar optimizaciones de performance
- `* SPEED:` para destacar beneficios de velocidad
- `* BENCHMARK:` para indicar mediciones de performance

### **Estructura de Funciones**
```foxpro
*-- LINCE: [Descripción de optimización de performance]
*-- SPEED: [Beneficio de velocidad]
*-- BENCHMARK: [Métrica de performance esperada]
Function MiFuncionLince(tnParametro)
    Local lnTiempoInicio, lnThroughput
    lnTiempoInicio = Sys(2)  && High precision timer
    
    * Implementación ultra-rápida aquí
    
    * Validar performance antes de retornar
    lnThroughput = This.CalcularThroughput(Sys(2) - lnTiempoInicio)
    This.ValidarSLAPerformance(lnThroughput)
    
    Return lnResultado
EndFunc
```

## 🔥 Optimizaciones Específicas LINCE

### **1. Cache Agresivo**
```foxpro
* Pre-cargar datos frecuentes en memoria
Select * From DatosFrecuentes Into Cursor CurCache ReadWrite
Index On campo_clave Tag CacheIndex
```

### **2. Eliminación de Overhead**
```foxpro
* LINCE: Sin validaciones innecesarias en hot paths
* Usar Force en operaciones críticas
* Eliminar logs verbose en producción
Set Safety Off  && Solo para operaciones críticas
```

### **3. Paralelización**
```foxpro
* Simular procesamiento paralelo con batch operations
For i = 1 To 1000 Step 100
    This.ProcesarBatchRapido(i, i+99)
Next
```

### **4. Measurements en Tiempo Real**
```foxpro
Function MedirPerformanceOperacion(tcOperacion)
    Local lnInicio, lnFin, lnDuracion
    lnInicio = Sys(2)
    
    * Ejecutar operación
    
    lnFin = Sys(2)
    lnDuracion = Val(lnFin) - Val(lnInicio)
    
    * Registrar métricas
    This.RegistrarMetrica(tcOperacion, lnDuracion)
    
    * Alertar si excede SLA
    If lnDuracion > This.SLA_MAX_TIME
        This.AlertarSLAViolation(tcOperacion, lnDuracion)
    EndIf
EndFunc
```

## 🏆 SLAs de Performance LINCE

### **Tiempos Máximos Permitidos**
- **Consultas DB**: < 50ms
- **Cálculos Complejos**: < 100ms
- **Generación de Reports**: < 500ms
- **Operaciones CRUD**: < 10ms

### **Throughput Mínimo**
- **Transacciones**: > 1,000/seg
- **Consultas**: > 5,000/seg
- **Cálculos**: > 10,000/seg

### **Recursos Máximos**
- **Memoria por Operación**: < 10MB
- **CPU por Thread**: < 80%
- **Disco I/O**: < 100MB/s

---

**✏️ EDITABLE:** Este archivo puede ser modificado para ajustar las directrices específicas del proyecto LINCE. Los SLAs, configuraciones y patrones pueden personalizarse según las necesidades del equipo de alta performance.

**🤖 COPILOT INTEGRATION:** Este contexto se carga automáticamente cuando el MCP detecta la línea de negocio LINCE, proporcionando a Copilot las directrices específicas para generar código de máximo rendimiento y velocidad.
