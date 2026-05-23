import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Topic from './pages/Topic'
import Tags from './pages/Tags'
import TagDetail from './pages/TagDetail'
import Favorited from './pages/Favorited'
import GraphPage from './pages/Graph'
import Tools from './pages/Tools'

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1>GeekNews Vault</h1>
        <NavLink to="/" end>최근</NavLink>
        <NavLink to="/favorited">★ 즐겨찾기</NavLink>
        <NavLink to="/tags">태그</NavLink>
        <NavLink to="/graph">그래프</NavLink>
        <div className="nav-section">tools</div>
        <NavLink to="/tools">크롤 · 빌드</NavLink>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:id" element={<Topic />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/:name" element={<TagDetail />} />
          <Route path="/favorited" element={<Favorited />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </main>
    </div>
  )
}
