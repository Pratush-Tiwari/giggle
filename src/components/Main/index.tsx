/**
 *
 * Main
 *
 */
import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './Sidebar/loadable';
import { NoteView } from './NoteView/loadable';

export const Main = memo(() => {
  return (
    <div className="w-[100vw] h-[100vh] flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/note/:noteId" element={<NoteView />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a note to view its content</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
});
