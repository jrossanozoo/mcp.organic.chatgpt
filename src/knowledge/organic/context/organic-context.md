# Contexto ORGANIC - Copilot Integration

## 🌱 Filosofía de Desarrollo ORGANIC

**ORGANIC** se basa en principios de **sostenibilidad**, **eficiencia de recursos** y **desarrollo responsable**. Cuando trabajes con esta línea de negocio, siempre prioriza:

### 🎯 Principios Fundamentales

1. **Sostenibilidad de Código**
   - Reutilización de componentes y objetos
   - Minimización de uso de memoria y recursos
   - Código limpio y mantenible a largo plazo

2. **Eficiencia Energética**
   - Algoritmos optimizados para consumir menos CPU
   - Reducción de operaciones innecesarias
   - Cache inteligente y persistente

3. **Desarrollo Responsable**
   - Validaciones de impacto ambiental en el código
   - Métricas de sostenibilidad en tiempo real
   - Cleanup gradual y responsable de recursos

## 🔧 Directrices de Implementación FoxPro

### **Estructura de Clases ORGANIC**
```foxpro
* Siempre incluir métricas de sostenibilidad
Define Class MiClaseOrganic as Custom
    * Propiedades para seguimiento de recursos
    UsoMemoriaInicial = 0
    ConexionesReutilizadas = 0
    OperacionesOptimizadas = 0
    
    Function Init
        * Inicializar métricas
        This.UsoMemoriaInicial = Memory(1)
        This.ConfigurarModeSostenible()
    EndFunc
    
    Function ConfigurarModeSostenible
        * Configuraciones ORGANIC estándar
        goParametros.Organic.Sostenibilidad.OptimizarMemoria = .T.
        goParametros.Organic.Eficiencia.ReutilizarConexiones = .T.
    EndFunc
EndDefine
```

### **Patrones de Pool de Objetos**
- Siempre usar pool de conexiones
- Reutilizar objetos en lugar de crear nuevos
- Implementar cleanup gradual

### **Métricas Obligatorias**
- Seguimiento de uso de memoria
- Contador de objetos reutilizados
- Tiempo de ejecución de operaciones críticas
- Reporte de eficiencia energética

## 📁 Estructura de Directorios FoxPro

### **Nucleo/ - Funcionalidades Base**
- Clases fundamentales del sistema
- Configuraciones globales ORGANIC
- Manejo de parámetros sostenibles
- Pool de objetos base

### **Felino/ - Componentes Ágiles**
- Cuando se detecte en ORGANIC: enfoque en agilidad sostenible
- Optimización de velocidad SIN comprometer sostenibilidad
- Balance entre performance y eficiencia energética

### **Dibujante/ - Interfaz de Usuario**
- Forms (.scx) optimizados para consumo mínimo
- Reports (.frx) con generación eficiente
- Controles (.vcx) reutilizables y ligeros

### **Generadores/ - Automatización**
- Generadores de código sostenible
- Templates con optimizaciones ORGANIC
- Automatización de tareas repetitivas

### **ColorYTalle/ - Configuración Visual**
- Temas optimizados para bajo consumo
- Configuraciones visuales eficientes
- Personalización sostenible de UI

## 💡 Patrones de Código Recomendados

### **1. Inicialización Sostenible**
```foxpro
Function Setup
    * ORGANIC: Configuración eficiente de recursos
    goParametros.Organic.Sostenibilidad.OptimizarMemoria = .T.
    goParametros.Organic.Eficiencia.ReutilizarConexiones = .T.
    goParametros.Organic.Recursos.ModoAhorro = .T.
    
    This.InicializarPoolObjetos()
    This.ConfigurarMetricasSostenibilidad()
EndFunc
```

### **2. Cleanup Responsable**
```foxpro
Function TearDown
    * ORGANIC: Limpieza gradual sin picos de recursos
    This.LimpiezaGradual()
    This.ReportarMetricasSostenibilidad()
    This.LiberarRecursosPrioritarios()
EndFunc
```

### **3. Validaciones de Sostenibilidad**
```foxpro
Function ValidarSostenibilidad(tnUsoMemoria, tnTiempoEjecucion)
    * Validar que cumple con criterios ORGANIC
    If tnUsoMemoria > This.LimiteMemoriaOrganic
        This.ReportarExcesoMemoria(tnUsoMemoria)
    EndIf
    
    If tnTiempoEjecucion > This.LimiteTiempoOrganic
        This.OptimizarOperacion()
    EndIf
EndFunc
```

## 🧪 Testing ORGANIC

### **Estructura de Tests**
- Usar FxuTestCase con extensiones ORGANIC
- Incluir métricas de sostenibilidad en cada test
- Validar eficiencia energética
- Pool de objetos para tests

### **Validaciones Obligatorias**
- Uso de memoria < límite definido
- Tiempo de ejecución optimizado
- Reutilización de recursos
- Cleanup completo sin residuos

## 🌿 Variables de Entorno ORGANIC

```
BUSINESS_LINE=organic
ORGANIC_MEMORY_LIMIT=1000KB
ORGANIC_TIME_LIMIT=5000ms
ORGANIC_REUSE_THRESHOLD=80%
ORGANIC_CLEANUP_MODE=gradual
```

## 📊 Métricas y KPIs

### **Métricas de Sostenibilidad**
- **Índice de Reutilización**: % de objetos reutilizados vs nuevos
- **Eficiencia Energética**: Operaciones/segundo por unidad de CPU
- **Huella de Memoria**: Memoria máxima utilizada por operación
- **Tiempo de Cleanup**: Tiempo promedio de liberación de recursos

### **Reportes Automáticos**
```foxpro
Function GenerarReporteSostenibilidad
    ? "=== ORGANIC Sustainability Report ==="
    ? "Índice de Reutilización:", This.CalcularIndiceReutilizacion(), "%"
    ? "Eficiencia Energética:", This.CalcularEficienciaEnergetica(), "%"
    ? "Huella de Memoria:", This.CalcularHuellaMemoria(), "KB"
    ? "===================================="
EndFunc
```

## 🎨 Estilo de Código ORGANIC

### **Naming Conventions**
- Prefijos: `org_`, `eco_`, `green_` para funciones sostenibles
- Sufijos: `_eco`, `_sustainable`, `_efficient` para métodos optimizados
- Variables: lnMemoria, llEficiente, lcConfigSostenible

### **Comentarios Requeridos**
- `* ORGANIC:` para explicar optimizaciones específicas
- `* ECO:` para destacar beneficios ambientales
- `* REUSE:` para indicar reutilización de objetos

### **Estructura de Funciones**
```foxpro
*-- ORGANIC: [Descripción de la función]
*-- ECO: [Beneficio ambiental]
*-- REUSE: [Objetos reutilizados]
Function MiFuncionOrganic(tnParametro)
    Local lnMemoriaInicio
    lnMemoriaInicio = Memory(1)
    
    * Implementación sostenible aquí
    
    * Validar sostenibilidad antes de retornar
    This.ValidarHuellaSostenibilidad(Memory(1) - lnMemoriaInicio)
    
    Return lnResultado
EndFunc
```

---

**✏️ EDITABLE:** Este archivo puede ser modificado para ajustar las directrices específicas del proyecto ORGANIC. Las configuraciones, límites y patrones pueden personalizarse según las necesidades del equipo de desarrollo.

**🤖 COPILOT INTEGRATION:** Este contexto se carga automáticamente cuando el MCP detecta la línea de negocio ORGANIC, proporcionando a Copilot las directrices específicas para generar código sostenible y eficiente.
