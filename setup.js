#!/usr/bin/env node

/**
 * Script de configuración e instalación del servidor MCP Organic
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌱 Configurando servidor MCP Organic/Lince...\n');

async function setup() {
  try {
    // 1. Verificar Node.js version
    console.log('📋 Verificando requisitos...');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ requerido. Versión actual: ${nodeVersion}`);
    }
    console.log(`✅ Node.js ${nodeVersion}`);

    // 2. Instalar dependencias
    console.log('\n📦 Instalando dependencias...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas');

    // 3. Compilar TypeScript
    console.log('\n🔨 Compilando TypeScript...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Compilación completada');

    // 4. Crear directorios necesarios
    console.log('\n📁 Creando estructura de directorios...');
    await fs.ensureDir('./logs');
    await fs.ensureDir('./dist');
    console.log('✅ Directorios creados');

    // 5. Copiar archivo de configuración
    console.log('\n⚙️ Configurando ambiente...');
    if (!await fs.pathExists('.env')) {
      await fs.copy('.env.example', '.env');
      console.log('✅ Archivo .env creado');
    } else {
      console.log('ℹ️ Archivo .env ya existe');
    }

    // 6. Validar estructura de conocimiento
    console.log('\n📚 Validando repositorio de conocimiento...');
    const knowledgePath = './src/knowledge';
    const businessLines = ['organic', 'lince'];
    const categories = ['architecture', 'patterns', 'standards', 'best-practices'];

    for (const businessLine of businessLines) {
      for (const category of categories) {
        const categoryPath = path.join(knowledgePath, businessLine, category);
        if (await fs.pathExists(categoryPath)) {
          const files = await fs.readdir(categoryPath);
          const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.yml'));
          console.log(`  📂 ${businessLine}/${category}: ${mdFiles.length} archivos`);
        }
      }
    }

    // 7. Test básico del servidor
    console.log('\n🧪 Ejecutando tests básicos...');
    try {
      execSync('npm test', { stdio: 'inherit' });
      console.log('✅ Tests básicos pasaron');
    } catch (error) {
      console.log('⚠️ Tests fallaron - revisar configuración');
    }

    // 8. Mostrar instrucciones finales
    console.log('\n🎉 ¡Configuración completada!\n');
    console.log('📖 Próximos pasos:');
    console.log('   1. Revisar y personalizar .env');
    console.log('   2. Poblar repositorios de conocimiento en src/knowledge/');
    console.log('   3. Ejecutar: npm start');
    console.log('   4. Configurar VS Code con settings.json\n');
    
    console.log('🔗 Comandos útiles:');
    console.log('   npm start          - Iniciar servidor MCP');
    console.log('   npm run dev        - Modo desarrollo');
    console.log('   npm run build      - Compilar TypeScript');
    console.log('   npm test           - Ejecutar tests');
    console.log('   npm run lint       - Verificar código\n');

    console.log('📚 Documentación: README-MCP-ORGANIC.md');

  } catch (error) {
    console.error('\n❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar setup
setup();
