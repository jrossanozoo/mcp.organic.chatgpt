# Repositorio de Código Fuente ORGANIC

## 📂 Propósito

Este directorio sirve como **repositorio de conocimiento** donde debes copiar el código fuente original que será la base para que el agente MCP aprenda las **guías de programación** y **estilo de código** específico de la línea de negocio **ORGANIC**.

## 🌱 Contenido Recomendado

### **Archivos .prg de Referencia**
Copiar aquí ejemplos de:
- Clases base con implementación sostenible
- Funciones optimizadas para eficiencia de recursos
- Patrones de reutilización de objetos
- Implementaciones de cleanup ecológico

### **Archivos .vcx/.scx de Referencia**
- Controles visuales optimizados
- Forms con consumo mínimo de recursos
- Implementaciones de UI sostenible

### **Archivos .dbf de Referencia**
- Estructuras de datos eficientes
- Índices optimizados para consultas ecológicas
- Ejemplos de normalización sostenible

## 📋 Estructura Recomendada

```
source-repository/
├── classes/
│   ├── base-classes.prg       # Clases fundamentales ORGANIC
│   ├── util-functions.prg     # Utilidades sostenibles
│   └── data-access.prg        # Acceso a datos eficiente
├── forms/
│   ├── main-form.scx          # Form principal optimizado
│   └── dialog-templates.scx   # Templates de diálogos
├── controls/
│   ├── eco-controls.vcx       # Controles sostenibles
│   └── green-widgets.vcx      # Widgets ecológicos
├── data/
│   ├── sample-tables.dbf      # Tablas de ejemplo
│   └── config-data.dbf        # Datos de configuración
└── patterns/
    ├── organic-patterns.prg   # Patrones específicos ORGANIC
    └── best-practices.prg     # Mejores prácticas implementadas
```

## 🎯 Qué Aprenderá el Agente

### **Estilo de Código**
- Naming conventions específicos de ORGANIC
- Estructura de comentarios y documentación
- Patrones de indentación y formato

### **Arquitectura**
- Organización de clases y módulos
- Patrones de diseño sostenibles
- Estructura de herencia eficiente

### **Optimizaciones**
- Técnicas de reutilización de objetos
- Implementaciones de cache sostenible
- Patrones de cleanup responsable

### **Métricas y Validaciones**
- Implementación de seguimiento de recursos
- Validaciones de sostenibilidad
- Reportes de eficiencia

## 📥 Instrucciones de Uso

### **1. Copiar Código de Referencia**
```bash
# Copiar tus archivos .prg principales aquí
cp /ruta/a/tu/codigo/*.prg ./classes/

# Copiar controles y forms
cp /ruta/a/tu/codigo/*.vcx ./controls/
cp /ruta/a/tu/codigo/*.scx ./forms/
```

### **2. Organizar por Categorías**
- **classes/**: Clases y módulos principales
- **forms/**: Interfaces de usuario
- **controls/**: Controles reutilizables
- **data/**: Estructuras de datos
- **patterns/**: Patrones y utilidades

### **3. Documentar Patrones Específicos**
Para cada archivo copiado, crear un archivo `.md` explicando:
- **Propósito**: Qué hace el código
- **Patrones ORGANIC**: Qué hace sostenible/eficiente
- **Lecciones**: Qué debe aprender el agente

### **Ejemplo de Documentación:**
```markdown
# base-classes.prg

## Propósito
Clases fundamentales que implementan patrones ORGANIC de sostenibilidad.

## Patrones ORGANIC Destacados
- Pool de objetos en `PoolManager` 
- Métricas de recursos en `ResourceTracker`
- Cleanup gradual en `EcoCleanup`

## Lecciones para el Agente
- Siempre implementar seguimiento de recursos
- Usar pool de objetos antes de crear nuevos
- Cleanup gradual es mejor que cleanup masivo
```

## 🤖 Integración con MCP

El agente MCP analizará automáticamente el código fuente de este repositorio para:

### **Aprender Patrones**
- Extraer patrones comunes de implementación
- Identificar estilos de naming y estructura
- Reconocer arquitecturas preferidas

### **Generar Código Similar**
- Usar los patrones aprendidos en nuevas generaciones
- Mantener consistencia con el estilo existente
- Aplicar las mejores prácticas identificadas

### **Mejorar Sugerencias**
- Proponer optimizaciones basadas en código existente
- Sugerir refactoring siguiendo patrones establecidos
- Validar código generado contra estándares aprendidos

## ⚙️ Configuración del Análisis

El MCP puede configurarse para analizar específicamente:

```json
{
  "source_analysis": {
    "focus_on": [
      "resource_optimization",
      "object_reuse_patterns", 
      "sustainable_cleanup",
      "efficiency_metrics"
    ],
    "ignore": [
      "legacy_code",
      "deprecated_patterns"
    ]
  }
}
```

## 📊 Métricas de Aprendizaje

El sistema reportará:
- **Patrones Identificados**: Cantidad y tipos
- **Estilo Consistency**: % de adherencia a patrones
- **Best Practices Found**: Prácticas reconocidas
- **Optimization Opportunities**: Mejoras potenciales

---

**💡 TIPS:**
- Copia tu **mejor código** como referencia
- Incluye **comentarios explicativos** en el código
- Organiza por **complejidad** (simple → avanzado)
- Actualiza regularmente con **nuevos patrones**

**🎯 OBJETIVO:**
Que el agente MCP genere código **indistinguible** del que tú escribirías, siguiendo exactamente tus patrones, estilo y mejores prácticas ORGANIC.
