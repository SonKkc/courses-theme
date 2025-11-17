import { defineConfig } from 'vite'
import { resolve } from 'path'
import { Liquid } from 'liquidjs'
import fs from 'fs'
import chokidar from 'chokidar'
import { execSync } from 'child_process'

// Create LiquidJS engine
const engine = new Liquid({
  root: resolve(__dirname, 'views'),
  extname: '.liquid'
})

// Add custom filters for development
engine.registerFilter('asset_url', (input) => {
  // Use absolute paths for development
  return `/assets/${input.replace(/^\/?assets\//, '')}`
})
engine.registerFilter('page_url', (input) => {
  if (input.endsWith('.html')) return `/pages/${input.replace(/\.html$/, '')}`;
  return `/pages/${input}`;
})

// Function to scan @pages directory and generate navigation
function generatePagesNavigation() {
  const pagesDir = resolve(__dirname, 'views/@pages')
  const navigation = [
    { title: 'Trang chủ', url: '/' }
  ]
  
  try {
    if (fs.existsSync(pagesDir)) {
      const files = fs.readdirSync(pagesDir)
      const htmlFiles = files.filter(file => file.endsWith('.html'))
      
      htmlFiles.forEach(file => {
        const filename = file.replace('.html', '')
        const title = filename.charAt(0).toUpperCase() + filename.slice(1) // Capitalize first letter
        navigation.push({
          title: title,
          url: `/pages/${filename}`
        })
      })
    }
  } catch (error) {
    console.warn('Error reading @pages directory:', error.message)
  }
  
  return navigation
}

// Function to generate navigation for build (with relative URLs)
function generateBuildNavigation() {
  const pagesDir = resolve(__dirname, 'views/@pages')
  const navigation = [
    { title: 'Trang chủ', url: './index.html' }
  ]
  
  try {
    if (fs.existsSync(pagesDir)) {
      const files = fs.readdirSync(pagesDir)
      const htmlFiles = files.filter(file => file.endsWith('.html'))
      
      htmlFiles.forEach(file => {
        const filename = file.replace('.html', '')
        const title = filename.charAt(0).toUpperCase() + filename.slice(1)
        navigation.push({
          title: title,
          url: `./${file}`
        })
      })
    }
  } catch (error) {
    console.warn('Error reading @pages directory:', error.message)
  }
  
  return navigation
}

const liquidContext = {
  clientMode: 1, // Set devMode based on environment
  pageTitle: 'Theme Default',
  pageDescription: 'A beautiful theme built with LiquidJS',
  navigation: generatePagesNavigation()
}

// Create build context with relative URLs
function createBuildContext(pageContext = {}) {
  // Create a new engine instance for build with relative filters
  const buildEngine = new Liquid({
    root: resolve(__dirname, 'views'),
    extname: '.liquid'
  })
  
  // Register filters with relative paths for build
  buildEngine.registerFilter('asset_url', (input) => {
    return `./assets/${input.replace(/^\/?assets\//, '')}`
  })
  buildEngine.registerFilter('page_url', (input) => {
    if (input.endsWith('.html')) return `./${input}`;
    return `./${input}.html`;
  })
  
  return {
    engine: buildEngine,
    context: {
      ...liquidContext,
      ...pageContext,
      navigation: generateBuildNavigation()
    }
  }
}

