import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import CandidateDrawer from './CandidateDrawer';
import RecommendedCandidates from '../../components/ai/RecommendedCandidates';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied' },
  { id: 'UNDER_REVIEW', title: 'Under Review' },
  { id: 'SHORTLISTED', title: 'Shortlisted' },
  { id: 'INTERVIEW_SCHEDULED', title: 'Interview Scheduled' },
  { id: 'INTERVIEW_COMPLETED', title: 'Interview Completed' },
  { id: 'SELECTED', title: 'Selected' },
  { id: 'REJECTED', title: 'Rejected' },
  { id: 'WITHDRAWN', title: 'Withdrawn' }
];

export default function ATSBoard() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get(`/applications/job/${jobId}`);
      setApplications(res.data.data);
    } catch (e) {
      toast.error("Failed to load ATS board");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    setApplications(prev => prev.map(app => 
      app.applicationId === draggableId ? { ...app, status: newStatus } : app
    ));

    try {
      await axiosInstance.patch(`/applications/${draggableId}/status`, {
        status: newStatus,
        notes: `Moved to ${newStatus} via ATS Board`
      });
      toast.success(`Candidate moved to ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update status");
      fetchApplications(); // Revert on failure
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.applicationId === appId ? { ...app, status: newStatus } : app
    ));
    if (selectedApp) {
        setSelectedApp({...selectedApp, status: newStatus});
    }
    try {
      await axiosInstance.patch(`/applications/${appId}/status`, {
        status: newStatus,
        notes: `Status changed to ${newStatus}`
      });
      toast.success(`Candidate status updated`);
    } catch (e) {
      toast.error("Failed to update status");
      fetchApplications();
    }
  };

  const openDrawer = (app) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  if (loading) return <div className="p-10 font-bold text-center">Loading ATS Board...</div>;

  // Group applications by status
  const filteredApps = applications.filter(app => 
    !searchQuery || 
    app.candidateSnapshot?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.candidateSnapshot?.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columnsData = COLUMNS.map(col => ({
    ...col,
    items: filteredApps.filter(app => app.status === col.id)
  }));

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">ATS Pipeline</h1>
          <p className="text-gray-600 mb-4">Drag and drop candidates to update their stage.</p>
          <input 
            type="text" 
            placeholder="Search candidates by name or skills..." 
            className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-1/3 bg-white p-4 rounded-xl shadow-sm border border-blue-100 max-h-64 overflow-y-auto">
          <RecommendedCandidates jobId={jobId} />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4 h-full items-start">
          {columnsData.map(col => (
            <div key={col.id} className="bg-gray-200 rounded-lg p-3 min-w-[300px] max-w-[300px] flex flex-col flex-1 max-h-[80vh]">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-gray-700">{col.title}</h3>
                <span className="bg-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{col.items.length}</span>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto min-h-[150px] space-y-3"
                  >
                    {col.items.map((app, index) => (
                      <Draggable key={app.applicationId} draggableId={app.applicationId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openDrawer(app)}
                            className={`bg-white p-4 rounded shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'opacity-80 ring-2 ring-blue-500' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-900">{app.candidateSnapshot?.name}</h4>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${getScoreColor(app.atsMatchScore)}`}>
                                {Math.round(app.atsMatchScore)}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate mb-3">{app.candidateSnapshot?.headline}</p>
                            <div className="text-xs text-gray-400">
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CandidateDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        application={selectedApp}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
