import React, { useState, useEffect } from 'react';
import BreadcrumbNav from './components/BreadcrumbNav';
import VoronoiDiagram from './components/VoronoiDiagram';
import DomainForm from './components/DomainForm';
import DocumentPanel from './components/DocumentPanel';
import { fetchDomains, addDomain, deleteDomain } from './services/apiService';
import './styles/App.css';

function App() {
  // State for domains at the current level
  const [domains, setDomains] = useState([]);
  
  // State for semantic distances
  const [semanticDistances, setSemanticDistances] = useState({});
  
  // Current parent ID (null for root level)
  const [currentParentId, setCurrentParentId] = useState(null);
  
  // Breadcrumb path
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  
  // Current document for document panel
  const [currentDocument, setCurrentDocument] = useState(null);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Diagram dimensions
  const diagramWidth = 800;
  const diagramHeight = 600;
  
  // Load domains at the current level
  useEffect(() => {
    const loadDomains = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchDomains(currentParentId);
        setDomains(data.domains || []);
        setSemanticDistances(data.semanticDistances || {});
        
        // If we're not at the root level, update the breadcrumb path
        if (currentParentId) {
          const path = [];
          let currentDomain = domains.find(d => d.id === currentParentId);
          
          if (currentDomain) {
            path.unshift(currentDomain);
            
            // Iterate up the parent chain
            while (currentDomain && currentDomain.parentId) {
              const parentId = currentDomain.parentId;
              // We would need to fetch the parent domain info here
              // For simplicity, we use a placeholder
              currentDomain = { id: parentId, name: `Parent of ${currentDomain.name}` };
              path.unshift(currentDomain);
            }
            
            setBreadcrumbPath(path);
          }
        } else {
          setBreadcrumbPath([]);
        }
      } catch (err) {
        console.error('Error loading domains:', err);
        setError('Failed to load domains. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDomains();
  }, [currentParentId]);
  
  // Handle adding a new domain
  const handleAddDomain = async (name, description = '') => {
    try {
      await addDomain(name, currentParentId, description);
      
      // Refresh domains
      const data = await fetchDomains(currentParentId);
      setDomains(data.domains || []);
      setSemanticDistances(data.semanticDistances || {});
    } catch (err) {
      console.error('Error adding domain:', err);
      setError('Failed to add domain. Please try again.');
    }
  };
  
  // Handle deleting a domain
  const handleDeleteDomain = async (domainId) => {
    try {
      await deleteDomain(domainId);
      
      // Refresh domains
      const data = await fetchDomains(currentParentId);
      setDomains(data.domains || []);
      setSemanticDistances(data.semanticDistances || {});
    } catch (err) {
      console.error('Error deleting domain:', err);
      setError('Failed to delete domain. Please try again.');
    }
  };
  
  // Handle domain click for drill-down
  const handleDomainClick = (domain) => {
    setCurrentParentId(domain.id);
  };
  
  // Handle document click
  const handleDocumentClick = (document) => {
    setCurrentDocument(document);
  };
  
  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (domainId) => {
    setCurrentParentId(domainId);
  };
  
  // Handle closing the document panel
  const handleCloseDocumentPanel = () => {
    setCurrentDocument(null);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">Semantic Tiles - Knowledge Map</h1>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav 
            path={breadcrumbPath} 
            onNavigate={handleBreadcrumbClick} 
          />
          
          {/* Domain form */}
          <DomainForm onAdd={handleAddDomain} />
          
          {/* Error message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Loading indicator */}
          {loading ? (
            <div className="loading-indicator">
              Loading...
            </div>
          ) : (
            <>
              {/* Voronoi diagram */}
              {domains.length > 0 ? (
                <VoronoiDiagram
                  domains={domains}
                  semanticDistances={semanticDistances}
                  width={diagramWidth}
                  height={diagramHeight}
                  onDomainClick={handleDomainClick}
                  onDocumentClick={handleDocumentClick}
                  onDeleteDomain={handleDeleteDomain}
                />
              ) : (
                <div className="empty-diagram">
                  <p>No domains at this level. Add your first domain!</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Document panel */}
      <DocumentPanel
        document={currentDocument}
        onClose={handleCloseDocumentPanel}
      />
    </div>
  );
}

export default App;