export default defineConfig({
  // Set root directory to project root
  root: '.',
  // Public directory (for static assets) - absolute path
  publicDir: 'assets',
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
    // Configure server options
    port: 5173,
    open: true,
    fs: {
      strict: false,
      allow: ['views', 'assets']
    }
  },
  
  build: {
    // Output directory
    outDir: 'dist',
    // Don't copy public dir automatically, we'll handle it manually
    copyPublicDir: false,
    // Use a minimal JS file as entry point since we handle HTML manually
    rollupOptions: {
      input: {
        dummy: resolve(__dirname, 'assets/js/main.js')
      }
    }
  },
  
  optimizeDeps: {
    exclude: ['views/components/*', 'views/elements/*', 'assets/*']
  },
  
  assetsInclude: ['**/*.html', '**/*.liquid'],
  
  plugins: [
    {
      name: 'build-html-pages',
      writeBundle() {
        // Create output directories
        const outputDir = resolve(__dirname, 'dist')
        const assetsSourceDir = resolve(__dirname, 'assets')
        const assetsDestDir = resolve(outputDir, 'assets')
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }
        
        // Copy assets folder using cp command
        try {
          if (fs.existsSync(assetsSourceDir)) {
            // Remove existing assets folder if it exists
            if (fs.existsSync(assetsDestDir)) {
              execSync(`rm -rf "${assetsDestDir}"`)
            }
            // Copy the entire assets folder
            execSync(`cp -r "${assetsSourceDir}" "${assetsDestDir}"`)
            console.log('✓ Copied assets folder')
          }
        } catch (error) {
          console.error('Error copying assets folder:', error.message)
        }
        
        // Render and write index.html directly to dist
        try {
          const indexPath = resolve(__dirname, 'views/index.html')
          if (fs.existsSync(indexPath)) {
            const indexHtml = fs.readFileSync(indexPath, 'utf-8')
            const { engine: buildEngine, context: buildContext } = createBuildContext()
            let renderedIndex = buildEngine.parseAndRenderSync(indexHtml, buildContext)
            
            // Remove Vite development scripts for production
            renderedIndex = renderedIndex
              .replace(/<script type="module" src="\/@vite\/client"><\/script>/g, '')
              .replace(/<!-- Vite Client -->/g, '')
              .replace(/<!-- Tự động reload page khi có thay đổi trong views -->/g, '')
              .replace(/<!-- Khi ghép theme nên xóa cái này đi -->/g, '')
            
            fs.writeFileSync(resolve(outputDir, 'index.html'), renderedIndex)
            console.log('✓ Generated index.html')
          }
        } catch (error) {
          console.error('Error rendering index.html:', error.message)
        }
        
        // Render and write @pages files directly to dist
        const pagesDir = resolve(__dirname, 'views/@pages')
        if (fs.existsSync(pagesDir)) {
          const files = fs.readdirSync(pagesDir)
          const htmlFiles = files.filter(file => file.endsWith('.html'))
          
          htmlFiles.forEach(file => {
            try {
              const filename = file.replace('.html', '')
              const filePath = resolve(pagesDir, file)
              const html = fs.readFileSync(filePath, 'utf-8')
              
              const { engine: buildEngine, context: buildContext } = createBuildContext({
                currentPage: filename,
                pageTitle: `${filename.charAt(0).toUpperCase() + filename.slice(1)} - Theme Default`
              })
              
              let rendered = buildEngine.parseAndRenderSync(html, buildContext)
              
              // Remove Vite development scripts for production
              rendered = rendered
                .replace(/<script type="module" src="\/@vite\/client"><\/script>/g, '')
                .replace(/<!-- Vite Client -->/g, '')
                .replace(/<!-- Tự động reload page khi có thay đổi trong views -->/g, '')
                .replace(/<!-- Khi ghép theme nên xóa cái này đi -->/g, '')
              
              fs.writeFileSync(resolve(outputDir, file), rendered)
              console.log(`✓ Generated ${file}`)
            } catch (error) {
              console.error(`Error rendering ${file}:`, error.message)
            }
          })
        }
      }
    },
    {
      name: 'liquidjs-index',
      transformIndexHtml(html) {
        try {
          return engine.parseAndRenderSync(html, liquidContext)
        } catch (error) {
          return `<!-- LiquidJS Error: ${error.message} -->\n${html}`
        }
      }
    },
    {
      name: 'liquidjs-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle root path (index.html)
          if (req.url === '/' || req.url === '/index.html') {
            const filePath = resolve(__dirname, 'views/index.html')
            if (fs.existsSync(filePath)) {
              const code = fs.readFileSync(filePath, 'utf-8')
              try {
                const rendered = engine.parseAndRenderSync(code, liquidContext)
                res.setHeader('Content-Type', 'text/html')
                res.end(rendered)
                return
              } catch (error) {
                res.statusCode = 500
                res.end(`<!-- LiquidJS Error: ${error.message} -->\n${code}`)
                return
              }
            }
          }
          
          // Handle /pages/[filename] routes
          if (req.url && req.url.startsWith('/pages/')) {
            const filename = req.url.replace('/pages/', '').replace(/\?.*$/, '') // Remove query params
            const filePath = resolve(__dirname, `views/@pages/${filename}.html`)
            
            if (fs.existsSync(filePath)) {
              const code = fs.readFileSync(filePath, 'utf-8')
              try {
                // Update context with current page info
                const pageContext = {
                  ...liquidContext,
                  currentPage: filename,
                  pageTitle: `${filename.charAt(0).toUpperCase() + filename.slice(1)} - Theme Default`
                }
                const rendered = engine.parseAndRenderSync(code, pageContext)
                res.setHeader('Content-Type', 'text/html')
                res.end(rendered)
                return
              } catch (error) {
                res.statusCode = 500
                res.end(`<!-- LiquidJS Error: ${error.message} -->\n${code}`)
                return
              }
            } else {
              // File not found in @pages directory
              res.statusCode = 404
              res.end(`Page not found: /pages/${filename}`)
              return
            }
          }
          
          // Handle other .html files
          if (req.url && req.url.endsWith('.html') && req.url !== '/index.html') {
            const filePath = resolve(__dirname, 'views' + req.url)
            if (fs.existsSync(filePath)) {
              const code = fs.readFileSync(filePath, 'utf-8')
              try {
                const rendered = engine.parseAndRenderSync(code, liquidContext)
                res.setHeader('Content-Type', 'text/html')
                res.end(rendered)
                return
              } catch (error) {
                res.statusCode = 500
                res.end(`<!-- LiquidJS Error: ${error.message} -->\n${code}`)
                return
              }
            }
          }
          next()
        })
      }
    },
    {
      name: 'reload-on-views-change',
      handleHotUpdate({ file, server }) {
        if (file.includes('/views/') || file.includes('/@pages/')) {
          // Regenerate navigation when @pages files change
          if (file.includes('/@pages/')) {
            liquidContext.navigation = generatePagesNavigation()
          }
          server.ws.send({ type: 'full-reload' });
        }
      }
    }
  ]
})