# Repositorio de Código Fuente LINCE

## 📂 Propósito

Este directorio sirve como **repositorio de conocimiento** donde debes copiar el código fuente original que será la base para que el agente MCP aprenda las **guías de programación** y **estilo de código** específico de la línea de negocio **LINCE**.

## ⚡ Contenido Recomendado

### **Archivos .prg de Referencia**
Copiar aquí ejemplos de:
- Clases optimizadas para máxima velocidad
- Algoritmos de alto rendimiento
- Implementaciones de cache agresivo
- Funciones de benchmark y métricas

### **Archivos .vcx/.scx de Referencia**
- Controles con respuesta ultra-rápida
- Forms con renderizado optimizado
- Implementaciones de UI de alta performance

### **Archivos .dbf de Referencia**
- Estructuras de datos optimizadas para velocidad
- Índices de alto rendimiento
- Ejemplos de consultas ultra-rápidas

## 📋 Estructura Recomendada

```
source-repository/
├── classes/
│   ├── performance-classes.prg    # Clases de alto rendimiento
│   ├── speed-functions.prg        # Funciones ultra-rápidas
│   └── fast-data-access.prg       # Acceso a datos optimizado
├── forms/
│   ├── turbo-forms.scx           # Forms de respuesta rápida
│   └── speed-dialogs.scx         # Diálogos optimizados
├── controls/
│   ├── rapid-controls.vcx        # Controles de alta velocidad
│   └── performance-widgets.vcx   # Widgets optimizados
├── data/
│   ├── speed-tables.dbf          # Tablas optimizadas
│   └── performance-indexes.dbf   # Índices de alta velocidad
└── patterns/
    ├── lince-patterns.prg        # Patrones específicos LINCE
    └── speed-practices.prg       # Prácticas de alta performance
```

## 🎯 Qué Aprenderá el Agente

### **Estilo de Código**
- Naming conventions específicos de LINCE
- Estructura de comentarios para performance
- Patrones de optimización y formato

### **Arquitectura**
- Organización para máxima velocidad
- Patrones de diseño de alto rendimiento
- Estructura de clases optimizada

### **Optimizaciones**
- Técnicas de cache agresivo
- Implementaciones de pool de objetos rápidos
- Patrones de eliminación de overhead

### **Métricas y Benchmarking**
- Implementación de medición de performance
- Validaciones de SLAs de velocidad
- Reportes de throughput y latencia

## 📥 Instrucciones de Uso

### **1. Copiar Código de Alta Performance**
```bash
# Copiar tus archivos .prg más optimizados aquí
cp /ruta/a/tu/codigo/rapido/*.prg ./classes/

# Copiar controles y forms optimizados
cp /ruta/a/tu/codigo/ui-rapida/*.vcx ./controls/
cp /ruta/a/tu/codigo/forms-rapidos/*.scx ./forms/
```

### **2. Organizar por Velocidad**
- **classes/**: Clases críticas de performance
- **forms/**: UIs de respuesta inmediata
- **controls/**: Controles ultra-rápidos
- **data/**: Estructuras de datos veloces
- **patterns/**: Algoritmos optimizados

### **3. Documentar Optimizaciones**
Para cada archivo copiado, crear un archivo `.md` explicando:
- **Performance Goal**: Objetivo de velocidad
- **Optimizaciones LINCE**: Qué hace rápido/eficiente
- **Benchmarks**: Métricas de performance logradas

### **Ejemplo de Documentación:**
```markdown
# performance-classes.prg

## Performance Goal
Clases que procesan > 10,000 operaciones/segundo con latencia < 1ms.

## Optimizaciones LINCE Destacadas
- Cache en memoria en `SpeedCache`
- Pool de objetos rápidos en `TurboPool`
- Eliminación de validaciones en hot paths

## Benchmarks Logrados
- Throughput: 15,000 ops/sec
- Latencia P99: 0.8ms
- CPU Usage: 65%
- Memory: 8MB máximo

## Lecciones para el Agente
- Siempre implementar medición de performance
- Cache agresivo es preferible a cálculos repetidos
- Eliminar overhead en paths críticos
```

## 🤖 Integración con MCP

El agente MCP analizará automáticamente el código fuente de este repositorio para:

### **Aprender Optimizaciones**
- Extraer patrones de alta performance
- Identificar técnicas de optimización
- Reconocer arquitecturas de velocidad

### **Generar Código Rápido**
- Usar optimizaciones aprendidas en nuevas generaciones
- Mantener consistencia con patrones de performance
- Aplicar técnicas de benchmarking aprendidas

### **Mejorar Velocidad**
- Proponer optimizaciones basadas en código existente
- Sugerir refactoring para máxima velocidad
- Validar performance contra estándares aprendidos

## ⚙️ Configuración del Análisis

El MCP puede configurarse para analizar específicamente:

```json
{
  "performance_analysis": {
    "focus_on": [
      "speed_optimizations",
      "cache_patterns",
      "benchmark_implementations",
      "throughput_techniques"
    ],
    "metrics_priority": [
      "execution_time",
      "throughput",
      "latency",
      "resource_usage"
    ],
    "ignore": [
      "compatibility_code",
      "verbose_logging"
    ]
  }
}
```

## 📊 Métricas de Aprendizaje

El sistema reportará:
- **Performance Patterns Found**: Patrones de optimización identificados
- **Speed Techniques**: Técnicas de velocidad reconocidas
- **Benchmark Standards**: Estándares de performance detectados
- **Optimization Opportunities**: Mejoras de velocidad potenciales

## 🏆 SLAs de Referencia

### **Tiempos Objetivo**
Basados en el código de referencia:
- **Consultas**: < 10ms
- **Cálculos**: < 50ms  
- **Renderizado**: < 100ms
- **Batch Processing**: > 1000 items/sec

### **Throughput Objetivo**
- **CRUD Operations**: > 5,000/sec
- **Data Processing**: > 10,000/sec
- **UI Updates**: > 60 FPS
- **Network Calls**: < 200ms

### **Resource Limits**
- **Memory per Operation**: < 5MB
- **CPU per Thread**: < 70%
- **Disk I/O**: < 50MB/s

---

**💡 TIPS:**
- Copia tu código **más rápido** como referencia
- Incluye **benchmarks reales** en los comentarios
- Organiza por **performance crítica** (crítico → optimizado)
- Documenta **SLAs específicos** logrados

**🎯 OBJETIVO:**
Que el agente MCP genere código con **performance equivalente** al tuyo, aplicando automáticamente tus técnicas de optimización, patrones de velocidad y estándares de benchmarking LINCE.

**⚡ LEMA LINCE:**
"Si no es medible, no es optimizable. Si no es rápido, no es LINCE."
