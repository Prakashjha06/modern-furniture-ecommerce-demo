import { createRoot } from 'react-dom/client';
import { AdminApp } from './components/AdminApp';
import './index.css';

createRoot(document.getElementById('admin-root')!).render(<AdminApp />);
