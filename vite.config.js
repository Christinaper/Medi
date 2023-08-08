import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    }
  },
  plugins: [
    react(),
    AutoImport({
      dts: false,
      imports: [
        'react', 'react-router-dom',
        {
          'react-redux': ['useDispatch', 'useSelector']
        }
      ],
      dirs: ['src/components', 'src/api', 'src/store']
    })
  ],
})
