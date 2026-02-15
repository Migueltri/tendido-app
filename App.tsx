import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleForm from './pages/ArticleForm';
import Authors from './pages/Authors';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/noticias" element={<ArticlesList />} />
          <Route path="/crear-noticia" element={<ArticleForm />} />
          <Route path="/editar-noticia/:id" element={<ArticleForm />} />
          <Route path="/autores" element={<Authors />} />
          <Route path="/configuracion" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;